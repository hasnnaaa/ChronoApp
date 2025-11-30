import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

export const AuthController = {
  async register(req, res) {
    const { email, password, fullName, username } = req.body;
    try {
      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
        full_name: fullName,
        username
      });

      res.status(201).json({ message: "Registrasi berhasil!", user: newUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const { data: user, error } = await UserModel.findByEmail(email);
      
      if (error || !user) return res.status(404).json({ error: "Email tidak terdaftar" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(400).json({ error: "Password salah!" });

      // Token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        message: "Login sukses",
        token, 
        user: { id: user.id, name: user.full_name, avatar: user.avatar_url } 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};