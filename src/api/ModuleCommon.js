import { request } from '@/utils/request'
const shopMoveIn = {
    // 判断店铺名是否存在
    isShopNameExist: (data) => request.get('/shop/s/shop/detail/isShopNameExist', data),

    // 保存店铺信息，等待审核
    saveShopInfo: (data) => request.post('/shop/s/shop/detail/save/shop/info', data),

    // 审核拒绝跳转到重新编辑页面
    editShop: (data) => request.get('/shop/s/shop/detail/edit/shop', data),

    // 商家登录后，调用此接口判断开店状态
    openShopStatus: (data) => request.get(`/shop/s/shop/detail/open/shop/status`, data),

    // 查找所有省份
    locationProvinces: (data) => request.get(`/basic/location/provinces`, data),

    // 根据省份id查找市
    locationCities: (id) => request.get(`/basic/location /${id}/cities`),

    // 根据市级id查找区域
    locationAreas: (id) => request.get(`/basic/location/{id}/areas`)
}
const storeManage = {
    storeDetail: (id) => request.get(`/admin/shop/detail/${id}`), // 获取店铺详情
	systemConfig: () => request.get('/shop/systemConfig'), // 【用户】获取ICP备案号以及商城名称等
	contactInformationGet: (data) => request.get('/shop/contactInformation/infoByShopId',data), // 【商家，平台】根据当前登录用户id查询商家或平台微信联系方式存储表
	contactInformationSave: (data) => request.post('/shop/contactInformation/s/save',data), // 【商家】保存商家微信联系方式
}

const addressApi = {
    location: (parentId) => request.get(`/basic/location/children/${parentId}`), //获取地址信息
    loadProvinceCity: () => request.get(`/basic/location/loadProvinceCity`), // 获取所有省市数据
    addressAndLocationCode: (params) => request.get('/basic/a/map/addressAndLocationCode', params, { isShowMessage: false }), // 【公共】根据经纬度获取地址和省市区LocationID
}
// 消息
const messageApi = {
    // 系统通知列表
    getMsgList: (data) => request.get('/basic/s/msg/page', data),
    // 系统通知详情
    getMsgDetail: (data) => request.get('/basic/s/msg', data),
    // 获取卖家公告列表
    getPubList: (data) => request.get('/shop/s/query/shop/pub/list', data),
    // 获取商城公告详情
    getPubDetail: (data) => request.get('/shop/s/pub/info', data),
    // 获取未读消息数
    getUnread: (params) => request.get('/basic/s/msg/unallread', params, { isShowMessage: false }),
	// 【商家】一键清除消息未读标记
	cleanUnread:(data) => request.get('/basic/s/msg/cleanUnread',data),
}

// 登录页(忘记密码/注册)
const loginPage = {
    isPhoneExist: (data) => request.get('/user/shop/register/isMobileExist', data), // 判断手机号是否存在
    shopRegister: (data) => request.post('/user/shop/register', data), // 商家注册
    smsVerifyCode: (data) => request.post('/user/userSend/smsVerifyCode', data), // 发送验证码，不需要登录
    userVerifyCode: (data) => request.post('/user/p/userSend/smsVerifyCode', data), // 发送验证码，需要登录
    resetPassword: (data) => request.put('/user/shop/register/reset/password', data), // 重置密码
    verifyCode: (data) => request.post('/user/basic/user/verifyCodeExchangeCertificate', data), // 【用户】修改：支付、登录、换绑、验证码获取临时凭证，需要手机号、验证码
    queryById: (data) => request.get(`/basic/protocol/get`, data) // 【后台】查看协议链接
}

const uploadApi = (data) => request.post('/basic/file/upload', data)

const getDomainApi = (data) => request.get('/basic/domain', data) //获取当前网址

const getToken = (data) => request.get('/shop/admin/grass/article/preview', data) //获取文章详情token

// const getDomainApi = (data) => request.get('/basic/domain', data) //获取当前网址
// 小程序
const miniWxApi = {
    // 小程序码接口
    getMiniQrCode: (data) => request.get('/basic/wx/getMiniQrCode', { flag: false, ...data }),
}

const excelCenter = {
    excelPage:(data)=>request.get('/basic/shop/export/excel/page',data),   // 文件导出分页查询
    excelDownload:(data) => request.getFile('/basic/export/excel/download',data)
}

export { shopMoveIn, storeManage, loginPage, addressApi, messageApi, uploadApi, getDomainApi, getToken, miniWxApi, excelCenter }
