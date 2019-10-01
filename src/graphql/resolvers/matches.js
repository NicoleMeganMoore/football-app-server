const League = require("../../models/league");
const Match = require("../../models/match");

const { transformMatch } = require("./helperFunctions");

module.exports = {
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

      league.matches.push(newMatch);
      await league.save();

      return transformMatch(newMatch);
    } catch (err) {
      throw err;
    }
  }
};
