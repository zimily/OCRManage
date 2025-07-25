import request from '@/utils/request'

export function search(inspectPart, current, size) {
  console.log(`这是请求过来的数据${inspectPart}  ${current}    ${size}`)
  return request({
    url: `/api/tasks/status5/fuzzy-search?current=${current}&size=${size}&inspectPart=${inspectPart}`,
    method: 'get'
  })
}
