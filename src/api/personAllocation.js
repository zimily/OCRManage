import request from '@/utils/request'
// 人员分配接口

// 跟据assignmentId修改信息
export function UpdateAssignment(data) {
  return request(
    {
      url: '/assign/updateAssignment',
      method: 'put',
      params: {
        data: data
      }
    }
  )
}

// 给人员分配项目
export function putDistribute(data) {
  return request(
    {
      url: '/assign/distribute',
      method: 'put',
      params: {
        data: data
      }
    }
  )
}

// 对分配好的人员的条件分页查询
export function getSelectAssignment(data) {
  return request({
    url: '/assign/selectAssignment',
    method: 'get',
    params: {
      data: data
    }
  })
}

// 获取项目列表
export function getProject() {
  return request.get('/assign/getProject')
}

//  获取人员列表
export function getPerson(id) {
  return request(
    {
      url: '/assign/getPerson',
      method: 'get',
      params: {
        opId: id
      }
    }
  )
}

// 跟据assignmentId删除信息
export function deleteAssignment(id) {
  return request(
    {
      url: '/assign/deleteAssignment',
      method: 'delete',
      params: {
        assignmentId: id
      }
    }
  )
}
