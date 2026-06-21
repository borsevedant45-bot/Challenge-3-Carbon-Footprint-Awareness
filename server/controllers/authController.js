import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendTokenResponse } from '../utils/jwtHelper.js';
import { errorResponse, successResponse } from '../utils/responseFormatter.js';

const prisma = new PrismaClient();

// Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  // Normalize email to lowercase for case-insensitive uniqueness
  const normalizedEmail = email ? email.toLowerCase().trim() : email;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return errorResponse(res, 'A user with this email already exists', 400);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        provider: 'local',
        baselineScore: 0
      }
    });

    return sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration Error:', error);
    return errorResponse(res, 'Server error during registration', 500);
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;
  // Normalize email to lowercase for case-insensitive matching
  const normalizedEmail = email ? email.toLowerCase().trim() : email;

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    if (user.provider !== 'local') {
      return errorResponse(res, 'Please sign in with Google', 401);
    }
    if (!user.passwordHash) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login Error:', error);
    return errorResponse(res, 'Server error during login', 500);
  }
};

// Logout User
export const logout = (req, res) => {
  res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  return successResponse(res, {}, 'Successfully logged out');
};

// Refresh Access Token
export const refresh = async (req, res) => {
  // TryRefresh is already handled in authMiddleware or we can do it directly here
  // If the user hits /api/auth/refresh directly, we inspect the cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return errorResponse(res, 'Session expired, no refresh token found', 401);
  }

  try {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_change_me_in_production';
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    return errorResponse(res, 'Invalid or expired refresh token', 401);
  }
};

// Get Current User Info
export const getMe = async (req, res) => {
  // req.user is populated by protect middleware
  if (!req.user) {
    return errorResponse(res, 'Not authenticated', 401);
  }
  return successResponse(res, req.user);
};

// Forgot Password Flow (Simulated)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return errorResponse(res, 'Email is required', 400);
  }
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return errorResponse(res, 'No user registered with this email', 404);
    }

    // In a real application, we would email a token
    // For MVP, we'll return a simulated link or code
    return successResponse(res, {
      simulatedResetLink: `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(normalizedEmail)}`
    }, 'Password reset link sent to email (simulated)');
  } catch (error) {
    return errorResponse(res, 'Server error during password reset request', 500);
  }
};

// Google Federated Login (Create or Find User)
export const googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;
  const normalizedEmail = email ? email.toLowerCase().trim() : email;
  
  if (!normalizedEmail || !name) {
    return errorResponse(res, 'Google email and name are required', 400);
  }

  try {
    // Find user by email or by provider id
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (user) {
      // If user exists but registered local, we can link it or reject
      if (user.provider !== 'google') {
        // Update provider to google, or just keep it
        user = await prisma.user.update({
          where: { email: normalizedEmail },
          data: { provider: 'google' }
        });
      }
    } else {
      // Create a new Google user
      user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          provider: 'google',
          baselineScore: 0
        }
      });
    }

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Google Auth Error:', error);
    return errorResponse(res, 'Server error during Google Authentication', 500);
  }
};
