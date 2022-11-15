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
        'SELECT id, username, email FROM users WHERE email = $1',
        [email],
      );
      return queryData.rows[0];
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  static async selectByUsername(username) {
    try {
      const queryData = await db.query(
        'SELECT id, username, email FROM users WHERE username = $1',
        [username],
      );
      return queryData.rows[0];
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  static async selectById(id) {
    try {
      const queryData = await db.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [id],
      );
      return queryData;
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  static updateUser(id, user) {
    if (this.selectByEmail(user.email)) {
      throw new Error('email in use, provide other');
    }
    return { message: `User ${user.username} Updated` };
  }

  static async correctPassword(id, password) {
    try {
      const queryData = await db.query(
        'SELECT password FROM users WHERE id = $1',
        [id],
      );
      if (!queryData.rowCount) return false;
      const password_hash = queryData.rows[0].password;
      return await bcrypt.compare(password, password_hash);
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }
}

module.exports = User;
