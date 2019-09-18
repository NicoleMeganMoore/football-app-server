const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc };
  } catch (err) {
    throw err;
  }
};

const getLeagues = async userId => {
  try {
    const leagues = await League.find({ user_list: userId });
    return leagues.map(league => {
      return {
        ...league._doc,
        user_list: getUsersByIds.bind(this, league.user_list)
      };
    });
  } catch (err) {
    throw err;
  }
};

const getUsersByIds = async userIds => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users.map(user => {
      return { ...user._doc, leagues: getLeagues.bind(this, user._id) };
    });
  } catch (err) {
    throw err;
  }
};

const getUsersByEmails = async userEmails => {
  try {
    const users = await User.find({ email: { $in: userEmails } });
    return users.map(user => {
      return { ...user._doc, leagues: getLeagues.bind(this, user._id) };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUser,
  getUsersByEmails,
  getUsersByIds,
  getLeagues
};
