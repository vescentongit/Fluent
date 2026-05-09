from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Transaction, User # Pastikan User di-import
from schemas import DigitalTwinResponse
from auth import get_user_saat_ini
from digital_twin import forecast_spending

router = APIRouter()

@router.get("", response_model=DigitalTwinResponse)
def get_forecast(
    current_user: User = Depends(get_user_saat_ini), # PERBAIKAN DI SINI
    db: Session = Depends(get_db)
):
    txs = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    tx_data = [{"date": t.timestamp, "amount": float(t.amount)} for t in txs] # Ubah t.date jadi t.timestamp sesuai model kalian
    
    result = forecast_spending(tx_data, days_ahead=90)
    
    if "error" in result:
        return {
            "forecast": [],
            "total_projected_90_days": 0,
            "warning_months": [],
            "trend": "stable"
        }
        
    return result