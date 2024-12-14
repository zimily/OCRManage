import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)  显示
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

//路由分三种：初始化路由=默认路由，动态路由
// 常量路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,  //hidden: true 隐藏在侧边栏的。这意味着它不会出现在导航菜单中，但仍然可以直接访问。
  },
 {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',//重定向
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      // component: () => import('@/views/role1'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // { path: '*', redirect: '/404', hidden: true }
]
//异步路由
export const asyncRoutes = [
  {
    path: '/inspectionBatch',
    component: Layout,
    redirect: '/dashboard',
    name: 'InspectionBatch',
    // meta: { title: '检验批管理', icon: 'el-icon-s-help' },  
    children: [
      {
        path: 'inspection',
        name: 'Inspection',
        component: () => import('@/views/inspectionBatch'),
        meta: { title: '检验批管理',  icon:'batch'}
      },
    ]
  },
  {
    path: '/dataCollection',
    component: Layout,
    redirect: '/dashboard',
    name: 'DataCollection',
    meta: { title: '数据收集管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'task1',
        name: 'Task',
        component: () => import('@/views/dataCollection/task'),
        meta: { title: '数据采集任务', icon: 'task' }
      },
      {
        path: 'assignment',
        name: 'Assignment',
        component: () => import('@/views/dataCollection/taskAssignment'),
        meta: { title: '采集任务分发', icon: 'assign' }
      },
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/dashboard',
    name: 'Project',
    children: [
      {
        path: 'projectManage',
        name: 'ProjectManage',
        component: () => import('@/views/project'),
        meta: { title: '项目管理', icon: 'program' }
      },
    ]
  },
  {
    path: '/stateMents',
    component: Layout,
    redirect: '/dashboard',
    name: 'StateMents',
    // meta: { title: '数据报表', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'statement',
        name: 'StateMent',
        component: () => import('@/views/statement'),
        meta: { title: '数据报表管理', icon: 'statement' }
      },
    ]
  },
  {
    path: '/projectApprove',
    component: Layout,
    redirect: '/dashboard',
    name: 'ProjectApprove',
    // meta: { title: '项目审批', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'approve',
        name: 'Approve',
        component: () => import('@/views/projectApprove'),
        meta: { title: '项目审批', icon: 'approve' }
      },
    ]
  },
  {
    path: '/authority',
    component: Layout,
    redirect: '/dashboard',
    name: 'Authority',
    meta: { title: '权限管理', icon: 'el-icon-lock' },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/authority/users'),
        meta: { title: '用户管理'}
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/authority/roles'),
        meta: { title: '角色管理' }
      },
    ]
  },
]
//任意路由：当路径出现错误的时候重定向404
export const anyRoutes= { path: '*', redirect: '/404', hidden: true }



//创建 router 实例，然后传 `routes` 配置
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  // console.log('*****',newRouter)
  // const asyncRoutes = store.state.user.permissionList
  // console.log('动态路由',asyncRoutes)

  router.matcher = newRouter.matcher // reset router
  //遍历删除
  // asyncRoutes.forEach((item)=>router.options.routes.push(item))
  // router.removeRoute(asyncRoutes)
}

export default router
