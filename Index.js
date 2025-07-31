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

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');
  app.listen(process.env.PORT || 3000, () => {
      console.log('Server running on http://localhost:3000');
      console.log('Health check: http://localhost:3000/health');
  });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();