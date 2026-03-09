import express from 'express';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import { initDb, query } from './src/lib/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize database
  initDb();

  // API Routes
  app.post('/api/gifts', async (req, res) => {
    try {
      const { gift_id, password, sender_name, recipient_name, message, theme, links, music_url } = req.body;

      if (!gift_id || !password || !sender_name || !recipient_name || !message || !theme) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if gift_id already exists
      const existing = await query('SELECT id FROM gift_boxes WHERE gift_id = $1', [gift_id]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Gift ID already exists' });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const result = await query(
        'INSERT INTO gift_boxes (gift_id, password_hash, sender_name, recipient_name, message, theme, music_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [gift_id, password_hash, sender_name, recipient_name, message, theme, music_url || null]
      );

      const giftBoxId = result[0].id;

      if (links && links.length > 0) {
        for (const link of links) {
          if (link.title && link.url) {
            await query(
              'INSERT INTO gift_links (gift_box_id, title, url) VALUES ($1, $2, $3)',
              [giftBoxId, link.title, link.url]
            );
          }
        }
      }

      res.status(201).json({ success: true, gift_id });
    } catch (error) {
      console.error('Error creating gift:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/gifts/login', async (req, res) => {
    try {
      const { gift_id, password } = req.body;

      if (!gift_id || !password) {
        return res.status(400).json({ error: 'Missing gift_id or password' });
      }

      const boxes = await query('SELECT * FROM gift_boxes WHERE gift_id = $1', [gift_id]);
      if (boxes.length === 0) {
        return res.status(404).json({ error: 'Gift not found' });
      }

      const box = boxes[0];
      const match = await bcrypt.compare(password, box.password_hash);

      if (!match) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // In a real app, we'd use sessions or JWT. For this demo, we'll just return success.
      // The frontend will store a flag to allow access to the reveal page.
      res.json({ success: true, gift_id });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/gifts/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const boxes = await query('SELECT * FROM gift_boxes WHERE gift_id = $1', [id]);
      if (boxes.length === 0) {
        return res.status(404).json({ error: 'Gift not found' });
      }

      const box = boxes[0];
      
      // Remove password hash from response
      delete box.password_hash;

      const links = await query('SELECT * FROM gift_links WHERE gift_box_id = $1', [box.id]);
      
      res.json({ ...box, links });
    } catch (error) {
      console.error('Error fetching gift:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
