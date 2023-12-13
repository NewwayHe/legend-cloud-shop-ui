import { request } from '@/utils/request'

//订单列表
const orderApi = {
    getOrderDetails: (data) => request.get('/order/s/order/get', data), //订单详情

    reasonList: (data) => request.get('/order/s/order/cancel/reason', data), //取消原因列表

    getLogisticsCompany: (data) => request.get('/order/s/order/get/logistics/company', data), //获取物流公司列表

    cancelOrder: (data) => request.post('/order/s/order/cancel/order', data), //取消原因列表

    cancelOrderBatch: (data) => request.post('/order/s/order/cancel/batch', data), //批量取消订单

    insertLogistic: (data) => request.postForm('/order/s/order/insert/logistic', data), // 确认发货

    subRemake: (data) => request.postForm('/order/s/order/insert/remake', data), //添加备注

    orderFee: (data) => request.postForm('/order/s/order/change/order/fee', data), //调整订单

    exportInvoicing: (data) => request.getFile('/order/s/order/invoice/export', data), // 发票导出

    orderExport: (data) => request.getFile('/order/s/order/export', data) // 订单数据导出
}

// 售后
const serviceOrderApi = {
    // 审核退款订单
    auditRefund: (data) => request.postForm('/order/s/order/refund/audit/refund', data),

    // 审核退货订单
    auditRefundGood: (data) => request.postForm('/order/s/order/refund/audit/refund/good', data),

    //商家确认收货
    confirmDeliver: (data) => request.postForm('/order/s/order/refund/confirm/deliver', data),

    // 售后详情
    orderRefundDetail: (data) => request.get('/order/s/order/refund', data),

    //售后导出
    refundExport: (data) => request.getFile('/order/s/order/refund/export', data)
}

export { orderApi, serviceOrderApi }
