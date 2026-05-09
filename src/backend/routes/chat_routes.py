# routes/chat_routes.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import datetime, timezone
import json

from ai.database import get_db
from ai.auth import get_user_saat_ini
import ai.models as models
from ai.chatbot import stream_chat_response
from ai.resilienceScore import calculate_resilience_score

router = APIRouter(tags=["AI Chatbot"])

@router.post("")
async def chat_endpoint(
    body: dict,
    current_user: models.User = Depends(get_user_saat_ini),
    db: Session = Depends(get_db)
):
    message  = body.get("message", "")
    language = body.get("language", "id")

    if not message:
        raise HTTPException(status_code=400, detail="Message kosong.")

    # Hitung score dulu untuk context AI
    user_data_raw = {
        "name": current_user.name,
        "monthly_income": current_user.monthly_income,
        "total_savings": current_user.total_savings,
        "has_insurance": current_user.has_insurance,
        "monthly_expenses": current_user.monthly_income * 0.7,
        "total_monthly_debt_payment": 0,
        "total_bnpl_debt": 0,
        "income_history": [current_user.monthly_income] * 3
    }

    score_data = calculate_resilience_score(user_data_raw)

    # Gabungkan semua context
    user_data = {
        **user_data_raw,
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