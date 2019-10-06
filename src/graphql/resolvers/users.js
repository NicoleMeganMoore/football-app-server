const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const User = require("../../models/user");

const { transformUser, checkAuthAndReturnUser } = require("./helperFunctions");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      return err;
    }
  },
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      return err;
    }
  },
  user: async (args, req) => {
    try {
      const user = await checkAuthAndReturnUser(req);
      return transformUser(user);
    } catch (err) {
      return err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
      );

      const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_REFRESH_KEY,
        {
          expiresIn: "7d"
        }
      );

      return {
        userId: user.id,
        tokens: { accessToken: token, refreshToken: refreshToken },
        tokenExpiration: 1
      };
    } catch (err) {
      return err;
    }
  },
  token: async (args, req, res) => {
    try {
      const refreshToken = args.refreshToken;

      if (!refreshToken) {
        throw new Error(req.errorName.INVALID_REFRESH_TOKEN);
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
      } catch (err) {
        req.isRefreshValid = false;
        throw new Error(req.errorName.INVALID_REFRESH_TOKEN);
      }

      if (!decodedToken) {
        throw new Error(req.errorName.INVALID_REFRESH_TOKEN);
      }

      // Create new access and refresh tokens using the same user details
      const newAccessToken = jwt.sign(
        { userId: decodedToken.userId, email: decodedToken.email },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
      );

      const newRefreshToken = jwt.sign(
        { userId: decodedToken.userId, email: decodedToken.email },
        process.env.JWT_REFRESH_KEY,
        {
          expiresIn: "7d"
        }
      );

      return {
        userId: decodedToken.userId,
        tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        tokenExpiration: 1
      };
    } catch (err) {
      return err;
    }
  }
};
