/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'provide a token' });
  }
  const [, token] = authHeader.split(' ');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'token invalid' });
    }
    req.userId = decoded.id;
    next();
  });
};
