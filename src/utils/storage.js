// 浏览器本地存储数据
/**
 * 1.localStorage 是 浏览器提供的原生 API，属于 Web Storage 的一部分。它通过 window 对象直接访问，无需额外引入或定义。
 */

export const setUser = (username, password) => {
  const user = {
    username: username,
    password: password // &#9888;️ 注意：存储密码存在安全风险
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

