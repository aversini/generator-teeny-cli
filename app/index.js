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

const {
  dependencies,
  githubUsername,
  moduleCLI,
  moduleDescription,
  moduleName,
  staticFiles,
  staticFolders,
  templateFiles,
  version,
} = require("./defaults");

const pe = new PrettyError();
pe.start();

const sanitizeScriptsForPkg = (command) => command.replace(/'/gi, '\\"');

module.exports = class extends Generator {
  constructor(...args) {
    super(...args);

    this.dependencies = {
      CLI: dependencies.CLI,
      noCLI: dependencies.noCLI,
    };
    this.defaults = {
      githubUsername,
      moduleCLI,
      moduleDescription,
      moduleName: this.appname || moduleName,
      staticFiles,
      staticFolders,
      templateFiles,
      version,
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
        continue: this.props.continue,
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
      const staticFolders = this.defaults.staticFolders;
      if (this.props.moduleCLI) {
        staticFolders.push("bin");
      }

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
      this.defaults.staticFiles.forEach((file) => {
        this.fs.copy(this.templatePath(file), file);
      });

      const depsTpl = this.props.moduleCLI
        ? this.dependencies.CLI
        : this.dependencies.noCLI;

      const templateFiles = this.defaults.templateFiles;

      const srcFiles = [
        `${this.templatePath()}/${templateFiles.pkg.src}`,
        `${this.templatePath()}/${templateFiles.license}`,
      ];
      /* istanbul ignore else */
      if (this.props.newModule) {
        srcFiles.push(`${this.templatePath()}/${templateFiles.readme}`);
      }

      this.fs.copyTpl(srcFiles, this.destinationPath(), {
        author: this.user.git.name(),
        // eslint-disable-next-line no-magic-numbers
        dependencies: JSON.stringify(depsTpl, null, 4)
          .replace("{", "")
          .replace("}", ""),
        githubUsername: this.props.githubUsername,
        moduleCLI: this.props.moduleCLI,
        moduleDescription: this.props.moduleDescription,
        moduleName,
        npmInstall: this.props.moduleCLI ? "npm install -g" : "npm install",
        repoName: kebabCase(repoName),
        scriptsBump: sanitizeScriptsForPkg(templateFiles.pkg.scripts.bump),
        scriptsChangelog: sanitizeScriptsForPkg(
          templateFiles.pkg.scripts.changelog
        ),
        scriptsLatest: sanitizeScriptsForPkg(templateFiles.pkg.scripts.latest),
        scriptsLint: this.props.moduleCLI
          ? sanitizeScriptsForPkg(templateFiles.pkg.scripts.CLI.lint)
          : sanitizeScriptsForPkg(templateFiles.pkg.scripts.noCLI.lint),
        scriptsLintFix: this.props.moduleCLI
          ? sanitizeScriptsForPkg(templateFiles.pkg.scripts.CLI.lintFix)
          : sanitizeScriptsForPkg(templateFiles.pkg.scripts.noCLI.lintFix),
        scriptsPrettierAll: sanitizeScriptsForPkg(
          templateFiles.pkg.scripts.prettierAll
        ),
        scriptsPrettierFix: this.props.moduleCLI
          ? sanitizeScriptsForPkg(templateFiles.pkg.scripts.CLI.prettierFix)
          : sanitizeScriptsForPkg(templateFiles.pkg.scripts.noCLI.prettierFix),
        scriptsRelease: sanitizeScriptsForPkg(
          templateFiles.pkg.scripts.release
        ),
        scriptsTest: sanitizeScriptsForPkg(templateFiles.pkg.scripts.test),
        scriptsTestCoverage: sanitizeScriptsForPkg(
          templateFiles.pkg.scripts.testCoverage
        ),
        scriptsTestWatch: sanitizeScriptsForPkg(
          templateFiles.pkg.scripts.testWatch
        ),
        version: this.defaults.version,
      });

      this.fs.move(
        this.destinationPath(templateFiles.pkg.src),
        this.destinationPath(templateFiles.pkg.dest)
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
