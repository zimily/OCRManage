import request from '@/utils/request'

export function getProjectsById(id) {
  return request(
    {
      url: '/api/projects/' + id,
      method: 'get'
    }
  )
}
export function getProjects() {
  return request(
    {
      url: '/api/projects',
      method: 'get'
    }
  )
}
export function getSubprojects() {
  return request(
    {
      url: '/api/subprojects/1',
      method: 'get'
    }
  )
}

export function putSubprojects(id) {
  return request(
    {
      url: '/api/subprojects/1',
      method: 'put',
      params: {
        subprojectId: id
      }
    }
  )
}

export function deleteSubprojects(id) {
  return request(
    {
      url: '/api/subprojects/1',
      method: 'delete',
      params: {
        subprojectId: id
      }
    }
  )
}

// ------------------------------------后续删掉两个时间-------------------------------------------------
export function postSubprojects(data) {
  const { subprojectId, projectId, obj } = data
  console.log('subprojectId', subprojectId)
  console.log('projectId', projectId)
  console.log('obj', obj)
  const temp = {
    subprojectId: 112,
    projectId: 103,
    subprojectName: obj.subprojecttName,
    kanchaDirector: obj.kanchaDirector,
    shigongDirector: obj.shigongDirector,
    // jianduPeople: obj.jianduPeople,
    jiansheDirector: obj.jiansheDirector,
    area: obj.area,
    jianliDirector: obj.jianliDirector,
    technicalDisorder: obj.technicalDisorder,
    shejiDirector: obj.shejiDirector,
    startDate: '2025-05-01 00:00:00',
    finishDate: '2025-07-01 00:00:00'
    // subprojectId: 112,
    // projectId: 103,
    // subprojectName: '子项目5',
    // jiansheDirector: '建设主管5',
    // shigongDirector: '施工主管5',
    // jianliDirector: '监理主管5',
    // shejiDirector: '设计主管5',
    // kanchaDirector: '勘察主管5',
    // technicalDisorder: '技术问题5',
    // startDate: '2025-05-01 00:00:00',
    // finishDate: '2025-07-01 00:00:00',
    // area: '区域5'
  }
  return request(
    {
      url: '/api/subprojects',
      method: 'post',
      data: temp
    }
  )
}

export function getAllSubprojectsById(id) {
  return request(
    {
      url: '/api/subprojects/byProject/' + id,
      method: 'get'
    }
  )
}
