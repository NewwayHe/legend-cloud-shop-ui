import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { test } from '@/utils/utils.js'

const ERROR404 = () => import('@/views/404')
NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

const whiteList = [
    '/login',
    '/register',
    '/userHelpCenter',
    '/userMessage',
    '/userMessageDetail',
    '/forgetPwd',
    '/shopMoveIn',
    '/staffLogin',
    '/agreeMent'
] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            if (!test.isEmpty(store.getters.userInfo)) {
                //增加判断当前登录用户商家状态是否是审核通过。没有通过只能访问入住页面。
                if (store.getters.shopStatus != 1 || !store.getters.shopInfo.id) {
                    if (to.path === '/shopMoveIn') {
                        next()
                    } else if (whiteList.indexOf(to.path) !== -1) {
                        next()
                    } else {
                        next({
                            path: '/shopMoveIn'
                        })
                    }
                    NProgress.done()
                }else {
                    if(to.matched.length == 0) {        //没有匹配到
                        Message({
                            message: '当前操作权限不足，请联系管理员！',
                            type: 'error'
                        })
                    }else {
                        next()
                    }
                }
                
            } else {
                try {
                    await store.dispatch('user/getInfo')
                    await store.dispatch('user/getShopStatus')
                    store.dispatch('user/getMsgInfo')
                    const getShopInfo = await store.dispatch('user/getShopInfo')
                    if(!getShopInfo?.data?.shopNewBieStatus){
                        store.dispatch('app/setGuide', true)
                    }
                    const accessRoutes = await store.dispatch('permission/generateRoutes')
                    accessRoutes.push({ path: '*', component: ERROR404, hidden: true })
                    router.addRoutes(accessRoutes)
                    next({
                        ...to,
                        replace: true
                    })
                } catch (error) {
                    console.log(error)
                    await store.dispatch('user/resetToken')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
