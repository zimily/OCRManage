// 浏览器本地存储数据
/**
 * 1.localStorage 是 浏览器提供的原生 API，属于 Web Storage 的一部分。它通过 window 对象直接访问，无需额外引入或定义。
 */

export const setUser = (username, id) => {
  const user = {
    username: username,
    userId: id
  }
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
  const userJson = localStorage.getItem('user')
  return userJson ? JSON.parse(userJson) : null
}

export const removeUser = () => {
  localStorage.removeItem('user')
}

export const setUserId = (id) => {
  localStorage.setItem('userId', id)
}

export const getUserId = () => {
  const id = localStorage.getItem('userId')
  return id ||null
}

export const removeUserId = () => {
  localStorage.removeItem('userId')
}

export const setUserTypeId = (id) => {
  localStorage.setItem('userTypeId', id)
}

export const getUserTypeId = () => {
  const id = localStorage.getItem('userTypeId')
  return id || null
}

export const removeUserTypeId = () => {
  localStorage.removeItem('userTypeId')
}