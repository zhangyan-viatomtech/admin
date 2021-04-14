import request from '@/utils/request'

// 查询项目列表
export function getProjectVersions(data,type) {
  return request({
    url: '/project/getProjectVersions',
    method: 'post',
    data,
    type
  })
}

// 查询项目
export function getProjects(data) {
  return request({
    url: '/project/getProjects',
    method: 'get',
    data
  })
}

//改变项目版本有效状态
export function changeEffect(data) {
  return request({
    url: '/project/changeEffect',
    method: 'get',
    params:data
  })
}

//修改项目版本
export function addProjectVersion(data) {
  return request({
    url: '/project/addProjectVersion',
    method: 'post',
    data:data,
    type:'change2'
  })
}

//修改项目版本
export function updateProjectVersion(data) {
  return request({
    url: '/project/updateProjectVersion',
    method: 'post',
    data:data,
    type:'change2'
  })
}
