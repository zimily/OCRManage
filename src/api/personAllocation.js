import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'
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
// 获取所有角色列表
export function getAllRolesNoPage() {
  // console.log(data)
  return request(
    {
      url: '/role/getAllRolesNoPage',
      method: 'get'
    }
  )
}
// 给人员分配项目
export function putDistribute(data) {
  // console.log(data)
  return request(
    {
      url: '/assign/distribute',
      method: 'put',
      data: data
    }
  )
}

// 对分配好的人员的条件分页查询
export function postSelectAssignment(data) {
  return request({
    url: '/assign/selectAssignment',
    method: 'post',
    data: data
  })
}
// 获取某个项目下所有的人员
export function getPersonInProject(projectId) {
  return request({
    url: '/assign/getPersonInProject',
    method: 'get',
    params: {
      projectId: projectId
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
// 获取管理员所在分公司下的分条件页查询
export function postPersonPage(data) {
  return request(
    {
      url: '/assign/getPersonPage',
      method: 'post',
      data: data
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
