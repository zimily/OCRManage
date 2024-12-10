
import Layout from '@/layout'
//角色路径
 const allRoutes=[
  {
    path: '/role1',
    name: 'role1',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '角色菜单1', icon: 'role' },
    children:[
      {
        path: 'role1function1',
        name: 'Role1Function1',
        component: () => import('@/views/role1'),
        meta: { title: '功能管理11', icon: 'table' }
      },
      {
        path: 'role1function2',
        name: 'Role1Function2',
        component: () => import('@/views/role1'),
        meta: { title: '功能管理12', icon: 'table' }
      },
    ]
  },
  {
    path: '/role2',
    component: Layout,
    redirect: '/dashboard',
    name: 'role2',
    meta: { title: '角色菜单2', icon: 'role' },
    children:[
      {
        path: 'role2function1',
        name: 'Role2Function1',
        component: () => import('@/views/role2'),
        meta: { title: '功能管理21', icon: 'table' }
      },
      {
        path: 'role2function2',
        name: 'Role2Function2',
        component: () => import('@/views/role2'),
        meta: { title: '功能管理22', icon: 'table' }
      },
    ]

  },
 ]

 export default allRoutes