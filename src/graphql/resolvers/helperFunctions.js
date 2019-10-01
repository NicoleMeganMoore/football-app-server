const DataLoader = require("dataloader");

const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");
const { dateToString } = require("../../helpers/date");

const userLoader = new DataLoader(userIds => {
  return getUsers(userIds);
});

const leagueLoader = new DataLoader(leagueIds => {
  return getLeagues(leagueIds);
});

const matchLoader = new DataLoader(matchIds => {
  return getMatches(matchIds);
});

const teamLoader = new DataLoader(teamIds => {
  return getTeams(teamIds);
});

const checkAuthAndReturnUser = async req => {
  if (req.isTokenExpired) {
    throw new Error(req.errorName.EXPIRED_ACCESS_TOKEN);
  } else if (!req.isAuth) {
    throw new Error(req.errorName.UNAUTHENTICATED);
  }
  const user = await User.findById(req.userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

const transformUser = user => {
  return {
    ...user._doc,
    leagues: () =>
      leagueLoader.loadMany(
        user._doc.leagues.map(leagueId => leagueId.toString())
      ),
    createdAt: dateToString(user._doc.createdAt),
    updatedAt: dateToString(user._doc.updatedAt)
  };
};
const transformLeague = league => {
  return {
    ...league._doc,
    user_list: () =>
      userLoader.loadMany(
        league._doc.user_list.map(userId => userId.toString())
      ),
    matches: () =>
      matchLoader.loadMany(
        league._doc.matches.map(matchId => matchId.toString())
      ),
    createdAt: dateToString(league._doc.createdAt),
    updatedAt: dateToString(league._doc.updatedAt)
  };
};
const transformTeam = team => {
  return {
    ...team._doc,
    league: getLeague.bind(this, team._doc.league),
    match: getMatch.bind(this, team._doc.match),
    owner: getUser.bind(this, team._doc.owner),
    createdAt: dateToString(team._doc.createdAt),
    updatedAt: dateToString(team._doc.updatedAt)
  };
};
const transformMatch = match => {
  return {
    ...match._doc,
    teams: () =>
      teamLoader.loadMany(match._doc.teams.map(teamId => teamId.toString())),
    winner: getUser.bind(this, match._doc.winner),
    league: getLeague.bind(this, match._doc.league),
    createdAt: dateToString(match._doc.createdAt),
    updatedAt: dateToString(match._doc.updatedAt)
  };
};
const getUser = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return user;
  } catch (err) {
    throw err;
  }
};
const getUsers = async userIds => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users.map(user => {
      return transformUser(user);
    });
  } catch (err) {
    throw err;
  }
};
const getLeague = async leagueId => {
  try {
    const league = await leagueLoader.load(leagueId.toString());
    return league;
  } catch (err) {
    throw err;
  }
};
const getLeagues = async leagueIds => {
  try {
    const leagues = await League.find({ _id: { $in: leagueIds } });
    return leagues.map(league => {
      return transformLeague(league);
    });
  } catch (err) {
    throw err;
  }
};
const getMatch = async matchId => {
  try {
    const match = await matchLoader.load(matchId.toString());
    return match;
  } catch (err) {
    throw err;
  }
};
const getMatches = async matchIds => {
  try {
    const matches = await Match.find({ _id: { $in: matchIds } });
    return matches.map(match => {
      return transformMatch(match);
    });
  } catch (err) {
    throw err;
  }
};
const getTeam = async teamId => {
  try {
    const team = await teamLoader.load(teamId.toString());
    return team;
  } catch (err) {
    throw err;
  }
};
const getTeams = async teamIds => {
  try {
    const teams = await Team.find({ _id: { $in: teamIds } });
    return teams.map(team => {
      return transformTeam(team);
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  checkAuthAndReturnUser,
  transformUser,
  transformLeague,
  transformMatch,
  transformTeam,
  getUser,
  getUsers,
  getLeague,
  getLeagues,
  getMatch,
  getMatches,
  getTeam,
  getTeams
};
