import { request } from '@/utils/request'

//订单列表
const orderApi = {
    getOrderDetails: (data) => request.get('/order/s/order/get', data), //订单详情

    reasonList: (data) => request.get('/order/s/order/cancel/reason', data), //取消原因列表

    getLogisticsCompany: (data) => request.get('/order/s/order/get/logistics/company', data), //获取物流公司列表

    cancelOrder: (data) => request.post('/order/s/order/cancel/order', data), //取消订单(买家未付款)

    cancelOrderBatch: (data) => request.post('/order/s/order/cancel/batch', data), //批量取消订单
    
    applyCancel: (data) => request.post('/order/s/order/refund/apply/cancel', data), // 申请取消订单(买家已付款)

    cancelPreSellOrder:(data) => request.post('/order/s/order/cancel/pre/sell/order', data), //取消预售订单

    insertLogistic: (data) => request.postForm('/order/s/order/insert/logistic', data), // 确认发货

    insertStockup: (data) => request.postForm('/order/s/order/insert/logistic/stockUp', data), // 备货完毕

    subRemake: (data) => request.postForm('/order/s/order/insert/remake', data), //添加备注

    orderFee: (data) => request.postForm('/order/s/order/change/order/fee', data), //调整订单

    batchOpenInvoicing: (data) => request.post('/order/s/order/invoice/batch/invoicing', data), // 批量开票

    exportInvoicing: (data) => request.getFile('/order/s/order/invoice/export', data), // 发票导出

    orderExport: (data) => request.getFile('/order/s/order/export', data), // 订单数据导出

    updateLogistic:(data) => request.postForm('/order/s/order/update/logistic',data), //商家修改物流信息

    logisticsExport:(importId)=>request.getFile(`/order/s/order/import/logistics/export/detail/${importId}`),//导出批量发货结果

}
// 评论
const commentApi = {
    // 查看评论详情
    getCommentDetail: (data) => request.get('/product/s/product/comment/get', data),
    // 回复初评
    postFirstComment: (data) => request.postForm('/product/s/product/comment/reply/first', data),
    // 回复追评
    postReplyComment: (data) => request.postForm('/product/s/product/comment/reply/add', data)
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
    // 商家申请售后列表
    orderRefundPageCancelOrder: (data) => request.get('/order/s/order/refund/pageCancelOrder', data),
    //售后导出
    refundExport: (data) => request.getFile('/order/s/order/refund/export', data),
    // 获取取消订单原因
    refundReason:() => request.post('/order/admin/order/refund/cancel/reason'),

    auditWithdrawGood: (data) =>request.post('/order/s/order/refund/audit/withdraw/good',data), //撤回取消订单(买家已付款)申请
    
    // 退款退货原因列表
    afterSalesReason:(data) => request.postForm('/order/s/order/refund/afterSales/reason',data),
    // 批量审核退款订单
    batchAuditRefund: (data) => request.post('/order/s/order/refund/batch/audit/refund', data),
    // 批量审核退货订单
    batchAuditRefundGood: (data) => request.post('/order/s/order/refund/batch/audit/refund/good', data),


}

// 问答
const askAnswerApi = {
    // 商品咨询回复
    consultReply: (data) => request.get('/product/s/product/consult/reply', data),
    // 商品咨询列表上下线
    consultOffline: (data) => request.get('/product/s/product/consult/offline', data)
}

export { orderApi, commentApi, serviceOrderApi, askAnswerApi }
