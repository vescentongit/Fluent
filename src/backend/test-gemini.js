require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
    try {
        const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 'Jawab dengan satu kata: halo',
        });
        console.log('✅ JALAN:', response.text);
    } catch (e) {
        console.error('❌ GAGAL:', e.message);
    }
}

test();