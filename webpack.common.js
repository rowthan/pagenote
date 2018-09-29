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
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};