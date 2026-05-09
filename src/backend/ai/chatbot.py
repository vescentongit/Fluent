# ai/chatbot.py
import os
from groq import Groq
from ai.prompts.systemPrompt import build_system_prompt

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def stream_chat_response(user_message: str, user_data: dict):
    """
    Generator function — yield chunk text satu per satu.
    FastAPI akan stream ini ke frontend.
    """
    system_prompt = build_system_prompt(user_data)

    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message}
        ],
        max_tokens=1024,
        stream=True
    )

    for chunk in stream:
        text = chunk.choices[0].delta.content or ""
        if text:
            yield text