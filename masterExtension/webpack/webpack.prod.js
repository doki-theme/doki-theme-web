const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.join(__dirname, '../installable_extension/js'),
    filename: '[name].js'
  }
});
