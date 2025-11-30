import express from 'express';
import { BookmarkController } from '../controllers/bookmarkController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); 
router.get('/', BookmarkController.getMyBookmarks);
router.get('/status/:articleId', BookmarkController.checkStatus);

router.post('/toggle', BookmarkController.toggleBookmark);
router.delete('/:id', BookmarkController.removeBookmark);

export default router;