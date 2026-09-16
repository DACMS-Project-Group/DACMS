import app from './app.js';
import { Server } from "socket.io";
import http from 'http';
import { createServer } from "node:http";
import env from 'dotenv';

env.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const userSockets = new Map();

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    socket.on('disconnect', () => {
        userSockets.delete(userId);
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}, ${process.env.JWT_SECRET}`);
});

export { io, userSockets };