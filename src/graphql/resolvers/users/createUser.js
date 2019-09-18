const bcrypt = require("bcryptjs");

const User = require("../../../models/user");
const { getLeagues } = require("../helperFunctions");

module.exports = async args => {
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

    return {
      ...result._doc,
      // This is not necessary since a new user will never have leagues to start with
      leagues: getLeagues.bind(this, result._doc._id),
      password: null
    };
  } catch (err) {
    throw err;
  }
};
