import request from '@/utils/request'


export function getRawMaterial(data) {
    return request({
      url: '/steelMaterialLedger/pageQuery',
      method: 'post',
      data: data
    })
  }