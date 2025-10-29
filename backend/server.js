// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import account50kRoutes from './routes/account50kRoutes.js';

import Order from './models/Order.js';
import NetflixAccount from './models/NetflixAccount.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const app = express();

// ===== CORS =====
const allowedOrigins = [
  'https://dailywithminh.com',
  'https://www.dailywithminh.com', // ✅ thêm domain có www
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('Blocked CORS request from:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.options('*', cors()); // preflight OPTIONS

// ===== BODY PARSER =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ===== MONGODB =====
const mongoUri = process.env.MONGO_URI;

if (!mongoUri || typeof mongoUri !== 'string' || mongoUri.trim() === '') {
  console.error('Missing MONGO_URI environment variable.');
  console.error(
    'Please create backend/.env (you can copy backend/.env.example) or set MONGO_URI before starting the server.'
  );
  process.exit(1);
}

mongoose.connect(mongoUri, { retryWrites: false })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', miscRoutes);
app.use('/api/account50k', account50kRoutes);

// debug: in ra routes (đặt sau khi mount routes)
function listRoutes() {
  const routes = [];
  app._router.stack.forEach(m => {
    if (m.route && m.route.path) {
      const methods = Object.keys(m.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${m.route.path}`);
    } else if (m.name === 'router' && m.handle && m.regexp) {
      // nested router
      m.handle.stack.forEach(r => {
        if (r.route && r.route.path) {
          const methods = Object.keys(r.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${r.route.path}`);
        }
      });
    }
  });
  console.log('=== Registered routes ===');
  routes.sort().forEach(r => console.log(r));
}
listRoutes();

// ===== SPA FRONTEND =====
app.use(express.static(join(__dirname, 'frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'frontend/dist/index.html'));
});

// ===== CRON JOB =====
cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  try {
    const expiredOrders = await Order.find({
      expiresAt: { $lt: now },
      status: { $ne: 'EXPIRED' },
    });

    for (const order of expiredOrders) {
      order.status = 'EXPIRED';
      await order.save();

      if (order.profileId) {
        await NetflixAccount.updateOne(
          { 'profiles.id': order.profileId },
          {
            $set: { 'profiles.$.status': 'empty' },
            $unset: {
              'profiles.$.customerPhone': '',
              'profiles.$.purchaseDate': '',
              'profiles.$.expirationDate': '',
            },
          }
        );
      }
    }
  } catch (err) {
    console.error('Cron job error:', err);
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`?? Server running on port ${PORT}`));
