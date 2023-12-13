import { request } from '@/utils/request'
const userManage = {
    // 保存菜单
    addAdmin: (data) => request.post('/admin/platform/user', data),
    // 修改菜单
    editAdmin: (data) => request.put('/admin/platform/user', data),
    // 登录后加载菜单
    userMenu: (data) => request.get('/admin/menu', data),
    // 删除菜单
    deleteMenu: (data) => request.delete('/admin/menu/' + data),
    // 获取用户拥有权限
    getRoleList: (id) => request.get(`/admin/menu/tree/${id}`),
    // 查询所有角色
    getAllRoleList: (data) => request.get(`/admin/role/list`, data),
    // 保存角色
    saveRole: (data) => request.put('/admin/role/menu', data)
}
const positionManage = {
    // 保存菜单
    getMenuList: (data) => request.get('/user/shop/menu/tree', data),
    // 根据条件查询子账号角色
    queryRolePage: (data) => request.put('/user/s/shop/userRole/queryRolePage', data),
    // 登录后加载菜单
    addUserRole: (data) => request.post('/user/s/shop/userRole', data),
    // 删除菜单
    editUserRole: (data) => request.post('/user/s/shop/userRole', data),
    // 获取用户拥有权限
    getRoleList: (id) => request.get(`/user/s/shop/userRole/${id}`),
    // 查询所有角色
    getAllRoleList: (data) => request.get(`/user/s/shop/userRole/queryAll`, data),
    //状态更新
    staffUpdate: (id, data) => request.put('/user/s/shop/subUser/updateStatus/' + id, data),

    //商家子账号更新密码
    staffUpdatePwd: (data) => request.postForm('/user/s/shop/subUser/updatePassword', data),

    // 获取员工列表
    getStaffList: (data) => request.get(`/user/s/shop/subUser/queryUserPage`, data)
}

const storeManage = {
    // 获取店铺详情
    storeDetail: (id) => request.get(`/admin/shop/detail/${id}`)
}
export { userManage, storeManage, positionManage }
