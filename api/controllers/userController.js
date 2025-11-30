import { UserModel } from '../models/userModel.js';

export const UserController = {
  async getProfile(req, res) {
    try {
      const { data } = await UserModel.findById(req.user.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;
      const data = await UserModel.update(userId, updates);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};