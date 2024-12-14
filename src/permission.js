import router from '@/router/index'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar 进度条
import 'nprogress/nprogress.css' // progress bar style 进度条样式
import { getToken } from '@/utils/auth' // get token from cookie  从 Cookie 获取 Token
import getPageTitle from '@/utils/get-page-title'// 获取页面标题的工具


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    console.log('有TOKEN',to.path)
    //  asyncRoutes=store.state.uesr.permissionList
    //  console.log('路由守卫',asyncRoutes)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 如果已登录，重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name // 检查是否已获取用户信息
      // console.log(hasGetUserInfo)
      // console.log('路由守卫1', store.state.user)
      const asyncRoutes = store.state.user.resultAsyncRoutes
      // console.log('路由守卫', asyncRoutes)  刷新时候的router丢失动态路由
      // console.log('asyncRoutes 数据类型:', Array.isArray(asyncRoutes) ? 'Array' : typeof asyncRoutes);
      if (hasGetUserInfo && asyncRoutes.length!=0) {
           console.log('有用户信息和动态路由',hasGetUserInfo, asyncRoutes)
          next()
      } else {
        try {
          //刷新时候有问题
          // get user info
          // await store.dispatch('user/getInfo')
           //有token和用户信息  获取获取动态路由
          const role= store.state.user.role
          console.log('守卫 role',role)
          // //根据角色发请求
          await store.dispatch("user/permission",role)
          // //获取动态路由
          // const asyncRoutes = store.state.user.permissionList
          // console.log('路由守卫2', asyncRoutes)
          // asyncRoutes.forEach((item)=>router.options.routes.push(item))
          // // router.addRoutes(asyncRoutes);
          // console.log('***',router)
          console.log('无有用户信息和动态路由')

          next()
        } catch (error) {
          // remove token and go to login page to re-login  
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
