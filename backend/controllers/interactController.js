import { LikeModel } from '../models/likeModel.js';
import { CommentModel } from '../models/commentModel.js';

export const InteractController = {
  // --- LIKES ---
  async toggleLike(req, res) {
    try {
      const userId = req.user.id;
      const { articleId } = req.body;
      
      const existing = await LikeModel.checkStatus(userId, articleId);

      if (existing) {
        await LikeModel.remove(userId, articleId);
        res.json({ liked: false, message: "Unliked" });
      } else {
        await LikeModel.add(userId, articleId);
        res.json({ liked: true, message: "Liked" });
      }
    } catch (err) { 
      if (err.code === '23505') return res.json({ liked: true });
      res.status(500).json({ error: err.message }); 
    }
  },

  async checkLikeStatus(req, res) {
    try {
      const userId = req.user.id;
      const { articleId } = req.params;
      const data = await LikeModel.checkStatus(userId, articleId);
      res.json({ isLiked: !!data }); 
    } catch (err) { 
      res.status(500).json({ error: err.message }); 
    }
  },

  // --- COMMENTS ---
  
  async getComments(req, res) {
    try {
      const { articleId } = req.params;
      const comments = await CommentModel.getByArticle(articleId);
      res.json(comments);
    } catch (err) { 
      res.status(500).json({ error: err.message }); 
    }
  },

  async addComment(req, res) {
    try {
      const userId = req.user.id; 
      const { content, articleId } = req.body; 
      
      if (!content) return res.status(400).json({ error: "Konten tidak boleh kosong" });

      await CommentModel.create(content, articleId, userId);
      res.status(201).json({ message: "Komentar terkirim" });
    } catch (err) { 
      res.status(500).json({ error: err.message }); 
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;       
      await CommentModel.delete(id);
      res.json({ message: "Komentar dihapus" });
    } catch (err) { 
      res.status(500).json({ error: err.message }); 
    }
  }
};