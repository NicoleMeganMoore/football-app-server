const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const createLeague = require("./leagues/createLeague");
// const deleteLeague = require("./leagues/deleteLeague");
const createUser = require("./users/createUser");

const { getUsersByIds, getLeagues } = require("./helperFunctions");

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
          owner: user.bind(this, team._doc.owner)
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
      const league = await League.findById(args.matchInput.league_id);
      if (!league) {
        throw new Error("League not found.");
      }

      const match = new Match({
        week: args.matchInput.week,
        league_id: args.matchInput.league_id,
        opponent_email: args.matchInput.opponent_email
      });

      const newMatch = await match.save();
      league.matches.push(newMatch);

      await league.save();
      return { ...newMatch._doc };
    } catch (err) {
      throw err;
    }
  },
  createTeam: async args => {
    try {
      // Change this to real match ID
      const match = await Match.findById("5d7d71eb8be2018a7f3ff79e");
      if (!match) {
        throw new Error("Match not found.");
      }

      const team = new Team({
        team_name: args.teamInput.team_name,
        team_photo_url: args.teamInput.team_photo_url,
        league: args.teamInput.league_id
      });

      const newTeam = await team.save();
      match.teams.push(team);

      await match.save();
      return { ...newTeam._doc };
    } catch (err) {
      throw err;
    }
  }
};
