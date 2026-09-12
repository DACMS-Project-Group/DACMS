import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Main API Router
app.use('/api', apiRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        error: err.message || 'Internal Server Error',
    });
});


export default app;