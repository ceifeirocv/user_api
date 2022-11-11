class User {
  static insertUser(user) {
    console.log('Mock');
    return { message: `User ${user.username} Created` };
  }
}

module.exports = User;
