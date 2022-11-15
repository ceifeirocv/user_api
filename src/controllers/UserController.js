/* eslint-disable consistent-return */
const Joi = require('joi');
const User = require('../models/User');

const re = /^\d+$/;
const schemaCreate = Joi.object({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(5)
    .max(25)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .required(),
  confirm_password: Joi.ref('password'),
}).with('password', 'confirm_password');
const schemaUpdate = Joi.object({
  email: Joi.string()
    .trim()
    .email(),
  password: Joi.string()
    .min(8),
  confirm_password: Joi.ref('password'),
}).with('password', 'confirm_password');

exports.getUser = async (req, res) => {
  const { userId } = req;
  if (!re.test(userId)) {
    return res.status(400).json({ message: 'Provide a valid Id' });
  }
  try {
    const user = await User.selectById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found, provide a valid Id' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Provide a Information' });
    return;
  }

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
    const user = await User.insertUser(value);
    return res.status(201).json({ message: user.message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  const { userId } = req;
  if (!re.test(userId)) {
    return res.status(400).json({ message: 'Provide a valid Id' });
  }
  const deletedUser = await User.deleteUser(userId);
  if (!deletedUser) {
    return res.status(400).json({ message: 'User not found, provide a valid Id' });
  }
  return res.status(200).json({ message: `User ${deletedUser.username} Deleted` });
};

exports.updateUser = async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Provide a Information' });
    return;
  }
  const {
    email, password, confirm_password,
  } = req.body;
  const { userId } = req;
  if (!re.test(userId)) {
    return res.status(400).json({ message: 'Provide a valid Id' });
  }
  const { value, error } = schemaUpdate.validate({ password, confirm_password, email });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const userToUpdate = await User.selectById(userId);
  if (!userToUpdate) {
    return res.status(400).json({ message: 'User not found, provide a valid Id' });
  }
  if (password) {
    userToUpdate.password = value.password;
  }
  if (email) {
    userToUpdate.email = value.email;
  }
  try {
    const user = await User.updateUser(userId, userToUpdate);
    return res.status(200).json({ message: user.message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
