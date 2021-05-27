import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'
// create 创建axios实例
const request = axios.create({
  timeout: 2000
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}
// 请求拦截器
request.interceptors.request.use(function (config) {
  // 判断 config.url 前缀，来进行请求baseURL 的设置
  config.baseURL = getBaseURL(config.url)
  // 统一设置 token信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin () {
  // 跳转到登录页面
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 存储是否正在更新 token的状态
let isRefreshing = false // eslint-disable-line no-unused-vars
// 存储因为等待 token刷新而挂起的请求
let requests = [] // eslint-disable-line no-unused-vars

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码2xx会执行在这里
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，响应接收完毕，但状态码为失败的情况
    // 判断失败的状态码情况，主要处理401
    const { status } = error.response
    let errorMessage = '' // eslint-disable-line no-unused-vars
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 1.无token 无效（过期处理）
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 2.token无效（错误/过期token）
      // 检测是否已经存在了正在刷新token的请求
      if (isRefreshing) {
        // 将当前失败的请求存储搭配请求列表中
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }
      isRefreshing = true
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 刷新token失败
        if (res.data.state !== 1) {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token成功
        store.commit('setUser', res.data.content)
        // 重新发送失败的请求，根据request发送所有失败的请求
        requests.forEach(callback => callback())
        // 发送完毕，清楚requests内容
        requests = []
        // 将本次请求发送
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态更改为false 即可
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error('请求超时，请重试')
  } else if (error.request) {
    Message.error(error.message)
  }
  // 本次请求的错误对象继续向后抛出，让接受响应的处理函数进行操作
  return Promise.reject(error)
})

export default request
