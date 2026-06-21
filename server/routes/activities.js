import express from 'express';
import { 
  getActivities, 
  createActivity, 
  getSummary 
} from '../controllers/activitiesController.js';
import { protect } from '../middleware/authMiddleware.js';
import { activityValidator } from '../middleware/validator.js';

const router = express.Router();

router.use(protect); // Protect all activity routes

router.get('/', getActivities);
router.post('/', activityValidator, createActivity);
router.get('/summary', getSummary);

export default router;
