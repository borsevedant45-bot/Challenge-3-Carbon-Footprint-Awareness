import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { globalLimiter } from './middleware/rateLimiter.js';

// Route Imports
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activities.js';
import insightRoutes from './routes/insights.js';
import challengeRoutes from './routes/challenges.js';
import offsetRoutes from './routes/offsets.js';

// Load Environment Variables
dotenv.config();

const app = express();

// Trust Render's proxy for correct rate limiting IP detection
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_URL || 'https://ecopulse-app.vercel.app';

// 1. Security Headers (Helmet with Content Security Policy)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", CLIENT_ORIGIN]
    }
  }
}));

// 2. CORS Setup (Allow only defined client origin, enable credentials for cookies)
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting (100 requests per 15 minutes globally)
app.use(globalLimiter);

// 4. Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/offsets', offsetRoutes);

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred'
  });
});

// 7. Start Server
app.listen(PORT, () => {
  console.log(`[Server] EcoPulse backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
