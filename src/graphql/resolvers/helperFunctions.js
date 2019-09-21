const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const { dateToString } = require("../../helpers/date");

module.exports = {
  transformUser: user => {
    return {
      ...user._doc,
      leagues: getLeagues.bind(this, user._doc._id),
      createdAt: dateToString(user._doc.createdAt),
      updatedAt: dateToString(user._doc.updatedAt)
    };
  },
  transformLeague: league => {
    return {
      ...league._doc,
      user_list: getUsersByIds.bind(this, league.user_list),
      createdAt: dateToString(league._doc.createdAt),
      updatedAt: dateToString(league._doc.updatedAt)
    };
  },
  transformTeam: team => {
    return {
      ...team._doc,
      league: getLeague.bind(this, team._doc.league),
      match: getMatch.bind(this, team._doc.match),
      owner: getUser.bind(this, team._doc.owner),
      createdAt: dateToString(team._doc.createdAt),
      updatedAt: dateToString(team._doc.updatedAt)
    };
  },
  transformMatch: match => {
    return {
      ...match._doc,
      teams: getTeams.bind(this, match._doc.teams),
      winner: getUser.bind(this, match._doc.winner),
      league: getLeague.bind(this, match._doc.league),
      createdAt: dateToString(match._doc.createdAt),
      updatedAt: dateToString(match._doc.updatedAt)
    };
  },
  getUser: async userId => {
    try {
      const user = await User.findById(userId);
      if (user) {
        return transformUser(user);
      }
      return null;
    } catch (err) {
      throw err;
    }
  },
  getLeagues: async userId => {
    try {
      const leagues = await League.find({ user_list: userId });
      return leagues.map(league => {
        return transformLeague(league);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByIds: async userIds => {
    try {
      const users = await User.find({ _id: { $in: userIds } });
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByEmails: async userEmails => {
    try {
      const users = await User.find({ email: { $in: userEmails } });
      return users.map(user => {
        return { ...user._doc, leagues: getLeagues.bind(this, user._id) };
      });
    } catch (err) {
      throw err;
    }
  },
  getTeams: async teamIds => {
    try {
      const teams = await Team.find({ _id: { $in: teamIds } });
      return teams.map(team => {
        return transformTeam(team);
      });
    } catch (err) {
      throw err;
    }
  },
  getLeague: async leagueId => {
    try {
      const league = await League.findById(leagueId);
      return transformLeague(league);
    } catch (err) {
      throw err;
    }
  },
  getMatch: async matchId => {
    try {
      const match = await Match.findById(matchId);
      return transformMatch(match);
    } catch (err) {
      throw err;
    }
  }
};
