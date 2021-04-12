import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView';

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/system/user'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/list',
        component: (resolve) => require(['@/views/system/user'], resolve),
        name: 'User',
        meta: { title: '用户管理' }
      },
      {
        path: '/ECGAnalysislist',
        component: (resolve) => require(['@/views/system/user/ECGAnalysis'], resolve),
        name: 'ECGAnalysislist',
        meta: { title: '心电分析服务列表' }
      },
    ]
  },
  {
    path: '/ecg',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/type',
        component: (resolve) => require(['@/views/system/ECGmenu/ECGAnalysisType'], resolve),
        name: 'ecgtype',
        meta: { title: '心电分析卡类型' }
      },
      {
        path: '/card',
        component: (resolve) => require(['@/views/system/ECGmenu/ECGAnalysisCard'], resolve),
        name: 'ecgcard',
        meta: { title: '心电分析卡' }
      },
    ]
  },
  {
    path: '/edition',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/edition/index',
        component: (resolve) => require(['@/views/system/edition/index'], resolve),
        name: 'edition',
        meta: { title: '版本管理' }
      },
    ]
  },
  {
    path: '/system',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/role',
        component: (resolve) => require(['@/views/system/role'], resolve),
        name: 'Role',
        meta: { title: '角色管理' }
      },
      {
        path: '/menu',
        component: (resolve) => require(['@/views/system/menu'], resolve),
        name: 'Menu',
        meta: { title: '菜单管理' }
      },
      {
        path: '/userinfo',
        component: (resolve) => require(['@/views/system/userinfo/index'], resolve),
        name: 'userinfo',
        meta: { title: '后台用户' }
      }
    ]
  },
  {
    path: '/password',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/password',
        component: (resolve) => require(['@/views/system/password'], resolve),
        name: 'password',
        meta: { title: '修改密码' }
      },
    ]
  }
]

export default new Router({
  mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
