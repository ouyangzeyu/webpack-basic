一、webpack基础
1 webpack的安装：
首先需要先安装好node.js最新版本
1.1 全局安装：
npm i webpack webpack-cli -g

1.2 项目中安装(强烈推荐使用)：
npm i webpack webpack-cli -D
 
webpack是核心包，webpack-cli是命令包，这是在webpack4.x之后开始分离的，所以必须要要安装这两个。
为什么说推荐使用在项目中安装呢？
因为webpack是一个项目打包工具，同时npm5.2之后内置了npx指令，通过npx webpack就可以执行webpack打包。

2 webpack的使用
npx需要解决的主要问题就是调用项目内部安装的模块，原理就是在node_modules下的.bin目录中找到对应的命令执行
webpack4.0之后实现了0配置打包构建，缺点就是限制较多，无法自定义很多配置，开发中还是常用webpack配置进行打包。
2.1 基础配置
官方默认需要一个配置文件：webpack.config.js，文件名字可以更改，在执行的命令的时候加上配置文件名，webpack就会自动启用改文件中的配置，比如我们可以分开发和上线两种配置文件。
命令：npx webpack --config xxx.js
该命令可以在package.json文件中的scripts中配置好脚本，如：
“build”：“webpack --config xxx.js”， 这样我们只需要执行npm run build命令即可打包

2.2 开发时自动编译工具
多数场景中，可能只需要使用webpack dev serve，也是官方最推荐的方式。
2.2.1 watch mode： 即在webpack指令后面加上 --watch参数就可以了。或者在配置文件中配置watch:true也可以实现一样的效果。

2.2.2 webpack dev server：
1 安装devSever: npm i webpack-dev-server -D
2 配置package.json的scripts：“dev”:"webpack-dev-server --hot --open --port 8080"
或者在配置文件中有一个devServer属性可以进行配置
devServer: {
open: true,
hot: true,
port: 3000,
contentBase: './src',
compress: true
}
3 运行npm run dev

html 插件配合webpack-dev-serve
1 安装：npm i html-webpack-plugin -D
2 在webpack.config.js中的plugin节点下配置
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
new HtmlWebpackPlugin ({
filename: 'index.html',
template: 'template.html'
})
]
它做什么事情呢？
1 根据模板在express项目根目录下生成html文件（类似devServer生成内存bundle.js）
2 自动引入bundle.js
3 打包时会自动生成index.html

2.3 处理CSS文件
安装 npm i css-loader style-loader -D

持续更新。。。