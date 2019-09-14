const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

// import { resolvers } from "./resolvers";
// import { typeDefs } from "./typeDefs";

const server = async () => {
  const app = express();

  app.use(bodyParser.json());

  app.use(
    "/graphql",
    graphqlHttp({
      schema: buildSchema(`
        type RootQuery {
          players: [String!]!
        }

        type RootMutation {
          createTeam(name: String): String
          addPlayer(id: Int): Int
        }
        
        schema {
          query: RootQuery
          mutation: RootMutation
        }
      `),
      rootValue: {
        players: () => {
          return ["Player 1", "Player 2", "Player 3"];
        },
        createTeam: args => {
          const teamName = args.name;
          return teamName;
        },
        addPlayer: args => {
          const playerId = args.playerId;
          return playerId;
        }
      },
      graphiql: true // Sandbox GUI at "/graphql"
    })
  );

  const port = 8080;
  app.listen({ port }, () => {
    console.log(`Magic happens on port ${port}`);
  });
};

server();
