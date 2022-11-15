const express = require('express');

const { createUser } = require('./controllers/UserController');
const checkJson = require('./middlewares/checkJson');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(checkJson);

app.use('/sessions', sessionRoutes);
app.post('/users', createUser);
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

app.listen(port, () => console.log(`Listening in port: ${port}`));
