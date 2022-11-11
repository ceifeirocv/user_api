class User {
  static insertUser(user) {
    console.log('Module');
    return { message: `User ${user.username} Created` };
  }
}

module.exports = User;
