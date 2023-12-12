import { request } from '@/utils/request'

// 商品列表
const GoodsManage = {
    productList: (data) => request.get(`/product/s/product/page`, data), // 商品列表
    getShopAllOnline: (data) => request.get('/product/admin/shop/detail/allOnline', data), // 获取所有店铺
    getBrandAllOnline: (data) => request.get('/product/admin/brand/allOnline', data), // 获取所有品牌
    updateStatus: (data) => request.put('/product/admin/product/updateStatus', data),
    batchUpdateStatus: (data) => request.put('/product/s/product/batchUpdateStatus', data), //批量更新状态
    productExport: (data) => request.getFile('/product/s/product/export', data),
    illegalExport: (data) => request.getFile('/product/s/accusation/illegalExport', data), //违规商品导出
    productArrivalNotice: (data) => request.get('/product/s/productArrivalNotice/page', data), //到货通知用户列表
    batchUpdateDelStatus: (data) => request.put('/product/s/product/batchUpdateDelStatus', data), //批量更新商品删除状态
    // updateRatio: (data) => request.put('/activity/distribution/prod/update/ratio', data) //批量更新商品删除状态
    productPreview: (data) => request.get('/product/s/product/preview', data), //到货通知用户列表
    updateRatio: (params) => request.sendRequest({ url: '/activity/distribution/prod/update/ratio', params, method: 'put' }), //更新佣金比例
    proPreview: (data) => request.get('/product/s/product/preview', data), // 预览商品生成标识
    updateProductList: (data) => request.post('/product/s/product/updateProductList', data), // 预览商品生成标识
    batchInsertProductFailPage: (data) => request.post('/product/s/product/batchInsertProductFailPage', data), // 页面展示近7天导入结果
}

// 商品举报
const report = {
    getAccusationTypeAll: () => request.get('/product/s/accusationType/all'), // 获取所有举报类型
    accusationDetail: (id) => request.get(`/product/s/accusation/${id}`) // 举报详情
}

// 商品添加
const addGood = {
    shopCategory: (data) => request.get('/product/s/shopCategory', data), // 商品类目树
    queryPropertyByCategoryId: (id, data) => request.get(`/product/s/productProperty/queryParamByCategoryId/${id}`, data), // 根据分类id查询商品参数列表
    querySpecifivationByCategoryId: (id, data) => request.get(`/product/s/productProperty/querySpecificationByCategoryId/${id}`, data), // 根据分类id查询规格列表
    getPlatformCategory: (data) => request.get(`/product/s/shopCategory/getPlatformCategory`, data), // 根据父id查询在线子类目
    brandList: (data) => request.get(`/product/s/brand/allOnline`, data), // 用户所有在线品牌
    productAdd: (data) => request.post(`/product/s/product`, data), // 发布商品
    productEdit: (data) => request.put(`/product/s/product`, data), // 发布商品
    userPropertyValueId: (data) => request.get(`/product/s/productProperty/userPropertyValueId`, data), // 保存自定义属性值（规格、参数属性）
    userPropertyNameId: (data) => request.get(`/product/s/product/userPropertyNameId`, data), // 获取商家自定义规格名称id
    productId: (id) => request.get(`/product/s/product/${id}`), // 获取商家自定义规格名称
    productDraftId: (id) => request.get(`/product/s/product/draft/${id}`), // 获取商家商品草稿
    productDraftArraignment:(data) => request.postForm('/product/s/product/draft/arraignment',data),//草稿提交审核
    productDraftRevokeArraignment:(data) => request.postForm('/product/s/product/draft/revokeArraignment',data)//草稿撤回审核

}

// 商品举报类型
const reportType = {
    updateStatus: (data) => request.put('/admin/accusationType/batchUpdateStatus', data), // 批量更新状态
    delete: (data) => request.delete('/admin/accusationType/batchDeleteStatus', data) // 批量删除
}

// 商品类目
const category = {
    page: (data) => request.get('/product/s/shopCategory', data), // 商品类目
    page2: (data) => request.get(`product/s/shopCategory/product`, data), // 类目下的商品
    detail: (id) => request.get(`/product/s/shopCategory/${id}`), // 类目详情
    add: (data) => request.post('/product/s/shopCategory', data), // 新增商品类目
    edit: (data) => request.put('/product/s/shopCategory', data), // 编辑商品类目
    changeStatus: (id, status) => request.put(`/product/s/shopCategory/changeStatus/${id}/${status}`), // 类目上下线
    delete: (id) => request.delete(`/product/s/shopCategory/${id}`) // 批量删除
}

