import request from '@/utils/request'
//接口管理  验收规范
export function getAllSpecifications(page,limit) {
    return request({
      url: `acceptCode/list?pageNum=${page}&pageSize=${limit}`,
      method: 'get',
  
    })
  }

  export function getSpecificationsById(Id) {
    return request({
      url: `acceptCode/getById?inspectId=${Id}`,
      method: 'get',
    })
  }
