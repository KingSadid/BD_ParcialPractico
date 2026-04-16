const express = require('express');
const path = require('path');

const spaceRoutes = require('./routes/space.routes');
const reservationRoutes = require('./routes/reservation.routes');
const heritageDB = require('./services/database/heritage.db');
const reservationsDB = require('./services/database/reservations.db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health Check
app.get('/health', async (req, res) => {
    const heritage = await heritageDB.healthCheck();
    const reservations = await reservationsDB.healthCheck();
    
    res.json({
        status: (heritage.connected && reservations.connected) ? 'operational' : 'degraded',
        databases: { heritage, reservations },
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/reservations', reservationRoutes);

// Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});