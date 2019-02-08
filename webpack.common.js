const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    app: './src/app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
      new CleanWebpackPlugin(['dist']),
      /*new HtmlWebpackPlugin({
          title: 'Production'
    })*/
  ],
  output: {
    filename: 'bundle.js',//[name].
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    //modules: [path.resolve(__dirname, './src'), 'node_modules'],
    //extensions: ['.js', '.jsx', '.json'],
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      DataStructures: path.resolve(__dirname, 'src/datastructures/'),
      Library: path.resolve(__dirname, 'src/library/'),
      Services: path.resolve(__dirname, 'src/services/')
    }
  }
};