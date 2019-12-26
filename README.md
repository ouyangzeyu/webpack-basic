此项目是作为个人学习webpack的一个归档，也可供初学者进行参考。

# 一、webpack基础

## 1 webpack的安装：
首先需要先安装好node.js最新版本
### 1.1 全局安装：
npm i webpack webpack-cli -g

### 1.2 项目中安装(强烈推荐使用)：
npm i webpack webpack-cli -D
 
webpack是核心包，webpack-cli是命令包，这是在webpack4.x之后开始分离的，所以必须要要安装这两个。
为什么说推荐使用在项目中安装呢？
因为webpack是一个项目打包工具，同时npm5.2之后内置了npx指令，通过npx webpack就可以执行webpack打包。

## 2 webpack的使用
npx需要解决的主要问题就是调用项目内部安装的模块，原理就是在node_modules下的.bin目录中找到对应的命令执行
webpack4.0之后实现了0配置打包构建，缺点就是限制较多，无法自定义很多配置，开发中还是常用webpack配置进行打包。
### 2.1 基础配置
官方默认需要一个配置文件：webpack.config.js，文件名字可以更改，在执行的命令的时候加上配置文件名，webpack就会自动启用改文件中的配置，比如我们可以分开发和上线两种配置文件。
命令：npx webpack --config xxx.js
该命令可以在package.json文件中的scripts中配置好脚本，如：
“build”：“webpack --config xxx.js”， 这样我们只需要执行npm run build命令即可打包

### 2.2 开发时自动编译工具
多数场景中，可能只需要使用webpack dev serve，也是官方最推荐的方式。
#### 2.2.1 watch mode:
即在webpack指令后面加上 --watch参数就可以了。或者在配置文件中配置watch:true也可以实现一样的效果。

#### 2.2.2 webpack dev server：
* 安装devSever: npm i webpack-dev-server -D
* 配置package.json的scripts：“dev”:"webpack-dev-server --hot --open --port 8080"
或者在配置文件中有一个devServer属性可以进行配置
```javascript
devServer: {
  open: true,
  hot: true,
  port: 3000,
  contentBase: './src',
  compress: true
}
```
* 3 运行npm run dev

#### 2.2.3html 插件配合webpack-dev-serve
* 安装：npm i html-webpack-plugin -D
* 在webpack.config.js中的plugin节点下配置
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin ({
    filename: 'index.html',
    template: 'template.html'
  })
]
```
它做什么事情呢？
* 根据模板在express项目根目录下生成html文件（类似devServer生成内存bundle.js）
* 自动引入bundle.js
* 打包时会自动生成index.html

### 2.3 处理CSS文件
* 安装 npm i css-loader style-loader -D

* 配置webpack.config.js

```javascript
module: {
    rules: [
      {
        test: /\.css$/,
        // webpack读取loader时是从右到左，或者是从下往上，所以要注意顺序
        use: ['style-loader', 'css-loader']
      }
    ]
  }
```

### 2.4 处理 less和sass文件
* 安装 npm i less less-loader sass-loader node-sass -D

* 配置webpack.config.js

```javascript
 {
    test: /\.less$/,
    se: ['style-loader', 'css-loader', 'less-loader']
  },
  {
    test: /\.s(a|c)ss$/,
    use: ['style-loader', 'css-loader', 'sass-loader']
  }
```

### 2.5 处理图片和字体文件
* 安装 npm i file-loader url-loader -D
url-loader封装了file-loader

* 配置
```javascript
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
}
```

### 2.5 babel
* 安装 npm i babel-loader @babel/core @babel/preset-env -D

* 如果需要支持更高级的js语法，需要安装插件(在babel官网可以查看相应的插件)
npm i @babel/plugin-proposal-class-properties -D

* 配置
```javascript
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
```
官方推荐的是在项目根目录下新建一个.babelrc的babel配置文件,他是一个json格式的文件。

```jason
{
  "presets": ["@babel/env"],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```
* 对于es6或es7等更高版本提供的对象原型上的新方法，babel并不会去处理，即使用了transform-runtime插件也不行。
需要使用另一个模块： npm i @babel/polyfill -S

该模块需要在使用新方法的地方直接引入：
```javascript
import '@babel/polyfill'
let str = '123'
console.log(str.includes('2'))
```
或者在weback配置文件入口处配置：
```javascript
module.exports = {
  entry: ['@babel/polyfill', './src/main.js'],
}
```

### 2.6 source map的使用
官网说明：https://www.webpackjs.com/guides/development/#%E4%BD%BF%E7%94%A8-source-map
不同的选项配置：https://www.webpackjs.com/configuration/devtool/

推荐：
```javascript
module.exports = {
  // suorce map
  devtool: 'cheap-module-eval-source-map'
}
```

### 2.7 推荐的几款插件
* clean-webpack-plugin
该插件可以用于自动清除dist目录后重新打包生成，在npm run build的时候非常方便

安装：npm i clean-webpack-plugin -D

使用：在配置文件中的plugins中直接创建对象即可
```javascript
// 之前的写法
// const CleanWebpackPlugin = require('clean-webpack-plugin')

// 最新的写法是需要解构出来的，否则会报错CleanWebpackPlugin is not a constructor
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

plugins: [
  new CleanWebpackPlugin()
]
```

* copy-webpack-plugin
安装：npm i copy-webpack-plugin -D

使用：
```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin')

plugins: [
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname, 'assets'),
      to: 'assets'
    }
  ]),
]
```
from: 从哪里拷贝，可以是相对路径或者绝对路径，推荐绝对路径
to: 拷贝到哪里去，相对于output的路径，也可以是相对路径或者绝对路径，推荐相对路径

* BannerPlugin
webpack内置插件，用于给打包的js文件加上版权注释信息
直接引入
```javascript
const webpack = require('webpack')

plugins: [
  new webpack.BannerPlugin('欧阳泽宇')
]
```


# 二、 webpack高级配置

## html中img标签的图片资源处理
* 安装：npm i html-withimg-loader -S

* 在webpack.config.js中添加loader
```javascript
{
  test: /\.(htm|html)$/i,
  loader: 'html-withimg-loader'
}
```


持续更新。。。