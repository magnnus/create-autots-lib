const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');
const prodConfig = require('../../lib/webpack.prod');

const mocha = new Mocha({
  timeout: '10000ms',
});

process.chdir(path.join(__dirname, 'tpl'));

rimraf('./dist', () => {
  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err); // eslint-disable-line
      process.exit(2);
    }

    // eslint-disable-next-line
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
    }));

    mocha.addFile(path.join(__dirname, 'html.test.js'));
    mocha.addFile(path.join(__dirname, 'css.test.js'));

    mocha.run();
  });
});
