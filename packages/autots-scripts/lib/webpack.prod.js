const path = require('path');
const merge = require('webpack-merge');
const cssnano = require('cssnano');
const webpack = require('webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base');

// confirm `min` entries
const entryKeys = Object.keys(baseConfig.entry);
const prodEntry = {};
entryKeys.forEach(key => {
  prodEntry[key + '.min'] = baseConfig.entry[key];
});

const projectRoot = process.cwd();
const pkg = require(path.join(projectRoot, 'package.json'));
const banner =`${pkg.name} v${pkg.version}
Last Modified @ ${new Date().toLocaleString()}
Released under the MIT License.`;

function generateConfig (name) {
  const noMin = name.indexOf('min') === -1;
  const cdn = name.indexOf('browser') > -1;

  const config = {
    mode: 'production',
    name,
    output: {
      filename: name + '.js',
    },
    optimization: {
      minimize: true,
    },
    plugins: [
      new webpack.BannerPlugin({
        banner
      }),
    ],
    externals: [],
  };

  if (name === 'main.min') {
    config.plugins.concat([
      new MiniCSSExtractPlugin({
        filename: '[name].css',
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: cssnano,
      }),
    ])
  }

  if (noMin) {
    config.optimization.minimize = false;
  }

  if (!cdn) {
    config.externals.push(nodeExternals({
      importType: 'umd',
    }));
  }

  return config;
}

const shortName = pkg.name.split('/').reverse()[0];

const targetFiles = ['main', 'main.min', `${shortName}.browser`, `${shortName}.browser.min`];

module.exports = targetFiles.map(t => {
  return merge(baseConfig, generateConfig(t));
})
