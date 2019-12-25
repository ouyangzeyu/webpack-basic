//入口文件

let a = require('./a.js')

// 引入css
import './css/index.css'
import './css/b.css'

// 引入less
import './less/index.less'
import './scss/index.scss'

// 引入字体文件
import 'bootstrap/dist/css/bootstrap.css'

console.log(a)

console.log('我是最帅的！ 这是真的!!!')
console.log('天哪123')

window.onload = function () {
  document.querySelector('ul').style.listStyle = 'none'
  document.querySelector('li').style.backgroundColor = 'red'
}

// es6的语法需要用babel进行转化
setTimeout(function () {
  console.log('一秒后我执行了,我没用箭头函数')
}, 1000)

setTimeout(() => {
  console.log('一秒后我执行了，我用了箭头函数')
}, 1000)

class Person {
  constructor(name) {
    this.name = name
  }
}
let p = new Person('小黑')
console.log(p)

// 更高级的语法 需要转换插件去处理，在官网有详细说明
// class Dog {
//   // 创建Dog对象时默认的name就是大黄
//   name = '大黄'
//   // 添加静态成员
//   static color = 'yellow'
// }
// let d = new Dog()
// console.dir(d)
// console.dir(Dog)

// 需要babel插件才能运行generator函数
function *fn () {
  yield 1
  yield 2
  return 3
}
let newFn = fn()
console.log(newFn.next()) // 1
console.log(newFn.next()) // 2
console.log(newFn.next()) // 3
console.log(newFn.next()) // undefined

//对于es6或es7等更高版本提供的对象原型上的新方法，babel并不会去处理
// 需要安装@babel/polyfill进行支持
import '@babel/polyfill'
let str = '123'
console.log(str.includes('2'))