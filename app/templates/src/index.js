const { yellow } = require("kleur");
const TeenyLogger = require("teeny-logger");
const logger = new TeenyLogger({
  boring: process.env.NODE_ENV === "test",
});

module.exports = (config) => {
  logger.log("Starting CLI with: ", yellow(config));
};
