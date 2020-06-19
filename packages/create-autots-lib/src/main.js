const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ncp = require('ncp');
const execa = require('execa');
const Listr = require('listr');

const { promisify } = require('util');

const access = promisify(fs.access);
const copy = promisify(ncp);
const rename = promisify(fs.rename);

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
  const commonDir = path.join(__dirname, '..', 'tpls/common');
  await copy(commonDir, options.targetDir, {
    clobber: false,
    stopOnErr: true,
  });

  // 特殊处理 gitignore 文件
  const oldGitIgnore = path.join(options.targetDir, 'gitignore');
  const newGitIgnore = path.join(options.targetDir, '.gitignore');
  await rename(oldGitIgnore, newGitIgnore);

  await copy(options.tplDir, options.targetDir, {
    clobber: true, // will overwrite destination files that already exist
  });
}

async function createPkg(options) {
  const basePkgInfo = require(path.join(options.targetDir, 'package.json'));
  basePkgInfo.name = `@autots/${options.targetLibName}`;

  // 更新 autots-scripts 到最新版本
  const { stdout: scriptsVersion } = await execa('npm', ['view', 'autots-scripts', 'version']);
  basePkgInfo.devDependencies['autots-scripts'] = scriptsVersion;

  fs.writeFileSync(path.join(options.targetDir, 'package.json'), JSON.stringify(basePkgInfo, null, 2));
}

// function installAllDependencies(options) {
//   const pkg = require(path.join(options.targetDir, 'package.json'));
//   const devDependencies = Object.keys(pkg.devDependencies);
//   const dependencies = Object.keys(pkg.dependencies);
//   const cwd = options.targetDir;

//   const tasks = [];

//   // TODO： 以下会造成版本不稳定
//   if (devDependencies.length > 0) {
//     tasks.push(
//       execa('npm', [ 'i', ...devDependencies, 'autots-scripts', '-D', '--no-package-lock'], {
//         cwd,
//       })
//     );
//   }

//   if (dependencies.length > 0) {
//     tasks.push(
//       execa('npm', [ 'i', ...dependencies, '-S', '--no-package-lock'], {
//         cwd,
//       })
//     );
//   }

//   return Promise.all(tasks);
// }

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
        title: 'Install dependencies (This may take a few minutes, please be patient 😊)',
        skip: () => {
          if (!options.install) {
            return 'You choose to install manually';
          }
        },
        task: () => execa('npm', [ 'i', '--no-package-lock'], {
          cwd: options.targetDir,
        }),
      },
    ]);

    await tasks.run();

    console.log(`%s The ${options.targetLibName} Library is Ready`, chalk.green.bold('DONE'));
    
    const Tips = [
      '',
      'Then you can follow these commands to start:',
      `$ ${chalk.greenBright('cd ' + options.targetLibName)}`,
    ];
    
    if (!options.install) {
      Tips.push(`$ ${chalk.greenBright('npm install')}`);
    }

    Tips.push(`$ ${chalk.greenBright('npm start')}`, '');
    
    Tips.forEach(v => console.log(v));
    return true;
  }
};