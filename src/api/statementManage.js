import request from '@/utils/request'

export function search(inspectPart, current, size, subprojectName) {
  console.log(`这是请求过来的数据${inspectPart}  ${current}    ${size}`)
  return request({
    url: `/api/tasks/status5/fuzzy-search?current=${current}&size=${size}&inspectPart=${inspectPart}&subprojectName=${subprojectName}`,
    method: 'get'
  })
}

//隐蔽验收记录
export function search2(current, size, inspectPart, subprojectName) {
  return request({
    url:`/api/tasks/status5/rebar-installation/fuzzy-search?current=${current}&size=${size}&inspectPart=${inspectPart}&subprojectName=${subprojectName}`,
    method: 'get'
  })
}
