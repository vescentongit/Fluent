from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import ai.models as models
import schemas
from ai.auth import get_user_saat_ini
import ai.database as database
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from ai.database import engine, get_db
import ai.auth


# Import router baru untuk fitur AI
from routes import resilience_routes, digital_twin_routes, chat_routes, nudge_routes

# Membuat tabel baru (pastikan sudah DROP TABLE di Neon sebelumnya)
database.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fluent API - AI Integrated")

# Penting: Tambahkan CORS agar Frontend (React Native/Web) bisa akses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def baca_root():
    return {"pesan": "Fluent Backend AI is Online!", "status": "ready"}

# ==========================================
# 1. UPDATE AUTH (SIGNUP & LOGIN)
# ==========================================

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")

    # Simpan dengan kolom lengkap untuk kebutuhan AI
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password= ai.auth.get_password_hash(user.password),
        monthly_income=user.monthly_income,
        total_savings=user.total_savings,
        has_insurance=user.has_insurance
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not db_user or not ai.auth.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Email atau password salah!")
    
    access_token = ai.auth.create_access_token(data={"sub": db_user.email})
    # Kembalikan user_id dan name agar frontend gampang menyapa user
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": db_user.id, 
        "name": db_user.name
    }

# ==========================================
# 2. UPDATE TRANSACTIONS (Mendukung is_bnpl)
# ==========================================

@app.post("/transactions", response_model=schemas.TransactionResponse)
def catat_transaksi(
    transaksi: schemas.TransactionCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_user_saat_ini) # PERBAIKAN: disamakan panggilannya
):
    db_transaksi = models.Transaction(
        amount=transaksi.amount, 
        type=transaksi.type, 
        category=transaksi.category,
        description=transaksi.description,
        is_bnpl=transaksi.is_bnpl,       
        user_id=current_user.id
    )
    db.add(db_transaksi)
    db.commit()
    db.refresh(db_transaksi)
    return db_transaksi

@app.get("/transactions", response_model=list[schemas.TransactionResponse])
def ambil_riwayat_saya(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_user_saat_ini)
):
    # Hanya ambil transaksi milik user yang sedang login
    return db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id).all()

# ==========================================
# 3. REGISTER AI ROUTERS
# ==========================================
# Ini akan menyambungkan file-file di folder /routes ke main API
app.include_router(resilience_routes.router, prefix="/api/resilience", tags=["AI Resilience"])
app.include_router(digital_twin_routes.router, prefix="/api/digital-twin", tags=["AI Forecasting"])
app.include_router(chat_routes.router, prefix="/api/chat", tags=["AI Chatbot"])
app.include_router(nudge_routes.router, prefix="/api/nudge", tags=["AI Nudges"])