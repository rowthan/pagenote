const path = require('path');

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
        use: [ 'style-loader', {
          loader: 'css-loader',
          options: {
              modules: true,
              localIdentName: '[hash:base64:3]'
          }
        },]
      },
    ]
  }
};