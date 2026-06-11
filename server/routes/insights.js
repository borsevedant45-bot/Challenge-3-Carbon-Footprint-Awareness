import express from 'express';
import { 
  getDailyTip, 
  getChartsData, 
  calculateBaseline 
} from '../controllers/insightsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { onboardingValidator } from '../middleware/validator.js';

const router = express.Router();

router.use(protect); // Protect all insights routes

router.get('/daily-tip', getDailyTip);
router.get('/charts', getChartsData);
router.post('/baseline', onboardingValidator, calculateBaseline);

export default router;
