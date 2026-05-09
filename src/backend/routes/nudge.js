// backend/routes/nudge.js

const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const { generateNudges } = require('../ai/nudgeLogic');
const { calculateResilienceScore } = require('../ai/resilienceScore');
const { buildDigitalTwin } = require('../ai/digitalTwin');
const { demoUser } = require('../db/demoData');

const expo = new Expo();

// Simpan push tokens sementara di memory (cukup untuk hackathon)
const pushTokens = new Map();

// ─── GET /api/nudge/demo ──────────────────────────────────
// Return daftar nudges untuk in-app banner
router.get('/demo', (req, res) => {
    const scoreData = calculateResilienceScore(demoUser);
    const twinData = buildDigitalTwin(generateDemoTransactions(), demoUser);
    const nudges = generateNudges(demoUser, scoreData, twinData);

    res.json({
        userId: 'demo',
        totalNudges: nudges.length,
        criticalCount: nudges.filter(n => n.severity === 'CRITICAL').length,
        nudges
    });
});

// ─── POST /api/nudge/register-token ──────────────────────
// Nathan kirim push token device ke sini waktu app dibuka
router.post('/register-token', (req, res) => {
    const { userId, token } = req.body;

    if (!token || !Expo.isExpoPushToken(token)) {
        return res.status(400).json({ error: 'Token tidak valid.' });
    }

    pushTokens.set(userId || 'demo', token);
    console.log(`Push token registered untuk ${userId}: ${token}`);
    res.json({ success: true, message: 'Token terdaftar.' });
});

// ─── POST /api/nudge/send ─────────────────────────────────
// Trigger push notification ke device user
router.post('/send', async (req, res) => {
    const { userId } = req.body;
    const token = pushTokens.get(userId || 'demo');

    if (!token) {
        return res.status(404).json({ error: 'Token tidak ditemukan. User belum register.' });
    }

    // Generate nudges terbaru
    const scoreData = calculateResilienceScore(demoUser);
    const twinData = buildDigitalTwin(generateDemoTransactions(), demoUser);
    const nudges = generateNudges(demoUser, scoreData, twinData);

    // Kirim hanya nudge yang paling critical
    const topNudge = nudges[0];
    if (!topNudge) {
        return res.json({ success: true, message: 'Tidak ada nudge untuk dikirim.' });
    }

    const messages = [{
        to: token,
        sound: 'default',
        title: `${topNudge.icon} ${topNudge.title}`,
        body: topNudge.message,
        data: { nudgeId: topNudge.id, action: topNudge.action }
    }];

    try {
        const chunks = expo.chunkPushNotifications(messages);
        const results = [];

        for (const chunk of chunks) {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        results.push(...receipts);
        }

        res.json({ success: true, sent: topNudge.title, results });
    } catch (error) {
        console.error('Push error:', error.message);
        res.status(500).json({ error: 'Gagal kirim notifikasi.' });
    }
});

// Demo transactions helper (sama seperti di digitalTwin route)
function generateDemoTransactions() {
    const transactions = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        transactions.push({
        date: date.toISOString(),
        amount: Math.max(0, 50_000 + i * 1_500 + (Math.random() - 0.5) * 20_000)
        });
    }
    return transactions;
}

module.exports = router;