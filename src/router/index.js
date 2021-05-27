import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
// 引入路由中需要使用的组件功能  @代表src
// import Login from '@/views/login/index'
// import Advert from '@/views/advert/index'
// import AdvertSpace from '@/views/advert-space/index'
// import Course from '@/views/course/index'
// import ErrorPage from '@/views/error-page/index'
// import Home from '@/views/home/index'
// import Layout from '@/views/layout/index'
// import Menu from '@/views/menu/index'
// import Resource from '@/views/resource/index'
// import Role from '@/views/role/index'
// import User from '@/views/user/index'

// 固定书写方式
Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName:'login' */'@/views/login/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName:'layout' */'@/views/layout/index'),
    // 直接给某个路由设置，这时内部的子路由都需要认证（包含当前路由）
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName:'home' */'@/views/home/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName:'role' */'@/views/role/index')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName:'menu' */'@/views/menu/index')
      },
      // 资源列表
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName:'resource' */'@/views/resource/index')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName:'course' */'@/views/course/index')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName:'user' */'@/views/user/index')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName:'advert' */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName:'advert-space' */'@/views/advert-space/index')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName:'menu-create' */'@/views/menu/create')
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName:'menu-edit' */'@/views/menu/edit')
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName:'alloc-menu' */'@/views/role/alloc-menu'),
        props: true
      },
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName:'alloc-resource' */'@/views/role/alloc-resource'),
        props: true
      },
      // 编辑资源
      {
        path: '/resource/:resourceId/edit',
        name: 'resource-edit',
        component: () => import(/* webpackChunkName:'resource-edit' */'@/views/resource/edit'),
        props: true
      },
      // 添加资源
      {
        path: '/resource/create',
        name: 'resource-create',
        component: () => import(/* webpackChunkName:'resource-create' */'@/views/resource/create'),
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName:course-create' */'@/views/course/create')
      },
      // 编辑课程组件
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName:course-edit' */'@/views/course/edit'),
        props: true
      },
      // 课程内容管理组件
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName:course-section' */'@/views/course/section'),
        props: true
      },
      // 课程内容上传视频组件
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName:course-video' */'@/views/course/video'),
        props: true
      }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName:'error-page' */'@/views/error-page/index')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 验证to 路由是否需要进行身份认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 验证 vuex的store中的登录用户信息是否存储
    if (!store.state.user) {
      // 未登录，跳转到登录页面
      return next({
        name: 'login',
        query: {
          // 本次路由的fullpath传递给login页面
          redirect: to.fullPath
        }
      })
    }
    // 已经登录，允许通过
    next()
  } else {
    next() // 确保一定要调用next()
  }
})

export default router
