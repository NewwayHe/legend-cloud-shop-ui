import { asyncRoutes, constantRoutes } from '@/router'
import { menuAuthManage } from '@/api/ModuleSystem'
import Layout from '@/layout'
import ParentView from '@/components/ParentView'
import serviceConfig from '@/config'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some((role) => route.meta.roles.includes(role))
    } else {
        return true
    }
}

// 加载后台动态路由
export const loadMenus = (next, to) => {
    return menuAuthManage.userMenu({ type: 'left', parentId: -1 }).then((res) => {
        return res.data || []
    })
}

// 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (routers, isRewrite = false) => {
    const accessedRouters = routers.filter((router) => {
        router.meta = {}
        router.meta.text = router.label
        if (isRewrite && router.children) {
            router.children = filterChildren(router.children, router.meta)
        }
        if (router.component) {
            // Layout组件特殊处理
            if (router.component === 'layout') {
                router.component = Layout
            } else if (router.component === 'ParentView') {
                router.component = ParentView
            } else {
                const component = router.component
                router.component = loadView(component)
            }

            router.meta.title = router.name

            // router.name = router.path
            if (router.path.startsWith('/')) {
                router.name = router.path.slice(1)
            } else if (router.path.includes('/')) {
                let pathArr = router.path.split('/')
                router.name = pathArr[pathArr.length - 1]
            } else {
                router.name = router.path
            }
            router.meta.icon = router.icon
            //如果是隐藏菜单就不走keep-alive,左侧菜单走keep-alive
            router.meta.noCache = !router.hiddenFlag
            // router.meta.noCache = false//打开这个注释的话，就所有页面都采用keep-alive缓存
            router.hidden = !router.hiddenFlag
        }
        if (router.children && router.children.length) {
            router.children = filterAsyncRouter(router.children, isRewrite)
        }
        return true
    })
    return accessedRouters
}

function filterChildren(childrenMap) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView') {
                children = children.concat(getParentViewRoute(el.children, el.path, el.name))
                return
            }
            children.push(el)
            return
        }
        children = children.concat(el)
    })
    return children
}

function getParentViewRoute(childrenMap, parentPath = '', parentTitle = '') {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView') {
                if (el.children && el.children.length) {
                    children = children.concat(getParentViewRoute(el.children, parentPath + '/' + el.path, parentTitle + '  /  ' + el.name))
                    return
                }
                children.push(el)
                return
            }
        }
        el.path = parentPath + '/' + el.path
        el.name = `${parentTitle}  /   ${el.name}`
        children = children.concat(el)
    })
    return children
}

// export const loadMenus = (next, to) => {
//     return menuAuthManage.userMenu().then((res) => {
//         let routerList = []
//         let asyncRouter = []
//         if (res.code === 1) {
//             routerList = res.data || []
//             asyncRouter = filterAsyncRouter(routerList)
//             asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
//         }
//         return asyncRouter
//         // const asyncRouter = filterAsyncRouter(res)
//         // asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
//         // store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
//         //     router.addRoutes(asyncRouter) // 动态添加可访问路由表
//         //     next({ ...to, replace: true })
//         // })
//     })
// }
// export const filterAsyncRouter = (routers) => {
//     // 遍历后台传来的路由字符串，转换为组件对象
//     const accessedRouters = routers.filter((router) => {
//         if (router.component) {
//             // Layout组件特殊处理
//             if (router.component === 'layout') {
//                 router.component = Layout
//             } else {
//                 const component = router.component
//                 router.component = loadView(component)
//             }
//             router.meta = {}
//             router.meta.title = router.name
//             // router.name = router.path
//             if (router.path.startsWith('/')) {
//                 router.name = router.path.slice(1)
//             } else {
//                 router.name = router.path
//             }
//             router.meta.icon = router.icon
//             router.meta.noCache = !router.hiddenFlag
//             router.hidden = !router.hiddenFlag
//         }
//         if (router.children && router.children.length) {
//             router.children = filterAsyncRouter(router.children)
//         }
//         return true
//     })
//     return accessedRouters
// }

export const loadView = (view) => {
    // 路由懒加载
    return (resolve) => require([`@/views/${view}`], resolve)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
    const res = []
    routes.forEach((route) => {
        const tmp = { ...route }
        // if (hasPermission(roles, tmp)) {
        if (tmp.children) {
            tmp.children = filterAsyncRoutes(tmp.children)
        }
        res.push(tmp)
        // }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: [],
    accessedRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
    SET_ROUTESl: (state, routes) => {
        state.accessedRoutes = routes
    }
}

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(async (resolve) => {
            let accessedRoutes = []
            let sidebarRoutes = []
            if (serviceConfig.asyncRoutes) {
                // 本地路由
                accessedRoutes = asyncRoutes || []
                sidebarRoutes = asyncRoutes || []
            } else {
                // 后端动态路由
                const loadMenuList = await loadMenus()
                const sdata = JSON.parse(JSON.stringify(loadMenuList || []))
                const rdata = JSON.parse(JSON.stringify(loadMenuList || []))
                //侧边栏路由
                sidebarRoutes = filterAsyncRouter(sdata, false)
                //本地路由，添加到 vue-router
                accessedRoutes = filterAsyncRouter(rdata, true)
            }
            // console.log(sidebarRoutes)
            // console.log(accessedRoutes)
            commit('SET_ROUTES', sidebarRoutes)
            commit('SET_ROUTESl', accessedRoutes)
            resolve(accessedRoutes)
            //         let accessedRoutes = []
            //         if (serviceConfig.asyncRoutes) {
            //             // 本地路由
            //             accessedRoutes = asyncRoutes || []
            //         } else {
            //             // 后端动态路由
            //             const loadMenuList = await loadMenus()
            // console.log(loadMenuList)
            //             accessedRoutes = loadMenuList || asyncRoutes
            //         }

            //         commit('SET_ROUTES', accessedRoutes)
            //         resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
