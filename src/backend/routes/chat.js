const express = require('express');
const router = express.Router();
const { streamChatResponse } = require('../ai/chatbot');
const { calculateResilienceScore } = require('../ai/resilienceScore');
const { demoUser } = require('../db/demoData');

    // routes/chat.js — update bagian router.post
router.post('/', async (req, res) => {
    const { message, language = 'id' } = req.body; // tambah language

    if (!message) return res.status(400).json({ error: 'Message kosong.' });

    const scoreData = calculateResilienceScore(demoUser);
    const userData = {
        ...demoUser,
        resilienceScore: scoreData.score,
        savingsRunwayMonths: scoreData.savingsRunwayMonths,
        debtToIncomeRatio: scoreData.debtToIncomeRatio,
        riskLevel: scoreData.riskLevel,
        language  // pass ke system prompt
    };


    await streamChatResponse(message, userData, res);
});

module.exports = router;