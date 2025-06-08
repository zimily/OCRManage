import { login, loginByPhone, logout, getInfo, getPermissionList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setUser, getUser, removeUser } from '@/utils/storage'
import { asyncRoutes, resetRouter, constantRoutes, anyRoutes } from '@/router/index'
import router from '@/router'
// console.log('asyncRoutes imported:', asyncRoutes);

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: {}, // 从存储中读取角色  对象需要序列化
    flag: '',
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由】
    resultAsyncRoutes: [],
    // 用户最终需要展示全部路由
    resultAllRoutes: []
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
    // console.log('SET_ROLE',role)
    state.role = role
  },
  SET_FLAG: (state, value) => {
    state.flag = value
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES(state, asyncRoutes) {
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes)
    asyncRoutes.forEach((item) => router.options.routes.push(item))
    router.addRoutes(asyncRoutes)
  }
}
// 定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    return routes.indexOf(item.name) !== -1
  })
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    console.log('store_login', username, password)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response.result
        console.log('登录请求11', response)
        // 1.获取并存储token
        const token = data.token
        commit('SET_TOKEN', token)
        setToken(token)
        // 获取用户信息
        const name = data.username
        setUser(username, password, data.userId)
        commit('SET_NAME', name)
        resolve()// 表示 Promise 成功完成
      }).catch(error => {
        console.log('登录请求报错', error)
        reject(error)
      })
    })
  },
  loginByPhone({ commit, dispatch }, phoneInfo) {
    const { userphone, verifycode } = phoneInfo
    return new Promise((resolve, reject) => {
      loginByPhone(userphone, verifycode).then(response => {
        const data = response.result
        console.log('手机号登录11', response)
        // 1.获取并存储token
        const token = data.token
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()// 表示 Promise 成功完成
      }).catch(error => {
        console.log('手机号登录请求报错', error)
        reject(error)
      }
      )
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.result
        console.log('服务器返回的权限信息', response)
        var act_routs = []
        data.forEach(item => {
          act_routs.push(item.page)
        })
        // 计算异步路由并提交 mutation
        const computedRoutes = computedAsyncRoutes(asyncRoutes, act_routs)
        console.log('computedRoutes', computedRoutes)
        commit('SET_RESULTASYNCROUTES', computedRoutes)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  logout({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      localStorage.clear()
      commit('RESET_STATE')
      resolve()
    })
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

