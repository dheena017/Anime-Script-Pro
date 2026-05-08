from fastapi import FastAPI, Request, HTTPException, Header
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="ASPro Mock Backend for Learning")

class LoginRequest(BaseModel):
    email: str
    password: str

class GenerateRequest(BaseModel):
    model: str
    prompt: str
    systemInstruction: Optional[str] = None
    temperature: Optional[float] = 0.0

@app.post('/api/auth/token')
async def token(login: LoginRequest):
    # Simple dev bypass: return a fixed token for the well-known dev credentials
    if login.email == 'email@gmail.com' and login.password == 'password':
        return {"access_token": "test-token", "token_type": "bearer", "expires_in": 900}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post('/api/generate')
async def generate(req: GenerateRequest, authorization: Optional[str] = Header(None)):
    # Mock authentication check (accept "Bearer test-token")
    if authorization is None or 'test-token' not in authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Return the sample response content
    return {
        "text": "Act 1: The hero is introduced...\nAct 2: Conflict escalates...\nAct 3: Resolution.",
        "model_used": req.model,
        "finish_reason": "STOP",
        "usage": {"prompt_tokens": 42, "total_tokens": 120},
        "latency_ms": 123.4,
        "fallbacks": []
    }

@app.get('/health')
async def health():
    return {"status": "ok"}
