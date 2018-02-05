import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const base = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// UN_AUTHORIZED(40001, "未认证"),
// EXPIRED_TOKEN(40002, "token超时"),
// INVALID_TOKEN(40003, "非法token"),
// MISS_INFO_TOKEN(40004, "token信息缺失"),
// USER_MISS_TOKEN(40005, "token用户不存在"),
const token_error_code = new Set([40001, 40002, 40003, 40004, 40005])

// request拦截器
base.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器,全局处理错误信息
base.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.data,
        type: 'error',
        duration: 5 * 1000
      })

      if (token_error_code.has(res.code)) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }

      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err...' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export function get(url, params) {
  return base.request({
    url: url,
    method: 'get',
    params: params
  })
}
export function post(url, data) {
  return base.request({
    url: url,
    method: 'post',
    data: data
  })
}
