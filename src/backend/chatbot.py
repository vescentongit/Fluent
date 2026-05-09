"""
ai/chatbot.py
AI Chatbot menggunakan Llama-3.3-70b-versatile (Groq) dengan streaming SSE
"""

import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

# Gunakan AsyncGroq untuk mendukung streaming di FastAPI
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

def build_system_prompt(user_data: dict) -> str:
    """
    Membangun system prompt dengan context data finansial user.
    """
    name = user_data.get("name", "Pengguna")
    score = user_data.get("resilience_score", "N/A")
    runway = user_data.get("savings_runway_months", "N/A")
    bnpl_debt = user_data.get("total_bnpl_debt", 0)
    monthly_income = user_data.get("monthly_income", 0)

    return f"""Kamu adalah Fluent, asisten keuangan personal yang cerdas, empati, dan to-the-point. 
Kamu dirancang khusus untuk pasar ASEAN dan memahami tantangan keuangan di Indonesia.

Data keuangan user saat ini:
- Nama: {name}
- Resilience Score: {score}/100
- Savings Runway: {runway} bulan (tanpa income)
- Total hutang BNPL: Rp {bnpl_debt:,.0f}
- Income bulanan: Rp {monthly_income:,.0f}

Panduan perilaku:
- Gunakan bahasa Indonesia yang natural, hangat, dan tidak menggurui.
- Berikan saran yang spesifik dan actionable berdasarkan data di atas.
- Jika score rendah, fokus ke prioritas paling mendesak (jangan overwhelming).
- Jangan rekomendasikan produk keuangan atau investasi spesifik.
- Jika ditanya hal di luar keuangan, redirect dengan sopan ke topik keuangan.
- Respon singkat dan padat — maksimal 3-4 paragraf kecuali diminta detail."""

async def stream_chat(user_message: str, user_data: dict):
    """
    Generator async untuk streaming response dari Groq Llama 3.3.
    """
    system_prompt = build_system_prompt(user_data)

    stream = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.7,
        max_tokens=1024,
        stream=True
    )
    
    async for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content