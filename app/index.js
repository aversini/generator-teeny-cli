"use strict";

const { blue } = require("kleur");
const path = require("path");
const PrettyError = require("pretty-error");
const {
  kebabCase,
  parseGitHubURL,
  isScopedPackage,
} = require("teeny-js-utilities");
const Generator = require("yeoman-generator");
const yosay = require("yosay");

const pe = new PrettyError();
pe.start();

module.exports = class extends Generator {
  constructor(...args) {
    super(...args);

    this.description = "Short and to the point";
    this.moduleName = this.appname;
    this.githubUsername = null;
    try {
      const pkg = require(path.join(process.cwd(), "./package.json"));
      if (pkg) {
        if (pkg.description) {
          this.description = pkg.description;
        }
        if (pkg.repository) {
          const repo =
            typeof pkg.repository === "string"
              ? pkg.repository
              : pkg.repository.url;
          const { owner } = parseGitHubURL(repo);
          this.githubUsername = owner;
        }
      }
    } catch (e) {
      // nothing to declare
    }
  }

  prompting() {
    this.log(yosay(`Welcome to the ${blue("teeny-cli")} generator!`));
    const prompts = [
      {
        default: !this.githubUsername,
        message: "Is this a brand new module?",
        name: "newModule",
        type: "confirm",
      },
      {
        default: kebabCase(this.appname),
        filter: (x) => kebabCase(x),
        message: "Module name?",
        name: "moduleName",
      },
      {
        default: this.description,
        message: "Module description?",
        name: "moduleDescription",
      },
      {
        default: this.githubUsername,
        message: "GitHub username?",
        name: "githubUsername",
        validate: (x) => (x.length > 0 ? true : "Username is required"),
      },
    ];

    // To access props later use this.props.someAnswer;
    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    const staticFolders = [".github", "configuration", "bin", "src"];
    const staticFiles = [
      ".bump-and-release.config.js",
      ".commitlintrc.js",
      ".eslintrc.js",
      ".gitignore",
      ".huskyrc.json",
      ".lintstagedrc.json",
      ".npmrc",
      ".prettierignore",
      ".prettierrc.js",
      "jest.config.js",
    ];
    const repoName = isScopedPackage(this.props.moduleName)
      ? this.props.moduleName.split("/")[1]
      : this.props.moduleName;

    staticFolders.forEach((folder) => {
      this.fs.copy(this.templatePath(folder), folder);
    });
    staticFiles.forEach((file) => {
      this.fs.copy(this.templatePath(file), file);
    });
    this.fs.copyTpl(
      [
        `${this.templatePath()}/_package.json`,
        `${this.templatePath()}/README.md`,
        `${this.templatePath()}/LICENSE`,
      ],
      this.destinationPath(),
      {
        githubUsername: this.props.githubUsername,
        moduleDescription: this.props.moduleDescription,
        moduleName: this.props.moduleName,
        name: this.user.git.name(),
        repoName,
      }
    );
    this.fs.move(
      this.destinationPath("_package.json"),
      this.destinationPath("package.json")
    );
  }

  git() {
    if (this.props.newModule) {
      this.spawnCommandSync("git", ["init"]);
    }
  }

  install() {
    if (this.props.newModule) {
      this.installDependencies({ bower: false });
    }
  }

  end() {
    this.log();
    this.log("Your CLI is ready!");
  }
};
