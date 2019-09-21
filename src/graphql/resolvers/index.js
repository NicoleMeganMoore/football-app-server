const { createUser, users } = require("./users");
const { teams, createTeam } = require("./teams");
const { matches, deleteMatch, createMatch } = require("./matches");
const {
  createLeague,
  deleteLeague,
  leagues,
  addUserToLeague
} = require("./leagues");

module.exports = {
  users: users,
  createUser: createUser,

  leagues: leagues,
  createLeague: createLeague,
  deleteLeague: deleteLeague,
  addUserToLeague: addUserToLeague,

  teams: teams,
  createTeam: createTeam,

  matches: matches,
  createMatch: createMatch,
  deleteMatch: deleteMatch
};
