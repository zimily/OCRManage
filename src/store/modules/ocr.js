import { getOcrData } from '@/api/ocrTest'

const state = {
  tableData: [
    {
      // 表格数据
      imgUrl: 'https://pica.zhimg.com/v2-7b9592a5ef7d7e5b2c71bfa3eb3d79c2_r.jpg?source=1940ef5c',
      name: 'A公司-混凝土试块',
      templateNum: '混凝土试块',
      detailData: [
        {
          // 表格数据
          x1: 10,
          y1: 203,
          x2: 100,
          y2: 233,
          xiang: '黄金糕'
        },
        {
          // 表格数据
          x1: 200,
          y1: 203,
          x2: 250,
          y2: 233,
          xiang: '双皮奶'
        },
        {
          // 表格数据
          x1: 300,
          y1: 400,
          x2: 360,
          y2: 500,
          xiang: '双皮奶'
        }
      ],
      reportName: '钢筋焊接（工艺）检测报告',
      graphXY: { x1: 0, y1: 120, x2: 1100, y2: 1100 }
    },
    {
      imgUrl: 'https://pica.zhimg.com/v2-7b9592a5ef7d7e5b2c71bfa3eb3d79c2_r.jpg?source=1940ef5c',
      name: 'A公司-钢筋检测',
      templateNum: '钢筋原材',
      detailData: [
        {
          // 表格数据
          x1: 10,
          y1: 203,
          x2: 100,
          y2: 233,
          xiang: '黄金糕'
        },
        {
          // 表格数据
          x1: 200,
          y1: 203,
          x2: 250,
          y2: 233,
          xiang: '双皮奶'
        },
        {
          // 表格数据
          x1: 300,
          y1: 400,
          x2: 360,
          y2: 500,
          xiang: '双皮奶'
        }
      ],
      reportName: '钢筋焊接（工艺）检测报告',
      graphXY: { x1: 0, y1: 120, x2: 1100, y2: 1100 }
    },
    {
      imgUrl: 'https://pica.zhimg.com/v2-7b9592a5ef7d7e5b2c71bfa3eb3d79c2_r.jpg?source=1940ef5c',
      name: 'A公司-钢筋机械连接',
      templateNum: '钢筋机械连接',
      detailData: [
        {
          // 表格数据
          x1: 10,
          y1: 203,
          x2: 100,
          y2: 233,
          xiang: '黄金糕'
        },
        {
          // 表格数据
          x1: 200,
          y1: 203,
          x2: 250,
          y2: 233,
          xiang: '双皮奶'
        },
        {
          // 表格数据
          x1: 300,
          y1: 400,
          x2: 360,
          y2: 500,
          xiang: '双皮奶'
        }
      ],
      reportName: '钢筋焊接（工艺）检测报告',
      graphXY: { x1: 0, y1: 120, x2: 1100, y2: 1100 }
    }
  ],
  detailData: [
    {
      // 表格数据
      x1: 10,
      y1: 203,
      x2: 100,
      y2: 233,
      xiang: '黄金糕'
    },
    {
      // 表格数据
      x1: 200,
      y1: 203,
      x2: 250,
      y2: 233,
      xiang: '双皮奶'
    },
    {
      // 表格数据
      x1: 300,
      y1: 400,
      x2: 360,
      y2: 500,
      xiang: '双皮奶'
    }
  ],
  ledgerData: [{
    value: 1,
    label: '混凝土试块'
  }, {
    value: 2,
    label: '钢筋原材'
  }, {
    value: 3,
    label: '钢筋焊接'
  }, {
    value: 4,
    label: '钢筋机械连接'
  }]
}

const mutations = {
  // 删除文档模版
  deleteModel(state, index) {
    state.tableData.splice(index, 1)
  },
  // 删除文档里的记录
  deleteDetail(state, obj) { // obj: tableData下标，detailData下标
    state.tableData[obj[0]].detailData.splice(obj[1], 1)
  },
  // 保存文档模版细节
  saveDetail(state, obj) {
    console.log(obj)
    const { imgUrl, name, templateNum, detailData, reportName, graphXY, index } = obj
    if ((+index) !== -1) {
      state.tableData[index].imgUrl = imgUrl
      state.tableData[index].name = name
      state.tableData[index].templateNum = templateNum
      state.tableData[index].detailData = detailData
      state.tableData[index].reportName = reportName
      state.tableData[index].graphXY = graphXY
    } else {
      state.tableData.push({
        imgUrl,
        name,
        templateNum,
        detailData,
        reportName,
        graphXY
      })
    }
  }
}

const actions = {
  async getNewData() {
    const { result } = await getOcrData()
    for (let i = 0; i < result.length; i++) {
      state.tableData.push({
        name: result[i].companyName,
        templateNum: result[i].inspectId,
        detailData: JSON.parse(JSON.stringify(state.detailData))
      })
    }
    const arr = JSON.parse(JSON.stringify(state.tableData))
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < arr.length; j++) {
        state.tableData.push(arr[j])
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

