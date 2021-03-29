import request from '@/utils/request'

// 登录方法
export function login(phone, password, code, uuid) {
  const data = {
    phone,
    password,
  }
  return request({
    url: '/login',

    method: 'post',
    params: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
//检测手机号码是否已经注册
export function checkPhoneExist(phone) {
  return request({
    url: '/checkPhoneExist',

    method: 'post',
    params: {phone}
  })
}

//注册
export function register(phone) {
  return request({
    url: '/register',

    method: 'post',
    params: {phone}
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}
