const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./models');
require('dotenv').config();

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
