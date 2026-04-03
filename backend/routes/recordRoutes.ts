import { Router } from 'express';
import * as recordController from '../controllers/recordController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, recordController.getRecords);
router.post('/', authenticateToken, authorizeRole(['admin']), recordController.createRecord);
router.put('/:id', authenticateToken, authorizeRole(['admin']), recordController.updateRecord);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), recordController.deleteRecord);
router.get('/stats', authenticateToken, recordController.getDashboardStats);

export default router;
