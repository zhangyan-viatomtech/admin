import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import Cookies from "js-cookie";

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/index' })
      NProgress.done()
    } else {
      if (store.state.user.roles.length==0) {
        store.dispatch('GenerateRoutes').then(accessRoutes => {
          console.log('accessRoutes',accessRoutes)
          store.state.user.roles = Cookies.get('RolesId')
          // 根据roles权限生成可访问的路由表
          // router.addRoutes(accessRoutes) // 动态添加可访问路由表
          if(to.path == '/'){
            next({ path: '/index' })
          }else{
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          }
        }).catch(err=>{
          console.log('err2',err)
        })
        // 判断当前用户是否已拉取完user_info信息
        /*store.dispatch('GetInfo').then(() => {
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            console.log(accessRoutes)
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })*/
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
