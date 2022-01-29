const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const templateFile = process.env.devFile || 'dev.html'

module.exports = merge(common, {
  entry: './dev/index.js',
  mode:"development",
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'dev.js',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './public',
    hot: true
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: `./dev/${templateFile}`,
    })
  ]
});
