import request from '@/utils/request'

// 按条件分页进行查询资源接口
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 查询资源分类接口
export const getResourceCategorienns = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 删除资源接口
export const deleteResource = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 获取所有分配资源
export const getResourceList = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

// 保存、更改资源分类
export const saveOrUpdateResources = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 给角色分配资源
export const allocRoleResources = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}

// 获取当前角色拥有的资源列表接口
export const getRoleResources = roleId => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}

// 获取资源
export const getResourceById = id => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}
