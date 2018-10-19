const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "production",
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'dist'),
      to :path.resolve(__dirname, 'extenstion/scripts/')
    },{
      from: path.resolve(__dirname, 'dist'),
      to :path.resolve(__dirname, 'extenstion/css/')
    }])
   ],
});