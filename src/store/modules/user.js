import { login, logout, getInfo, getPermissionList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, resetRouter,constantRoutes,anyRoutes } from '@/router/index'
import router from '@/router'
// console.log('asyncRoutes imported:', asyncRoutes);

const getDefaultState = () => {
  let storedRole = '';
  try {
    storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      storedRole = JSON.parse(storedRole); // 反序列化
    }
  } catch (e) {
    console.error('Error reading role from localStorage', e);
    storedRole = ''; // 如果读取或解析失败，设置为默认空值
  }
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: storedRole, // 从存储中读取角色  对象需要序列化
   //对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由】
   resultAsyncRoutes:[],
   //用户最终需要展示全部路由
   resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    console.log('SET_ROLE',role)
    state.role = role
    try {
      localStorage.setItem('userRole', JSON.stringify(role)); // 序列化存储角色对象
    } catch (e) {
      console.error('Error saving role to localStorage', e);
    } // 序列化存储角色对象 持久化存储角色
  },
   //最终计算出的异步路由
   SET_RESULTASYNCROUTES(state,asyncRoutes){
    //vuex保存当前用户的异步路由，注意：一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes;
    console.log('resultAsyncRoutes',asyncRoutes)
    //计算出当前用户需要展示所有路由
    state.resultAllRoutes=constantRoutes.concat(state.resultAsyncRoutes);
    console.log('resultAllRoutes', state.resultAllRoutes)
    asyncRoutes.forEach((item)=>router.options.routes.push(item))
    //给路由器添加新的路由
    router.addRoutes(asyncRoutes)

  }
}
//定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes=(asyncRoutes,routes)=>{
  // console.log('所有的异步路由',asyncRoutes)
  // console.log('服务器返回的路由标签',routes)
  //过滤出当前用户【超级管理员|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item=>{
    //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1
    if(routes.indexOf(item.name)!=-1){
      //递归：别忘记还有2、3、4、5、6级路由
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes);
      }
      return true;
    }
  })
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, role } = userInfo
    console.log('store_login',username, password)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const  data= response.result
        console.log('store-login', response)
        console.log('data',data)
        //1.获取并存储token
        const token=data.token
        commit('SET_TOKEN',token)
        setToken(token)
        //获取用户信息
        const info=data.information
        const name=info.name
        commit('SET_NAME', name)
        //获取用户角色信息
        const role=data.role
        commit('SET_ROLE', role)
        resolve()//表示 Promise 成功完成
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 动态路由
  permission({ commit, state }, role) {
    var act_routs=[]
    // console.log('////s',role,role.roleId)
    if(role.roleId==1){  //分公司管理人员
      act_routs=["InspectionBatch","Inspection","DataCollection","Assignment","Project",
      "ProjectManage","StateMents","StateMent","ProjectApprove","Approve","Authority","Users","Roles"]
    }else if(role.roleId==2){ //项目管理人员
      act_routs=["DataCollection","Assignment","Project","ProjectManage","Authority","Users","Roles"]

    }else if(role.roleId==3){ //采集人员
      act_routs=["DataCollection","Task"]

    }else if(role.roleId==4){ //公司管理人员
      act_routs=["InspectionBatch","Inspection","DataCollection","Assignment","Project",
      "ProjectManage","StateMents","StateMent","ProjectApprove","Approve","Authority","Users","Roles"]
    }
    // 计算异步路由并提交 mutation
    console.log('act_routs:', act_routs);
    const computedRoutes = computedAsyncRoutes(asyncRoutes, act_routs);
    console.log('computedRoutes',computedRoutes)
    commit('SET_RESULTASYNCROUTES', computedRoutes);
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

