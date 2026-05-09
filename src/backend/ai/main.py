# Di main.py / app.py backend mereka

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json
from ai.resilienceScore import calculate_resilience_score
from ai.chatbot import stream_chat_response
from ai.digitalTwin import build_digital_twin, generate_demo_transactions
from db.demoData import demo_user

router = APIRouter(prefix="/api")

# ── Resilience Score ──────────────────────────────────────
@router.get("/resilience/demo")
def get_resilience():
    result = calculate_resilience_score(demo_user)
    return {"user": demo_user["name"], **result}

# ── AI Chatbot (Streaming) ────────────────────────────────
@router.post("/chat")
async def chat(body: dict):
    message  = body.get("message", "")
    language = body.get("language", "id")

    score_data = calculate_resilience_score(demo_user)
    user_data  = {
        **demo_user,
        "resilience_score":      score_data["score"],
        "savings_runway_months": score_data["savings_runway_months"],
        "debt_to_income_ratio":  score_data["debt_to_income_ratio"],
        "risk_level":            score_data["risk_level"],
        "language":              language,
    }

    def event_stream():
        for text in stream_chat_response(message, user_data):
            yield f"data: {json.dumps({'text': text})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

# ── Digital Twin ──────────────────────────────────────────
@router.get("/digital-twin/demo")
def get_digital_twin():
    transactions = generate_demo_transactions()
    return build_digital_twin(transactions, demo_user)

# Daftarkan router
app.include_router(router)  # pastikan 'app' adalah instance FastAPI