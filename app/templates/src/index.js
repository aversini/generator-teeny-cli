const TeenyLogger = require("teeny-logger");
const logger = new TeenyLogger({
  boring: process.env.NODE_ENV === "test",
});

module.exports = async (config) => {
  logger.log("Configuration: ", config);
};
