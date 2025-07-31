// 采集员的采集任务
import request from '@/utils/request'
//数据采集任务
export function getCompleted(current,size,token,) {
    return request({
      url: `/api/tasks/completed?current=${current}&size=${size}&token=${token}`,
      method: 'get',
    })
  }


export function getSearch(current,size,projectName,subprojectName,inspectPart,token) {
  return request({
    url: `/api/tasks/fuzzy-search?current=${current}&size=${size}&projectName=${projectName}&subprojectName=${subprojectName}&inspectPart=${inspectPart}&token=${token}`,
    method: 'get',
  })
}

export function getDetails(taskId, userId){
    return request({
        url: `/api/tasks/${taskId}/user/${userId}/unfinished-items-details`,
        method: 'get',
    });
};

export function getCapacity(taskId) {
  return request({
    url: `/api/task-inspect-batch-volumes/task/${taskId}`,
    method: 'get',
  })
}

//已完成的台账信息
export function getFinishedList(reportType,pageNum, pageSize,subprojectId) {
  return request({
    url: `/ledger/query-exist-testno?reportType=${reportType}&pageNum=${pageNum}&pageSize=${pageSize}&subprojectId=${subprojectId}`,
    method: 'get',
  })
}


//提交数据
export function submitData(data) {
  return request({
    url: '/api/receive/receiveData  ',
    method: 'post',
    data
  })
}