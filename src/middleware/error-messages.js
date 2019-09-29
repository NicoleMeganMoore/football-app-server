const FormatError = require("easygraphql-format-error");
const errorMessages = require("../graphql/resolvers/errorMessages");

const formatError = new FormatError(errorMessages);
const errorName = formatError.errorName;

module.exports = (req, res, next) => {
  req.errorName = errorName;
  next();
};
