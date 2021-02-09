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
      /* istanbul ignore next */
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
        default: this.appname,
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
        validate: /* istanbul ignore next */ (x) =>
          x.length > 0 ? true : "Username is required",
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

    let scope, repoName;
    this.props.moduleName = this.props.moduleName.trim().replace(" ", "-");

    if (isScopedPackage(this.props.moduleName)) {
      const res = this.props.moduleName.split("/");
      scope = kebabCase(res[0]);
      repoName = kebabCase(res[1]);
      this.moduleName = `@${scope}/${repoName}`;
    } else {
      repoName = kebabCase(this.props.moduleName);
      this.moduleName = repoName;
    }

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
        author: this.user.git.name(),
        githubUsername: this.props.githubUsername,
        moduleDescription: this.props.moduleDescription,
        moduleName: this.moduleName,
        repoName: kebabCase(repoName),
        scopedName: this.scope,
      }
    );
    this.fs.move(
      this.destinationPath("_package.json"),
      this.destinationPath("package.json")
    );
  }

  /* istanbul ignore next */
  git() {
    if (this.props.newModule && process.env.NODE_ENV !== "test") {
      this.spawnCommandSync("git", ["init"]);
    }
  }

  /* istanbul ignore next */
  install() {
    if (this.props.newModule && process.env.NODE_ENV !== "test") {
      this.installDependencies({ bower: false });
    }
  }

  end() {
    this.log();
    this.log("Your CLI is ready!");
  }
};
