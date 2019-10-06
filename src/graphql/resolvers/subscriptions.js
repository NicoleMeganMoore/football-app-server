// const { PubSub, withFilter } = require("graphql-subscriptions");
// export const pubsub = new PubSub();
import pubsub from "../../pubsub";

module.exports = {
  // matchUpdated: {
  //   subscribe: withFilter(
  //     () => pubsub.asyncIterator("matchUpdated"),
  //     (payload, variables) => {
  //       return payload.matchId === variables.matchId;
  //     }
  //   )
  // },
  readyToDraft: {
    subscribe: () => {
      return pubsub.asyncIterator("readyToDraft");
    }
  },
  leagueAdded: {
    subscribe: () => {
      console.log("IN LEAGUE ADDED RESOLVER");
      console.log(pubsub.asyncIterator("leagueAdded"));
      return pubsub.asyncIterator("leagueAdded");
    }
  }
};
