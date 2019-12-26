const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig, {
  mode: 'production', // production会是默认值，会进行压缩
  devtool: 'cheap-module-source-map'
})