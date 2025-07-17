const express = import('express');
const cors = import('cors');
const routes = import('./routes');
const { sequelize } = import('./models');
import('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  });
});
