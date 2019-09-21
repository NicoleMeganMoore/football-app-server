const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const createLeague = require("./leagues/createLeague");
// const deleteLeague = require("./leagues/deleteLeague");
const createUser = require("./users/createUser");

const {
  transformUser,
  transformLeague,
  transformTeam,
  transformMatch
} = require("./helperFunctions");

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  leagues: async () => {
    try {
      const leagues = await League.find();
      return leagues.map(league => {
        return transformLeague(league);
      });
    } catch (err) {
      throw err;
    }
  },
  teams: async () => {
    try {
      const teams = await Team.find();
      return teams.map(team => {
        return transformTeam(team);
      });
    } catch (err) {
      throw err;
    }
  },
  matches: async () => {
    try {
      const matches = await Match.find();
      return matches.map(match => {
        return transformMatch(match);
      });
    } catch (err) {
      throw err;
    }
  },
  createUser: createUser,
  addUserToLeague: args => {},
  createLeague: createLeague,
  deleteLeague: async args => {
    try {
      await League.deleteOne({ _id: args.leagueId });
      // ALSO DELETE ALL TEAMS AND MATCHES TIED TO THIS LEAGUE
      // DO WE REALLY WANT TO DO THIS?
      // const newLeagueList = League.find()
      return true;
    } catch (err) {
      throw err;
    }
  },
  deleteMatch: async args => {
    try {
      await Match.deleteOne({ _id: args.matchId });
      // ALSO DELETE ALL TEAMS AND MATCHES TIED TO THIS LEAGUE
      // DO WE REALLY WANT TO DO THIS?
      // const newLeagueList = League.find()
      return true;
    } catch (err) {
      throw err;
    }
  },
  createMatch: async args => {
    try {
      const league = await League.findOne({ id: args.matchInput.league_id });
      if (!league) {
        throw new Error("League not found.");
      }

      const match = new Match({
        week: args.matchInput.week,
        league: league
      });

      const newMatch = await match.save();
      return transformMatch(newMatch);
    } catch (err) {
      throw err;
    }
  },
  createTeam: async args => {
    try {
      // Change this to real match ID
      const match = await Match.findOne({ id: args.teamInput.match_id });
      if (!match) {
        throw new Error("Match not found.");
      }

      const league = await League.findOne({ id: args.teamInput.league_id });
      if (!league) {
        throw new Error("League not found.");
      }

      const team = new Team({
        team_name: args.teamInput.team_name,
        team_photo_url: args.teamInput.team_photo_url,
        players: [],
        // CHANGE THIS TO CURRENT USER FROM AUTH
        owner: "5d81905dcd8d991024a67118",
        total_points: 0,
        match: match,
        league: league
      });

      const newTeam = await team.save();
      match.teams.push(team);
      await match.save();

      return transformTeam(newTeam);
    } catch (err) {
      throw err;
    }
  }
};
