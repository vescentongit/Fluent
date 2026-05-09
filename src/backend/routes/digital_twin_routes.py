# routes/digital_twin_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ai.database import get_db
from ai.auth import get_user_saat_ini
import ai.models as models
from ai.digitalTwin import build_digital_twin

# Hapus prefix="/api" — sudah dihandle di main.py
router = APIRouter(tags=["AI Forecasting"])

@router.get("")  # "/" karena prefix sudah di main.py
def get_forecast(
    current_user: models.User = Depends(get_user_saat_ini),
    db: Session = Depends(get_db)
):
    transactions_db = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == "expense"
    ).order_by(models.Transaction.timestamp.desc()).limit(30).all()

    transactions = [
        {"date": t.timestamp.isoformat(), "amount": t.amount}
        for t in transactions_db
    ]

    user_data = {
        "monthly_income": current_user.monthly_income,
        "total_savings": current_user.total_savings,
    }

    return build_digital_twin(transactions, user_data)