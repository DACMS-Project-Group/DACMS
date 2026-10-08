import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import cookieParser from 'cookie-parser';
import pool from './config/db.js';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/healthz', async (req, res, next) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        next(error);
    }
});

// Main API Router
app.use('/api', apiRoutes);

const frontendDist = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../frontend/dist'
);

if (process.env.NODE_ENV === 'production' && existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.use((req, res, next) => {
        if (
            req.method !== 'GET' ||
            req.path === '/api' ||
            req.path.startsWith('/api/') ||
            req.path.startsWith('/socket.io')
        ) {
            return next();
        }

        res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
            if (error) next(error);
        });
    });
}

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        error: err.message || 'Internal Server Error',
    });
});


export default app;