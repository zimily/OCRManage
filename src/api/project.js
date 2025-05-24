import request from '@/utils/request'

// 根据项目ID获取项目详细信息
export function getProjectsById(id) {
  return request(
    {
      url: '/api/projects/' + id,
      method: 'get'
    }
  )
}
// 根据项目ID更新项目全部字段
export function putProjects(id, data) {
  return request(
    {
      url: '/api/projects/' + id,
      method: 'put',
      data: data
    }
  )
}
// 获取系统内所有项目基本信息
export function getProjects() {
  return request(
    {
      url: '/api/projects',
      method: 'get'
    }
  )
}
// 根据分项目ID获取分项目详细信息
export function getSubprojects(id) {
  return request(
    {
      url: '/api/subprojects/' + id,
      method: 'get'
    }
  )
}

// 根据分项目ID更新分项目全部字段
export function putSubprojects(id, data) {
  return request(
    {
      url: '/api/subprojects/' + id,
      method: 'put',
      params: {
        data: data
      }
    }
  )
}
// 根据分项目ID删除分项目
export function deleteSubprojects(id) {
  return request(
    {
      url: '/api/subprojects/' + id,
      method: 'delete',
      params: {
        subprojectId: id
      }
    }
  )
}

// ------------------------------------后续删掉两个时间-------------------------------------------------
// 创建一个新的分项目
export function postSubprojects(data) {
  // const { subprojectId, projectId, obj } = data
  // console.log('subprojectId', subprojectId)
  // console.log('projectId', projectId)
  // console.log('obj', obj)
  // const temp = {
  //   subprojectId: 112,
  //   projectId: 103,
  //   subprojectName: obj.subprojecttName,
  //   kanchaDirector: obj.kanchaDirector,
  //   shigongDirector: obj.shigongDirector,
  //   // jianduPeople: obj.jianduPeople,
  //   jiansheDirector: obj.jiansheDirector,
  //   area: obj.area,
  //   jianliDirector: obj.jianliDirector,
  //   technicalDisorder: obj.technicalDisorder,
  //   shejiDirector: obj.shejiDirector,
  //   startDate: '2025-05-01 00:00:00',
  //   finishDate: '2025-07-01 00:00:00'
  //   // subprojectId: 112,
  //   // projectId: 103,
  //   // subprojectName: '子项目5',
  //   // jiansheDirector: '建设主管5',
  //   // shigongDirector: '施工主管5',
  //   // jianliDirector: '监理主管5',
  //   // shejiDirector: '设计主管5',
  //   // kanchaDirector: '勘察主管5',
  //   // technicalDisorder: '技术问题5',
  //   // startDate: '2025-05-01 00:00:00',
  //   // finishDate: '2025-07-01 00:00:00',
  //   // area: '区域5'
  // }
  return request(
    {
      url: '/api/subprojects',
      method: 'post',
      data: data
    }
  )
}
// 根据项目ID查询该项目下的所有分项目
export function getAllSubprojectsById(id) {
  return request(
    {
      url: '/api/subprojects/byProject/' + id,
      method: 'get'
    }
  )
}
// 根据分部ID查询相关的验收规范信息
export function getInspectRulesById(id) {
  return request(
    {
      url: '/api/inspect-rules/by-fenbu/' + id,
      method: 'get'
    }
  )
}
