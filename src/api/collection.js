import request from '@/utils/request'

// 获取所有项目的采集状态
export function getAllAtatus(data) {
    return request({
      url: `/status/getByUserId`,
      method: 'post',
      data
    })
  }
  
// 获取所有项目的采集状态
export function getAssignData(id) {
    return request({
      url: `/status/getLastFloorTaskItemBytaskId?taskId=${id}`,
      method: 'get',
    })
  }
  
//获取所有采集员的角色
export function getAllCollector() {
    return request({
      url: '/status/getCaijiRole',
      method: 'post',
    })
  }

//任务分发
export function distribution(data) {
  return request({
    url: '/status/TaskDistribution',
    method: 'post',
    data
  })
}

// 详情页面
// 获取所有验收项目  任务详情
export function getTaskDetailData(taskId) {
  return request({
    url: `/status/getTaskDetailWithBatchAndItems?taskId=${taskId}`,
    method: 'get',
  })
}

//获取采集的数据
export function getCollectData(data){
    return request({
      url: '/status/getTaskDataTableContent',
      method: 'post',
      data
    })
}

//项目审核
export function verify(data){
    return request({
      url: '/status/checkTaskItemStatus',
      method: 'post',
      data
    })
}
