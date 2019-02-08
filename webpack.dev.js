const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
  module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      port: 9999,
      //compress: true,
      //stats: "errors-only",
      open: true,
      //contentBase: path.resolve(__dirname, 'src'),
      publicPath: '/dist'
    }

});
