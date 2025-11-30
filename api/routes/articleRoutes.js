import express from 'express';
import { ArticleController } from '../controllers/articleController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/search', ArticleController.search);
router.get('/my-articles', verifyToken, ArticleController.getMyArticles);

router.post('/', verifyToken, ArticleController.create);
router.put('/:id', verifyToken, ArticleController.update);
router.delete('/:id', verifyToken, ArticleController.remove);

router.get('/', ArticleController.getAll);
router.get('/:id', ArticleController.getById);

export default router;