import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
import {Toast} from 'vant'
import router from '@/router'

const refreshTokenReq = axios.create({
  baseURL : 'http://ttapi.research.itcast.cn'
})

// 配置默认请求路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
axios.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    console.log('转换失败', err)
    return data
  }
}]

axios.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(response => {

  return response
},async error => {
  // 状态码超出 2xx 都会进入这里
  const status = error.response.status
  if(status === 400) {
    // 客户端错误
    Toast.fail('客户端请求参数异常')
  }else if (status === 401) {
    // token 无效
    // 如果没有 user 或者 user.token 直接去登录
    const {user} = store.state
    if (!user || !user.token){
      // 提示用户
      Toast({message:'未登录',position:'top'})
      // 跳转登录页
      return redirectLogin()
    }
    // 如果有 refresh_token 请求获取信息 token
    try {
      //  新的请求对象，请求失败不会进入 axios 的响应拦截器 造成死循环
      const {data} = await refreshTokenReq({
        method:'put',
        url:'/app/v1_0/authorizations',
        headers:{
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 拿到新的 token 后更新到容器中
      user.token = data.data.token
      store.commit('setUser',user)
      // 失败的请求重新发出去
      // error.config 是本次请求的 相关配置对象
      // 使用 axios 发送请求 他会走拦截器
      // 他的请求拦截器用过 store 容器访问 token 数据
      //  axios 发送请求 请求数据在 error.config 中，也就是上次请求失败的配置对象，相当于重新请求一次
      return axios(error.config)
    }catch (e) {
        // 刷新 token 失败 直接跳转登录页面
         redirectLogin()
    }

  }else if(status === 403){
    // 没有权限操作
    Toast.fail('没有操作权限，请登录或稍后重试')
  }else if (status >= 500){
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }
  return Promise.reject(error)
})

function redirectLogin(){
  router.replace({
    name:'login',
    // 传递查询参数 查询参数会以 ？ 号作为分隔符放到 url 后面
    query:{
      // 数据名是自己起的
      // router.currentRoute 获取当前路由对象  fullPath 当前路由路径
      redirect: router.currentRoute.fullPath
    }
  })
}

Vue.prototype.$axios = axios
