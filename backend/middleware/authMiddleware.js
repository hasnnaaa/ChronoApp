import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Akses ditolak! Token tidak ditemukan." });
  }

  try {
    // Verifikasi token dengan kunci rahasia
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(400).json({ error: "Token tidak valid atau kadaluarsa!" });
  }
};