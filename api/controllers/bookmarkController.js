import { BookmarkModel } from '../models/bookmarkModel.js';

export const BookmarkController = {
  // Ambil semua bookmark user
  async getMyBookmarks(req, res) {
    try {
      const userId = req.user.id; 
      const bookmarks = await BookmarkModel.getByUserId(userId);
      res.json(bookmarks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Toggle (Like/Unlike logic)
  async toggleBookmark(req, res) {
    try {
      const userId = req.user.id;
      const { articleId } = req.body;

      const existing = await BookmarkModel.checkStatus(userId, articleId);

      if (existing) {
        await BookmarkModel.delete(userId, articleId);
        res.json({ bookmarked: false, message: "Bookmark dihapus" });
      } else {
        await BookmarkModel.create(userId, articleId);
        res.json({ bookmarked: true, message: "Bookmark ditambahkan" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cek status
  async checkStatus(req, res) {
    try {
      const userId = req.user.id;
      const { articleId } = req.params;
      const data = await BookmarkModel.checkStatus(userId, articleId);
      res.json({ isBookmarked: !!data, id: data?.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Hapus dari Reading List
  async removeBookmark(req, res) {
    try {
      const { id } = req.params; // ID Bookmark
      await BookmarkModel.deleteById(id);
      res.json({ message: "Bookmark berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};