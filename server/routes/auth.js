import express from 'express';
import { 
  register, 
  login, 
  logout, 
  refresh, 
  getMe, 
  forgotPassword, 
  googleLogin 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerValidator, loginValidator } from '../middleware/validator.js';

const router = express.Router();

// Apply strict rate limiting to authentication routes
router.use(authLimiter);

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/google', googleLogin);

export default router;
