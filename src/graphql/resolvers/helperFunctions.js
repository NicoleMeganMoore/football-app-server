const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const getUser = userId => {
  return User.findById(userId)
    .then(user => {
      return { ...user._doc };
    })
    .catch(err => {
      throw err;
    });
};

const getLeagues = userId => {
  return League.find({ user_list: userId })
    .then(leagues => {
      return leagues.map(league => {
        return {
          ...league._doc,
          user_list: getUsersByIds.bind(this, league.user_list)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

const getUsersByIds = userIds => {
  return User.find({ _id: { $in: userIds } })
    .then(users => {
      return users.map(user => {
        return { ...user._doc, leagues: getLeagues.bind(this, user._id) };
      });
    })
    .catch(err => {
      throw err;
    });
};

const getUsersByEmails = userEmails => {
  return User.find({ email: { $in: userEmails } })
    .then(users => {
      return users.map(user => {
        return { ...user._doc, leagues: getLeagues.bind(this, user._id) };
      });
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  getUser,
  getUsersByEmails,
  getUsersByIds,
  getLeagues
};
