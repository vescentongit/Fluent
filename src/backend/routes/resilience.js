const express = require('express');
const router = express.Router();
const { calculateResilienceScore } = require('../ai/resilienceScore');
const { demoUser } = require('../db/demoData');


router.get('/demo', (req, res) => {
    const result = calculateResilienceScore(demoUser);
    res.json({ user: demoUser.name, ...result });
});

module.exports = router;