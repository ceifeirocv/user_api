/* eslint-disable no-undef */
const db = require('../config/database');
const User = require('./User');

jest.mock('../config/database');

beforeEach(async () => {
  await db.query('TRUNCATE TABLE users RESTART IDENTITY');
});

describe('create session', () => {
  it('it should be a method', () => {
    expect(typeof User.insertUser).toBe('function');
  });
  it('it should return success', async () => {
    const user = {
      username: 'anyuser',
      email: 'any@mail.cv',
      password: '01234567',
      confirm_password: '01234567',
    };
    expect(await User.insertUser(user)).toEqual({ message: 'User anyuser Created' });
  });
});
