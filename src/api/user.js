import { request } from '@/utils/request'

export function login(data, opt) {
    return request.postForm('/oauth2/oauth2/token', data, opt)
}

export function getInfo(token) {
    return request.get('/user/s/user')
}

//店铺信息
export function getShopInfo() {
    return request.get('/shop/shopDetail')
}

export function logout() {
    return request.delete('/oauth2/token/logout?userType=SHOP')
}

export function verifyImg(data) {
    return request.post('/verify', data)
}
