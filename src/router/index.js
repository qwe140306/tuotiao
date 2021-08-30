import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/'),
        meta: {
          keepAlive: true //此组件需要被缓存
        }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: {
          requiresAuth: true //此组件需要登录访问
        }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/')
      }
    ]
  },

  // 登录路由
  {
    name: 'login',
    path: '/login',
    // 路由懒加载写法
    component: () => import('@/views/login/')
  },
  // 搜索页
  {
    name: 'search',
    path: '/search',
    component: () => import('@/views/search/')
  },
  // 文章详情
  {
    name: 'article',
    path: '/article/:articleId',
    component: () => import('@/views/article'),
    props: true
  },
  // 编辑资料
  {
    name: 'userProfile',
    path: '/user/profile',
    component: () => import('@/views/user-profile'),
  }
]



const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 校验登录状态
    // 没有提示用户是否登录
    if (!store.state.user){
      Dialog.confirm({
        title: '访问提示',
        message: '该功能需要登录才能访问，确认登录吗？'
      })
        .then(() => {
          router.replace({
            name:'login',
            query:{
              redirect: to.path
            }
          })
        })
        .catch(() => {
          // 取消了 中断路由导航
          next(false)
        })
    }else{
      next()
    }

  }else {
    // 不需要登录 直接跳转
    next()
  }
})

export default router
