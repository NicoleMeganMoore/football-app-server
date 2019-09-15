const bcrypt = require("bcryptjs");

const User = require("../../../models/user");

module.exports = args => {
  return User.findOne({ email: args.userInput.email }).then(user => {
    if (user) {
      throw new Error("Email already exists.");
    }
    return bcrypt
      .hash(args.userInput.password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
          first_name: args.userInput.first_name,
          last_name: args.userInput.last_name,
          leagues: []
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, password: null };
      })
      .catch(err => {
        throw err;
      });
  });
};
