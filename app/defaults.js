/* prettier ignore */
module.exports = {
  dependencies: {
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
  },
  githubUsername: null,
  moduleCLI: false,
  moduleDescription: "Short and to the point",
  moduleName: "module-name",
  staticFiles: [
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
  ],
  staticFolders: [".github", "configuration", "src"],
  templateFiles: {
    license: "LICENSE",
    pkg: {
      dest: "package.json",
      scripts: {
        CLI: {
          lint:
            "eslint --color './src/*.js' './bin/*.js' './configuration/**/*.js'",
          lintFix:
            "eslint --fix --color './src/*.js' './bin/*.js' './configuration/**/*.js'",
          prettierFix:
            "prettier --loglevel error --write '{src/**/*.js,bin/**/*.js,configuration/**/*.js}'",
        },
        bump: "bump-and-release -t bump",
        changelog: "conventional-changelog -i CHANGELOG.md -s -p angular",
        latest:
          "rimraf LATEST.md && conventional-changelog -o LATEST.md -n './configuration/latest/config.js'",
        noCLI: {
          lint: "eslint --color './src/*.js' './configuration/**/*.js'",
          lintFix:
            "eslint --fix --color './src/*.js' './configuration/**/*.js'",
          prettierFix:
            "prettier --loglevel error --write '{src/**/*.js,configuration/**/*.js}'",
        },
        prettierAll: "npm-run-all --serial prettier:fix lint:fix",
        release: "bump-and-release -t release",
        test: "cross-env NODE_ENV='test' TZ=UTC jest",
        testCoverage: "npm run test -- --coverage",
        testWatch: "npm run test -- --watch",
      },
      src: "package.json.tpl",
    },
    readme: "README.md",
  },
  version: "0.0.1",
};
