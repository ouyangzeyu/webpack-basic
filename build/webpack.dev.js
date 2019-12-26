const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

const webpack = require('webpack')

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
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: 'true'
      // 定义字符串的话要引号里面套引号，否则会当成变量处理
      // 如：str: '"张三"'
    })
  ]
})