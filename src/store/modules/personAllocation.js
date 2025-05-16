const state = {
  personList: [{
    name: '张三',
    role: '采集员',
    affiliation: '中建五局A公司甲分公司',
    projectName: '龙湖小区建设项目'
  }, {
    name: '贾鸣孜',
    role: '总工',
    affiliation: '中建五局A公司甲分公司',
    projectName: '龙湖小区建设项目'
  }, {
    name: '胡湖虎',
    role: '采集员',
    affiliation: '中建五局A公司甲分公司',
    projectName: '龙湖小区建设项目'
  }, {
    name: '赵迪',
    role: '采集员',
    affiliation: '中建五局A公司甲分公司',
    projectName: '碧云花园建设项目'
  }]
}
const mutations = {
  setPersonList(state) {
    const list = JSON.parse(JSON.stringify(state.personList))
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < list.length; j++) {
        state.personList.push(list[j])
      }
    }
  }
}
const actions = {

}
const getters = {

}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
