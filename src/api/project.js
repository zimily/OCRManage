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
      data: data
    }
  )
}
// 根据分项目ID删除分项目
export function deleteSubprojects(id) {
  return request(
    {
      url: '/api/subprojects/' + id,
      method: 'delete'
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
// 根据分项目ID获取该分项目下的所有检验批信息
export function getTasksBySubprojectId(id) {
  return request(
    {
      url: `/api/subprojects/${id}/tasks`,
      method: 'get'
    }
  )
}

// 修改分项目，同时创建验收依据和检验批
export function postSubAndTasks(data) {
  return request(
    {
      url: `/api/subprojects/batch-create`,
      method: 'post',
      data: data
    }
  )
}
// 获取一个在系统中未被使用过的分项目ID
export function getNewSubprojectId(projectId) {
  return request(
    {
      url: `/api/subprojects/unused-id/${projectId}`,
      method: 'get'
    }
  )
}
// 根据分项目ID获取该分项目的所有验收规范
export function getYanSouRulesById(projectId) {
  return request(
    {
      url: `/api/subprojects/${projectId}/inspect-rules`,
      method: 'get'
    }
  )
}
// 获取可以用的验收规范
export function getYanShouRules() {
  return request(
    {
      url: `/api/inspect-rules/getInspectRules`,
      method: 'get'
    }
  )
}
