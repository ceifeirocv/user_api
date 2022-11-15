const Joi = require('joi');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
require('dotenv').config();

const schemaCreate = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
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

  try {
    const user = await User.selectByEmail(value.email);
    if (!user) {
      return res.status(401).json({ message: 'wrong email or password' });
    }
    try {
      const isPasswordCorrect = await User.correctPassword(user.id, value.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'wrong email or password' });
      }
      return res.status(201).json({
        name: user.username,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '24h',
        }),
      });
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
