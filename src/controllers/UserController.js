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

  password: Joi.string()
    .min(8)
    .required(),
  confirm_password: Joi.ref('password'),
  email: Joi.string()
    .trim()
    .email()
    .required(),
}).with('password', 'confirm_password');
const schemaUpdate = Joi.object({
  password: Joi.string()
    .min(8),
  confirm_password: Joi.ref('password'),
  email: Joi.string()
    .trim()
    .email(),
}).with('password', 'confirm_password');

exports.getUser = async (req, res) => {
  const { id } = req.params;
  if (!re.test(id)) {
    return res.status(400).json({ message: 'Provide a valid Id' });
  }
  try {
    const user = User.selectById(id);
    if (!user) {
      return res.status(400).json({ message: 'User not found, provide a valid Id' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

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
    return res.status(201).json({ message: user.message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  const { userId } = req.body;
  if (!re.test(userId)) {
    return res.status(400).json({ message: 'Provide a valid Id' });
  }
  const deletedUser = User.deleteUser(userId);
  if (!deletedUser) {
    return res.status(400).json({ message: 'User not found, provide a valid Id' });
  }
  return res.status(200).json({ message: `User ${deletedUser.username} Deleted` });
};

exports.updateUser = async (req, res) => {
  const {
    userId, email, password, confirm_password,
  } = req.body;
  if (!re.test(userId)) {
    return res.status(400).json({ message: 'Provide a valid Id' });
  }
  const { value, error } = schemaUpdate.validate({ password, confirm_password, email });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const userToUpdate = User.selectById(userId);
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
    const user = User.updateUser(userId, userToUpdate);
    return res.status(200).json({ message: user.message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
