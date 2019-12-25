// webpack的配置文件遵循common规范

const path = require('path')

module.exports = {
  entry: './src/main.js', // 默认是index.js
  output: {
    // path.resolve():把当前相对路径解析成绝对路径
    // path.join(__dirname, './dist/'):拼接路径
    path: path.resolve('./dist/'),
    filename: 'custombundle.js'
  },
  mode: 'development' // production会是默认值，会进行压缩
}
