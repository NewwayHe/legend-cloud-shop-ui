import { request } from '@/utils/request'

//商品统计页
const pssApi = {
    //商品概况/商品spu总数
    getSpu: (data) => request.get('/product/s/count/spu', data),
    //商品概况/商品sku总数
    getSku: (data) => request.get('/product/s/count/sku', data),
    //商品概况/商品在售sku总数
    getSkuSale: (data) => request.get('/product/s/count/sku/sale', data),
    //商品概况/商品spu访问用户数
    getSpuClick: (data) => request.get('/product/s/count/spu/click', data),
    //饼状图分类树
    getCategoryTree: (data) => request.get('/product/s/count/category/tree', data),
    //商品SKU分类排行信息
    getSkuCategory: (data) => request.get('/product/s/count/sku/category', data)
}

const psyApi = {
    // 获取店铺商品概况
    getDetail: (data) => request.get('/product/s/count/shop/detail', data),
    getgoodList: (data) => request.get('/product/s/count/good/list', data)
}

//商品销售排行
const srgApi = {
    //商品概况/商品spu总数
    getOrder: (data) => request.get('/product/s/count/sale/order', data),
    // 导出Excel
    getExcel: (data) => request.getFile('/product/s/count/sale/order', data)
}

//趋势图
const dtsApi = {
    // //商品概况/商品spu总数
    // getLine: (data) => request.get('/product/s/count/trend/line', data),
    // //销售趋势图成交列表数据
    // getDeal: (data) => request.get('/product/s/count/trend/deal', data),
    // 导出Excel
    getExcel: (data) => request.getFile('/product/s/count/trend/deal/excel', data)
}

//趋势图
const csyApi = {
    getTree: (data) => request.get('/product/s/count/category/tree', data)
}

//营销统计
const mssApi = {
    //获取营销概况数据
    masketingPage: (data) => request.get('/data/s/count/activity/page', data),
    //新增使用总次数饼图
    masketingCount: (data) => request.get('/data/s/count/activity/page', data),
    //营销分析
    masketingAnalysis: (data) => request.get('/data/s/count//activity/detail', data),
    // 商家优惠券投入产出数据统计
    couponAmountCount: (data) => request.get('/data/shop/coupon/statement/shop/amountCount', data),
    // 商家优惠券拉新复购数据统计
    couponUserAmountCount: (data) => request.get('/data/shop/coupon/statement/shop/userAmountCount', data),
    // 商家优惠券数据趋势数据统计
    couponShopUserDataCount: (data) => request.get('/data/shop/coupon/statement/shop/userDataCount', data),

    excelUserDataCount: (data) => request.getFile('/data/shop/coupon/statement/shop/page/excel/userDataCount', data)
}

export { pssApi, srgApi, dtsApi, psyApi, csyApi, mssApi }
