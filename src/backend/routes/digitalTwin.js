// backend/routes/digitalTwin.js

const express = require('express');
const router = express.Router();
const { buildDigitalTwin } = require('../ai/digitalTwin');
const demoTransactions = generateDemoTransactions();
const { demoUser } = require('../db/demoData');

router.get('/demo', (req, res) => {
    const result = buildDigitalTwin(demoTransactions, demoUser);
    res.json(result);
});

// Generate 30 hari transaksi demo yang realistis
function generateDemoTransactions() {
    const transactions = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString();

        // Spending naik sedikit tiap minggu (trend negatif untuk demo)
        const baseSpending = 50_000 + i * 1_500;
        const randomVariance = (Math.random() - 0.5) * 20_000;

        transactions.push({
        date: dateStr,
        amount: Math.max(0, baseSpending + randomVariance)
        });
    }

    return transactions;
}

module.exports = router;