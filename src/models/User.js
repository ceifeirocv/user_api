/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');

const db = require('../config/database');

class User {
  static async insertUser(user) {
    const { username, email, password } = user;

    const isUsernameUsed = await this.selectByUsername(username);
    if (isUsernameUsed) {
      throw new Error('username in use, provide other');
    }

    const isEmailUsed = await this.selectByEmail(email);
    if (isEmailUsed) {
      throw new Error('email in use, provide other');
    }

    const password_hash = await bcrypt.hash(password, 8);
    try {
      const queryData = await db.query(
        'INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING id, username, email',
        [username, email, password_hash],
      );
      return { message: `User ${queryData.rows[0].username} Created` };
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  static async deleteUser(id) {
    try {
      const queryData = await db.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, username, email',
        [id],
      );
      return queryData.rows[0];
    } catch (error) {
      if (error) {
        return error;
      }
    }
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
      return queryData.rows[0];
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  static async updateUser(id, user) {
    if (!user.password) {
      const queryPassword = await db.query(
        'SELECT password FROM users WHERE id = $1',
        [id],
      );
      user.password = queryPassword.rows[0].password;
    } else {
      user.password = await bcrypt.hash(user.password, 8);
    }
    const isEmailUsed = await this.selectByEmail(user.email);
    if (isEmailUsed) {
      throw new Error('email in use, provide other');
    }

    try {
      const queryData = await db.query(
        'UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING username;',
        [user.email, user.password, id],
      );
      return { message: `User ${queryData.rows[0].username} updated` };
    } catch (error) {
      return error;
    }
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
