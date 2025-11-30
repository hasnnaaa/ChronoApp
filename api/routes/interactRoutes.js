import express from 'express';
import { InteractController } from '../controllers/interactController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// LIKES
router.get('/likes/status/:articleId', verifyToken, InteractController.checkLikeStatus);
router.post('/likes/toggle', verifyToken, InteractController.toggleLike);

// COMMENTS
router.get('/comments/:articleId', InteractController.getComments);
router.post('/comments', verifyToken, InteractController.addComment);
router.delete('/comments/:id', verifyToken, InteractController.deleteComment);

export default router;