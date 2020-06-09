#!/usr/bin/env node

const { Command } = require('commander');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

const pkg = require('../package.json');
const devConfig = require('../lib/webpack.dev');
const prodConfig = require('../lib/webpack.prod');

const devServerConfig = Object.assign({}, devConfig.devServer, {
});

const program = new Command();

program.version(pkg.version);

program
  .command('start')
  .description('start webpack-dev-server')
  .action(() => {
    webpackDevServer.addDevServerEntrypoints(devConfig, devServerConfig);

    const compiler = webpack(devConfig);
    const server = new webpackDevServer(compiler, devServerConfig);

    server.listen(8080, 'localhost', () => {
      console.log(chalk.greenBright('AutoTs dev-server listening on http://localhost:8080'))
    });
  });

program
  .command('build')
  .action(() => {
    process.env.NODE_ENV = 'production';
    
    webpack(prodConfig, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        // if (err.details) {
        //   console.error(err.details);
        // }
        return;
      }
      console.log(stats.toString({
        colors: true,
        env: true,
      }));

      const info = stats.toJson('minimal');
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
  
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    });
  });

program.parse();
