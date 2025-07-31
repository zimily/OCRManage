import Cookies from 'js-cookie'
//在cookie中保存token
const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

//物资平台的token
const MaterialPlatformTokenKey = 'material_platform_token'

export function getMaterialPlatformToken() {
  return Cookies.get(MaterialPlatformTokenKey)
}

export function setMaterialPlatformToken(token) {
  return Cookies.set(MaterialPlatformTokenKey, token)
}

export function removeMaterialPlatformToken() {
  return Cookies.remove(MaterialPlatformTokenKey)
}