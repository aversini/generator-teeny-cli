"use strict";

const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-teeny-cli:app", () => {
  it("", async () => {
    helpers
      .run(path.join(__dirname, "../app"))
      .withPrompts({ newModule: true })
      .withPrompts({ moduleName: "some name" })
      .withPrompts({ moduleDescription: "some description" })

      .then(function () {});
  });

  it("generate a non-scoped node module CLI", async () =>
    helpers
      .run(path.join(__dirname, "../app"))
      .withPrompts({ newModule: true })
      .withPrompts({ moduleName: "some name" })
      .withPrompts({ moduleDescription: "some description" })
      .withPrompts({ githubUsername: "some-github-username" })

      .then(function () {
        assert.file([
          "LICENSE",
          "README.md",
          "package.json",
          "bin",
          "bin/cli.js",
          "configuration",
          "configuration/bump.png",
          "configuration/eslint",
          "configuration/eslint/index.js",
          "configuration/eslint/rules",
          "configuration/eslint/rules/best-practices",
          "configuration/eslint/rules/best-practices/off.js",
          "configuration/eslint/rules/best-practices/on.js",
          "configuration/eslint/rules/es6",
          "configuration/eslint/rules/es6/off.js",
          "configuration/eslint/rules/es6/on.js",
          "configuration/eslint/rules/node",
          "configuration/eslint/rules/node/off.js",
          "configuration/eslint/rules/node/on.js",
          "configuration/eslint/rules/possible-errors",
          "configuration/eslint/rules/possible-errors/off.js",
          "configuration/eslint/rules/possible-errors/on.js",
          "configuration/eslint/rules/reset.js",
          "configuration/eslint/rules/style",
          "configuration/eslint/rules/style/off.js",
          "configuration/eslint/rules/style/on.js",
          "configuration/eslint/rules/variables",
          "configuration/eslint/rules/variables/off.js",
          "configuration/eslint/rules/variables/on.js",
          "configuration/jest",
          "configuration/jest/before-all-env.js",
          "configuration/latest",
          "configuration/latest/README.md",
          "configuration/latest/config.js",
          "configuration/latest/parser-opts.js",
          "configuration/latest/templates",
          "configuration/latest/templates/commit.hbs",
          "configuration/latest/templates/footer.hbs",
          "configuration/latest/templates/template.hbs",
          "configuration/latest/writer-opts.js",
          "configuration/release.png",
          "jest.config.js",
          "src",
          "src/defaults.js",
          "src/index.js",
        ]);

        assert.fileContent("README.md", "npm install some-name");
        // eslint-disable-next-line new-cap
        assert.JSONFileContent("package.json", {
          description: "some description",
          homepage: "https://github.com/some-github-username/some-name",
          name: "some-name",
        });
      }));

  it("generate a scoped node module CLI", async () =>
    helpers
      .run(path.join(__dirname, "../app"))
      .withPrompts({ newModule: false })
      .withPrompts({ moduleName: "@some-scope/some name" })
      .withPrompts({ moduleDescription: "some description" })
      .withPrompts({ githubUsername: "some-github-username" })

      .then(function () {
        assert.file([
          "LICENSE",
          "README.md",
          "package.json",
          "bin",
          "bin/cli.js",
          "configuration",
          "configuration/bump.png",
          "configuration/eslint",
          "configuration/eslint/index.js",
          "configuration/eslint/rules",
          "configuration/eslint/rules/best-practices",
          "configuration/eslint/rules/best-practices/off.js",
          "configuration/eslint/rules/best-practices/on.js",
          "configuration/eslint/rules/es6",
          "configuration/eslint/rules/es6/off.js",
          "configuration/eslint/rules/es6/on.js",
          "configuration/eslint/rules/node",
          "configuration/eslint/rules/node/off.js",
          "configuration/eslint/rules/node/on.js",
          "configuration/eslint/rules/possible-errors",
          "configuration/eslint/rules/possible-errors/off.js",
          "configuration/eslint/rules/possible-errors/on.js",
          "configuration/eslint/rules/reset.js",
          "configuration/eslint/rules/style",
          "configuration/eslint/rules/style/off.js",
          "configuration/eslint/rules/style/on.js",
          "configuration/eslint/rules/variables",
          "configuration/eslint/rules/variables/off.js",
          "configuration/eslint/rules/variables/on.js",
          "configuration/jest",
          "configuration/jest/before-all-env.js",
          "configuration/latest",
          "configuration/latest/README.md",
          "configuration/latest/config.js",
          "configuration/latest/parser-opts.js",
          "configuration/latest/templates",
          "configuration/latest/templates/commit.hbs",
          "configuration/latest/templates/footer.hbs",
          "configuration/latest/templates/template.hbs",
          "configuration/latest/writer-opts.js",
          "configuration/release.png",
          "jest.config.js",
          "src",
          "src/defaults.js",
          "src/index.js",
        ]);

        assert.fileContent("README.md", "npm install @some-scope/some-name");
        // eslint-disable-next-line new-cap
        assert.JSONFileContent("package.json", {
          description: "some description",
          homepage: "https://github.com/some-github-username/some-name",
          name: "@some-scope/some-name",
        });
      }));
});
