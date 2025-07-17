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
    // console.log('有token')
    // next()//有token，直接放行
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 如果已登录，重定向到主页
      // console.log('to.path === /login且有token，直接放行')  
      next({ path: '/' })
      NProgress.done()
    } else {
      const flag= store.state.user.resultAllRoutes;
      // console.log('resultAllRoutes的长度',flag,flag.length)
      if (flag.length>0) {
          //  console.log('有用户信息和动态路由',router)
          next()
      } else {
        try {
          // console.log('添加动态路由前',router)
          await store.dispatch('user/getInfo')
          // console.log('添加动态路由后',router)
          next({...to, replace: true})//白屏问题，确保addRoutes()时动态添加的路由已经被完全加载上去
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
    console.log('无token')
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
