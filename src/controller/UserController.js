const Joi = require('joi');
const User = require('../models/User');

const schemaCreate = Joi.object({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(5)
    .max(25)
    .required(),

  password: Joi.string()
    .min(8)
    .required(),
  confirm_password: Joi.ref('password'),
  email: Joi.string()
    .trim()
    .email()
    .required(),
}).with('password', 'confirm_password');

exports.createUser = async (req, res) => {
  const {
    username, password, confirm_password, email,
  } = req.body;

  const { value, error } = schemaCreate.validate({
    username, password, confirm_password, email,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = User.insertUser(value);
    console.log('user', user);
    return res.status(201).json({ message: user.message });
  } catch (err) {
    console.log('err', err);
    return res.status(500).json({ message: err.message });
  }
};
