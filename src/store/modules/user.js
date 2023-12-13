import { login, logout, getInfo, getShopInfo } from '@/api/user'
import { storeManage, shopMoveIn, messageApi } from '@/api/ModuleCommon'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { object, debounce } from '@/utils/utils.js'

const getDefaultState = () => {
    return {
        token: getToken(),
        userInfo: {}, // 用户信息
        name: '',
        avatar: '',
        roles: [],
        shopStatus: null, //商家入住状态
        shopInfo: {}, // 商家信息
        repeatVerify: {}, //二次校验参数
        messageInfo: {
            //未读消息信息
            count: 0
        }
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_SHOPSTATUS: (state, status) => {
        state.shopStatus = status
    },
    CLEAR_TOKEN: (state, token) => {
        state.token = ''
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = object.deepClone(userInfo)
    },

    // 设置商家信息
    SET_SHOPINFO: (state, shopInfo) => {
        state.shopInfo = object.deepClone(shopInfo)
    },

    SET_REPEATVERIFY: (state, info) => {
        state.repeatVerify = info
    },

    SET_MSGINFO: (state, info) => {
        state.messageInfo = info
    }
}

const actions = {
    // user login
    //userType 用户类型 true 员工登录  false 商家登录
    login({ state, commit }, options) {
        return new Promise((resolve, reject) => {
            const loginParams = {
                grant_type: 'legendshop',
                scope: 'server',
                user_type: 'SHOP'
            }
            // 增加二次校验请求头
            const { captchaType = '', token = '', pointJson = '' } = state.repeatVerify
            login({ ...loginParams, ...options.userInfo }, { addHeader: { grantType: 'legendshop', captchaType, code: options.code } })
                .then((response) => {
                    const { access_token } = response
                    commit('SET_TOKEN', access_token)
                    setToken(access_token)
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    getShopStatus({ commit, state }) {
        return new Promise((resolve, reject) => {
            shopMoveIn
                .openShopStatus()
                .then((response) => {
                    if (response.code == 1) {
                        commit('SET_SHOPSTATUS', response.data)
                    } else {
                        commit('SET_SHOPSTATUS', 1)
                    }
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    // 店铺信息
    getShopInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getShopInfo()
                .then((response) => {
                    if (response.code) {
                        commit('SET_SHOPINFO', response.data || {})
                        resolve(response)
                    } else {
                        reject()
                    }
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
                .then((response) => {
                    if (response.code && response.data) {
                        // commit('SET_ROLES', ['admin'])
                        // commit('SET_NAME', '李总')
                        // commit('SET_AVATAR', '45454')
                        commit('SET_USERINFO', response.data)
                        resolve({ roles: [1, 2] })
                    } else {
                        reject()
                    }
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    /* 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
		注意：一、debounce方法如果写在getSystemConfig()的话，Promise resolve()出来的值会为空(如果外面同时执行两次getSystemConfig的话，它会同时执行两次Promise从而resolve一个空值出来)
			 二、debounce方法如果写在Promise和getSystemConfig()之间，防抖会失效
			 三、debounce方法如果写在Promise里，但不是另外开一个__私密方法的话，防抖会失效
	 */
    getSystemConfig({ commit, state }) {
        return new Promise((resolve, reject) => {
            actions.__systemConfig(commit, state, resolve, reject)
        })
    },
    __systemConfig: debounce(function (commit, state, resolve, reject) {
        storeManage
            .systemConfig()
            .then((response) => {
                if (response.code && response.data) {
                    localStorage.setItem('systemConfig', JSON.stringify(response.data))
                    // console.log('SYSTEMCONFIG:', JSON.parse(localStorage.getItem('systemConfig')));
                    resolve(response.data)
                } else {
                    reject(response)
                }
            })
            .catch((error) => {
                reject(error)
                // 备注：如果这里不写finally，则外面调用的getSystemConfig就没有finally方法
            })
            .finally(() => {})
    }),

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    removeToken() // must remove  token  first
                    resetRouter()
                    commit('RESET_STATE')
                    commit('CLEAR_TOKEN')
                    commit('app/SET_GUIDE', false, { root: true })
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    },

    // 请求登录token之前需要使用captcha/check的参数
    saveRepeatVerify({ commit }, info) {
        commit('SET_REPEATVERIFY', info)
    },

    // 请求未读消息数
    getMsgInfo({ commit }) {
        return new Promise((resolve, reject) => {
            messageApi
                .getUnread()
                .then((response) => {
                    console.log('消息数--', response)
                    if (response.code == 1) {
                        commit('SET_MSGINFO', { count: response.data })
                    } else {
                        commit('SET_MSGINFO', { count: 0 })
                    }
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
