<template>
    <section class="">
        <!-- 进度 -->
        <div class="mb-20">
            <div class="p-10 bg-fff rounded-4 flex-start">
                <i class="iconfont icon-tanhao text-warning" />
                <div class="ml-10 font-12">
                    <div v-if="detailsInfo.applyStatus == '2'">商家申请取消订单后，需要平台审核。</div>
                    <div v-if="detailsInfo.applyStatus == '3'">平台审核同意，订单状态变为已取消</div>
                    <div v-if="detailsInfo.applyStatus == '-4'">平台审核拒绝，商家可重新申请。</div>
                    <div v-if="detailsInfo.applyStatus == '-1'">商家撤回申请，不需要平台审核，商家可重新申请。</div>
                </div>
            </div>
        </div>
        <div class="mb-20">
            <el-card shadow>
                <div class="d-flex a-center order p-20">
                    <div class="d-flex flex-column a-center order-wrapper">
                        <h1 class="order-status">{{ refuseStatus(detailsInfo) }}</h1>
                        <p class="order-code">售后编号: {{ detailsInfo.refundSn }}</p>
                    </div>
                    <div class="order-line" style="" />
                    <div class="flex-1 d-flex j-center">
                        <el-steps
                            class="order-step w-100"
                            :space="200"
                            :active="refuseStatus(detailsInfo, false)"
                            finish-status="success"
                            align-center
                        >
                            <el-step :description="detailsInfo.createTime" title="商家申请" />
                            <el-step v-if="detailsInfo.applyStatus == '-1'" :description="detailsInfo.sellerTime" title="商家撤回" status="error" />
                            <template v-else>
                                <el-step
                                    :description="detailsInfo.adminTime"
                                    title="平台审核"
                                    :status="detailsInfo.applyStatus == '-4' ? 'error' : undefined"
                                />
                                <el-step :description="detailsInfo.applyStatus == '-4' ? '--' : detailsInfo.adminTime" title="订单取消" />
                            </template>
                        </el-steps>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 商品表格 -->
        <el-card shadow>
            <el-form label-width="90px" label-position="left" size="small" class="order-form mb-20">
                <div class="d-flex p-20" style="background-color: #f5f7fa">
                    <div class="flex-1 ml-20">
                        <!-- 退款信息 -->
                        <div>
                            <div class="font-14 font-weight-600" style="line-height: 32px">退款信息</div>
                            <el-form-item label="申请时间：">{{ detailsInfo.createTime }}</el-form-item>
                            <el-form-item label="订单编号：">{{ detailsInfo.orderNumber }}</el-form-item>
                            <el-form-item label="取消原因：">{{ detailsInfo.reason }}</el-form-item>
                            <el-form-item label="备注说明：">{{ detailsInfo.sellerMessage || '-' }}</el-form-item>
                        </div>
                    </div>
                    <div style="flex-basis: 25%" class="ml-20">
                        <div>
                            <div class="font-14 font-weight-600" style="line-height: 32px">平台退款处理</div>
                            <el-form-item label="备注：">{{ detailsInfo.remark || '-' }}</el-form-item>
                            <el-form-item label="状态：">{{ refuseStatus(detailsInfo, true, false) }}</el-form-item>
                            <el-form-item label="处理时间：">{{ detailsInfo.adminTime || '-' }}</el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <!--列表-->
            <order-table ref="table" :table-list="tableList" :refuse-info="detailsInfo" @operate="successOperate" />
            <el-row type="flex" justify="end" class="mt-30">
                <el-button size="small" plain @click="back">返回</el-button>
                <el-button v-if="orderStatus(detailsInfo) == '待确认'" size="small" plain type="primary" @click="openSubmitDialog(detailsInfo)">
                    撤回
                </el-button>
            </el-row>
            <!-- 确认表格 -->
        </el-card>
    </section>
</template>
<script>
import orderTable from './components/orderTableDetail'
import { serviceOrderApi } from '@/api/ModuleOrder'
export default {
    components: {
        orderTable
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
                remark: '' // 	卖家备注
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
            // 待审核（2） 已同意（3）已取消（-1） 已拒绝(-4)
            return function (data, istext = true, isPla = true) {
                if (data.applyStatus == 2 || data.applyStatus == -2) {
                    return istext ? '待审核' : 1
                }
                if (data.applyStatus == -1 || data.applyStatus == -2) {
                    return istext ? (isPla ? '已撤回' : '-') : 5
                }
                if (data.applyStatus == -4 || data.sellerStatus == -1) {
                    return istext ? '已拒绝' : 2
                }
                if (data.applyStatus == 3) {
                    return istext ? '已完成' : 3
                    // return 5
                    // return '已完成'
                }
                if (data.applyStatus == -1) {
                    return istext ? '已完成' : 2
                    // return 5
                    // return '已完成'
                }
                return 0
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
        this.orderNumber = this.$route.query.orderNumber || ''
        this.getDetailsInfo()
    },
    methods: {
        back() {
            this.$router.back()
        },
        // 获取商家退款详情
        getDetailsInfo() {
            serviceOrderApi
                .orderRefundPageCancelOrder({ orderNumber: this.orderNumber })
                .then((res) => {
                    if (res.code == 1) {
                        this.detailsInfo = res.data.resultList[0]
                        this.tableList = res.data.resultList[0].orderItemDTOList || []
                        this.$forceUpdate()
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
