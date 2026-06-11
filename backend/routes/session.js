import { Router } from 'express';
import { saveSession, getSession, clearSession } from '../controllers/sessionController.js';
import { authenticate } from '../services/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getSession);
router.post('/', authenticate, saveSession);
router.delete('/', authenticate, clearSession);

export default router;
