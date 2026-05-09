# auth.py
from sqlalchemy.orm import Session
from Fluent_Project.src.backend.ai.database import get_db
import Fluent_Project.src.backend.ai.models as models

import os
from dotenv import load_dotenv

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from Fluent_Project.src.backend.ai.database import get_db
import Fluent_Project.src.backend.ai.models as models


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-aman") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Alat pengacak password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")

# Fungsi untuk mengacak password
def get_password_hash(password):
    return pwd_context.hash(password)

# Fungsi untuk mengecek: password yang diketik vs password di database cocok gak?
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Fungsi untuk membuat "Tiket Masuk" (JWT Token)
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_user_saat_ini(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Tiket tidak valid")
    except JWTError:
        raise HTTPException(status_code=401, detail="Tiket tidak valid")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user