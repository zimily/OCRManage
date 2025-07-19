import { getAllRoles } from '@/api/authority'


const getDefaultState = () => {

  return {
      roles:[],
  }
}
const state = getDefaultState()
const mutations = {
    SET_ROLES:(state,roles)=>{
        state.roles=roles
    }
}

const actions = {
    getAllRoles({ commit, dispatch }){
        return new Promise((resolve,reject)=>{
            getAllRoles().then(response=>{
                commit('SET_ROLES', response.result)
                console.log('权限请求',response.result)
            })
        }).catch(error=>{
            reject(error)
        })
    }
 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

