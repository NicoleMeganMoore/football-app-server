const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const createLeague = require("./leagues/createLeague");
// const deleteLeague = require("./leagues/deleteLeague");
const createUser = require("./users/createUser");

const {
  getUser,
  getUsersByIds,
  getLeagues,
  getTeams,
  getLeague,
  getMatch
} = require("./helperFunctions");

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return {
          ...user._doc,
          leagues: getLeagues.bind(this, user._doc._id)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  leagues: async () => {
    try {
      const leagues = await League.find();

      return leagues.map(league => {
        return {
          ...league._doc,
          user_list: getUsersByIds.bind(this, league.user_list)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  teams: async () => {
    try {
      const teams = await Team.find();
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
  },
  matches: async () => {
    try {
      const matches = await Match.find();
      return matches.map(match => {
        return {
          ...match._doc,
          teams: getTeams.bind(this, match._doc.teams),
          winner: getUser.bind(this, match._doc.winner),
          league: getLeague.bind(this, match._doc.league)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createUser: createUser,
  // addUserToLeague: args => {

  // },
  createLeague: createLeague,
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
      return { ...newMatch._doc };
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

      return {
        ...newTeam._doc,
        teams: getTeams.bind(this, match._doc.teams),
        owner: getUser.bind(this, "5d81905dcd8d991024a67118")
      };
    } catch (err) {
      throw err;
    }
  }
};
