import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { sequelize } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  });
}).catch((error) => {
  console.error('Failed to sync database:', error);
});

export default app;