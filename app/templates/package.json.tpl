{
  "name": "<%= moduleName %>",
  "version": "<%= version %>",
  "license": "MIT",
  "author": "<%= author %>",
  "description": "<%= moduleDescription %>",
  "homepage": "https://github.com/<%= githubUsername %>/<%= repoName %>",
  "repository": {
    "type": "git",
    "url": "git@github.com:<%= githubUsername %>/<%= repoName %>.git"
  },<% if(moduleCLI){ %>
  "bin": {
    "<%= moduleName %>": "bin/cli.js"
  },
  "files": [
    "bin/cli.js",
    "src/*.js"
  ],<% } else{ %>
  "main": "src/index.js",
  "files": [
    "src/*.js"
  ],<% } %>
  "scripts": {
    "bump": "<%- scriptsBump -%>",
    "changelog": "<%- scriptsChangelog -%>",
    "latest": "<%- scriptsLatest -%>",
    "lint": "<%- scriptsLint -%>",
    "lint:fix": "<%- scriptsLintFix -%>",
    "prettier:fix": "<%- scriptsPrettierFix -%>",
    "prettier:all": "<%- scriptsPrettierAll -%>",
    "release": "<%- scriptsRelease -%>",
    "test": "<%- scriptsTest -%>",
    "test:coverage": "<%- scriptsTestCoverage -%>",
    "test:watch": "<%- scriptsTestWatch -%>"
  },
  <%- include("devDependencies"); -%>
  "dependencies": {<%- dependencies %>  }
}
