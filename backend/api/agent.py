import json
import time
import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, List
from google.genai import types
from loguru import logger

from backend.utils.deps import get_auth_user_id
from backend.ai_engine import stream_ai, call_ai, build_genai_client, ai_engine
from backend.schemas import GenerationRequest, GenerationResponse
from backend.api.ai import get_api_key, resolve_model, health_registry

router = APIRouter(prefix="/api/agent", tags=["Agent Execution"])

class AgentGenerationRequest(GenerationRequest):
    stream: Optional[bool] = False

@router.post("", response_model=GenerationResponse)
async def generate_agent(request: AgentGenerationRequest, user_id: str = Depends(get_auth_user_id)):
    """Agentic generation endpoint supporting both standard response and streaming workflows."""
    if request.stream:
        return await stream_agent_response(request, user_id)
        
    target_model = resolve_model(request.model)
    
    # Fallbacks for Agents
    FALLBACK_MODELS = [
        target_model,
        "gemini-3.1-pro",
        "gemini-3-pro",
        "gemini-2.5-pro",
        "gemini-2.0-pro",
        "gemini-1.5-pro",
        "gemini-3.1-flash",
        "gemini-2.5-flash",
        "gemma-3-27b"
    ]
    
    NVIDIA_FAILOVER = "nvidia/llama-3.1-nemotron-70b-instruct"
    unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACK_MODELS))]
    start_time = time.perf_counter()
    attempted_fallbacks = []
    request_id = str(uuid.uuid4())[:8]

    logger.opt(colors=True).info(f"AGENT SYNTHESIS [#{request_id}]: Starting agent orchestration. Target: <cyan>{target_model}</cyan>")

    last_error = None
    for current_model in unique_fallbacks:
        if health_registry.is_degraded(current_model) and current_model != unique_fallbacks[-1]:
            logger.opt(colors=True).warning(f"AGENT ROUTING [#{request_id}]: Model <cyan>{current_model}</cyan> degraded. Skipping...")
            continue
            
        try:
            if current_model != target_model and current_model not in attempted_fallbacks:
                logger.opt(colors=True).warning(f"AGENT RECOVERY [#{request_id}]: Failover to: <yellow>{current_model}</yellow>")
                attempted_fallbacks.append(current_model)

            api_key = await get_api_key(user_id, current_model)

            is_openai = "gpt-" in current_model.lower() or "o1-" in current_model.lower()
            is_groq = any(m in current_model.lower() for m in ["llama", "mixtral", "deepseek"]) and "gemma" not in current_model.lower() and "nvidia" not in current_model.lower() and "meta/" not in current_model.lower()
            is_claude = "claude" in current_model.lower()
            is_nvidia = "nvidia" in current_model.lower() or "nemotron" in current_model.lower() or current_model.startswith("meta/")

            if is_claude or is_openai or is_groq or is_nvidia:
                output_text = await call_ai(current_model, request.prompt, request.systemInstruction, user_id)
                usage_dict = {}
            else:
                client = build_genai_client(api_key=api_key)
                config = {"system_instruction": request.systemInstruction} if request.systemInstruction else None
                response = await client.aio.models.generate_content(
                    model=current_model,
                    contents=request.prompt,
                    config=types.GenerateContentConfig(**config) if config else None
                )
                if not response or not hasattr(response, "text"):
                    raise ValueError(f"Model {current_model} returned an empty response.")
                
                output_text = response.text
                
                if output_text.strip().startswith("{") and not output_text.strip().endswith("}"):
                    logger.warning(f"AGENT REPAIR [#{request_id}]: Truncated JSON. Repairing.")
                    output_text = ai_engine._repair_json(output_text)

                usage_dict = {
                    "prompt_tokens": getattr(response.usage_metadata, "prompt_token_count", 0),
                    "candidates_tokens": getattr(response.usage_metadata, "candidates_token_count", 0),
                    "total_tokens": getattr(response.usage_metadata, "total_token_count", 0)
                } if hasattr(response, "usage_metadata") else {}

            latency_ms = (time.perf_counter() - start_time) * 1000
            
            logger.success(f"AGENT COMPLETED: [✅] Neural Agent Synthesis Successful")
            health_registry.report_success(current_model)
            
            from backend.utils.notifications import notify_user
            await notify_user(user_id, "Agent Synthesis Successful", f"Agent Model {current_model} finalized orchestration in {latency_ms:.0f}ms.", "SUCCESS")

            return GenerationResponse(
                text=output_text,
                model_used=current_model,
                finish_reason="STOP",
                usage=usage_dict,
                latency_ms=latency_ms,
                fallbacks=attempted_fallbacks
            )

        except Exception as e:
            last_error = e
            health_registry.report_failure(current_model)
            error_str = str(e).lower()
            
            if "api key not valid" in error_str or "api_key_invalid" in error_str:
                logger.error(f"AGENT AUTH ERROR [#{request_id}]: API Key invalid for {current_model}.")
                raise HTTPException(status_code=400, detail="API key is invalid. Please check settings.")

            if ("429" in error_str or "rate limit" in error_str or "exhausted" in error_str) and "nvidia" not in current_model.lower():
                logger.opt(colors=True).critical(f"AGENT RATE LIMIT [#{request_id}]: 429 on {current_model}. Emergency NVIDIA failover.")
                try:
                    api_key = await get_api_key(user_id, NVIDIA_FAILOVER)
                    output_text = await call_ai(NVIDIA_FAILOVER, request.prompt, request.systemInstruction, user_id)
                    latency_ms = (time.perf_counter() - start_time) * 1000
                    
                    logger.success(f"AGENT RECOVERY: [⚡] NVIDIA Emergency Failover Successful")
                    health_registry.report_success(NVIDIA_FAILOVER)
                    return GenerationResponse(
                        text=output_text,
                        model_used=NVIDIA_FAILOVER,
                        finish_reason="STOP",
                        usage={},
                        latency_ms=latency_ms,
                        fallbacks=attempted_fallbacks + [current_model]
                    )
                except Exception as nvidia_e:
                    logger.error(f"AGENT FAILOVER [#{request_id}]: NVIDIA Failover failed: {nvidia_e}")
            
            logger.warning(f"AGENT SYNTHESIS [#{request_id}]: Model {current_model} failed: {str(e)}")
            continue

    logger.error(f"AGENT SYNTHESIS [#{request_id}]: All connections failed.")
    raise HTTPException(status_code=500, detail=f"Neural Agent Synthesis Failed: {str(last_error)}")

