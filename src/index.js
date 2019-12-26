
console.log('我是index.js')

// import $ from 'jquery'

$('body').css('backgroundColor', 'yellowgreen')

console.log($)
console.log(window.$) // 本来打印的是undefined, 配置了expose-loader之后，就可以正常打印出来了，因为被挂载到了全局作用域

import { getUserInfo } from './api/http.js'

getUserInfo().then(() => {}, (err) => {
  console.log(err)
})