import express from 'express';
import { UserController } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/profile', verifyToken, UserController.getProfile);
router.put('/profile', verifyToken, UserController.updateProfile);

export default router;