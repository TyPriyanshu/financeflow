import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authenticateToken, authorizeRole(['admin']), authController.getUsers);

export default router;
