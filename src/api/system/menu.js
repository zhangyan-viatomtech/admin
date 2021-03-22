import request from '@/utils/request'
import Cookies from "js-cookie";

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/healthRole/getAllOperation',
    header:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    method: 'get',
    params:{
      roleId:Cookies.get("RolesId")
    }
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
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/healthRole/updateRole',
    header:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
