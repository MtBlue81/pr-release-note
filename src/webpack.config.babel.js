'use strict';

import 'babel-polyfill';
import webpack from 'webpack';
import path from 'path';

const DEBUG = !process.argv.includes('--release');

export default {
  target: 'electron',
  node: {
    __dirname: false,
    __filename: false
  },
  entry: {
    'main': './app/javascripts/main/main.js',
    'renderer': './app/javascripts/renderer/app.js'
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ja/),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': `"${process.env.NODE_ENV || (DEBUG ? 'development' : 'production')}"` }),
    ...(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { 'screw_ie8': true, 'warnings': VERBOSE } }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      // https://github.com/request/request/issues/1529#issuecomment-103454943
      { test: /\.json$/, loader: 'json-loader' },
      { exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        }
      },
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
};
