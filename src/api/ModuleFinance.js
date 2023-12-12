import { request } from '@/utils/request'

/**
 * 财务管理
 *
 * */

// 结算管理
const settle = {
    // 结算列表导出
    exportBillList: (data) => request.getFile('/order/s/shop/order/bill/export', data),
    // 结算账单列表导出
    exportBillData: (data) => request.getFile('/order/s/shop/order/bill/orderPage/export', data),
    // 账单详情查询
    getBillDetail: (id) => request.get(`/order/s/shop/order/bill/${id}`),
    //确认账单
    determinebill: (id) => request.put(`/order/s/shop/order/bill/confirm/${id}`)
}

export { settle }
