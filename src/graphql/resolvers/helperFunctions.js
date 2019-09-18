const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    if (user) {
      return { ...user._doc };
    }
    return null;
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

const getTeams = async teamIds => {
  try {
    const teams = await Team.find({ _id: { $in: teamIds } });
    return teams.map(team => {
      return {
        ...team._doc,
        league: getLeague.bind(this, team._doc.league),
        match: getMatch.bind(this, team._doc.match),
        owner: getUser.bind(this, team._doc.owner)
      };
    });
  } catch (err) {
    throw err;
  }
};

const getLeague = async leagueId => {
  try {
    const league = await League.findById(leagueId);
    return {
      ...league._doc,
      user_list: getUsersByIds.bind(this, league.user_list)
    };
  } catch (err) {
    throw err;
  }
};

const getMatch = async matchId => {
  try {
    const match = await Match.findById(matchId);
    return {
      ...match._doc,
      league: getLeague.bind(this, match._doc.league),
      winner: getTeams.bind(this, match._doc.winner),
      teams: getTeams.bind(this, match._doc.teams)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUser,
  getUsersByEmails,
  getUsersByIds,
  getLeagues,
  getTeams,
  getLeague,
  getMatch
};
