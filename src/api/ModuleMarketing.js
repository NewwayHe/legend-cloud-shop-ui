import { request } from '@/utils/request'

// 优惠券api
const couponApi = {
    saveCoupon: (data) => request.post('/activity/s/coupon', data), // 保存优惠券

    updateCouponStatu: (status, data) => request.put(`/activity/s/coupon/updateStatus/${status}`, data), // 修改优惠券状态

    couponDetail: (couponId, data) => request.get(`/activity/s/coupon/${couponId}`, data), // 修改优惠券状态

    productPage: (data) => request.get(`/activity/s/coupon/productPage`, data), // 优惠券分页查询商品

    couponProduct: (data) => request.get(`/activity/s/coupon/product`, data), // 根据id查询优惠券优惠商品

    couponProductPut: (data) => request.put(`/activity/s/couponProduct`, data), // 根据id查询优惠券优惠商品

    updateInvalid: (data) => request.postForm(`/activity/p/couponUser/updateStatus`, data), // 强制失效用户优惠券状态

    copyCouponProduct: (couponId) => request.postForm(`/activity/s/couponProduct/copy/${couponId}`), // 拷贝优惠券商品

    couponProductDel: (couponProductId, couponId) => request.delete(`/activity/s/couponProduct/${couponProductId}/${couponId}`), // 删除优惠券商品

    // 根据主配置名称查询配置项
    shopParamItemList: (data) => request.get(`/shop/shopParamItem/list`, data),

    // 批量修改配置项value
    shopParamItemValue: (data) => request.put(`/shop/shopParamItem/value/items`, data)
}

export {
    couponApi // 优惠券
}
