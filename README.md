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
使用时只需要在html中正常引用图片即可，webpack会找到对应的资源进行打包，并修改html中的引用路径

## 多页应用打包
* 修改webpack.config.js文件中入口、出口和plugin的配置
```javascript
entry: { // 多页应用的路口配置
  index: './src/index.js',
  other: './src/other.js'
},
output: {
  filename: '[name].js' // 配合多页应用打包，输出文件也需要对应多个，所以要用变量动态成
},
plugin: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html',
    // chunks数组里面的名字对应的是entry中的名字
    chunks: ['index']
  }),
  new HtmlWebpackPlugin({
    filename: 'other.html',
    template: './src/other.html',
    chunks: ['other']
  }),
]
```

## 第三方库的两种引入方式
可以通过expose-loader进行全局变量的注入，也可以使用内置插件webpack.ProvidePlugin对每个模块的闭包空间注入一个变量自动加载模块，而不必到处去import或者require
* expose-loader：将库引入到全局作用域
安装：npm i expose-loader -D
配置：
```javasript
{
  // 解析jqeury的绝对路径
  test: require.resolve('jquery'),
  use: {
    loader: 'expose-loader',
    options: '$'
  }
}
```

* webpack.ProvidePlugin：将库自动加载到每个模块
plugin中配置
```javascript
new webpack.ProvidePlugin({
  $: 'jquery',
  jquery: 'jquery'
})
```

## development/production 不同配置文件打包
项目开发时一般需要使用两套配置文件，开发阶段打包不需要压缩，上线阶段是需要压缩并优化的。
1 可以抽离三个配置文件：
* webpack.base.js: 公用的基础配置

* webpack.prod.js：生产环境的配置

* webpack.dev.js：开发环境的配置

抽离后要注意配置文件中使用到绝对路径的地方，需要往上翻一层级！

2 在dev和prod中使用webpack-merge把自己的配置与base配置进行合并导出
安装：npm i webpack-merge -D
如dev配置文件中：
```javascript
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
```
prod配置文件中同理

3 将package.json中的脚本参数进行修改，通过--config手动指定特定的配置文件


## 环境变量的配置
```javascript
plugins: [
  new webpack.DefinePlugin({
    IS_DEV: 'true'
    // 定义字符串的话要引号里面套引号，否则会当成变量处理
    // 如：str: '"张三"'
  })
]
```
这样IS_DEV就是一个全局的变量了，任何项目中的js文件中都能使用它

## 跨域问题及解决方案
目前主要的方案有：
jsonp(被淘汰了)，非官方的方案，而且默认是get方式请求，无法修改。
cors(目前最流行的)，主要由后端工程师支持
http proxy代理请求(推荐使用)

* 使用devServer解决跨域问题，其实原理就是用的http proxy
```javascript
devServer: {
  proxy: {
    // 当前端请求api地址时会将请求转发到http://localhost:9999
    '/api': {
      target: 'http://localhost:9999',
      pathRewrite: { // 重写路径，转发请求时就不会携带/api了
        '^/api': ''
      }
    }
  }
}
```

# 三、 webpack优化
1 production模式打包自带优化
* tree shaking
用于打包时移除js中未引用的代码，使用es6的import和export才能实现，require不行

* scope hoisting
作用是将模块之间的关系进行结果推测，可以让webpack打包出来的代码文件更小、运行更快
原理就是分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但是前提是不能造成代码的冗余
因此只有那些被引用了一次的模块才能被合并

* 代码压缩


2 css优化
* 将css抽取到独立的文件中
需要用到mini-css-extract-plugin插件,对每个包含css的js文件都会创建一个css文件
安装：npm i mini-css-extract-plugin -D
配置：
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

new MiniCssExtractPlugin({
  filename: '[name].css'
})
```
最后还需要将原来配置的所有style-loader替换为MiniCssExtractPlugin.loader
```javascript
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
}
```

* 自动添加css前缀
PostCss工具，需要用到postcss-loader和autoprefixer插件
安装：npm i postcss-loader autoprefixer -D

需要放在css-loader的右边，因为他需要先对css做添加前缀处理
项目根目录新建一个postcss.config.js的配置文件
```javascript
module.exports = {
  plugins: [require('autoprefixer')]
}
```

* css压缩
需要使用potimize-css-assets-webpack-plugin插件

但有个注意点是，该插件安装后需要配置optimazation对象，会对其默认的配置进行覆盖，所以js压缩会失效，需要我们手动引入js压缩插件重新进行配置

3 js优化(重要)
code splitting特性：把代码分离到不同的bundle中，然后可以按需加载或者并行加载这些文件。
常用的三种分离方式：
* 入口起点：使用entry配置手动的分离(极不推荐)

* 防止重复：使用webpack4内置插件SplitChunksPlugin去重、分离chunk
```javascript
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```
打包后会生成一个vendors名称开头的js文件，他就是公共依赖的js文件，比如两个js文件都引用了jquery，那么vendors文件就是打包的jquery代码

* 动态导入：通过模块的内联函数调用来分离代码(最常用的模式)
webpack4默认是允许import语法动态导入的，但是需要babel的插件来支持'@babel/plugin-syntax-dynamic-import'
动态导入的最大的好处就是实现了懒加载，用到哪个模块才会加载哪个模块
1 安装：npm i @babel/plugin-syntax-dynamic-import -D
2 配置.babelrc配置文件
3 这时已经可以实现动态导入了，如jquery:
```javascript
import('jquery').then(({ default: $ }) => {})
```



持续更新。。。