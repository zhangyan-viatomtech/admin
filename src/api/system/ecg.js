import request from '@/utils/request'

// 查询心电分析卡列表
export function getService(query) {
  return request({
    url: '/service/getService',
    method: 'post',
    params: query
  })
}
// 查询心电分析卡类型列表
export function getServiceType(query) {
  return request({
    url: '/service/getServiceType',
    method: 'post',
    params: query
  })
}
//添加心电分析卡
export function createService(query) {
  return request({
    url: '/service/createService',
    method: 'post',
    type:'change',
    data: query
  })
}

//添加心电分析卡类型
export function createServiceType(query) {
  return request({
    url: '/service/createServiceType',
    method: 'post',
    type:'change',
    data: query
  })
}
