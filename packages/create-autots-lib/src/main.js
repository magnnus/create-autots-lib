const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ncp = require('ncp');
const execa = require('execa');
const Listr = require('listr');

const { promisify } = require('util');

const access = promisify(fs.access);
const copy = promisify(ncp);

async function initGit(options) {
  const result = await execa('git', ['init'], {
    cwd: options.targetDir,
  });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}

async function copyTplFiles(options) {
  return copy(options.tplDir, options.targetDir, {
    clobber: false, // not overwrite destination files that already exist
  });
}

module.exports = {
  async createLib(options) {
    options = {
      ...options,
      targetDir: options.targetDir || process.cwd(),
    };

    const tplDir = path.resolve(
      __dirname,
      '../tpls',
      options.tpl.toLowerCase()
    );
    options.tplDir = tplDir;

    try {
      await access(tplDir, fs.constants.R_OK);
    } catch (err) {
      console.error('%s Invalid template name', chalk.red.bold('ERROR'));
      process.exit(1);
    }

    const tasks = new Listr([
      {
        title: 'Copy template files',
        task: () => copyTplFiles(options),
      },
      {
        title: 'Initialize git',
        task: () => initGit(options),
        enabled: () => options.git,
      },
      {
        title: 'Install dependencies',
        task: () => execa('npm', [ 'install' ] ),
        skip: () =>
          !options.runInstall ?
          'Pass --install to automatically install dependencies' :
          undefined,
      },
    ]);

    await tasks.run();

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
  }
};