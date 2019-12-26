console.log('我是index.js')

// import $ from 'jquery'

$('body').css('backgroundColor', 'green')

console.log($)
console.log(window.$) // 本来打印的是undefined, 配置了expose-loader之后，就可以正常打印出来了，因为被挂载到了全局作用域