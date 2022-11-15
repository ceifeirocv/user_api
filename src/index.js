const express = require('express');

const checkJson = require('./middlewares/checkJson');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(checkJson);

app.use('/sessions', sessionRoutes);
app.use('/users', userRoutes);
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'User API',
  });
});

app.listen(port, () => console.log(`Listening in port: ${port}`));
