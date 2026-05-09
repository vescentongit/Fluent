# routes/ai_routes.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import datetime, timezone
import json

from Fluent_Project.src.backend.ai.database import get_db
import Fluent_Project.src.backend.ai.models as models
from Fluent_Project.src.backend.ai.auth import get_user_saat_ini

from ai.resilience_score import calculate_resilience_score
from ai.chatbot import stream_chat_response
from ai.digital_twin import build_digital_twin
from ai.nudge_logic import generate_nudges 

router = APIRouter(prefix="/api")


# ── Helper: Ambil data user dari DB ──────────────────────
def get_user_financial_data(user: models.User, db: Session) -> dict:
    """
    Kumpulkan semua data finansial user dari DB
    untuk dipakai AI functions
    """
    # Total BNPL debt dari transaksi aktif
    bnpl_transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == user.id,
        models.Transaction.is_bnpl == True,
        models.Transaction.type == "expense"
    ).all()
    total_bnpl_debt = sum(t.amount for t in bnpl_transactions)

    # Monthly debt payment — BNPL bulan ini
    now = datetime.now(timezone.utc)
    monthly_bnpl = db.query(models.Transaction).filter(
        models.Transaction.user_id == user.id,
        models.Transaction.is_bnpl == True,
        models.Transaction.type == "expense",
        extract('month', models.Transaction.timestamp) == now.month,
        extract('year', models.Transaction.timestamp) == now.year
    ).all()
    total_monthly_debt_payment = sum(t.amount for t in monthly_bnpl)

    # Income history 3 bulan terakhir
    income_history = []
    for months_ago in range(2, -1, -1):  # 2, 1, 0 bulan lalu
        target_month = (now.month - months_ago - 1) % 12 + 1
        target_year  = now.year if now.month > months_ago else now.year - 1
        monthly_income_transactions = db.query(models.Transaction).filter(
            models.Transaction.user_id == user.id,
            models.Transaction.type == "income",
            extract('month', models.Transaction.timestamp) == target_month,
            extract('year', models.Transaction.timestamp) == target_year
        ).all()
        total = sum(t.amount for t in monthly_income_transactions)
        # Fallback ke monthly_income dari profile jika tidak ada transaksi
        income_history.append(total if total > 0 else user.monthly_income)

    # Monthly expenses dari transaksi bulan ini
    monthly_expense_transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == user.id,
        models.Transaction.type == "expense",
        extract('month', models.Transaction.timestamp) == now.month,
        extract('year', models.Transaction.timestamp) == now.year
    ).all()
    monthly_expenses = sum(t.amount for t in monthly_expense_transactions)
    # Fallback jika belum ada transaksi bulan ini
    if monthly_expenses == 0:
        monthly_expenses = user.monthly_income * 0.7  # estimasi 70% income

    return {
        "name": user.name,
        "monthly_income": user.monthly_income,
        "total_savings": user.total_savings,
        "has_insurance": user.has_insurance,
        "total_bnpl_debt": total_bnpl_debt,
        "total_monthly_debt_payment": total_monthly_debt_payment,
        "monthly_expenses": monthly_expenses,
        "income_history": income_history,
    }


# ── Helper: Simpan score ke DB ────────────────────────────
def save_score_to_db(user_id: int, score_data: dict, db: Session):
    new_score = models.Score(
        user_id          = user_id,
        resilience_score = score_data["score"],
        savings_months   = score_data["savings_runway_months"],
        savings_score    = score_data["breakdown"]["savings_score"],
        stability_score  = score_data["breakdown"]["stability_score"],
        debt_score       = score_data["breakdown"]["debt_score"],
        insurance_score  = score_data["breakdown"]["insurance_score"],
    )
    db.add(new_score)
    db.commit()


# ══════════════════════════════════════════════════════════
# ENDPOINTS
# ══════════════════════════════════════════════════════════

# ── Resilience Score ──────────────────────────────────────
@router.get("/resilience")
def get_resilience(
    current_user: models.User = Depends(get_user_saat_ini),
    db: Session = Depends(get_db)
):
    user_data  = get_user_financial_data(current_user, db)
    score_data = calculate_resilience_score(user_data)

    # Simpan ke DB
    save_score_to_db(current_user.id, score_data, db)

    return {"user": current_user.name, **score_data}


# ── AI Chatbot (Streaming) ────────────────────────────────
@router.post("/chat")
async def chat(
    body: dict,
    current_user: models.User = Depends(get_user_saat_ini),
    db: Session = Depends(get_db)
):
    message  = body.get("message", "")
    language = body.get("language", "id")

    if not message:
        raise HTTPException(status_code=400, detail="Message tidak boleh kosong.")

    user_data  = get_user_financial_data(current_user, db)
    score_data = calculate_resilience_score(user_data)

    # Gabungkan semua context untuk AI
    ai_context = {
        **user_data,
        "resilience_score":      score_data["score"],
        "savings_runway_months": score_data["savings_runway_months"],
        "debt_to_income_ratio":  score_data["debt_to_income_ratio"],
        "risk_level":            score_data["risk_level"],
        "language":              language,
    }

    def event_stream():
        for text in stream_chat_response(message, ai_context):
            yield f"data: {json.dumps({'text': text})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# ── Digital Twin ──────────────────────────────────────────
@router.get("/digital-twin")
def get_digital_twin(
    current_user: models.User = Depends(get_user_saat_ini),
    db: Session = Depends(get_db)
):
    # Ambil 30 hari transaksi expense terakhir
    transactions_db = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == "expense"
    ).order_by(models.Transaction.timestamp.desc()).limit(30).all()

    transactions = [
        {"date": t.timestamp.isoformat(), "amount": t.amount}
        for t in transactions_db
    ]

    user_data = get_user_financial_data(current_user, db)
    return build_digital_twin(transactions, user_data)


# ── Nudges ────────────────────────────────────────────────
@router.get("/nudge")
def get_nudges(
    current_user: models.User = Depends(get_user_saat_ini),
    db: Session = Depends(get_db)
):
    user_data  = get_user_financial_data(current_user, db)
    score_data = calculate_resilience_score(user_data)

    transactions_db = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == "expense"
    ).order_by(models.Transaction.timestamp.desc()).limit(30).all()

    transactions = [
        {"date": t.timestamp.isoformat(), "amount": t.amount}
        for t in transactions_db
    ]

    twin_data = build_digital_twin(transactions, user_data)
    nudges    = generate_nudges(user_data, score_data, twin_data)

    return {
        "user": current_user.name,
        "total_nudges": len(nudges),
        "critical_count": sum(1 for n in nudges if n["severity"] == "CRITICAL"),
        "nudges": nudges
    }