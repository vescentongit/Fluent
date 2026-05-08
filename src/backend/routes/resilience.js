const express = require('express');
const router = express.Router();
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

router.get('/demo', (req, res) => {
    const result = calculateResilienceScore(demoUser);
    res.json({ user: demoUser.name, ...result });
});

module.exports = router;