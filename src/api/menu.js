import request from '@/utils/request'
import Cookies from "js-cookie";
// 获取路由
export const getRouters = () => {
  return request({
    url: '/healthRole/getAllOperation',
    method: 'get',
    params:{
      roleId:Cookies.get("RolesId")
    }
  })
}
