import express from 'express';
import cors from 'cors';
import routes from './Routes.js';
import { sequelize } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Root route to avoid 404 on project root
app.get('/', (req, res) => {
  res.json({
    message: 'ExplorAR API',
    docs: '/api',
    health: '/health'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Initialize database on cold start (serverless friendly)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Database init error:', error);
  }
})();

// Export the Express app for Vercel serverless
export default app;
//