import request from '@/utils/request'
//接口管理  验收规范
export function getAllSpecifications(page,limit) {
    return request({
      url: `api/inspect-rules/with-type-fenxiang/page?current=${page}&size=${limit}`,
      method: 'get',
  
    })
  }
//获取每一个分项的所有验收细则
  export function getSpecificationsById(inspectId) {
    // console.log("inspectId 的数据类型:", typeof inspectId); // 打印数据类型
    // console.log("inspectId 的值:", inspectId); // 打印实际值
    return request({
      url: `inspection-lot-template-item/full-info/${inspectId}`,
      method: 'get',
    })
  }

  //获取所有验收类别
  export function getAllInspectType(){
    return request({
      url: 'inspection-lot-template-item/types',
      method: 'get',
    })
  }

  //根据类别和验收依据 获取已有验收规范的信息
  export function getBaseRule(inspectTypeId){
    return request({
      url: `inspection-lot-template-item/rules-by-type/${inspectTypeId}`,
      method: 'get',
    })
  }

  //编辑修改验收项目细则
  export function updateInspectDetil(data){
    return request({
      url: 'inspection-lot-template-item/batch-update',
      method: 'put',
      data
    })
  }

  //新建验收项目细则
  export function newInspectDetil(inspectTypeId,yanshouRule,baseRule,data){
     return request({
      url: `inspection-lot-template-item/batch-add-items?inspectTypeId=${inspectTypeId}&yanshouRule=${yanshouRule}&baseRule=${baseRule}`,
      method: 'post',
      data
    })
  }

   //新建验收项目细则
   export function newInspectDetil1(inspectTypeId,yanshouRule,data){
    return request({
     url: `inspection-lot-template-item/create-rule-and-items?inspectTypeId=${inspectTypeId}&yanshouRule=${yanshouRule}`,
     method: 'post',
     data
   })
 }