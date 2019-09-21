const bcrypt = require("bcryptjs");
const User = require("../../models/user");

const { transformUser } = require("./helperFunctions");

module.exports = {
  createUser: async args => {
    try {
      const foundUser = await User.findOne({ email: args.userInput.email });
      if (foundUser) {
        throw new Error("Email already exists.");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        first_name: args.userInput.first_name,
        last_name: args.userInput.last_name,
        leagues: []
      });

      const result = await user.save();

      return transformUser(result);
    } catch (err) {
      throw err;
    }
  },
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  }
};
