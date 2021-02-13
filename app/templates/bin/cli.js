#!/usr/bin/env node

const meow = require("meow");
const {
  meowOptionsHelper,
  meowParserHelper,
  shallowMerge,
} = require("teeny-js-utilities");
const PrettyError = require("pretty-error");

const defaults = require("../src/defaults");
const start = require("../src");

const pe = new PrettyError();
/**
 * Automatically prettifying all exceptions
 * that are logged.
 */
pe.start();

/**
 * Example of some options.
 */
const { helpText, options } = meowOptionsHelper({
  flags: {
    help: {
      alias: "h",
      description: "Display help instructions",
      type: "boolean",
    },
    version: {
      alias: "v",
      description: "Output the current version",
      type: "boolean",
    },
  },
  usage: true,
});

/**
 * Interpret the options passed by the user.
 */
const cli = meow(helpText, options);
meowParserHelper({ cli });

/**
 * Merging default configuration with the
 * preferences shared by the user.
 */
const config = shallowMerge(defaults, cli.flags);

/**
 * And finally calling the main program.
 */
(async () => {
  await start(config);
})();
