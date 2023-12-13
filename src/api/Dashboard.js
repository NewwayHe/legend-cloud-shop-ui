import { request } from '@/utils/request'

//商品统计页
const indexApi = {
    //首页订单信息
    orderInfo: (data) => request.get('/order/s/order/index/order/info', data),

    //首页支付订单数量
    paidOrder: (data) => request.get('/order/s/order/index/paidOrder', data),

    //首页待处理事项
    pending: (data) => request.get('/order/s/order/index/pending', data),

    //首页销售额-数据
    indexSales: (data) => request.get('/order/s/order/indexSales', data),

    //首页当前账单结算订单
    currentBill: (data) => request.get('/order/s/shop/order/bill/current/bill', data),
    newBier: (data) => request.get('/shop/admin/shop/detail/newBier', data)
}

export { indexApi }
