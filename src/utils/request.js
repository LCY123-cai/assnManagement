import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 创建一个axios实例
const service = axios.create({
  // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API,
  // send cookies when cross-domain requests
  // withCredentials: true,
  // 请求超时
  timeout: 5000
})
// 请求拦截
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 如果code码值不为 20000, 那么就是错误.
    if (res.code && res.code !== '20000') {
      Message({
        message: res.msg || '系统错误',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: 非法 token; 50012: 其他人登录; 50014: Token 失效;
      if (res.code === '50008' || res.code === '50012' || res.code === '50014') {
        // to re-login
        MessageBox.confirm('您已登出，点击取消以保留在该页面上，或者点击重新登录以再次登录', '确认登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // for debug
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
