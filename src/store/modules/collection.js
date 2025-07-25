const state = {
    currentRowData:JSON.parse(localStorage.getItem('currentRowData')) || null, // 当前选择项目行的数据采集
    dataEntryRow:JSON.parse(localStorage.getItem('dataEntryRow')) || null,
}
const mutations = {
    setCurrentRowData(state, data) { 
        state.currentRowData = data;
         // 存入 localStorage
        localStorage.setItem('currentRowData', JSON.stringify(data));
    },
    setDataEntryRow(state, data){
      state.dataEntryRow = data;
      localStorage.setItem('dataEntryRow', JSON.stringify(data));
    }
}

const actions = {
  setCurrentRowData({ commit }, data) {
    commit('setCurrentRowData', data);
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

