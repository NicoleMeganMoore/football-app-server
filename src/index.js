const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");
const errorMessagesMiddleware = require("./middleware/error-messages");

const FormatError = require("easygraphql-format-error");
const errorMessages = require("./graphql/resolvers/errorMessages");
const formatError = new FormatError(errorMessages);

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(isAuth);
app.use(errorMessagesMiddleware);

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
    // graphiql: true, // Sandbox GUI at "/graphql"
    customFormatErrorFn: err => {
      return formatError.getError(err);
    }
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@footballapp-uksbe.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen({ port }, () => {
      console.log(`Magic happens on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
