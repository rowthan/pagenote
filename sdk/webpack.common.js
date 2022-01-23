const path = require('path');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const profile = require('./package');

module.exports = {
  entry: './src/pagenote.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/'+profile.version),
    filename: 'pagenote.js',
    libraryTarget: 'umd'
  },
  //loader: resolve the files except javascript
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['react-svg-loader'],
      },
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.js$/,
        // exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-html|@polymer|@vaadin|@lit)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            "plugins": [
              [
                "@babel/plugin-transform-react-jsx",
                {
                // "pragma": "h",
                // "pragmaFrag": "Fragment",
            }]]
          },
        }
      },
      {
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader,{
          loader: 'css-loader',
          options: {
              modules: false,
              localIdentName: '[hash:base64:3]'
          }
        },{
          loader: "sass-loader"
        }]
      },
      {
        test: /\.less$/,
        use: ['to-string-loader',{
          loader: 'css-loader',
          options: {
            modules: false,
            localIdentName: '[hash:base64:3]'
          }
        },{
          loader: "less-loader"
        }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,{
          loader: 'css-loader',
          options: {
            modules: false,
            localIdentName: '[hash:base64:3]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png)$/,
        use: [{
          loader: 'file-loader', options: {esModule: false}
        }]
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
      filename: "pagenote.css",
      chunkFilename: "[id].css"
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      '@': require('path').resolve(__dirname, 'src')
      // Must be below test-utils
    },
  }
};
