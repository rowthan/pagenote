const path = require('path');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'easyshare.js',
  },
  //loader: resolve the files except javascript
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              ["transform-react-jsx", { "pragma":"h" }]
            ]
          },
        }
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
              modules: true,
              localIdentName: '[hash:base64:3]'
          }
        },]
      },
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {discardComments:{removeAll: true}},
        canPrint: true
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "easyshare.css",
      chunkFilename: "[id].css"
    }),
  ]
};