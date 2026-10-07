import app from './app.js';
import { Server } from 'socket.io';
import { configureSocketIO } from './services/NotificationService.js';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: true, credentials: true }
});
const userSockets = new Map();
configureSocketIO(io, userSockets);

io.use((socket, next) => {
    const token = socket.handshake.headers.cookie
        ?.split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('token='))
        ?.slice('token='.length);

    if (!token) {
        return next(new Error('Authentication required'));
    }

    try {
        const user = jwt.verify(
            decodeURIComponent(token),
            process.env.JWT_SECRET || 'your_super_secret_key'
        );
        if (!user.user_id || !user.role_id) {
            return next(new Error('Invalid authentication token'));
        }
        socket.data.userId = String(user.user_id);
        return next();
    } catch {
        return next(new Error('Invalid authentication token'));
    }
});

io.on('connection', (socket) => {
    const userId = socket.data.userId;
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    socket.on('disconnect', () => {
        if (userSockets.get(userId) === socket.id) {
            userSockets.delete(userId);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

export { io, userSockets };