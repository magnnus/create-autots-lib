const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const TerserPlugin = require('terser-webpack-plugin');

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

const prodConfig = {
  mode: 'production',
  entry: {
    ...baseConfig.entry,
    ...prodEntry,
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: '[name].css',
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    new webpack.BannerPlugin({
      banner
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.(js|ts)$/,
      }),
    ],
  },
};

module.exports = merge(baseConfig, prodConfig);
