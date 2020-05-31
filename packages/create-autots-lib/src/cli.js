const path = require('path');
const arg = require('arg');
const inquirer = require('inquirer');

const { createLib } = require('./main');

const defaultTpl = 'TypeScript';

function parseRawArgs(rawArgs) {
  const args = arg({
    // Types
    '--yes': Boolean,
    '--install': Boolean,
    '--git': Boolean,
    '--type': String,
    
    // Aliases
    '-y': '--yes',
    '-i': '--install',
    '-g': '--git',
    '-t': '--type',
  }, {
    argv: rawArgs.slice(2),
  });

  const cwd = process.cwd();

  return {
    targetDir: args._[0] ? path.resolve(cwd, args._[0]) : cwd,
    tpl: args['--type'] || defaultTpl,
    skip: args['--yes'] || false,
    git: args['--git'] || false,
    runInstall: args['--install'] || false,
  };
}

async function promptForMissingOptions(options) {

  if (options.skip) {
    return {
      ...options,
      tpl: options.tpl || defaultTpl,
    };
  }

  const questions = [];
  if (!options.tpl) {
    questions.push({
      type: 'list',
      name: 'tpl',
      message: 'Please choose which lib tpl to use',
      choices: ['TypeScript', 'JavaScript'],
      default: defaultTpl,
    });
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: true,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    tpl: options.tpl || answers.tpl,
    git: options.git || answers.git,
  };
}

module.exports = {
  async cli(args) {
    let options = parseRawArgs(args);
    options = await promptForMissingOptions(options);
    console.log(options);
    createLib(options);
  }
};
