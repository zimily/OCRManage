import request from '@/utils/request'

// 获取不同种类台账数据
export function getRawMaterial(data) {
  return request({
    url: '/steelMaterialLedger/pageQuery',
    method: 'post',
    data: data
  })
}

export function getConnection(data) {
  return request({
    url: '/mechanicalConnectLedger/pageQuery',
    method: 'post',
    data: data
  })
}

export function getWeld(pageNum, pageSize, userid, projectName, subProjectName, usePart) {
  return request({
    url: `/weldTable/page?pageNum=${pageNum}&pageSize=${pageSize}&userid=${userid}&projectName=${projectName}&subProjectName=${subProjectName}&usePart=${usePart}`,
    method: 'get'
  })
}

export function getBeton(pageNum, pageSize, userid, projectName, subProjectName, usePart) {
  return request({
    url: `/concreteTable/page?pageNum=${pageNum}&pageSize=${pageSize}&userid=${userid}&projectName=${projectName}&subProjectName=${subProjectName}&usePart=${usePart}`,
    method: 'get'
  })
}

// 删除台账
export function deleteRaw(dataId) {
  return request({
    url: `/steelMaterialLedger/deleteById/${dataId}`,
    method: 'delete'
  })
}

export function deleteConnect(dataId) {
  return request({
    url: `/mechanicalConnectLedger/deleteById/${dataId}`,
    method: 'delete'
  })
}

export function deleteWeld(dataId) {
  return request({
    url: `/weldTable/deleteWeldTableById/?dataId=${dataId}`,
    method: 'delete'
  })
}

export function deleteBeton(dataId) {
  return request({
    url: `/concreteTable/deleteConcreteTableById/?dataId=${dataId}`,
    method: 'delete'
  })
}

// 台账录入页面接口
export function getAllProjectName(userId) {
  return request({
    url: `/ledger/projectNameList?userId=${userId}`,
    method: 'get'
  })
}

export function getAllSubrojectName(projectId) {
  return request({
    url: `/ledger/subprojectNameList?projectId=${projectId}`,
    method: 'get'
  })
}

export function getFieldName(reportType) {
  return request({
    url: `/ledger/fields?reportType=${reportType}`,
    method: 'get'
  })
}

export function getFormData(reportType, id) {
  return request({
    url: `/ledger/form?reportType=${reportType}&id=${id}`,
    method: 'get'
  })
}

export function getProjectInfo(projectId) {
  return request({
    url: `/ledger/projectInfo?projectId=${projectId}`,
    method: 'post'
  })
}

//台账数据保存
export function saveLedgerData(data) {
  return request({
    url: '/ledger/save',
    method: 'post',
    data: data
  })
}