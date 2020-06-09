const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.base');

const projectRoot = process.cwd();

const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    publicPath: '/',
    contentBase: [
      path.resolve(projectRoot, 'dist'),
      path.resolve(projectRoot, 'public'),
    ],
    hot: true,
    stats: 'minimal', // or error-only
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(projectRoot, 'public/index.html'),
      inject: 'head',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(baseConfig, devConfig);
