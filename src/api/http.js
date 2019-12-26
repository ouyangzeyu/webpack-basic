let host = 'http://192.168.1.22:8888'
console.log(IS_DEV)
if (!IS_DEV) {
  host = 'http://www.ouyang.com'
}

let url = host + '/api/v1/getUserInfo'

import axios from 'axios'

export const getUserInfo = () => axios.get(url)