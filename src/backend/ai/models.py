from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
# Baris pertama ai/models.py — ganti:
from .database import Base

# 1. Tabel Users (Pengguna)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="User") # Tambahan AI: Nama untuk disapa Chatbot
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # Tambahan AI: Data statis finansial untuk kalkulasi Resilience Score
    monthly_income = Column(Float, default=0.0)
    total_savings = Column(Float, default=0.0)
    has_insurance = Column(Boolean, default=False)

    # Relasi
    transactions = relationship("Transaction", back_populates="owner")
    scores = relationship("Score", back_populates="owner")

# 2. Tabel Transactions (Transaksi)
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) 
    amount = Column(Float) 
    type = Column(String) # "income" atau "expense"
    category = Column(String) 
    description = Column(String, nullable=True) # Tambahan AI
    is_bnpl = Column(Boolean, default=False) # Tambahan AI: Untuk deteksi utang
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="transactions")

# 3. Tabel Scores (Resilience Score)
class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resilience_score = Column(Float) 
    savings_months = Column(Float) 
    
    # Tambahan AI: Breakdown skor per pilar
    savings_score = Column(Float, nullable=True)
    stability_score = Column(Float, nullable=True)
    debt_score = Column(Float, nullable=True)
    insurance_score = Column(Float, nullable=True)
    
    calculated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="scores")