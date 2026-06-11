import express from 'express';
import { 
  getChallenges, 
  getUserChallenges, 
  joinChallenge, 
  completeChallenge 
} from '../controllers/challengesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all challenge routes

router.get('/', getChallenges);
router.get('/active', getUserChallenges);
router.post('/join', joinChallenge);
router.post('/complete', completeChallenge);

export default router;
