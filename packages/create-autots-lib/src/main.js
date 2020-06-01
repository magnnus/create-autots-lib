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

function createPkg(options) {
  const basePkgInfo = require(path.join(options.tplDir, 'package.json'));
  const pkg = {
    ...basePkgInfo,
    name: `@autots/${options.targetLibName}`,
  };

  fs.writeFileSync(path.join(options.targetDir, 'package.json'), JSON.stringify(pkg, null, 2));
}

function installAllDependencies(options) {
  const pkg = require(path.join(options.tplDir, 'package.json'));
  const devDependencies = Object.keys(pkg.devDependencies);
  const dependencies = Object.keys(pkg.dependencies);
  const cwd = options.targetDir;

  const tasks = [];

  if (devDependencies.length > 0) {
    tasks.push(
      execa('npm', [ 'i', ...devDependencies, '-D'], {
        cwd,
      })
    );
  }

  if (dependencies.length > 0) {
    tasks.push(
      execa('npm', [ 'i', ...dependencies, '-S'], {
        cwd,
      })
    );
  }

  return Promise.all(tasks);
}

module.exports = {
  async createLib(options) {
    const tplDir = path.resolve(
      __dirname,
      '..',
      'tpls',
      options.type.toLowerCase()
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
        title: 'Generate package.json',
        task: () => createPkg(options),
      },
      {
        title: 'Initialize git',
        task: () => initGit(options),
        enabled: () => options.git,
      },
      {
        title: 'Install dependencies',
        task: () => installAllDependencies(options),
      },
    ]);

    await tasks.run();

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
  }
};