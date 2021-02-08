#!/usr/bin/env node

const path = require("path");
const commander = require("commander");
const { shallowMerge } = require("teeny-js-utilities");
const PrettyError = require("pretty-error");

const defaults = require("../src/defaults");
const { start } = require("../src");
const pkg = require(path.join(__dirname, "../package.json"));

const program = new commander.Command();
const pe = new PrettyError();
// Automatically prettifying all exceptions that are logged
pe.start();

const optionParseType = (value) => {
  if (value !== "f" && value !== "d") {
    throw new commander.InvalidOptionArgumentError(
      `Valid options are "f" or "d".`
    );
  }
  return value;
};

const optionParseGrep = (value) => {
  if (value !== "" && program.opts().type === "d") {
    throw new commander.InvalidOptionArgumentError(
      `Options "grep" and "type" = "d" are incompatible.`
    );
  }
  return value;
};

program
  .version(pkg.version, "-v, --version", "Output the current version")
  .option(
    "-p, --pattern <string>",
    "A regular expression to match file or folder names",
    null
  )
  .option(
    "-t, --type <string>",
    "Search for files (f) or directories (d)",
    optionParseType
  )
  .option("--short", "Short listing format (equivalent to ls)", false)
  .option("--dot", "Show hidden files and directories", false)
  .option("-b, --boring", "Do not use color output", false)
  .option("-s, --stats", "Display some statistics", false)
  .option("-i, --ignore-case", "Ignore case when searching", false)
  .option(
    "-c, --command <cmd>",
    "Command to execute over each node (ex: chmod +x)"
  )
  .option(
    "-g, --grep <pattern>",
    "A regular expression to match the content of the files found",
    optionParseGrep
  )
  .helpOption("-h, --help", "Display help instructions");

program.configureHelp({
  sortOptions: true,
});

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

(async () => {
  await start(config);
})();
