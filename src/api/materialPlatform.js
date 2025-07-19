import request from '@/utils/request_mp.js'
export function getAccessToken() {
  return request({
    url: '/material-api/ejc-idm-web/auth/getAccessToken?appId=1836595908945981442&secret=MTgzNjU5NTkwODk0NTk4MTQ0Mg==',
    method: 'get'
  })

}
export function getMaterialPlatformData(pageNumber, pageSize, projectName, beginTime, endTime, materialType, materialName, spec) {
  return request({
    // url: `/cscec5b-wzxt-web/openapi/checkDetail/queryDetailList?pageNumber=${pageNumber}&pageSize=${pageSize}&projectName=${projectName}&beginTime=${beginTime}&endTime=${endTime}&materialType=${materialType}&materialName=${materialName}&spec=${spec}`,
    // url: `/material-api/cscec5b-wzxt-web/openapi/checkDetail/queryDetailList?pageNumber=${1}&pageSize=${10}&projectName=${"润雅苑"}`,
    url: `/material-api/cscec5b-wzxt-web/openapi/checkDetail/queryDetailList?pageNumber=${pageNumber}&pageSize=${pageSize}&projectName=${projectName}`,
    method: 'get'
  })
}