from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ==========================================
# 1. SCHEMAS UNTUK TRANSAKSI (WALLET)
# ==========================================
class TransactionCreate(BaseModel):
    amount: float
    type: str  # "income" atau "expense"
    category: str
    description: Optional[str] = None
    is_bnpl: bool = False

class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: str
    category: str
    description: Optional[str]
    is_bnpl: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# ==========================================
# 2. SCHEMAS UNTUK USERS (AUTH)
# ==========================================
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    monthly_income: Optional[float] = 0.0
    total_savings: Optional[float] = 0.0
    has_insurance: Optional[bool] = False

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    monthly_income: float
    total_savings: float
    has_insurance: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str

# ==========================================
# 3. SCHEMAS UNTUK SCORE (DASHBOARD)
# ==========================================
class ScoreResponse(BaseModel):
    resilience_score: float
    savings_months: float
    calculated_at: datetime
    # Response tambahan dari algoritma AI
    breakdown: dict = {}
    warning_message: str = ""

    class Config:
        from_attributes = True  

# ==========================================
# 4. SCHEMAS UNTUK AI (CHAT & DIGITAL TWIN)
# ==========================================
class ChatRequest(BaseModel):
    message: str

class ForecastPoint(BaseModel):
    day: int
    projected_spending: float

class DigitalTwinResponse(BaseModel):
    forecast: List[ForecastPoint]
    total_projected_90_days: float
    warning_months: List[int]
    trend: str 

class NudgeTrigger(BaseModel):
    type: str
    message: str

class NudgeCheckResponse(BaseModel):
    triggers: List[NudgeTrigger]
    sent: bool

# ==========================================
# 5. SCHEMAS UNTUK RESILIENCE SCORE AI
# ==========================================
class ResilienceScoreResponse(BaseModel):
    score: int
    savings_runway_months: float
    breakdown: dict
    warning_message: str