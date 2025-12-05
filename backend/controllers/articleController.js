import { ArticleModel } from '../models/articleModel.js';

export const ArticleController = {
  async getAll(req, res) {
    try {
      const articles = await ArticleModel.getAll();
      res.json(articles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const article = await ArticleModel.getById(req.params.id);
      res.json(article);
    } catch (err) {
      res.status(404).json({ error: "Artikel tidak ditemukan" });
    }
  },

  async create(req, res) {
    try {
      const userId = req.user.id; // Middleware Token
      const { title, category, content, image_url, excerpt } = req.body;
      
      const newArticle = await ArticleModel.create({
        title, category, content, image_url, excerpt, user_id: userId
      });
      
      res.status(201).json(newArticle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMyArticles(req, res) {
    try {
      const userId = req.user.id; // Token
      const articles = await ArticleModel.getByUserId(userId);
      res.json(articles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async search(req, res) {
    try {
      const { q, category } = req.query; 
      let articles;
      if (category) {
        // Kalau ada parameter category, pakai filter ketat
        articles = await ArticleModel.getByCategory(category);
      } else if (q) {
        // Kalau ada parameter q, pakai search biasa
        articles = await ArticleModel.search(q);
      } else {
        articles = [];
      }
      res.json(articles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await ArticleModel.update(id, updates);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await ArticleModel.delete(req.params.id);
      res.json({ message: "Artikel dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};