'use strict';

const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const del               = require('del');

function resolve(_path) {
  return path.resolve(__dirname, _path);
}

del.sync([resolve('../../dist')], { force: true });

module.exports = {
  entry: {
    main: resolve('./example/app'),
    vendor: resolve('./example/vendor')
  },
  output: {
    path: resolve('./example/dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new HtmlWebpackPlugin({
      template: resolve('./example/index.html')
    }),
    new ExtractTextPlugin('[name].css')
  ]
};
