import request from '@/utils/request'

export function getOcrData() {
  return request.get('/templates')
}

// 分页+模糊查询模板
export function getTemplates(pageNum, pageSize, keyword, reportType) {
  if (reportType === 0) {
    reportType = null
  }
  return request({
    url: '/templates/page/search',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      keyword: keyword,
      reportType: reportType
    }
  })
}

// 删除模板(级联删除所有项)
export function deleteTemplateById(templateId) {
  return request({
    url: `/templates/${templateId}`,
    method: 'delete'
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
// 批量保存图片,返回url集合
export function postImage(data) {
  return request({
    url: `/imgSave/batchSave`,
    method: 'post',
    data: data
  })
}
// 返回值为url与base64的键值对集合,一个url对应一个base64
export function getImage(data) {
  // console.log('getImgs的参数，', data, typeof data)
  return request({
    url: `/imgSave/getImgs`,
    method: 'post',
    data: data
  })
}
