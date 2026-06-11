import { Router } from 'express';
import { handleCommand } from '../controllers/commandController.js';
import { optionalAuth } from '../services/authMiddleware.js';

const router = Router();

// Command endpoint - auth optional (guests can use basic features)
router.post('/', optionalAuth, handleCommand);

export default router;
