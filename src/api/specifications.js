import request from '@/utils/request'
//接口管理  验收规范
export function getAllSpecifications(page,limit) {
    return request({
      url: `acceptCode/list?pageNum=${page}&pageSize=${limit}`,
      method: 'get',
  
    })
  }
//获取每一个验收规范详细信息
  // export function getSpecificationsById(Id) {
  //   return request({
  //     url: `acceptCode/getById?inspectId=${Id}`,
  //     method: 'get',
  //   })
  // }
  export function getSpecificationsById(Id) {
    return request({
      url: `inspection-lot-template-item/inspectItemId?inspectItemId=${Id}`,
      method: 'get',
    })
  }