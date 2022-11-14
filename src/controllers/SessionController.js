const Joi = require('joi');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
require('dotenv').config();

const schemaCreate = Joi.object({

  password: Joi.string()
    .min(8)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
});

exports.createSession = async (req, res) => {
  const { email, password } = req.body;

  const { value, error } = schemaCreate.validate({
    password, email,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const user = User.selectByEmail(value.email);
  if (!user) {
    return res.status(401).json({ message: 'wrong email or password' });
  }
  if (!User.correctPassword(value.password)) {
    return res.status(401).json({ message: 'wrong email or password' });
  }
  return res.status(201).json({
    name: user.username,
    token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    }),
  });
};
