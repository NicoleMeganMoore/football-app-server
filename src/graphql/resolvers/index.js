// const { createUser, users } = require("./users");
// const { teams, createTeam } = require("./teams");
// const { matches, deleteMatch, createMatch } = require("./matches");
// const {
//   createLeague,
//   deleteLeague,
//   leagues,
//   addUserToLeague
// } = require("./leagues");

const usersResolver = require("./users");
const leaguesResolver = require("./leagues");
const teamsResolver = require("./teams");
const matchesResolver = require("./matches");

const rootResolver = {
  ...usersResolver,
  ...leaguesResolver,
  ...teamsResolver,
  ...matchesResolver
};

module.exports = rootResolver;
