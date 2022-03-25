const webpack = require('webpack');
const {merge} = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');
const path = require("path");
const profile = require("./package.json");

module.exports = merge(common, {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib/'+profile.version),
    filename: 'pagenote.js',
    libraryTarget: 'umd'
  },
  mode: "production",
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BundleAnalyzerPlugin()
  ],
    optimization: {
      minimizer: [new TerserPlugin()]
    }
});
