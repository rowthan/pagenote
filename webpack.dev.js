const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  entry: './demo/index.js',
  mode:"development",
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'pagenote.js',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './public',
    hot: true
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      templateContent: ({htmlWebpackPlugin}) => `
    <html>
      <head>
        <link href="https://pagenote.cn/favicon.ico" rel="shortcut icon">
        ${htmlWebpackPlugin.tags.headTags}
        <title>pagenote demo</title>
        <meta name="description" content="这是pagenote 运行 demo" />
      </head>
      <body>
        <div id="guide"></div>
        ${htmlWebpackPlugin.tags.bodyTags}
      </body>
    </html>
  `
    })
  ]
});
