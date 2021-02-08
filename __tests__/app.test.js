"use strict";

const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-teeny-cli:app", () => {
  it("generate a node module CLI", () =>
    /*
     * The object returned acts like a promise, so
     * return it to wait until the process is done
     */
    helpers
      .run(path.join(__dirname, "../app"))
      .withPrompts({ moduleName: "some name" })
      .withPrompts({ moduleDescription: "some description" })
      .withPrompts({ githubUsername: "some-github-username" })
      .then(function () {
        assert.file([
          ".gitignore",
          "README.md",
          "package.json",
          "bin/cli.js",
          "src/defaults.js",
          "src/index.js",
        ]);
      }));
});
