const express = require('express');
const router = express.Router();
const { streamChatResponse } = require('../ai/chatbot');
const { calculateResilienceScore } = require('../ai/resilienceScore');

const demoUser = {
    name: 'Budi Santoso',
    totalSavings: 2_300_000,
    monthlyExpenses: 1_600_000,
    monthlyIncome: 5_000_000,
    totalMonthlyDebtPayment: 800_000,
    totalBnplDebt: 3_200_000,
    hasInsurance: false,
    incomeHistory: [4_800_000, 5_000_000, 5_200_000]
    };

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