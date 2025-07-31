const state = {
  projectList: [
    {
      id: '457875',
      projectName: '郑州中原保利心语项目',
      address: '郑州中原区',
      constructionUnit: '中建五局A公司甲分公司', // 施工单位
      buildUnit: '郑州煜盛房地产开发有限公司', // 建设单位
      supervisoryUnit: '中新华都国际工程咨询有限公司', // 监理单位
      designUnit: '河南省纺织建设设计院有限公司', // 设计单位
      surveyingUnit: '郑州中核岩土工程有限公司', // 勘察单位
      monitorUnit: '河南省XX有限公司', // 监督单位
      treeData: []
    }
  ],
  treeData: [
    {
      id: 1,
      label: '郑州中原保利心语项目',
      childList: [
        {
          id: 4,
          label: '保利心语佳苑1#楼',
          detailObj: {}
        }
      ]
    },
    {
      id: 2,
      label: '一级 2',
      childList: [
        {
          id: 5,
          label: '二级 2-1',
          detailObj: {}
        },
        {
          id: 6,
          label: '二级 2-2',
          detailObj: {}
        }
      ]
    },
    {
      id: 3,
      label: '一级 3',
      childList: [
        {
          id: 7,
          label: '二级 3-1',
          detailObj: {}
        },
        {
          id: 8,
          label: '二级 3-2',
          detailObj: {}
        }
      ]
    }
  ],
  detailObj: {
    unitProjectName: '保利心语佳苑1#楼', // 单位工程名称
    surveyingUnitPeople: '张三', // 勘察单位负责人
    constructionUnitPeople: '建工', // 施工单位负责人
    monitorUnitPeople: '监工', // 监督单位负责人
    buildUnitPeople: '建设单位负责人', // 单位负责人
    area: 10000, // 施工面积
    supervisoryUnitPeople: '监理单位负责人', // 监理单位负责人
    technologyPeople: '设计单位负责人', // 项目技术负责人
    designUnitPeople: '设计单位负责人'// 设计单位负责人
  }
}
const mutations = {
  initData(state) {
    for (let i = 0; i < state.treeData.length; i++) {
      state.treeData[i].detailObj = JSON.parse(JSON.stringify(state.detailObj))
    }
    for (let i = 0; i < state.projectList.length; i++) {
      state.projectList[i].treeData = JSON.parse(JSON.stringify(state.treeData))
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
