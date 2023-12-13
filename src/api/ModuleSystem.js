import { request } from '@/utils/request'
const menuAuthManage = {
    // 获取菜单列表
    getMenuList: (data) => request.get('/admin/menu/tree', data),
    // 保存菜单
    saveMenu: (data) => request.post('/admin/menu', data),
    // 修改菜单
    editMenu: (data) => request.put('/admin/menu', data),
    // 登录后加载菜单
    userMenu: (data) => request.get('/user/shop/menu', data),
    // 删除菜单
    deleteMenu: (data) => request.delete('/admin/menu/' + data),
    // 获取用户拥有权限
    getRoleList: (id) => request.get(`/admin/menu/tree/${id}`),

    // 查询所有角色
    getAllRoleList: (data) => request.get(`/admin/role/list`, data),
    // 保存角色
    saveRole: (data) => request.put('/admin/role/menu', data)
}

const version = {
    // 获取下程序版本：develop（开发版），trial（体验版），release（正式版）
    getMpVersion: (params) => request.PUT('/api/businessConfig/getMpVersion', params)
}

const orderSet = {
    // 【商家】获取店铺订单设置
    orderSetting: (params) => request.get('/shop/s/order/setting', params),
    // 【商家】 保存店铺订单设置
    orderUpdate: (params) => request.post('/shop/s/order/setting/update', params)
}

const shopManage = {
    // 首页装修页面的删除接口
    delPage: (id) => request.delete(`/shop/s/decoratePage/${id}`) //删除页面
}

// 个人信息/企业信息  获取与设置
const infoGetAndEdit = {
    getInfo: () => request.get('/shop/s/setting'), //基本信息查询
    editInfo: (data) => request.put('/shop/s/setting', data)
}

//物流管理
const logisticsManage = {
    detail: () => request.get('/order/s/logistics/company/page'),
    allList: () => request.get('/order/s/logistics/company/all/list') //获取全部物流公司列表
}

//修改密码和手机
const editPersonInfo = {
    codeUpdate: (params) => request.post('/user/basic/user/verifyCodeExchangeCertificate', params), //修改验证码
    phoneUpdate: (params) => request.post('/user/s/user/updateMobilePhone', params), //修改手机号码
    resetPassword: (data) => request.put('/user/shop/register/reset/password', data) //重置密码
}

//运费模板
const freightTemplate = {
    transportAdd: (data) => request.post('/product/s/transport', data),
    transportEdit: (data) => request.put('/product/s/transport', data), //获取全部物流公司列表
    transportDet: (id) => request.get(`/product/admin/transport/${id}`), //运费模板详情
    transRuleDet: () => request.get(`/product/s/transRule/shop`), //获取店铺运费规则
    transRuleEdit: (data) => request.put(`/product/s/transRule`, data) //更新店铺运费规则
}

//素材中心
const materialCenter = {
    getResourceList: (data) => request.get('/basic/s/file/queryPageByShop', data), //获取文件夹及多媒体资源列表
    changeResourceName: (data) => request.get('/basic/s/file/updateFileFolderName', data, { isShowMessage: false }), //修改文件夹或图片名字
    tempUpload: (data) => request.postFile('/basic/s/file/uploadNew', data), //临时上传
    confirmUpload: (data) => request.put('/basic/s/file/updateManagedFlage', data), //确认上传
    deleteResource: (data) => request.delete(`/basic/s/file/delectFileByIdList`, data), //删除文件夹或多媒体资源
    createFloder: (data) => request.post('/basic/s/file/saveFileFolder', data),
    getParentFloderList: (data) => request.get('/basic/s/file/getIdList', data),
    getFloderTree: (data) => request.get('/basic/s/file/queryFileFolderList', data), //获取文件夹列表树
    moveResource: (data) => request.put('/basic/s/file/updateFileFolderList', data),
    getSaveHistory: (data) => request.post('/basic/file/saveHistoryNew', data) //图片中心历史记录
}

export { menuAuthManage, orderSet, version, shopManage, infoGetAndEdit, logisticsManage, freightTemplate, editPersonInfo, materialCenter }
