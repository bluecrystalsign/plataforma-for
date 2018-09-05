
const webpack = require('webpack'); // eslint-disable-line
const path = require('path'); // eslint-disable-line
const config = require('./webpack.config.js');

delete config.devtool;
delete config.output.pathinfo;

config.output.path = path.join(__dirname, 'dist');
config.plugins[0] = new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  'process.env':{
	'NODE_ENV': JSON.stringify('production')
  }
});

module.exports = config;
