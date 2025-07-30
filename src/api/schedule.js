import request from '@/utils/request'

// 获取检验批计划
export function getInspectPlan(projectId, subprojectId) {
  return request(
    {
      url: `/api/inspectPlan`,
      method: 'get',
      params: {
        projectId: projectId,
        subprojectId: subprojectId
      }
    }
  )
}

// 更新检验批计划
export function postInspectPlan(data) {
  return request(
    {
      url: `/api/inspectPlan`,
      method: 'post',
      data: data
    }
  )
}

// 导入检验批计划
export function importInspectPlan(projectId, subprojectId, data) {
  return request(
    {
      url: `/api/inspectPlan/import`,
      method: 'post',
      params: {
        projectId: projectId,
        subprojectId: subprojectId
      },
      data: data
    }
  )
}
