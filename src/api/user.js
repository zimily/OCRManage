import request from '@/utils/request'
// 接口管理
export function login(data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

// token刷新接口
export function refreshToken() {
  return request({
    url: '/token/getToken',
    method: 'get'
  })
}

export function getPermissionList(userId,token) {
  return request({
    url: `/user/getRoleNameByUserId?userId=${userId}&token=${token}`,
    method: 'get',
  })
}

export function getInfo(token) {
  return request({
    url: '/permission/getRolePermissionByToken',
    method: 'get',
    params: { token }
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

//发送手机号验证码
export function sendCode(phone){
  return request({
    url: `/login/sendSms?userPhone=${phone}`,
    method: 'post',
  })
}
//手机号+验证码 登录
export function loginByPhone(userPhone,code){
  return request({
    url: `/login/loginbyphone?userPhone=${userPhone}&code=${code}`,
    method: 'post',
  })
}
