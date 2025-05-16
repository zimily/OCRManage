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

export function postSubprojects(data) {
  const { subprojectId, obj } = data
  console.log(subprojectId)
  const temp = {
    subproject_id: subprojectId,
    subprojecttName: obj.subprojecttName,
    kanchaDirector: obj.kanchaDirector,
    shigongDirector: obj.shigongDirector,
    jianduPeople: obj.jianduPeople,
    jiansheDirector: obj.jiansheDirector,
    area: obj.area,
    jianliDirector: obj.jianliDirector,
    technicalDirector: obj.technicalDirector,
    shejiDirector: obj.shejiDirector
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
