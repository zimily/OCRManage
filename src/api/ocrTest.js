import request from '@/utils/request'

export function getOcrData() {
  return request.get('/templates')
}

// 分页+模糊查询模板
export function getTemplates(pageNum, pageSize, keyword) {
  return request({
    url: '/templates/page/search',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      keyword: keyword
    }
  })
}

// 删除模板(级联删除所有项)
export function deleteTemplateById(templateId, data) {
  return request({
    url: `/templates/${templateId}`,
    method: 'put',
    data: data
  })
}

// 创建模板(含初始项)
export function postTemplates(data) {
  return request({
    url: `/templates`,
    method: 'post',
    data: data
  })
}
// 获取模板详情(含所有项)
export function getTemplateById(templateId) {
  return request({
    url: `/templates/${templateId}`,
    method: 'get'
  })
}

// 更新模板基本信息
export function putTemplateById(templateId, data) {
  return request({
    url: `/templates/${templateId}`,
    method: 'put',
    data: data
  })
}

