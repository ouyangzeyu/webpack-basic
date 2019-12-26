const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig, {
  mode: 'development', // production会是默认值，会进行压缩
  devServer: {
    open: true,
    port: 3000,
    compress: true,
    // contentBase: './src',
    hot: true
  },
  // source map
  devtool: 'cheap-module-eval-source-map'
})