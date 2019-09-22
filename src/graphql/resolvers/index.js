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
