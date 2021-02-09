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

    this.dependencies = {
      CLI: {
        commander: "7.0.0",
        kleur: "4.1.4",
        "pretty-error": "3.0.3",
        "teeny-js-utilities": "^1.4.0",
        "teeny-logger": "^0.2.0",
      },
      noCLI: {
        execa: "5.0.0",
        kleur: "4.1.4",
        lodash: "4.17.20",
        "npm-package-arg": "8.1.0",
        ora: "5.3.0",
        "teeny-logger": "0.2.0",
      },
    };
    this.defaults = {
      githubUsername: null,
      moduleCLI: false,
      moduleDescription: "Short and to the point",
      moduleName: this.appname,
      version: "0.0.1",
    };

    try {
      const pkg = require(path.join(process.cwd(), "./package.json"));
      /* istanbul ignore next */
      if (pkg) {
        if (pkg.description) {
          this.defaults.moduleDescription = pkg.description;
        }
        if (pkg.version) {
          this.defaults.version = pkg.version;
        }
        if (pkg.bin) {
          this.defaults.moduleCLI = true;
        }
        if (pkg.dependencies) {
          this.dependencies.CLI = pkg.dependencies;
          this.dependencies.noCLI = pkg.dependencies;
        }
        if (pkg.repository) {
          const repo =
            typeof pkg.repository === "string"
              ? pkg.repository
              : pkg.repository.url;
          const { owner } = parseGitHubURL(repo);
          this.defaults.githubUsername = owner;
        }
      }
    } catch (e) {
      // nothing to declare
    }
  }

  async prompting() {
    this.log(yosay(`Welcome to the ${blue("teeny-nm")} generator!`));
    const prompts = [
      {
        default: !this.defaults.githubUsername,
        message: "Is this a brand new module?",
        name: "newModule",
        type: "confirm",
      },
      {
        default: this.defaults.moduleCLI,
        message: "Is this module a CLI?",
        name: "moduleCLI",
        type: "confirm",
        when: (x) => x.newModule === true,
      },
      {
        default: this.defaults.appname,
        message: "Module name?",
        name: "moduleName",
        validate: /* istanbul ignore next */ (x) =>
          x.length > 0 ? true : "Module name is required",
        when: (x) => x.newModule === true,
      },
      {
        default: this.defaults.moduleDescription,
        message: "Module description?",
        name: "moduleDescription",
        when: (x) => x.newModule === true,
      },
      {
        default: this.defaults.githubUsername,
        message: "GitHub username?",
        name: "githubUsername",
        validate: /* istanbul ignore next */ (x) =>
          x.length > 0 ? true : "Username is required",
        when: (x) => x.newModule === true,
      },
      {
        default: true,
        message: "About to re-generate files in this existing repo, continue?",
        name: "continue",
        type: "confirm",
        when: (x) => x.newModule !== true,
      },
      {
        default: true,
        message: "About to generate files in this folder, continue?",
        name: "continue",
        type: "confirm",
        when: (x) => x.newModule === true,
      },
    ];

    this.props = await this.prompt(prompts);
    /* istanbul ignore next */
    if (!this.props.newModule) {
      this.props = {
        githubUsername: this.defaults.githubUsername,
        moduleCLI: this.defaults.moduleCLI,
        moduleDescription: this.defaults.moduleDescription,
        moduleName: this.defaults.moduleName,
      };
    }
  }

  writing() {
    /* istanbul ignore else */
    if (this.props.continue) {
      const staticFolders = [".github", "configuration", "src"];
      if (this.props.moduleCLI) {
        staticFolders.push("bin");
      }
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

      let scope, repoName, moduleName;
      this.props.moduleName = this.props.moduleName.trim().replace(" ", "-");

      if (isScopedPackage(this.props.moduleName)) {
        const res = this.props.moduleName.split("/");
        scope = kebabCase(res[0]);
        repoName = kebabCase(res[1]);
        moduleName = `@${scope}/${repoName}`;
      } else {
        repoName = kebabCase(this.props.moduleName);
        moduleName = repoName;
      }

      staticFolders.forEach((folder) => {
        this.fs.copy(this.templatePath(folder), folder);
      });
      staticFiles.forEach((file) => {
        this.fs.copy(this.templatePath(file), file);
      });

      const depsTpl = this.props.moduleCLI
        ? this.dependencies.CLI
        : this.dependencies.noCLI;
      const srcFiles = [
        this.props.moduleCLI
          ? `${this.templatePath()}/_package-cli.json`
          : `${this.templatePath()}/_package-nocli.json`,
        `${this.templatePath()}/LICENSE`,
      ];
      /* istanbul ignore else */
      if (this.props.newModule) {
        srcFiles.push(`${this.templatePath()}/README.md`);
      }
      this.fs.copyTpl(srcFiles, this.destinationPath(), {
        author: this.user.git.name(),
        dependencies: JSON.stringify(depsTpl, null, 4)
          .replace("{", "")
          .replace("}", ""),
        githubUsername: this.props.githubUsername,
        moduleDescription: this.props.moduleDescription,
        moduleName,
        npmInstall: this.props.moduleCLI ? "npm install -g" : "npm install",
        repoName: kebabCase(repoName),
        version: this.defaults.version,
      });

      this.fs.move(
        this.props.moduleCLI
          ? this.destinationPath("_package-cli.json")
          : this.destinationPath("_package-nocli.json"),
        this.destinationPath("package.json")
      );
    }
  }

  /* istanbul ignore next */
  git() {
    if (
      this.props.continue &&
      this.props.newModule &&
      process.env.NODE_ENV !== "test"
    ) {
      this.spawnCommandSync("git", ["init"]);
    }
  }

  /* istanbul ignore next */
  install() {
    if (
      this.props.continue &&
      this.props.newModule &&
      process.env.NODE_ENV !== "test"
    ) {
      this.installDependencies({ bower: false });
    }
  }

  end() {
    this.log();
    /* istanbul ignore else */
    if (this.props.continue) {
      this.log(
        this.props.moduleCLI
          ? "Your CLI is ready!"
          : "Your node module is ready!"
      );
    } else {
      this.log("Bye then!");
    }
  }
};
