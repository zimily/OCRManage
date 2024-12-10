import { login, logout, getInfo, getPermissionList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import dynamicRouter from "@/router/routes"
import { recursionRouter, setDefaultRoute } from "@/utils/recursion-router"
import router, { constantRoutes } from "@/router/index"

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: localStorage.getItem('userRole') || '', // 从存储中读取角色
    // permissionList: [],
    permissionList:null,
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
  SET_PERMISSION(state, routes) {
    state.permissionList = routes;
  },
  CLEAR_PERMSSION(state) {
    state.permissionList = null;
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
    localStorage.setItem('userRole', role) // 持久化存储角色
  }
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
        console.log('用户信息',info)
        commit('SET_NAME', name)
        resolve()//表示 Promise 成功完成
      }).catch(error => {
        reject(error)
      })
    })
  },
  //动态路由
  permission({ commit, state }, role) {
    //发请求 异步
    return new Promise((resolve, reject) => {
      console.log('vuex 发请求',role)
      getPermissionList(role)
        .then(response => {
          const { data } = response
          let permissionList = data.permissions
          console.log('vuex权限返回数据', response)
          console.log('dynamicRouter', dynamicRouter)
          console.log('vuex*****permissionList ',permissionList)
          //1.筛选
          let selectRoutes = recursionRouter(permissionList, dynamicRouter);
          console.log('筛选routes', selectRoutes)
          commit("SET_PERMISSION", [...selectRoutes])
          resolve()
        }).catch(error => {
          reject(error)
        })
    })

  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
        removeToken() // must remove  token  first
        resetRouter()
        /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
        // window.location.reload()
        commit('CLEAR_PERMSSION')
        commit('RESET_STATE')
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

