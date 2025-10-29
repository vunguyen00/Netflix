import { Router } from 'express';
import { login, register, me, stream, checkPhone, resetPin } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post('/check-phone', checkPhone);

router.get('/me', authenticate, me);
router.get('/stream', authenticate, stream);

router.post('/reset-pin', authenticate, resetPin);

export default router;
