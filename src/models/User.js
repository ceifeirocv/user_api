/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');

const db = require('../config/database');

class User {
  static async insertUser(user) {
    const { username, email, password } = user;
    if (this.selectByUsername(username)) {
      throw new Error('username in use, provide other');
    }

    if (this.selectByEmail(email)) {
      throw new Error('email in use, provide other');
    }

    const password_hash = await bcrypt.hash(password, 8);
    try {
      const queryData = await db.query(
        'INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *',
        [username, email, password_hash],
      );
      return { message: `User ${queryData.rows[0].username} Created` };
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  static deleteUser(user_id) {
    if (user_id === 1) {
      return { username: 'anyuser' };
    }
    return undefined;
  }

  static async selectByEmail(email) {
    try {
      const queryData = await db.query(
        'SELECT id, username, email FROM users WHERE email = 1$',
        [email],
      );
      return queryData;
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  static selectByUsername(user) {
    if (user === 'useduser') {
      return {
        id: 1,
        username: 'useduser',
        email: 'any@mail.cv',
      };
    }
    return undefined;
  }

  static selectById(id) {
    if (id === '1') {
      return {
        id: 1,
        username: 'anyuser',
        email: 'any@mail.cv',
      };
    }
    return undefined;
  }

  static updateUser(id, user) {
    if (this.selectByEmail(user.email)) {
      throw new Error('email in use, provide other');
    }
    return { message: `User ${user.username} Updated` };
  }

  static correctPassword(password) {
    if (password === '01234567') {
      return true;
    }
    return false;
  }
}

module.exports = User;
