"use strict";

const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const pify = require("pify");

let generator;
describe("generator-teeny-nm:app", () => {
  beforeEach(async () => {
    await pify(helpers.testDirectory)(path.join(__dirname, "../tmp"));
    generator = helpers.createGenerator("teeny-nm:app", ["../app"], null, {
      skipInstall: true,
    });
  });

  it("should generate new files for a non-scoped node module with no CLI support", async () => {
    helpers.mockPrompt(generator, {
      githubUsername: "some-github-username",
      moduleCLI: false,
      moduleDescription: "some description",
      moduleName: "some name",
      newModule: true,
    });

    await pify(generator.run.bind(generator))();
    assert.file(["LICENSE", "README.md"]);
    assert.noFile(["bin", "bin/cli.js"]);
    assert.fileContent("README.md", "npm install some-name");
  });

  it("should generate new files for a scoped node module with no CLI support", async () => {
    helpers.mockPrompt(generator, {
      githubUsername: "some-github-username",
      moduleCLI: false,
      moduleDescription: "some description",
      moduleName: "@some-scope/some name",
      newModule: true,
    });

    await pify(generator.run.bind(generator))();
    assert.file(["LICENSE", "README.md"]);
    assert.noFile(["bin", "bin/cli.js"]);
    assert.fileContent("README.md", "npm install @some-scope/some-name");
  });

  it("should generate new files for a non-scoped node module with CLI support", async () => {
    helpers.mockPrompt(generator, {
      githubUsername: "some-github-username",
      moduleCLI: true,
      moduleDescription: "some description",
      moduleName: "some name",
      newModule: true,
    });

    await pify(generator.run.bind(generator))();

    assert.file([
      "LICENSE",
      "README.md",
      "package.json",
      "bin",
      "bin/cli.js",
      "configuration",
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
      "jest.config.js",
      "src",
      "src/defaults.js",
      "src/index.js",
    ]);

    assert.fileContent("README.md", "npm install -g some-name");
    // eslint-disable-next-line new-cap
    assert.JSONFileContent("package.json", {
      description: "some description",
      homepage: "https://github.com/some-github-username/some-name",
      name: "some-name",
    });
  });

  it("should generate new files for a scoped node module with CLI support", async () => {
    helpers.mockPrompt(generator, {
      githubUsername: "some-github-username",
      moduleCLI: true,
      moduleDescription: "some description",
      moduleName: "@some-scope/some name",
      newModule: true,
    });

    await pify(generator.run.bind(generator))();

    assert.file([
      "LICENSE",
      "README.md",
      "package.json",
      "bin",
      "bin/cli.js",
      "configuration",
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
      "jest.config.js",
      "src",
      "src/defaults.js",
      "src/index.js",
    ]);

    assert.fileContent("README.md", "npm install -g @some-scope/some-name");
    // eslint-disable-next-line new-cap
    assert.JSONFileContent("package.json", {
      description: "some description",
      homepage: "https://github.com/some-github-username/some-name",
      name: "@some-scope/some-name",
    });
  });

  it("should not generate any files if the user does not want to continue", async () => {
    helpers.mockPrompt(generator, {
      continue: false,
    });

    assert.noFile([
      "LICENSE",
      "README.md",
      "package.json",
      "bin",
      "bin/cli.js",
      "configuration",
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
      "jest.config.js",
      "src",
      "src/defaults.js",
      "src/index.js",
    ]);
  });
});
