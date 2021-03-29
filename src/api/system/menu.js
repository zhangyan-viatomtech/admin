import request from '@/utils/request'
import Cookies from "js-cookie";

// 查询菜单列表
export function listMenu(data) {
  return request({
    url: '/menu/selectMenu',
    method: 'get',
    params:data
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data,type) {
  return request({
    url: '/menu/addMenu',
    method: 'post',
    type,
    data: data
  })
}

// 修改菜单
export function updateMenu(data,type) {
  return request({
    url: '/menu/updateMenu',
    method: 'post',
    type,
    data: data
  })
}

// 删除菜单
export function delMenu(data,type) {
  return request({
    url: '/menu/deleteMenu',
    method: 'post',
    type,
    params:data
  })
}
