// webpack的配置文件遵循common规范

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js', // 默认是index.js
  output: {
    // path.resolve():把当前相对路径解析成绝对路径
    // path.join(__dirname, './dist/'):拼接路径
    path: path.resolve('./dist/'),
    filename: 'bundle.js'
  },
  // watch: true, // 开启监视模式
  mode: 'production', // production会是默认值，会进行压缩
  devServer: {
    open: true,
    port: 3000,
    compress: true,
    // contentBase: './src',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // webpack读取loader时是从右到左，或者是从下往上
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.s(a|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      // url-loader是依赖file-loader的，因为他对file-loader进行了封装，可以进行更细致的配置优化
      {
        test: /\.(jpg|png|bmp|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            // 图片小于5kb就专成base64格式的，大于5kb就以路径的形式展示
            limit: 5 * 1024,
            // 指定图片的输出目录
            outputPath: 'images',
            // 自定义图片的名字
            name: '[name]-[hash:4].[ext]'
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|svg|ttf)$/,
        use: 'file-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  }
}