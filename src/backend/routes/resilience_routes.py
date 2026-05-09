# resilience_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ai.database import get_db
from ai.models import User, Transaction
from schemas import ResilienceScoreResponse
from ai.auth import get_user_saat_ini
from resilience_score import calculate_resilience_score

router = APIRouter()

@router.get("", response_model=ResilienceScoreResponse)
def get_resilience(
    current_user: User = Depends(get_user_saat_ini), # PERBAIKAN DI SINI
    db: Session = Depends(get_db)
):
    txs = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    monthly_expenses = sum([float(t.amount) for t in txs if not t.is_bnpl])
    total_bnpl = sum([float(t.amount) for t in txs if t.is_bnpl])
    
    if monthly_expenses == 0:
        monthly_expenses = float(current_user.monthly_income or 1000000) * 0.5 

    result = calculate_resilience_score(
        total_savings=float(current_user.total_savings or 0),
        monthly_expenses=monthly_expenses,
        monthly_income=float(current_user.monthly_income or 0),
        total_monthly_debt_payment=total_bnpl,
        has_insurance=current_user.has_insurance,
        income_history=[float(current_user.monthly_income or 0)] * 3 
    )
    return result