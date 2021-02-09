#!/usr/bin/env node

const path = require("path");
const commander = require("commander");
const { shallowMerge } = require("teeny-js-utilities");
const PrettyError = require("pretty-error");

const defaults = require("../src/defaults");
const start = require("../src");
const pkg = require(path.join(__dirname, "../package.json"));

const program = new commander.Command();
const pe = new PrettyError();
/**
 * Automatically prettifying all exceptions
 * that are logged.
 */
pe.start();

/**
 * Example of some options.
 */
program
  .version(pkg.version, "-v, --version", "Output the current version")
  .option("-b, --boring", "Do not use color output", false)
  .helpOption("-h, --help", "Display help instructions");

/**
 * Sort options alphabetically.
 */
program.configureHelp({
  sortOptions: true,
});

/**
 * Interpret the options passed by the user.
 */
program.parse(process.argv);
const customCfg = program.opts();

/**
 * Merging default configuration with the
 * preferences shared by the user.
 */
if (customCfg.grep) {
  // forcing simplified display if grep is true.
  customCfg.short = true;
}
const config = shallowMerge(defaults, customCfg);

/**
 * And finally calling the main program.
 */
(async () => {
  await start(config);
})();
