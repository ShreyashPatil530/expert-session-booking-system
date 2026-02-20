require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*', // In production, restrict to your frontend URL
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
app.use('/api/experts', require('./routes/expertRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
