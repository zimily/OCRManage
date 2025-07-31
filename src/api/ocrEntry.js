import request from '@/utils/request'
import { getUser } from '@/utils/storage'

// 获取该用户的项目名称的列表
export function getProjectNameList(userId) {
  return request({
    url: '/ledger/projectNameList',
    method: 'get',
    params: {
      userId: userId
    }
  })
}
// 获取该用户的项目的单位工程的列表
export function getSubNameList(projectId) {
  return request({
    url: '/ledger/subprojectNameList',
    method: 'get',
    params: {
      projectId: projectId
    }
  })
}
// 根据项目id查询项目信息
export function postProjectInfo(projectId) {
  return request({
    url: '/ledger/projectInfo',
    method: 'post',
    params: {
      projectId: projectId
    }
  })
}
// 根据台账类型返回模板
export function getTemplate(reportType) {
  return request({
    url: '/ledger/Template',
    method: 'get',
    params: {
      reportType: reportType
    }
  })
}
// OCR分页查询
export function getTaiZhang(report_type, pageNum, pageSize, projectId, subprojectId) {
  return request({
    url: '/ledger/query-empty-testno',
    method: 'get',
    params: {
      reportType: report_type,
      pageNum: pageNum,
      pageSize: pageSize,
      projectId: projectId,
      subprojectId: subprojectId
    }
  })
}
// 根据台账类型获取需ocr的列名
export function getFields(report_type) {
  return request({
    url: 'http://172.31.0.191:8081/ocr/fields',
    method: 'get',
    params: {
      report_type: report_type
    }
  })
}
// 自动匹配模板并识别所需信息
export function autodetect(data) {
  return request({
    url: 'http://172.31.0.191:8081/ocr/autodetect',
    method: 'post',
    data: data
  })
}
// 提交指定模板的OCR任务
export function specifieddetect(data) {
  return request({
    url: 'http://172.31.0.191:8081/ocr/specifieddetect',
    method: 'post',
    data: data
  })
}
// 新增：轮询获取 autodetect 结果
export function pollAutodetect(taskId, callback, interval = 5000, timeout = 30000) {
  let elapsed = 0
  const poll = setInterval(async() => {
    try {
      const result = await getAutodetectStatus(taskId)
      if (result.status === 'SUCCESS' || result.status === 'FAILED') {
        clearInterval(poll)
        callback(null, result, result.status)
      } else if (elapsed >= timeout) {
        clearInterval(poll)
        callback(new Error('识别超时'), null, null)
      }
      elapsed += interval
    } catch (error) {
      clearInterval(poll)
      callback(error, null, null)
    }
  }, interval)
}

// 检查 autodetect 状态
function getAutodetectStatus(task_id) {
  return request({
    url: `http://172.31.0.191:8081/ocr/task/${task_id}`,
    method: 'get'
  })
}

// 获取提取的图片
export function getImageURL(filename) {
  const encodedFilename = encodeURIComponent(filename)
  // console.log('encodedFilename', encodedFilename, filename)
  return request({
    url: `http://172.31.0.191:8081/image/get/${encodedFilename}`,
    method: 'get'
  })
}

// OCR批量保存台账
export function postTemplate(data) {
  return request({
    url: '/ledger/batch-save',
    method: 'post',
    data: data
  })
}
// 完成OCR删除临时文件
export function postFinish() {
  return request({
    url: 'http://172.31.0.191:8081/ocr/finish',
    method: 'post'
  })
}

// 测试图片url
export function geTestURL() {
  return request({
    url: 'http://172.31.0.191:8081/image/get/1.png?username=test&userId=1',
    method: 'get'
  })
}
