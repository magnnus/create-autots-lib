const path = require('path');
const chalk = require('chalk');
const { Command } = require('commander');
const inquirer = require('inquirer');

const { createLib } = require('./main');
const pkg = require('../package.json');

const defaultTpl = 'ts-class';
let targetDir = process.cwd();
let targetLibName = path.basename(targetDir);

const program = new Command(pkg.name);

program
  .version(pkg.version)
  .arguments('[targetLibName]')
  .usage(`${chalk.green('[targetLibName]')} [options]`)
  .action((name = '') => {
    targetDir = path.join(process.cwd(), name);
    targetLibName = targetDir.split(path.sep).reverse()[0];
  })
  .option('-y, --yes', 'use all default config')
  .option('-g, --git', 'use `git` to init this project')
  .option('-t, --type <type>', 'select lib type');

program.parse()

async function promptForMissingOptions(options) {

  if (options.yes) {
    return {
      ...options,
      git: true,
      type: defaultTpl,
    };
  }

  const questions = [];

  if (!options.type) {
    questions.push({
      type: 'list',
      name: 'type',
      message: 'Please choose which lib tpl to use',
      choices: ['ts-class', 'ts-utils'],
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
    type: options.type || answers.type,
    git: options.git || answers.git,
  };
}

module.exports = {
  async cli() {
    program.parse();

    const options = await promptForMissingOptions(program.opts());
    options.targetDir = targetDir;
    options.targetLibName = targetLibName;

    createLib(options);
  }
};
