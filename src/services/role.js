import request from "@/utils/request"

// 获取用户接口
export const getRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

// 删除接口
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 添加/编辑角色接口
export const createOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 根据Id获取用户接口
export const getRolesById = id => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 获取所有角色
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 给用户分配角色
export const allocUserRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 查询用户角色
export const getUserRoles = userId => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
