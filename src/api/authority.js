import request from '@/utils/request'
// 接口管理
export function getAllRoles(page, limit) {
  return request({
    url: `/role/getAllRoles?pageNum=${page}&pageSize=${limit}`,
    method: 'get'

  })
}

export function reqPermissionList() {
  return request({
    url: '/permission/getPermissionList',
    method: 'get'
  })
}

export function addRoleWithPermissions(roleName, permissions) {
  return request({
    url: `/role/addRoleWithPermissions?roleName=${roleName}&permissions=${permissions}`,
    method: 'post'
  })
}

export function deleteRoleById(id) {
  return request({
    url: `/role/deleteRoleById?roleId=${id}`,
    method: 'delete'
  })
}

export function getRoleById(id) {
  return request({
    url: `/role/getRoleById?roleId=${id}`,
    method: 'get'
  })
}
export function updateRole(roleId, permissions) {
  return request({
    url: `/role/updateRole?roleId=${roleId}&permissions=${permissions}`,
    method: 'put'
  })
}
export function searchRole(key) {
  return request({
    url: `/role/getRoleByNameFuzzy?keyword=${key}`,
    method: 'get'
  })
}

// 用户管理接口
export function getAllUser(pageNum, pageSize) {
  return request({
    url: `/user/getAllUserByOrder?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function getUserById(id) {
  return request({
    url: `/user/getUserById?id=${id}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data: data
  })
}

export function updateById(data) {
  return request({
    url: '/user/updateById',
    method: 'put',
    data: data
  })
}

export function deleteUserById(id) {
  return request({
    url: `/user/deleteUserById?id=${id}`,
    method: 'delete'
  })
}

export function searchUser(key) {
  return request({
    url: `/user/getUserByNameFuzzy?keyword=${key}`,
    method: 'get'
  })
}
