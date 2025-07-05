import request from '@/utils/request'


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
