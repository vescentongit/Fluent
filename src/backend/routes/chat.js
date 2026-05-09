const express = require('express');
const router = express.Router();
const { streamChatResponse } = require('../ai/chatbot');
const { calculateResilienceScore } = require('../ai/resilienceScore');
const { demoUser } = require('../db/demoData');

    router.post('/', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message tidak boleh kosong.' });

    const scoreData = calculateResilienceScore(demoUser);
    const userData = {
        ...demoUser,
        resilienceScore: scoreData.score,
        savingsRunwayMonths: scoreData.savingsRunwayMonths,
        debtToIncomeRatio: scoreData.debtToIncomeRatio,
        riskLevel: scoreData.riskLevel
    };

    await streamChatResponse(message, userData, res);
});

module.exports = router;