async def stream_agent_response(request: AgentGenerationRequest, user_id: str):
    """Internal SSE stream generator for agent logic."""
    target_model = resolve_model(request.model)
    request_id = str(uuid.uuid4())[:8]
    
    async def event_generator():
        FALLBACKS = [
            target_model,
            "gemini-3.1-pro",
            "gemini-2.5-pro",
            "gemini-3.1-flash",
            "gemini-2.5-flash",
            "gemma-3-27b"
        ]
        unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACKS))]
        attempted_fallbacks: list[str] = []
        
        for current_model in unique_fallbacks:
            if health_registry.is_degraded(current_model) and current_model != unique_fallbacks[-1]:
                logger.opt(colors=True).warning(f"AGENT STREAM ROUTING [#{request_id}]: Model <cyan>{current_model}</cyan> degraded. Skipping...")
                continue
                
            try:
                if current_model != target_model and current_model not in attempted_fallbacks:
                    logger.opt(colors=True).warning(f"AGENT STREAM RECOVERY [#{request_id}]: Failover to: <yellow>{current_model}</yellow>")
                    attempted_fallbacks.append(current_model)

                logger.opt(colors=True).info(f"AGENT STREAM [#{request_id}]: Initializing via <cyan>{current_model}</cyan>")
                
                async for chunk in stream_ai(current_model, request.prompt, request.systemInstruction, user_id):
                    yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"
                
                logger.success(f"AGENT STREAM [#{request_id}]: Stream finalized successfully.")
                health_registry.report_success(current_model)
                yield "data: [DONE]\n\n"
                return
            except Exception as e:
                logger.warning(f"AGENT STREAM [#{request_id}]: Model {current_model} failed: {str(e)}")
                health_registry.report_failure(current_model)
                
                error_str = str(e).lower()

                if "api key not valid" in error_str or "api_key_invalid" in error_str:
                    yield f"data: {json.dumps({'error': 'API key is invalid.', 'done': True})}\n\n"
                    return

                if current_model == unique_fallbacks[-1]:
                     yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"
                continue
        
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(), 
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )
