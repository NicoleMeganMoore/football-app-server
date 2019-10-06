const usersResolver = require("./users");
const leaguesResolver = require("./leagues");
const teamsResolver = require("./teams");
const matchesResolver = require("./matches");
const subscriptionsResolver = require("./subscriptions");

const rootResolver = {
  ...usersResolver,
  ...leaguesResolver,
  ...teamsResolver,
  ...matchesResolver,
  ...subscriptionsResolver
};

module.exports = rootResolver;
