// backend/ai/chatbot.js

const Groq = require('groq-sdk');
const { buildSystemPrompt } = require('./prompts/systemPrompt');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function streamChatResponse(userMessage, userData, res) {
    try {
        const systemPrompt = buildSystemPrompt(userData);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Ganti .stream() dengan .create({ stream: true })
        const stream = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ],
        max_tokens: 1024,
        stream: true
        });

        for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();

    } catch (error) {
        console.error('Chatbot error:', error.message);
        res.write(`data: ${JSON.stringify({ error: 'Terjadi kesalahan.' })}\n\n`);
        res.end();
    }
}

module.exports = { streamChatResponse };