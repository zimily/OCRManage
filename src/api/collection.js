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
      url: `/status/getInspectItemBytaskId?taskId=${id}`,
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

// 获取任务详情
export function getTaskDetailData(taskId) {
  return request({
    url: `/status/getTaskDetailWithBatchAndItems?taskId=${taskId}`,
    method: 'get',
  })
}
