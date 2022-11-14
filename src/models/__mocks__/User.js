class User {
  static insertUser(user) {
    if (this.selectByUsername(user.username)) {
      throw new Error('username in use, provide other');
    }

    if (this.selectByEmail(user.email)) {
      throw new Error('email in use, provide other');
    }

    return { message: `User ${user.username} Created` };
  }

  static deleteUser(user_id) {
    if (user_id === 1) {
      return { username: 'anyuser' };
    }
    return undefined;
  }

  static selectByEmail(email) {
    if (email === 'used@mail.cv') {
      return {
        id: 1,
        username: 'anyuser',
        email: 'used@mail.cv',
      };
    }
    return undefined;
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
