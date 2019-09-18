const User = require("../../models/user");
const League = require("../../models/league");
const Match = require("../../models/match");
const Team = require("../../models/team");

const createLeague = require("./leagues/createLeague");
// const deleteLeague = require("./leagues/deleteLeague");
const createUser = require("./users/createUser");

const { getUsersByIds, getLeagues } = require("./helperFunctions");

module.exports = {
  users: () => {
    return User.find()
      .then(users => {
        return users.map(user => {
          return {
            ...user._doc,
            leagues: getLeagues.bind(this, user._doc._id)
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  leagues: () => {
    return League.find()
      .then(leagues => {
        return leagues.map(league => {
          return {
            ...league._doc,
            user_list: getUsersByIds.bind(this, league.user_list)
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  teams: () => {
    return Team.find()
      .then(teams => {
        return teams.map(team => {
          return {
            ...team._doc,
            owner: user.bind(this, team._doc.owner)
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  createUser: createUser,
  // addUserToLeague: args => {

  // },
  createLeague: createLeague,
  createMatch: args => {
    const match = new Match({
      week: args.matchInput.week,
      league_id: args.matchInput.league_id,
      opponent_email: args.matchInput.opponent_email
    });
    let createdMatch;
    return match
      .save()
      .then(result => {
        createdMatch = { ...result._doc };
        return League.findById("fjlkwejflwekfjwef");
      })
      .then(league => {
        if (!league) {
          throw new Error("League not found.");
        }
        league.matches.push(match);
        return league.save();
      })
      .then(() => {
        return createdMatch;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createTeam: args => {
    const team = new Team({
      team_name: args.teamInput.team_name,
      team_photo_url: args.teamInput.team_photo_url,
      league: args.teamInput.league_id
    });
    let createdTeam;
    return team
      .save()
      .then(result => {
        createdTeam = { ...result._doc };
        return Match.findById("5d7d71eb8be2018a7f3ff79e");
      })
      .then(match => {
        if (!match) {
          throw new Error("Match not found.");
        }
        match.teams.push(team);
        return match.save();
      })
      .then(() => {
        return createdTeam;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};
