import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_access_secret_key_change_me_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_change_me_in_production';

export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Check cookies
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    // If no access token, check if we have a refresh token to issue a new one
    return tryRefresh(req, res, next);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        baselineScore: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Access token expired, try to refresh
      return tryRefresh(req, res, next);
    }
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

const tryRefresh = async (req, res, next) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Not authorized, session expired' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        baselineScore: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });

    // Set cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired, please log in again' });
  }
};
