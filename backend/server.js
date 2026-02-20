require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Pass socketio to app to use in controllers
app.set('socketio', io);

// Define Routes
app.get('/', (req, res) => {
    res.send('ExpertConnect Backend is running successfully!');
});

// Health check route for database
app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    const status = mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected';
    res.json({
        status,
        database: mongoose.connection.name || 'Not Connected',
        env: process.env.NODE_ENV
    });
});

app.use('/api/experts', require('./routes/expertRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5001;

// Bind to port immediately to satisfy Render's health check
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);

    // Connect to database after binding to port
    connectDB().then(() => {
        console.log('✅ Background DB connection successful');
    }).catch(err => {
        console.error('❌ Background DB connection failed:', err.message);
    });
});
