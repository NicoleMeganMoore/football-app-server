const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const { checkAuthAndReturnUser, transformTeam } = require("./helperFunctions");

module.exports = {
  teams: async (args, req) => {
    try {
      await checkAuthAndReturnUser(req);

      const teams = await Team.find({ owner: req.userId });
      return teams.map(team => {
        return transformTeam(team);
      });
    } catch (err) {
      throw err;
    }
  },
  createTeam: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
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
        owner: req.userId,
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
