# chat_routes.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from Fluent_Project.src.backend.ai.database import get_db
from Fluent_Project.src.backend.ai.models import User, Transaction
from schemas import ChatRequest
from Fluent_Project.src.backend.ai.auth import get_user_saat_ini
from chatbot import stream_chat

router = APIRouter()

@router.post("")
async def chat_endpoint(
    body: ChatRequest,
    current_user: User = Depends(get_user_saat_ini), # PERBAIKAN DI SINI
    db: Session = Depends(get_db)
):
    # Tidak perlu query User lagi karena sudah didapat dari tiket JWT
    txs = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    total_bnpl = sum([float(t.amount) for t in txs if t.is_bnpl])
    
    user_data = {
        "name": current_user.name,
        "monthly_income": float(current_user.monthly_income or 0),
        "resilience_score": 75, 
        "savings_runway_months": (float(current_user.total_savings or 0) / 3000000) if current_user.total_savings else 0, 
        "total_bnpl_debt": total_bnpl
    }

    return StreamingResponse(
        stream_chat(body.message, user_data), 
        media_type="text/event-stream"
    )