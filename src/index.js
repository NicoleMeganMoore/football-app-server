const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
// const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { ApolloServer } = require("apollo-server-express");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const isAuth = require("./middleware/is-auth");
const errorMessagesMiddleware = require("./middleware/error-messages");
// const pubSubMiddleware = require("./middleware/pubsub");

console.log("graphql schema");
console.log(graphQlSchema);

const FormatError = require("easygraphql-format-error");
const errorMessages = require("./graphql/resolvers/errorMessages");
const formatError = new FormatError(errorMessages);

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(isAuth);
app.use(errorMessagesMiddleware);
// app.use(pubSubMiddleware);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true, // Sandbox GUI at "/graphql"
    customFormatErrorFn: err => {
      return formatError.getError(err);
    }
    // context: async ({ req, connection }) => {
    //   if (connection) {
    //     // check connection for metadata
    //     return connection.context;
    //   } else {
    //     // check from req
    //     const token = req.headers.authorization || "";

    //     return { token };
    //   }
    // },
  })
);

const server = new ApolloServer({
  schema: graphQlSchema,
  resolvers: graphQlResolvers
});

server.applyMiddleware({
  app,
  path: "/graphql"
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// app.use(
//   "/graphiql",
//   graphiqlExpress({
//     endpointURL: "/graphql",
//     subscriptionsEndpoint: "ws://localhost:8080/subscriptions"
//   })
// );

// const server = createServer(app);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@footballapp-uksbe.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    // server.listen(PORT, () => {
    //   // Set up the WebSocket for handling GraphQL subscriptions
    //   new SubscriptionServer(
    //     {
    //       execute,
    //       subscribe,
    //       schema: graphQlSchema
    //       // context: async ({ req, connection }) => {
    //       //   if (connection) {
    //       //     // check connection for metadata
    //       //     return connection.context;
    //       //   } else {
    //       //     // check from req
    //       //     const token = req.headers.authorization || "";

    //       //     return { token };
    //       //   }
    //       // }
    //     },
    //     {
    //       server: server,
    //       path: "/subscriptions"
    //     }
    //   );
    //   console.log(`Magic happens on port ${PORT}`);
    // });

    httpServer.listen({ port: PORT }, () => {
      // middleware.apolloSubscriptions(ws);
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
      );
    });
  })
  .catch(err => {
    console.log(err);
  });
