// webpack的配置文件遵循common规范

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // entry: './src/main.js', // 默认是index.js

  entry: { // 多页应用的路口配置
    index: './src/index.js',
    other: './src/other.js'
  },
  output: {
    // path.resolve():把当前相对路径解析成绝对路径
    // path.join(__dirname, './dist/'):拼接路径
    path: path.resolve('./dist/'),
    // filename: 'bundle.js'
    filename: '[name].js' // 配合多页应用打包，输出文件也需要对应多个，所以要用变量动态生成
  },
  // watch: true, // 开启监视模式
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      // chunks数组里面的名字对应的是entry中的名字
      chunks: ['index', 'other']
    }),
    new HtmlWebpackPlugin({
      filename: 'other.html',
      template: './src/other.html',
      chunks: ['other']
    }),
    // new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.join(__dirname, 'assets'),
    //     to: 'assets'
    //   }
    // ]),
    new webpack.BannerPlugin('欧阳泽宇'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery'
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
          // 下面的配置都可以独立抽离到.babelrc文件中，官方也推荐这么做
          // options: {
          //   presets: ['@babel/env'],
          //   plugins: [
          //     '@babel/plugin-transform-runtime'
          //   ]
          // }
        },
        exclude: /node_modules/
      },
      // {
      //   test: /\.(htm|html)$/i,
      //   loader: 'html-withimg-loader'
      // }
      {
        // 解析jqeury的绝对路径
        test: require.resolve('jquery'),
        use: {
          loader: 'expose-loader',
          options: '$'
        }
      }
    ]
  }
}