import request from '@/utils/request'
import axios from '_axios@0.21.0@axios'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/healthRole/getAllRole',
    method: 'get',
    data: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/healthRole/addRole',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {

  /*return request({
    url: '/healthRole/changeRoleOperation',
    header:{
      'Content-Type':'application/json'
    },
    method: 'post',
    data: data
  })*/
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/healthRole/deleteRole',
    method: 'delete',
    data:{
      roleId
    }
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/system/role/export',
    method: 'get',
    params: query
  })
}