// 规格
const specifications = {
    specificationPage: (data) => request.get('/product/s/productProperty/page', data), // 规格列表
    specificationAgg: (data) => request.post('/product/s/productPropertyAgg/specification', data), // 保存关联规格参数分组
    add: (data) => request.post('/product/s/productProperty', data), // 新增
    edit: (data) => request.put('/product/s/productProperty', data), // 编辑
    detail: (id) => request.get(`/product/s/productProperty/${id}`), // 获取详情
    getByIds: (data) => request.get(`/product/s/productProperty/getByIds`, data) // 根据ids获取参数
}

// 参数
const params = {
    paramsAgg: (data) => request.post('/product/s/productPropertyAgg/param', data), // 保存关联规格参数分组
    add: (data) => request.post('/product/s/productProperty', data), // 新增
    edit: (data) => request.put('/product/s/productProperty', data), // 编辑
    detail: (id) => request.get(`/product/s/productProperty/${id}`) // 详情
}

// 参数组/s/ParamGroup
const paramGroup = {
    paramsGroupAgg: (data) => request.post('/product/s/productPropertyAgg/paramGroup', data), // 保存关联规格参数分组
    paramsProperty: (data) => request.get('/product/s/productProperty/page', data), // 获取参数列表
    paramGroupPage: (data) => request.get('/product/s/paramGroup/page', data), // 获取参数列表
    paramsGroupDeatail: (id) => request.get(`/product/s/paramGroup/${id}`), // 获取参数组详情
    addParamsGroup: (data) => request.post('/product/s/paramGroup', data), // 新增参数分组
    editParamsGroup: (data) => request.put('/product/s/paramGroup', data), // 编辑参数分组
    getByIds: (data) => request.get('/product/s/paramGroup/getByIds', data), // 根据ids 获取参数组
    getByCategoryId: (id, data) => request.get(`/product/s/paramGroup/getByCategoryId/${id}`, data) // 详情
}

// 商品品牌管理
const commodityBrand = {
    updateStatus: (data) => request.put('/product/s/brand/updateStatus', data), // 更新状态
    brandExport: (data, vueThat) => request.getFile('/product/s/brand/export', data, vueThat), // 导出
    queryByCategory: (id) => request.get(`/product/s/brand/queryByCategory/${id}`) // 根据类目id查找关联的品牌列表
}

// 商品品牌详情
const commodityBrandDetail = {
    brandDetail: (id) => request.get(`/product/s/brand/${id}`) // 查看详情
}

// 规格参数分组
const specificationParamsGroup = {
    productPropertyAgg: (id) => request.get(`/product/s/productPropertyAgg/${id}`), // 单个规格参数分组详细信息(简略版)
    productDetailPropertyAgg: (id) => request.get(`/product/admin/productPropertyAgg/detail/${id}`), // 单个规格参数分组详细信息(详情版)
    add: (data) => request.post('/product/s/productPropertyAgg', data), // 新增
    edit: (data) => request.put('/product/s/productPropertyAgg', data), // 编辑
    getTree: () => request.get('/product/s/category/briefTree') // 获取完整的类目树
}

//库存管理
const inventoryManage = {
    stocksExport: (data) => request.getFile('/product/s/product/stocksExport', data), //库存商品导出
    stocksLogPage: (data) => request.get('/product/s/product/stocksLogPage', data), //根据id查询库存历史
    stocksList: (data) => request.post('/product/s/product/stocksList', data), //库存计算
    queryStocksList: (data) => request.get('/product/s/product/queryStocksListBySkuIdList', data), //根据StocksList查询库存列表
    batchUpdateStock: (stock, data) => request.put(`/product/s/product/batchUpdateStock/${stock}`, data), //根据id查询库存历史
    batchUpdateSku: (data) => request.put(`/product/s/product/batchUpdateSkuStock`, data) //根据id查询库存历史
}

//运费模板管理
const transportManage = {
    transportChoose: (data) => request.get('/product/s/transport/choose/page', data) //根据id查询库存历史
}

export {
    transportManage, //运费模板管理
    inventoryManage, // 库存管理
    GoodsManage, //商品管理
    addGood, //商品添加
    report, //商品举报
    reportType, //举报类型
    category, // 商品类目
    specifications, //商品规格
    params, //商品参数
    paramGroup, // 商品参数组
    commodityBrand, // 商品品牌管理
    commodityBrandDetail, //商品品牌详情
    specificationParamsGroup
}
