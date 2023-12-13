const getters = {
    sidebar: (state) => state.app.sidebar,
    device: (state) => state.app.device,
    guide: (state) => state.app.guide,
    token: (state) => state.user.token,
    avatar: (state) => state.user.avatar,
    userInfo: (state) => state.user.userInfo,
    shopInfo: (state) => state.user.shopInfo, // 店铺信息
    shopStatus: (state) => state.user.shopStatus,
    name: (state) => state.user.name,
    roles: (state) => state.user.roles,
    permission_routes: (state) => state.permission.routes,
    visitedViews: (state) => state.tagsView.visitedViews,
    cachedViews: (state) => state.tagsView.cachedViews,
    accessedRoutes: (state) => state.permission.accessedRoutes,
    messegeNum: (state) => state.user.messageInfo.count //未读消息数
}
export default getters
