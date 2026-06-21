import express from 'express';
import { getOffsets, pledgeOffset } from '../controllers/offsetsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all offset marketplace routes

router.get('/', getOffsets);
router.post('/pledge', pledgeOffset);

export default router;
