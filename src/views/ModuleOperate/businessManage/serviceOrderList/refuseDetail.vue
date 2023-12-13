<template>
    <section class="">
        <div class="mb-20">
            <div class="p-10 bg-fff rounded-4 flex-start">
                <i class="iconfont icon-tanhao text-warning" />
                <div class="ml-10 font-12">
                    <div v-if="orderStatus(detailsInfo) === '待确认'">
                        请在
                        <countDown v-slot="{ times }" :time="detailsInfo.autoCancelRefundTime" :custom="true" class="d-inline-block">
                            <span v-if="times.days > 0">{{ times.days }}天</span>
                            <span v-if="times.hours > 0">{{ times.hours }}时</span>
                            <span>{{ times.minutes }}分</span>
                            <span>{{ times.seconds }}秒</span>
                        </countDown>
                        内处理本次售后操作，如逾期未处理，将自动同意售后{{
                            detailsInfo.applyType == 2 ? '并默认为弃货' : ''
                        }}。退款金额按照原路退回，优先退还余额支付金额。
                    </div>
                    <div v-if="orderStatus(detailsInfo) === '待审核'">
                        <template v-if="detailsInfo.applyType == 1">
                            商家已同意售后，待平台审核。退款金额按照原路退回，优先退还余额支付金额。
                        </template>
                        <template v-else>
                            {{
                                detailsInfo.cancellationType == 4
                                    ? '商家逾期未处理，系统默认同意售后（选择弃货），直接提交平台审核。'
                                    : detailsInfo.cancellationType == 6
                                    ? '商家已同意售后（选择弃货）待平台审核。'
                                    : '商家已确认收货，待平台审核。退款金额按照原路退回，优先退还余额支付金额。'
                            }}
                        </template>
                    </div>
                    <div v-if="orderStatus(detailsInfo) === '待用户退货' || orderStatus(detailsInfo) === '待收货'">
                        <template v-if="detailsInfo.cancellationType == 7">
                            商家已同意售后，用户已寄回商品，确认收货后提交平台审核。商品显示已配送到商家收货地址后，商家需要在
                            <countDown v-slot="{ times }" :time="detailsInfo.autoCancelRefundTime" :custom="true" class="d-inline-block">
                                <span v-if="times.days > 0">{{ times.days }}天</span>
                                <span v-if="times.hours > 0">{{ times.hours }}时</span>
                                <span>{{ times.minutes }}分</span>
                                <span>{{ times.seconds }}秒</span>
                            </countDown>
                            内确认收货/标记商品异常，如逾期未处理，售后单将自动确认收货。
                        </template>
                        <template v-else>
                            商家已同意售后，等待用户寄回商品，确认收货后提交平台审核。用户需要在
                            <countDown v-slot="{ times }" :time="detailsInfo.autoCancelRefundTime" :custom="true" class="d-inline-block">
                                <span v-if="times.days > 0">{{ times.days }}天</span>
                                <span v-if="times.hours > 0">{{ times.hours }}时</span>
                                <span>{{ times.minutes }}分</span>
                                <span>{{ times.seconds }}秒</span>
                            </countDown>
                            内寄回商品，如逾期未处理，售后单将自动变为取消状态。
                        </template>
                    </div>
                    <div v-if="orderStatus(detailsInfo) === '已退款'">退款金额按照原路退回，优先退还余额支付金额。</div>
                    <div v-if="orderStatus(detailsInfo) === '已拒绝'">商家已拒绝售后，用户可重新申请售后。</div>
                    <div v-if="orderStatus(detailsInfo) === '已取消'">
                        {{ detailsInfo.cancellationType == 1 ? '用户取消售后，取消时间：' : '用户逾期未发货，售后单自动变为取消状态，取消时间：'
                        }}{{ detailsInfo.cancellationTime }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 进度 -->
        <div class="mb-20">
            <el-card shadow>
                <div class="d-flex a-center order p-20">
                    <div class="d-flex flex-column a-center order-wrapper">
                        <h1 class="order-status">{{ refuseStatus(detailsInfo) }}</h1>
                        <p class="order-code">售后编号: {{ detailsInfo.refundSn }}</p>
                    </div>
                    <div class="order-line" style="" />
                    <div class="flex-1 d-flex j-center">
                        <!--
                            1、退款->用户取消（此时商家未确认） 此时流程图应该为：发起->用户取消->完成
                            2、退款->商家确认（用户无法取消 已经直接平台审核了） / 商家拒绝（用户也无法取消 只能重新申请售后） 流程图：发起->商家确认->平台->完成

                            3、退货->用户取消（此时商家未确认）流程图：发起->用户取消->完成
                            4、退货->商家确认->用户还能进行取消售后 流程图：发起->商家确认->用户取消->完成
                            5、退货->商家拒绝->用户只能重新申请售后 流程图：发起->【商家拒绝X】->商家待收货...
                        -->
                        <el-steps
                            v-if="detailsInfo.applyType"
                            class="order-step w-100"
                            :space="200"
                            finish-status="success"
                            :active="refuseStatus(detailsInfo, false)"
                            align-center
                        >
                            <el-step :description="detailsInfo.createTime" title="申请售后" />
                            <!-- 退款 -->
                            <template v-if="detailsInfo.applyType == 1">
                                <!-- 商家未确认 但是用户已取消 -->
                                <template v-if="detailsInfo.applyStatus == -1 && detailsInfo.sellerStatus == 0">
                                    <el-step :description="detailsInfo.cancellationTime" title="用户取消" />
                                </template>
                                <template v-else>
                                    <el-step
                                        :description="detailsInfo.sellerTime"
                                        title="商家确认"
                                        :status="
                                            detailsInfo.applyStatus == -3 || detailsInfo.sellerStatus == -1
                                                ? 'error'
                                                : detailsInfo.applyStatus == 1 && detailsInfo.sellerStatus == 0
                                                ? 'process'
                                                : 'success'
                                        "
                                    />
                                    <el-step
                                        v-if="detailsInfo.applyStatus != -2 && detailsInfo.applyStatus != -1"
                                        :description="detailsInfo.adminTime"
                                        title="平台审核"
                                    />
                                </template>
                            </template>

                            <!-- 退货 -->
                            <template v-else-if="detailsInfo.applyType == 2">
                                <!-- 商家未确认 但是用户已取消 -->
                                <template v-if="detailsInfo.applyStatus == -1 && detailsInfo.sellerStatus == 0">
                                    <el-step :description="detailsInfo.cancellationTime" title="用户取消" />
                                </template>
                                <!-- 商家确认 但是用户已取消 -->
                                <template v-else-if="detailsInfo.applyStatus == -1 && detailsInfo.sellerStatus == 1">
                                    <el-step :description="detailsInfo.sellerTime" title="商家确认" status="success" />
                                    <el-step :description="detailsInfo.cancellationTime" title="用户取消" />
                                </template>
                                <!-- 正常流程 -->
                                <template v-else>
                                    <el-step
                                        :description="detailsInfo.sellerTime"
                                        title="商家确认"
                                        :status="
                                            detailsInfo.applyStatus == -3 || detailsInfo.sellerStatus == -1
                                                ? 'error'
                                                : detailsInfo.applyStatus == 1 && detailsInfo.sellerStatus == 0
                                                ? 'process'
                                                : 'success'
                                        "
                                    />
                                    <el-step
                                        v-if="detailsInfo.applyType == 2 && detailsInfo.returnType !== 1 && detailsInfo.applyStatus > -1"
                                        :description="detailsInfo.receiveTime"
                                        title="商家确认收货"
                                    />
                                    <el-step
                                        v-if="detailsInfo.applyStatus != -2 && detailsInfo.applyStatus != -1"
                                        :description="detailsInfo.adminTime"
                                        title="平台审核"
                                    />
                                </template>
                            </template>
                            <el-step v-if="detailsInfo.applyStatus == -2" :description="detailsInfo.completeTime" title="逾期发货自动取消" />
                            <el-step v-else :description="detailsInfo.completeTime" title="完成" />
                        </el-steps>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 商品表格 -->
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 快递 -->
            <div v-if="detailsInfo.sellerStatus == 1 && detailsInfo.refundReturnLogisticsDTO" class="mb-20">
                <div v-if="detailsInfo.refundReturnLogisticsDTO" class="d-flex order p-20" style="background-color: #f5f7fa">
                    <div class="flex-col-start order-wrapper font">
                        <el-form
                            label-width="90px"
                            label-position="left"
                            size="small"
                            class="order-form order-wrapper"
                            style="flex-basis: auto; width: 500px"
                        >
                            <p class="font-14 font-weight-600" style="line-height: 32px">配送信息</p>
                            <el-form-item label="配送方式：">{{ detailsInfo.refundReturnLogisticsDTO.logisticsCompany || '-' }}</el-form-item>
                            <el-form-item label="单号：">{{ detailsInfo.refundReturnLogisticsDTO.shipmentNumber || '-' }}</el-form-item>
                        </el-form>
                        <ls-image :src="$photoServer + detailsInfo.productImage" :options="{ w: '80', h: '80', br: '4' }" class="mt-20" />
                    </div>
                    <div class="order-line" />
                    <div class="flex-1">
                        <div class="font-14 font-weight-600 mb-10" style="line-height: 32px">物流信息</div>
                        <el-scrollbar class="time-scoll">
                            <el-timeline class="express-step">
                                <el-timeline-item
                                    v-for="(activity, index) in logisticsArr"
                                    :key="index"
                                    :color="index == 0 ? '#ffba00' : ''"
                                    :timestamp="activity.ftime"
                                >
                                    {{ activity.context }}
                                </el-timeline-item>
                            </el-timeline>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <el-form label-width="90px" label-position="left" size="small" class="order-form mb-20">
                <div class="d-flex p-20" style="background-color: #f5f7fa">
                    <!-- 收货人信息 -->
                    <div class="flex-1">
                        <!-- 售后信息 -->
                        <div>
                            <div class="font-14 font-weight-600" style="line-height: 32px">售后信息</div>
                            <el-form-item label="售后编号：">{{ detailsInfo.refundSn }}</el-form-item>
                            <el-form-item label="申请时间：">{{ detailsInfo.createTime }}</el-form-item>
                            <el-form-item label="订单编号：">{{ detailsInfo.orderNumber }}</el-form-item>
                            <el-form-item label="售后类型：">{{ detailsInfo.applyType == 1 ? '仅退款' : '退货' }}</el-form-item>
                            <el-form-item label="退款金额：">{{ detailsInfo.refundAmount | priceFilter }}</el-form-item>
                            <el-form-item label="售后原因：">
                                <span class="word-breakall">{{ detailsInfo.reason || '-' }}</span>
                            </el-form-item>
                            <el-form-item label="售后说明：">
                                <span class="word-breakall">{{ detailsInfo.buyerMessage || '-' }}</span>
                            </el-form-item>
                            <el-form-item label="凭证：">
                                <template v-if="detailsInfo.photoVoucher && detailsInfo.photoVoucher.length">
                                    <ls-image
                                        v-for="(item, index) in detailsInfo.photoVoucher"
                                        :key="index"
                                        class="m-10 v-middle"
                                        style="vertical-align: middle"
                                        :src="item"
                                        :options="{ w: '50', h: '50', br: '4' }"
                                    />
                                </template>
                                <span v-else>-</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="flex-1 ml-20">
                        <!-- 商家处理信息 -->
                        <div>
                            <div class="font-14 font-weight-600" style="line-height: 32px">商家处理信息</div>
                            <el-form-item label="状态：">
                                <p v-if="detailsInfo.applyStatus == -1 || detailsInfo.applyType == -1 || detailsInfo.applyStatus == -2">-</p>
                                <p v-else-if="detailsInfo.sellerStatus == 0" class="status-wait">待确认</p>
                                <p v-else-if="detailsInfo.sellerStatus == 1" class="status-pass">同意</p>
                                <p v-else-if="detailsInfo.sellerStatus == -1" class="status-veto">拒绝</p>
                            </el-form-item>
                            <el-form-item label="处理时间：">{{ detailsInfo.sellerTime || '-' }}</el-form-item>
                            <el-form-item label="商家备注：">{{ detailsInfo.sellerMessage || '-' }}</el-form-item>
                        </div>
                    </div>
                    <div style="flex-basis: 25%" class="ml-20">
                        <div>
                            <div class="font-14 font-weight-600" style="line-height: 32px">平台退款处理</div>
                            <el-form-item label="备注：">{{ detailsInfo.adminMessage || '-' }}</el-form-item>
                            <el-form-item label="状态：">
                                <span :class="[statusClass(detailsInfo)]">{{ refuseStatus(detailsInfo, true, false) }}</span>
                            </el-form-item>
                            <el-form-item label="处理时间：">{{ detailsInfo.adminTime || '-' }}</el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <!--列表-->
            <order-table ref="table" :table-list="tableList" :refuse-info="detailsInfo" @operate="successOperate" />
            <LsSticky :data="tableList">
                <el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <el-button size="small" plain @click="back">返回</el-button>
                    <el-button v-if="orderStatus(detailsInfo) == '待确认'" size="small" plain type="primary" @click="openSubmitDialog(detailsInfo)">
                        确认
                    </el-button>
                    <el-button v-if="orderStatus(detailsInfo) == '待收货'" size="small" plain type="primary" @click="confirmDeliver(detailsInfo)">
                        确认收货
                    </el-button>
                </el-row>
            </LsSticky>
            <!-- 确认表格 -->
            <el-dialog title="确认售后" :visible.sync="orderDialogVisible" custom-class="dialog-form-small">
                <el-form ref="form" :model="form" :rules="rules" label-width="98px" label-position="right" size="small">
                    <el-form-item label="确认类型：" prop="auditFlag">
                        <el-radio-group v-model="form.auditFlag">
                            <el-radio :label="1">同意</el-radio>
                            <el-radio :label="0">拒绝</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        v-if="currentOrder.applyType == 2"
                        class="transition-all05 overflow-h"
                        :style="{ height: form.auditFlag == 1 ? '33px' : '0px' }"
                        label="是否弃货："
                        prop="abandonedGoodFlag"
                    >
                        <el-switch v-model="form.abandonedGoodFlag" active-color="#13ce66" inactive-color="#CCCCCC"></el-switch>
                    </el-form-item>
                    <el-form-item label="审核意见：" prop="sellerMessage">
                        <el-input v-model="form.sellerMessage" :maxlength="100" placeholder="请输入审核意见"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="orderDialogVisible = false">取 消</el-button>
                    <ls-button size="small" type="primary" :async-function="sureSubmit">确 定</ls-button>
                </span>
            </el-dialog>
        </el-card>
    </section>
</template>
<script>
import orderTable from './components/orderTableDetail'
import { serviceOrderApi } from '@/api/ModuleOrder'
import { orderSet } from '@/api/ModuleSystem'
import countDown from '@/components/countDown'
export default {
    components: {
        orderTable,
        countDown
    },
    data() {
        return {
            tableList: [], // 售后关联订单列表
            logisticsArr: [], // 物流数组
            detailsInfo: {}, // 售后订单信息
            id: 0,
            orderDialogVisible: false, // 确认售后订单dialog
            form: {
                abandonedGoodFlag: false, // 是否弃货
                auditFlag: 1, // 	是否通过售后
                refundId: '', // 	退款编号
                sellerMessage: '' // 	卖家备注
            },
            currentOrder: {}, // 激活的售后订单
            rules: {
                abandonedGoodFlag: [{ required: true, message: '是否弃货', trigger: 'blur' }],
                auditFlag: [{ required: true, message: '是否同意', trigger: 'blur' }]
            }
        }
    },
    computed: {
        orderStatus() {
            return function (data, istext = true) {
                if (data.applyStatus == 1 && data.sellerStatus == 0) {
                    return '待确认'
                }
                if (data.applyStatus == -3 || data.sellerStatus == -1) {
                    return '已拒绝'
                }
                if (data.applyStatus == -1 || data.applyStatus == -2) {
                    return '已取消'
                }
                if (data.goodsStatus == 1 && data.sellerStatus == 1) {
                    return '待用户退货'
                }
                if (data.applyStatus == 2) {
                    return '待审核'
                }
                if ((data.goodsStatus == 3 || data.goodsStatus == 5 || data.goodsStatus == 1) && data.sellerStatus == 1) {
                    return '待收货'
                }
                if (data.applyStatus == 3) {
                    return '已退款'
                }
                return '-'
            }
        },
        refuseStatus() {
            // goodsStatus	1为待发货,3为待签收,5为待收货,7为已收货,默认为0
            return function (data, istext = true, isPla = true) {
                if (data.applyStatus == -1 || data.applyStatus == -2) {
                    return istext ? '已取消' : 5
                }
                if (data.applyStatus == -3 || data.sellerStatus == -1) {
                    return istext ? '已拒绝' : 1
                }
                if (data.applyStatus == 3) {
                    return istext ? '已完成' : 5
                }
                if (data.applyStatus == 1 && data.sellerStatus == 0) {
                    return istext ? (isPla ? '待商家确认' : '-') : 1
                }
                if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
                    return istext ? (isPla ? '待商家收货' : '-') : 2
                }
                if (data.applyStatus == 2) {
                    if (data.applyType == 1) {
                        return istext ? '待审核' : 2
                    } else {
                        return istext ? '待审核' : 3
                    }
                }
                if (data.goodsStatus == 1 && data.sellerStatus == 1) {
                    return istext ? '待用户退货' : 2
                }
                return istext ? '-' : 0
            }
        },
        // 状态样式类
        statusClass() {
            return (detailsInfo) => {
                if (detailsInfo.applyStatus == -3 || detailsInfo.sellerStatus == -1) {
                    return 'status-veto'
                }
                if (
                    (detailsInfo.applyStatus == 1 && detailsInfo.sellerStatus == 0) ||
                    (detailsInfo.goodsStatus == 3 && detailsInfo.sellerStatus == 1) ||
                    (detailsInfo.goodsStatus == 5 && detailsInfo.sellerStatus == 1) ||
                    detailsInfo.applyStatus == 2 ||
                    (detailsInfo.goodsStatus == 1 && detailsInfo.sellerStatus == 1)
                ) {
                    return 'status-wait'
                }
                return 'status-done'
            }
        }
    },
    watch: {
        orderDialogVisible(newVal) {
            if (!newVal) {
                this.$refs.form.resetFields()
            }
        }
    },
    mounted() {
        this.id = this.$route.query.id || ''
        this.getDetailsInfo()
    },
    methods: {
        //确认
        openSubmitDialog(order) {
            this.currentOrder = order
            this.$set(this.form, 'refundId', order.id)
            this.orderDialogVisible = true
        },

        // 确认提交
        sureSubmit() {
            return new Promise((resolve) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let api = ''
                        if (this.currentOrder.applyType == 1) {
                            api = 'auditRefund'
                        } else {
                            api = 'auditRefundGood'
                        }
                        // 调接口验证有没有收货地址
                        orderSet.orderSetting().then((res) => {
                            if (res.success) {
                                // 如果已经设置了退货地址，则正常调接口
                                if (res.data && res.data.returnProvinceId && res.data.returnCityId && res.data.returnShopAddr) {
                                    serviceOrderApi[api](this.form)
                                        .then((res) => {
                                            if (res.success) {
                                                this.orderDialogVisible = false
                                                if (res.code) {
                                                    this.$message({
                                                        message: '操作成功',
                                                        type: 'success',
                                                        onClose: this.getDetailsInfo()
                                                    })
                                                }
                                            }
                                        })
                                        .catch((err) => {
                                            console.log('sumit err', err)
                                        })
                                        .finally((_) => {
                                            resolve()
                                        })
                                    // 如果未设置退货地址,则跳去设置
                                } else {
                                    resolve()
                                    this.$confirm('您还未设置退货地址，要去设置退货地址吗?', '提示', {
                                        type: 'warning'
                                    }).then(() => {
                                        this.orderDialogVisible = false
                                        this.$router.push({ name: 'baseSet', query: { switchType: 'ortherSet' } })
                                    })
                                }
                            } else {
                                resolve()
                            }
                        })
                    } else {
                        resolve()
                    }
                })
            })
        },

        //确认收货
        confirmDeliver(row) {
            this.$confirm('确认收货后，不可恢复。确认收货？', '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                serviceOrderApi.confirmDeliver({ refundId: row.id }).then((res) => {
                    if (res.code) {
                        if (res.code) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                onClose: this.getDetailsInfo()
                            })
                        }
                    }
                })
            })
        },
        back() {
            this.$router.go(-1)
        },
        // 获取商品详情
        getDetailsInfo() {
            serviceOrderApi
                .orderRefundDetail({ refundId: this.id })
                .then((res) => {
                    if (res.code == 1) {
                        this.detailsInfo = res.data

                        this.tableList = res.data.orderItemDTOList || []
                        if (res.data.refundReturnLogisticsDTO) {
                            this.logisticsArr = JSON.parse(res.data.refundReturnLogisticsDTO.trackingInformation)
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 操作成功回调
        successOperate(res) {
            if (res.code) {
                this.$message({
                    message: '操作成功',
                    type: 'success',
                    onClose: this.getDetailsInfo()
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
// 订单详情form默认样式修改
.order-form ::v-deep {
    .el-form-item__label {
        font-size: 12px;
    }

    .el-form-item__content {
        font-size: 12px;
        color: #333;
    }

    .el-form-item--small.el-form-item {
        margin-bottom: 0px;
    }

    .el-button--text {
        color: #2d8bef;
    }

    .el-button--text:hover,
    .el-button--text:focus {
        color: #2d8bef;
    }

    .more {
        display: inline-block;
        color: #2d8bef;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        padding: 12px 0;
    }

    .more:hover > .more-info {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        position: absolute;
        left: 120%;
        top: -100%;
        width: 180px;
        height: 96px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        color: #333;
        padding-left: 10px;
    }

    .more-info {
        display: none;
    }
}

.order {
    .order-wrapper {
        flex-basis: 500px;

        .order-status {
            font-size: 18px;
            font-weight: bold;
            color: #f56c6c;
            margin-bottom: 5px;
            margin-top: 0;
        }

        .order-info {
            font-size: 12px;
            color: #f56c6c;
            margin-bottom: 24px;
        }

        .count-down {
            font-size: 14px;
            color: #f56b6b;
            font-weight: bold;
        }

        .order-code {
            font-size: 12px;
            font-weight: 400;
            color: #999999;
        }
    }

    .order-line {
        width: 1px;
        height: 200px;
        background: rgba(231, 233, 235, 1);
        margin: 0 20px;
    }

    // 步骤条默认样式修改
    .order-step ::v-deep {
        // width: 95%;
        // margin: 0 auto;

        .el-step.is-horizontal {
            flex: 1 !important;
        }

        .el-step.is-horizontal .el-step__line {
            height: 1px;
        }

        .el-step__title {
            font-size: 14px;
        }
    }

    // 滚动条默认样式修改
    .time-scoll ::v-deep {
        .el-scrollbar__thumb {
            left: -20px;
        }
    }

    // 时间线样式修改
    .express-step ::v-deep {
        height: 150px;
        width: 100%;
        margin-top: 5px;
        padding-left: 5px;

        .el-timeline-item__node--normal {
            width: 8px;
            height: 8px;
        }

        .el-timeline-item {
            padding-bottom: 13px;
        }

        .el-timeline-item__tail {
            left: 2px;
        }
    }
}

.check {
    .settle-title {
        display: inline-block;
        width: 135px;
        text-align: right;
        font-size: 12px;
    }

    .money {
        display: inline-block;
        width: 80px;
        text-align: right;
        font-size: 12px;
    }

    .total {
        display: inline-block;
        width: 80px;
        color: #f56b6b;
        text-align: right;
        font-size: 18px;
        font-weight: bold;
        line-height: 6px;
    }
}

/* 由于使用了字数提示 但是ELEMENT并未做好处理 当输入过长时 输入的字符会被字数提示(position:absolute)给遮挡 */
.el-input {
    ::v-deep .el-input__inner {
        padding-right: 46px;
    }
}
</style>
