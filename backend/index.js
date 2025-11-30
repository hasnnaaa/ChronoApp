import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import interactRoutes from './routes/interactRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api', interactRoutes); 
app.use('/api/users', userRoutes);

// Root
app.get('/', (req, res) => {
  res.send('ChronoApp API is running... 🚀');
});

if (!process.env.VERCEL) {
  const port = 3001;
  app.listen(port, () => {
    console.log(`🚀 Server Backend jalan di http://localhost:${port}`);
  });
}

export default app;