"""
Anime Script Pro — Text Generation Router

This router manages text synthesis, orchestrating fallback models across various
providers, handling API key validation, real-time failover logic, and streaming responses
via Server-Sent Events (SSE).

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Pydantic Schemas / Request Payload Models
  5. Router Initialization
  6. Core Generation Endpoints
  7. Streaming Event Generators
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import asyncio
from datetime import datetime
import json
import time
from typing import Dict, List, Optional
import uuid

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from google.genai import types
from loguru import logger
from pydantic import BaseModel

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.ai_engine import (
    ai_engine,
    create_gemini_client,
    generate_ai_text,
    resolve_engine_model,
    stream_ai_text,
)
from backend.api.ai import get_api_key, health_registry
from backend.lib.text_models import DEFAULT_TEXT_MODELS
from backend.schemas import GenerationRequest, GenerationResponse
from backend.utils.deps import get_auth_user_id

# ==============================================================================
# 4. PYDANTIC SCHEMAS / REQUEST PAYLOAD MODELS
# ==============================================================================

class TextGenerationRequest(GenerationRequest):
    """Pydantic model extending default generation requests to support SSE streaming option."""
    stream: Optional[bool] = False

# ==============================================================================
# 5. ROUTER INITIALIZATION
# ==============================================================================
router = APIRouter(prefix="/api/text", tags=["Text Generation"])


def estimate_token_count(text: str) -> int:
    """Rudimentary token estimator (approx 3.2 chars per token for dense templates).

    Used to avoid sending overly large prompts to providers with strict TPM
    / token limits (notably Groq Llama fallbacks).
    """
    if not text:
        return 0
    return int(max(0, (len(text) / 3.2)))

# ==============================================================================
# 6. CORE GENERATION ENDPOINTS
# ==============================================================================

@router.post("", response_model=GenerationResponse)
async def generate_text(
    request: TextGenerationRequest,
    user_id: str = Depends(get_auth_user_id),
) -> GenerationResponse:
    """Unified text generation endpoint supporting both standard response and streaming.

    Automatically handles model resolution, checks model health, tracks
    degradations, and runs a robust loop across multiple backup models as fallback
    options on failure.

    Args:
        request: The TextGenerationRequest object detailing the model and prompt.
        user_id: The authenticated user's ID.

    Returns:
        GenerationResponse: The complete generated payload containing text, model,
                            usage metadata, and latency.

    Raises:
        HTTPException(400): If the authentication API key is invalid.
        HTTPException(500): If all available failover models exhaustively fail.
    """
    if request.stream:
        # If streaming is requested, return the streaming response
        return await stream_text_response(request, user_id)

    target_model = resolve_engine_model(request.model)

    # Resolve custom params with camelCase fallback
    temperature = request.temperature
    max_tokens = request.maxTokens if request.maxTokens is not None else request.max_tokens
    top_p = request.topP if request.topP is not None else request.top_p
    top_k = request.topK if request.topK is not None else request.top_k

    # Text Fallback Models
    FALLBACK_MODELS = [target_model] + DEFAULT_TEXT_MODELS

    NVIDIA_FAILOVER = "nvidia/llama-3.1-nemotron-70b-instruct"
    unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACK_MODELS))]
    start_time = time.perf_counter()
    attempted_fallbacks = []
    request_id = str(uuid.uuid4())[:8]

    prompt_chars = len(request.prompt or "")
    prompt_tokens = estimate_token_count(request.prompt or "")
    system_chars = len(request.systemInstruction or "")
    system_tokens = estimate_token_count(request.systemInstruction or "")
    total_chars = prompt_chars + system_chars
    total_tokens = prompt_tokens + system_tokens
    page_name = request.pageName or "UNKNOWN"

    logger.opt(colors=True).info(
        f"<yellow>[TELEMETRY]</yellow> <magenta>[AI INPUT ]</magenta> "
        f"Model: <cyan>{target_model}</cyan> | Chars: <light-blue>{total_chars}</light-blue> | "
        f"Tokens (est): <light-blue>{total_tokens}</light-blue> | Page: <green>{page_name}</green> | ID: <yellow>{request_id}</yellow>"
    )

    last_error = None
    quota_issues: List[str] = []
    for current_model in unique_fallbacks:
        if health_registry.is_degraded(current_model) and current_model != unique_fallbacks[-1]:
            logger.opt(colors=True).warning(
                f"TEXT ROUTING [#{request_id}]: Model <cyan>{current_model}</cyan> is degraded/busy. Skipping..."
            )
            continue

        try:
            if current_model != target_model and current_model not in attempted_fallbacks:
                logger.opt(colors=True).warning(
                    f"TEXT RECOVERY [#{request_id}]: Primary model busy/failed. Failover to: <yellow>{current_model}</yellow>"
                )
                attempted_fallbacks.append(current_model)
            # Compute provider flags early so guards can use them
            is_openai = "gpt-" in current_model.lower() or "o1-" in current_model.lower()
            is_groq = (
                any(m in current_model.lower() for m in ["llama", "mixtral", "deepseek"]) 
                and "gemma" not in current_model.lower()
                and "nvidia" not in current_model.lower()
                and "meta/" not in current_model.lower()
            )
            is_claude = "claude" in current_model.lower()
            is_nvidia = (
                "nvidia" in current_model.lower()
                or "nemotron" in current_model.lower()
                or current_model.startswith("meta/")
            )

            # Guard: Prevent sending very large prompts to Groq Llama fallbacks
            GROQ_SAFE_LIMIT = 4500  # tokens — keep below Groq's TPM limit (6000) with a safe buffer for response tokens
            prompt_tokens = estimate_token_count(request.prompt or "")
            system_tokens = estimate_token_count(request.systemInstruction or "")
            total_estimated = prompt_tokens + system_tokens

            if is_groq and total_estimated > GROQ_SAFE_LIMIT:
                logger.opt(colors=True).warning(
                    f"TEXT ROUTING [#{request_id}]: Skipping Groq model {current_model} — estimated tokens={total_estimated} exceeds safe limit {GROQ_SAFE_LIMIT}"
                )
                health_registry.report_failure(current_model)
                continue

            api_key = await get_api_key(user_id, current_model)

            if is_claude or is_openai or is_groq or is_nvidia:
                output_text = await generate_ai_text(
                    current_model,
                    request.prompt,
                    request.systemInstruction,
                    user_id,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    top_p=top_p,
                    top_k=top_k,
                )
                usage_dict: dict = {}
            else:
                client = create_gemini_client(api_key=api_key)
                resolved_model = resolve_engine_model(current_model)
                
                # Build content generation config with all resolved parameters
                config_args = {}
                if request.systemInstruction:
                    config_args["system_instruction"] = request.systemInstruction
                if temperature is not None:
                    config_args["temperature"] = temperature
                if max_tokens is not None:
                    config_args["max_output_tokens"] = max_tokens
                if top_p is not None:
                    config_args["top_p"] = top_p
                if top_k is not None:
                    config_args["top_k"] = top_k
                
                config = types.GenerateContentConfig(**config_args) if config_args else None
                try:
                    response = await asyncio.wait_for(
                        client.aio.models.generate_content(
                            model=resolved_model,
                            contents=request.prompt,
                            config=config,
                        ),
                        timeout=180.0  # Safe 180-second limit to accommodate dense script and cast synthesis
                    )
                except asyncio.TimeoutError:
                    raise ValueError(f"Content generation for {current_model} timed out after 22.0s.")
                
                if not response or not hasattr(response, "text"):
                    raise ValueError(f"Model {current_model} returned an empty response.")

                output_text = response.text

                starts_with_json = output_text.strip().startswith(("{", "["))
                ends_with_json = output_text.strip().endswith("}") if output_text.strip().startswith("{") else output_text.strip().endswith("]")
                if starts_with_json and not ends_with_json:
                    logger.warning(f"TEXT REPAIR [#{request_id}]: Truncated JSON detected. Fixing.")
                    output_text = ai_engine.repair_truncated_json(output_text)

                usage_dict = {
                    "prompt_tokens": getattr(response.usage_metadata, "prompt_token_count", 0),
                    "candidates_tokens": getattr(response.usage_metadata, "candidates_token_count", 0),
                    "total_tokens": getattr(response.usage_metadata, "total_token_count", 0),
                } if hasattr(response, "usage_metadata") else {}

            latency_ms = (time.perf_counter() - start_time) * 1000

            out_chars = len(output_text or "")
            out_tokens = usage_dict.get("candidates_tokens", 0) or estimate_token_count(output_text or "")

            logger.opt(colors=True).success(
                f"<yellow>[TELEMETRY]</yellow> <green>[AI OUTPUT]</green> "
                f"Model: <cyan>{current_model}</cyan> | Chars: <light-blue>{out_chars}</light-blue> | "
                f"Tokens: <light-blue>{out_tokens}</light-blue> | Latency: <light-blue>{latency_ms:.2f}ms</light-blue> | ID: <yellow>{request_id}</yellow>"
            )
            health_registry.report_success(current_model)

            from backend.utils.notifications import notify_user
            await notify_user(
                user_id,
                "Neural Synthesis Successful",
                f"AI Model {current_model} has finalized the orchestration in {latency_ms:.0f}ms.",
                "SUCCESS",
            )

            return GenerationResponse(
                text=output_text,
                model_used=current_model,
                finish_reason="STOP",
                usage=usage_dict,
                latency_ms=latency_ms,
                fallbacks=attempted_fallbacks,
            )

        except Exception as e:
            last_error = e
            health_registry.report_failure(current_model)
            error_str = str(e).lower()

            if "api key not valid" in error_str or "api_key_invalid" in error_str:
                logger.error(f"TEXT AUTH ERROR [#{request_id}]: API Key invalid for {current_model}. Aborting loop.")
                raise HTTPException(
                    status_code=400,
                    detail="API key is invalid. Please update your AI provider keys in Settings.",
                )

            # Treat explicit quota/plan errors as skip-able: try next fallback
            if "insufficient_quota" in error_str or "quota" in error_str or "resource_exhausted" in error_str:
                logger.opt(colors=True).warning(
                    f"TEXT QUOTA [#{request_id}]: Provider quota/plan error on {current_model}: {error_str}. Skipping model."
                )
                quota_issues.append(f"{current_model}: {error_str}")
                continue

            if ("429" in error_str or "rate limit" in error_str or "exhausted" in error_str) and "nvidia" not in current_model.lower():
                logger.opt(colors=True).critical(
                    f"TEXT RATE LIMIT [#{request_id}]: 429 on {current_model}. Emergency NVIDIA failover."
                )
                try:
                    api_key = await get_api_key(user_id, NVIDIA_FAILOVER)
                    output_text = await generate_ai_text(
                        NVIDIA_FAILOVER,
                        request.prompt,
                        request.systemInstruction,
                        user_id,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        top_p=top_p,
                        top_k=top_k,
                    )
                    latency_ms = (time.perf_counter() - start_time) * 1000

                    logger.success("TEXT RECOVERY: [⚡] NVIDIA Emergency Failover Successful")
                    health_registry.report_success(NVIDIA_FAILOVER)
                    return GenerationResponse(
                        text=output_text,
                        model_used=NVIDIA_FAILOVER,
                        finish_reason="STOP",
                        usage={},
                        latency_ms=latency_ms,
                        fallbacks=attempted_fallbacks + [current_model],
                    )
                except Exception as nvidia_e:
                    logger.error(f"TEXT FAILOVER [#{request_id}]: NVIDIA Failover failed: {nvidia_e}")

            logger.warning(f"TEXT SYNTHESIS [#{request_id}]: Model {current_model} failed: {str(e)}")
            continue

    logger.error(f"TEXT SYNTHESIS [#{request_id}]: All connections failed.")
    # Final recovery attempt: trim the prompt and try a single direct Gemini call
    try:
        trimmed_prompt = (request.prompt or "").strip()
        # If too long, keep a sensible head/tail slice to preserve context
        if len(trimmed_prompt) > 4000:
            trimmed_prompt = trimmed_prompt[:3000] + "\n\n...TRIMMED...\n\n" + trimmed_prompt[-800:]

        # Resolve a Gemini API key (may raise) and try a single, conservative generation
        try:
            gem_api_key = await get_api_key(user_id, "gemini-2.0-flash")
        except Exception:
            gem_api_key = None

        client = create_gemini_client(api_key=gem_api_key)
        config = types.GenerateContentConfig(max_output_tokens=1024)
        resp = await client.aio.models.generate_content(model="gemini-2.0-flash", contents=trimmed_prompt, config=config)
        if resp and hasattr(resp, "text") and resp.text:
            latency_ms = (time.perf_counter() - start_time) * 1000
            logger.success(f"TEXT RECOVERY [#{request_id}]: Trimmed Gemini fallback succeeded")
            return GenerationResponse(
                text=resp.text,
                model_used="gemini-2.0-flash-trimmed",
                finish_reason="STOP",
                usage={},
                latency_ms=latency_ms,
                fallbacks=attempted_fallbacks,
            )
    except Exception as recovery_exc:
        # If the trimmed fallback failed due to quota/rate limits, surface a 429
        recovery_str = str(recovery_exc).lower()
        logger.warning(f"TEXT RECOVERY [#{request_id}]: Trimmed Gemini fallback failed: {recovery_exc}")
        if "resource_exhausted" in recovery_str or "quota" in recovery_str or "429" in recovery_str or "exceeded" in recovery_str:
            # Include any known retry info in the message (best effort)
            raise HTTPException(status_code=429, detail=f"Trimmed fallback failed due to provider quota/rate limits: {recovery_exc}")

    # If no specific exception was captured, provide a generic message
    if last_error is None:
        raise HTTPException(status_code=500, detail="Neural Engine Synthesis Failed: Unknown error")
    raise HTTPException(status_code=500, detail=f"Neural Engine Synthesis Failed: {str(last_error)}")

# ==============================================================================
# 7. STREAMING EVENT GENERATORS
# ==============================================================================

async def stream_text_response(
    request: TextGenerationRequest,
    user_id: str,
) -> StreamingResponse:
    """Internal Server-Sent Events stream generator.

    Provides high-concurrency streaming chunk forwarding using event-stream format.
    Dynamically routes across models if a rate limit or degradation is identified.

    Args:
        request: The generation properties.
        user_id: The identifier of the requesting user.

    Returns:
        StreamingResponse: SSE stream rendering model chunks in real-time.
    """
    target_model = resolve_engine_model(request.model)
    request_id = str(uuid.uuid4())[:8]
    # Resolve custom params with camelCase fallback
    temperature = request.temperature
    max_tokens = request.maxTokens if request.maxTokens is not None else request.max_tokens
    top_p = request.topP if request.topP is not None else request.top_p
    top_k = request.topK if request.topK is not None else request.top_k

    prompt_chars = len(request.prompt or "")
    prompt_tokens = estimate_token_count(request.prompt or "")
    system_chars = len(request.systemInstruction or "")
    system_tokens = estimate_token_count(request.systemInstruction or "")
    total_chars = prompt_chars + system_chars
    total_tokens = prompt_tokens + system_tokens
    page_name = request.pageName or "UNKNOWN"

    logger.opt(colors=True).info(
        f"<yellow>[TELEMETRY]</yellow> <magenta>[AI INPUT ]</magenta> "
        f"Model: <cyan>{target_model}</cyan> | Chars: <light-blue>{total_chars}</light-blue> | "
        f"Tokens (est): <light-blue>{total_tokens}</light-blue> | Page: <green>{page_name}</green> | Streaming: <light-blue>True</light-blue> | ID: <yellow>{request_id}</yellow>"
    )

    async def event_generator():
        FALLBACKS = [target_model] + DEFAULT_TEXT_MODELS
        unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACKS))]
        attempted_fallbacks: list[str] = []

        for current_model in unique_fallbacks:
            if health_registry.is_degraded(current_model) and current_model != unique_fallbacks[-1]:
                logger.opt(colors=True).warning(
                    f"TEXT STREAM ROUTING [#{request_id}]: Model <cyan>{current_model}</cyan> degraded. Skipping..."
                )
                continue

            # Compute provider flags early so guards can use them
            is_groq = (
                any(m in current_model.lower() for m in ["llama", "mixtral", "deepseek"]) 
                and "gemma" not in current_model.lower()
                and "nvidia" not in current_model.lower()
                and "meta/" not in current_model.lower()
            )

            # Guard: Prevent sending very large prompts to Groq Llama fallbacks
            GROQ_SAFE_LIMIT = 4500  # tokens — keep below Groq's TPM limit (6000) with a safe buffer for response tokens
            prompt_tokens = estimate_token_count(request.prompt or "")
            system_tokens = estimate_token_count(request.systemInstruction or "")
            total_estimated = prompt_tokens + system_tokens

            if is_groq and total_estimated > GROQ_SAFE_LIMIT:
                logger.opt(colors=True).warning(
                    f"TEXT STREAM ROUTING [#{request_id}]: Skipping Groq model {current_model} — estimated tokens={total_estimated} exceeds safe limit {GROQ_SAFE_LIMIT}"
                )
                health_registry.report_failure(current_model)
                continue

            try:
                if current_model != target_model and current_model not in attempted_fallbacks:
                    logger.opt(colors=True).warning(
                        f"TEXT STREAM RECOVERY [#{request_id}]: Failover to: <yellow>{current_model}</yellow>"
                    )
                    attempted_fallbacks.append(current_model)

                logger.opt(colors=True).info(f"TEXT STREAM [#{request_id}]: Initializing via <cyan>{current_model}</cyan>")

                async for chunk in stream_ai_text(
                    current_model,
                    request.prompt,
                    request.systemInstruction,
                    user_id,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    top_p=top_p,
                    top_k=top_k,
                ):
                    yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"

                logger.opt(colors=True).success(
                    f"<yellow>[TELEMETRY]</yellow> <green>[AI OUTPUT]</green> "
                    f"Model: <cyan>{current_model}</cyan> | Streaming: <light-blue>Completed</light-blue> | ID: <yellow>{request_id}</yellow>"
                )
                health_registry.report_success(current_model)
                yield "data: [DONE]\n\n"
                return
            except Exception as e:
                logger.warning(f"TEXT STREAM [#{request_id}]: Model {current_model} failed: {str(e)}")
                health_registry.report_failure(current_model)

                error_str = str(e).lower()

                if "api key not valid" in error_str or "api_key_invalid" in error_str:
                    yield f"data: {json.dumps({'error': 'API key is invalid.', 'done': True})}\n\n"
                    return

                if ("429" in error_str or "rate limit" in error_str or "exhausted" in error_str) and "nvidia" not in current_model.lower():
                    logger.opt(colors=True).critical(
                        f"TEXT STREAM LIMIT [#{request_id}]: 429 on {current_model}. Triggering NVIDIA failover."
                    )
                    try:
                        NVIDIA_FAIL_MODEL = "nvidia/llama-3.1-nemotron-70b-instruct"
                        async for chunk in stream_ai_text(
                            NVIDIA_FAIL_MODEL,
                            request.prompt,
                            request.systemInstruction,
                            user_id,
                            temperature=temperature,
                            max_tokens=max_tokens,
                            top_p=top_p,
                            top_k=top_k,
                        ):
                            yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"
                        health_registry.report_success(NVIDIA_FAIL_MODEL)
                        yield "data: [DONE]\n\n"
                        return
                    except Exception as nvidia_e:
                        logger.error(f"TEXT STREAM FAILOVER [#{request_id}]: NVIDIA Failover failed: {nvidia_e}")

                if current_model == unique_fallbacks[-1]:
                    yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"
                continue

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
