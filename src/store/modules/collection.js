const state = {
    currentRowData:JSON.parse(localStorage.getItem('currentRowData')) || null // 当前选择项目行的数据采集
}
const mutations = {
    setCurrentRowData(state, data) {
        state.currentRowData = data;
         // 存入 localStorage
        localStorage.setItem('currentRowData', JSON.stringify(data));
    }
}

const actions = {
   
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

