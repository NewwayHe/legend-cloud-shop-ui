import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import ModuleGoods from './ModuleGoods' // 商品管理
import ModuleSystem from './ModuleSystem' // 系统设置
import ModuleUser from './ModuleUser' // 用户管理
import ModuleData from './ModuleData' // 数据管理
import ModuleOperate from './ModuleOperate' // 运营模块
import ModuleMarketing from './ModuleMarketing' // 运营模块
import ModulePerson from './ModulePerson' // 个人信息
import ModuleFinance from './ModuleFinance' // 个人信息
// import ModuleHelp from './ModuleHelp' // 帮助中心

import ModuleCommon from './ModuleCommon' // 公共模块

/**
 * Note: // 一般侧边栏有两种形式即：submenu 和 直接 el-menu-item。 一个是嵌套子菜单，另一个则是直接一个链接。当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *      // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *      // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   // (默认 false),当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 重定向地址，在面包屑中点击会重定向去的地址。当设置 'noRedirect' 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
        roles: ['admin','editor']     // 设置该路由进入的权限，支持多个权限叠加。它下面所以的子路由都会继承这个权限
        title: 'title'                // 设置该路由在侧边栏和面包屑中展示的名字
        icon: 'svg-name'              // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
        noCache: true                 // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        breadcrumb: false             //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
        activeMenu: '/example/list'   // 当路由设置了该属性，则会高亮相对应的侧边栏。这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list。点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
        affix: true                   // 若果设置为true，它则会固定在tags-view中(默认 false)
    }
    children: [{
      path: 'index',
      component: ()=>import('permission/index'),
      name: 'permission',
      meta: {
        title: 'permission',
        icon: 'lock', //图标
        roles: ['editor'],           //或者你可以给每一个子路由设置自己的权限
        noCache: true                // 不会被 <keep-alive> 缓存
      }
    }]
 */

/**
 * 这里的路由分为两种，constantRoutes 和 asyncRoutes。
 * constantRoutes： 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。
 * asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面。
 */
export const constantRoutes = [
    ...ModuleCommon, // 公共模块
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: {
                    title: '首页',
                    icon: 'shouye',
                    text:'首页'
                }
            }
        ]
    },
    {
        path: '/excelCenter',
        component: Layout,
        hidden: true,
        children:[
            { 
                path: 'excelCenter',
                component: () => import('@/views/excelCenter'),
                hidden: true,
                name:'excelCenter',
                meta: {
                    title: '文件导出中心',
                    // icon: 'shouye'
                }
            }
        ]
    },

    /*
     * 注意事项:如果这里有一个需要非常注意的地方就是 404 页面一定要最后加载，如果放在 constantRoutes 一同声明了 404 ，后面的所有页面都会被拦截到404
     */
    // {
    //     path: '/404',
    //     component: () => import('@/views/404'),
    //     hidden: true
    // }
]
/**
 * 这里的路由分为两种，constantRoutes 和 asyncRoutes。
 * constantRoutes： 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。
 * asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面。
 */
export const asyncRoutes = [
    ...ModuleData, // 数据管理
    ...ModuleGoods, // 商品管理
    ...ModuleMarketing, // 营销管理
    // ...ModuleStore, // 商城管理
    ...ModuleSystem, // 系统设置
    ...ModuleUser, // 用户管理
    ...ModuleOperate, // 运营模块
    ...ModulePerson, // 个人信息
    ...ModuleFinance, // 账单管理
    // {
    //     path: '*',
    //     redirect: '/404',
    //     hidden: true
    // }
]

const createRouter = () =>
    new Router({
        // mode: 'history', //可以选择两种方式：browserHistory 和 hashHistory。默认使用的是 hashHistory ，所以如果你的 url 里有 #，想去掉的话，需要切换为 browserHistory
        scrollBehavior: () => ({
            y: 0
        }),
        routes: constantRoutes
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
