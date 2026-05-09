# nudge_routes.py
from fastapi import APIRouter, Depends
from ai.models import User
from schemas import NudgeCheckResponse
from ai.auth import get_user_saat_ini

router = APIRouter()

@router.get("/check", response_model=NudgeCheckResponse)
def check_nudges(current_user: User = Depends(get_user_saat_ini)): # PERBAIKAN DI SINI
    return {
        "triggers": [
            {
                "type": "warning_bnpl",
                "message": f"Halo {current_user.name}, pengeluaran BNPL kamu mendekati batas aman. Hati-hati!"
            }
        ],
        "sent": True
    }