import request from '@/utils/request'

export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    // url:`/boss/menu/getEditMenuInfo?id=${id}`
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

// 添加新菜单接口
export const createOrupdateMenu = data => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 获取所有菜单
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 删除
export const deleteMenu = id => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

// 分配菜单根据分页 获取所有菜单并按层级展示
export const getMenuNodeList = data => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

// 给角色分配菜单
export const allocRoleMenus = data => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}

// 获取角色拥有的菜单列表
export const getRolesMenus = roleId => {
  return request({
    method: 'GET',
    // url: `/boss/menu/getRoleMenus/${roleId}`
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}
