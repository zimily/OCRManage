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
  const temp = JSON.stringify(data)
  console.log(typeof temp, temp)
  return request({
    url: '/assign/selectAssignment',
    method: 'get',
    body: temp
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
// 获取管理员所在分公司下的分条件页查询
export function getPersonPage() {
  const data = {
    opId: 1,
    page: 1,
    pageSize: 10
  }
  return request(
    {
      url: '/assign/getPersonPage',
      method: 'get',
      params: {
        data: data
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

// 展示用户细节
export function getAssignDetailById(id) {
  return request(
    {
      url: '/assign/detail',
      method: 'get',
      params: {
        id: id
      }
    }
  )
}
