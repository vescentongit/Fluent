// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const digitalTwinRoutes = require('./routes/digitalTwin');

const chatRoutes = require('./routes/chat');
const resilienceRoutes = require('./routes/resilience');

console.log('chatRoutes type:', typeof chatRoutes);
console.log('resilienceRoutes type:', typeof resilienceRoutes);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/resilience', resilienceRoutes);
app.use('/api/digital-twin', digitalTwinRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Fluent Backend running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});