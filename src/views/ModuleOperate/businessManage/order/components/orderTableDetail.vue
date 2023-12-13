<template>
    <div class="customTable__warp table">
        <el-table
            ref="multipleTable"
            :data="tableList"
            tooltip-effect="dark"
            class="w-100"
            :span-method="orderInfo.orderType == 'P' ? preSellSpanMethod : normalSpanMethod"
            row-class-name="hoverStyle"
            header-row-class-name="headerRow"
        >
            <el-table-column prop="pic" label="商品" width="280">
                <template slot-scope="scope">
                    <div v-if="!scope.row.title" class="d-flex a-center line-h-md">
                        <ls-image style="flex: 0 0 60px" :src="scope.row.pic" :options="{ w: '60', h: '60', br: '4' }" />
                        <div class="ml-10 flex-col-between">
                            <el-link :underline="false" type="primary">
                                <el-popover placement="top-start" width="500" trigger="hover" :content="scope.row.productName">
                                    <div slot="reference" class="text-blue line-clamp2 text-left">{{ scope.row.productName }}</div>
                                </el-popover>
                            </el-link>
                            <div v-if="scope.row.attribute" class="text-left text-999 mt-10">
                                <span>{{ scope.row.attribute }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        {{ scope.row.title }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="单价">
                <template slot-scope="scope">
                    <div v-if="!scope.row.title">
                        <div>{{ scope.row.price | priceFilter }}</div>
                    </div>
                    <div v-else>{{ scope.row.price | priceFilter }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="basketCount" label="数量">
                <template slot-scope="scope">
                    <div v-if="!scope.row.title">{{ scope.row.basketCount || '-' }}</div>
                    <div v-else>
                        <div
                            v-if="scope.$index === 1 && (orderInfo.preSellOrderBO.payPctType === 0 || orderInfo.preSellOrderBO.payPctType === 1)"
                        ></div>
                        <div v-else-if="scope.$index !== 1 && scope.$index !== 3">
                            尾款支付时间：{{ scope.row.finalMStart }} - {{ scope.row.finalMEnd }}
                        </div>
                        <div v-else>发货时间：{{ scope.row.preDeliveryTime || '-' }} 开始发货</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="订单类型" align="center">
                <template slot-scope="scope">
                    <span v-if="!scope.row.title">{{ orderType[orderInfo.orderType] }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="用户信息" align="center" width="200px">
                <template slot-scope="scope">
                    <el-badge value="会员" type="warning" :hidden="!orderInfo.isMember">
                        <p class="text-blue">{{ orderInfo.nickName }}{{ scope.row.isMember }}</p>
                    </el-badge>
                    <p>{{ orderInfo.receiver }}</p>
                    <p>{{ orderInfo.mobile }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="实付款" align="center" width="160px">
                <template slot-scope="scope">
                    <div>
                        <span>{{ orderInfo.actualTotalPrice | priceFilter }}</span>
                        <br />
                        <span>(含运费：{{ orderInfo.freightPrice | priceFilter }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="店铺信息" align="center">
                <template>
                    <p class="text-blue">{{ orderInfo.shopName }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="交易状态" align="center">
                <template slot-scope="scope">
                    <span v-if="!scope.row.title" :class="'1,5,10,15'.includes(orderInfo.status) ? 'status-wait' : 'status-done'">
                        {{ orderInfo.status | getOrderStatus(orderInfo.orderType) }}
                    </span>
                    <div v-else>
                        <span v-if="orderInfo.preSellOrderBO.depositPayTime && scope.$index === 1">已支付</span>
                        <span
                            v-else-if="
                                scope.row.title === '阶段3，发货' ||
                                (orderInfo.preSellOrderBO && orderInfo.preSellOrderBO.payPctType === 0 && orderInfo.status !== -5)
                            "
                        ></span>
                        <span v-else :class="{ 'status-wait': !(orderInfo.preSellOrderBO.payFinalTime || orderInfo.status == -5) }">
                            {{ orderInfo.preSellOrderBO.payFinalTime ? '已支付' : orderInfo.status == -5 ? '已取消' : '待支付' }}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="售后状态" align="center" width="120">
                <template slot-scope="scope">
                    <span :class="refundStatus(scope.row).status">{{ refundStatus(scope.row).msg }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="交易操作" align="center">
                <template slot-scope="scope">
                    <el-link class="text-blue" :underline="false" @click="goOrderPrint">打印订单</el-link>
                    <el-link v-if="scope.row.refundId" class="text-blue" :underline="false" @click="toRefuseDetail(scope.row)">查看售后</el-link>
                    <template v-if="orderInfo.status == '5' && (!orderInfo.refundStatus || orderInfo.refundStatus === 3)">
                        <el-link
                            v-if="orderInfo.orderType != 'SM'"
                            :underline="false"
                            class="d-block text-blue"
                            @click="showDialog(orderInfo, 'deliver')"
                        >
                            确认发货
                        </el-link>
                        <el-link v-else :underline="false" class="d-block text-blue" @click="sureStockUp(orderInfo)">备货完毕</el-link>
                    </template>
                    <el-link
                        v-if="
                            (orderInfo.status == '5' || orderInfo.status == '2' || orderInfo.status == '3') &&
                            (orderInfo.refundStatus === 0 || orderInfo.refundStatus === 3)
                        "
                        :underline="false"
                        class="d-block text-blue"
                        @click="showDialog(orderInfo, 'applyCancel')"
                    >
                        申请取消订单
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="actionMap[currentAction].title" :visible.sync="orderDialog" custom-class="dialog-form-small">
            <div v-if="currentAction == 'applyCancel'" slot="title">
                <span>申请取消订单</span>
                <el-popover placement="right" width="500" trigger="hover">
                    <div class="font-12">
                        取消订单需商家与消费者达成一致后，提交系统审核通过后才能取消；平台审核通过前，用户无法在用户端查看申请取消订单进度和任何信息，若用户申请退款，退款优先于高于申请取消订单，申请取消订单数据系统自动关闭并且只保留退款数据商家端默认同意退款并提交平台审核；
                    </div>
                    <i slot="reference" class="el-icon-question text-light-muted"></i>
                </el-popover>
            </div>
            <div>
                <el-form ref="form" :model="form" label-width="98px" label-position="right" size="small">
                    <!-- //取消订单(已付款待发货) -->
                    <template v-if="currentAction == 'applyCancel'">
                        <el-form-item label="取消原因：" prop="reason" :rules="[{ required: true, message: '请选择取消原因' }]">
                            <el-select v-model="form.reason" placeholder="请选择">
                                <el-option v-for="item in reasonList_paid" :key="item.id" :label="item.value" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注说明：" prop="sellerMessage" :rules="[{ required: true, message: '请输入内容' }]">
                            <el-input v-model="form.sellerMessage" placeholder="请输入内容" clearable :maxlength="50" />
                        </el-form-item>
                    </template>

                    <!-- //确认发货 -->
                    <template v-if="currentAction == 'deliver'">
                        <el-form-item label="快递公司：" prop="logisticsCompanyId" :rules="[{ required: true, message: '请选择快递公司' }]">
                            <el-select v-model="form.logisticsCompanyId" placeholder="请选择">
                                <el-option v-for="item in logisticsList" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快递单号：" prop="logisticsNumber" :rules="[{ required: true, message: '请填写快递单号' }]">
                            <el-input v-model="form.logisticsNumber" placeholder="请输入内容" clearable />
                        </el-form-item>
                    </template>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="orderDialog = false">取 消</el-button>
                <ls-button size="small" type="primary" :async-function="orderSumbit">确 定</ls-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { orderApi, serviceOrderApi } from '@/api/ModuleOrder.js'
import { debounce } from '@/utils/utils.js'
export default {
    components: {},
    filters: {
        getOrderStatus(status, orderType) {
            const orderStatusDict = {
                1: '待付款',
                2: '待成团',
                3: '已付定金',
                5: '待发货',
                10: '待签收',
                15: '待收货',
                20: '已完成',
                [-5]: '已取消'
            }
            return orderStatusDict[status] || '-'
        }
    },
    props: {
        tableList: {
            type: [Object, Array],
            required: true
        },
        orderInfo: {
            type: [Object, Array],
            required: true
        }
    },
    data() {
        return {
            orderType: {
                O: '普通订单',
                P: '预售订单',
                G: '团购订单',
                S: '秒杀订单',
                MG: '拼团订单',
                SM: '门店自提订单'
            },
            actionMap: {
                // 操作对应map操作
                deliver: {
                    title: '确认发货',
                    method: 'insertLogistic',
                    message: '发货成功'
                },
                applyCancel: {
                    title: '申请取消订单',
                    method: 'applyCancel',
                    message: '申请取消订单成功'
                }
            },
            currentAction: 'deliver',
            form: {},
            reasonList_paid: [],
            logisticsList: [],
            orderDialog: false
        }
    },
    computed: {},
    watch: {
        orderInfo: {
            handler(n) {
                console.log(n, 'nn')
            },
            deep: true
        },
        orderDialog(newVal) {
            if (!newVal) {
                Object.assign(this.form, {})
            }
        }
    },
    mounted() {
        console.log(this.orderInfo, '666')
        this.getBaseInfo()
    },
    methods: {
        // 预售订单表格合并
        preSellSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex != 0) {
                if (columnIndex === 2) {
                    return [1, 5]
                } else if (columnIndex === 3) {
                    return [0, 0]
                } else if (columnIndex === 4) {
                    return [0, 0]
                } else if (columnIndex === 5) {
                    return [0, 0]
                } else if (columnIndex === 6) {
                    return [0, 0]
                } else if (columnIndex === 7) {
                    return [1, 3]
                } else if (columnIndex === 8) {
                    return [0, 0]
                } else if (columnIndex === 9) {
                    return [0, 0]
                }
            }
        },
        //普通订单表格合并
        normalSpanMethod({ row, column, rowIndex, columnIndex }) {
            if ((columnIndex >= 3 && columnIndex <= 7) || columnIndex == 9) {
                if (rowIndex == 0) {
                    return {
                        rowspan: this.tableList.length, //合并的行数
                        colspan: 1 //合并的列数
                    }
                } else {
                    return [0, 0]
                }
            }
        },
        // 去售后订单详情
        toRefuseDetail(row) {
            // applyType为1、2是退货、退款，为3是商家申请取消订单
            if (this.orderInfo?.orderAftersalesInformationDTO?.applyType == 3) {
                this.$router.push({ name: 'shopApplicationDetail', query: { orderNumber: this.orderInfo.orderNumber } })
            } else {
                this.$router.push({ name: 'refuseDetail', query: { id: row.refundId } })
            }
        },
        //打印订单
        goOrderPrint() {
            this.$emit('printOrder')
        },
        refundStatus(data) {
            if (data.applyStatus == 1 && data.sellerStatus == 0) {
                return {
                    msg: '待商家确认',
                    status: 'status-wait'
                }
            }
            if (data.applyStatus == -3) {
                return {
                    msg: '已拒绝',
                    status: 'status-veto'
                }
            }
            if (data.goodsStatus == 1 && data.sellerStatus == 1) {
                return {
                    msg: '待用户退货',
                    status: 'status-wait'
                }
            }
            if (data.applyStatus == 2) {
                return {
                    msg: '待审核',
                    status: 'status-wait'
                }
            }
            if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
                return {
                    msg: '待商家收货',
                    status: 'status-wait'
                }
            }
            if (data.applyStatus == 3) {
                return {
                    msg: '已完成',
                    status: 'status-done'
                }
            }
            if (data.applyStatus == -1 || data.applyStatus == -2) {
                return {
                    msg: '已取消',
                    status: 'status-done'
                }
            }
            if (data.refundStatus == 0) {
                return {
                    msg: '未申请',
                    status: 'status-done'
                }
            }
            return {
                msg: '-',
                status: 'status-done'
            }
        },
        orderSumbit() {
            return new Promise(async (resolve) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        orderApi[this.actionMap[this.currentAction].method](this.form)
                            .then((res) => {
                                if (res.code == 1) {
                                    this.orderDialog = false
                                    Object.assign(this.form, defalutForm)
                                    this.$message.success(this.actionMap[this.currentAction].message)
                                    this.$emit('refreshData')
                                }
                            })
                            .finally((_) => {
                                resolve()
                            })
                    } else {
                        resolve()
                    }
                })
            })
        },
        getBaseInfo() {
            orderApi.getLogisticsCompany().then((res) => {
                if (res.code == 1) {
                    this.logisticsList = res.data
                }
            })
            serviceOrderApi.refundReason().then((res) => {
                if (res.code) {
                    this.reasonList_paid = res.data
                }
            })
        },
        showDialog(item, dialogType) {
            // applyCancel
            //
            this.currentAction = dialogType
            this.currentOrder = item
            this.orderDialog = true
            this.form.orderNumber = item.orderNumber
            this.form.orderId = item.id
            //如果是调整订单需要赋值然后计算
            if (dialogType == 'adjustOrder') {
                this.form.freight = item.freightPrice
                this.form.orderAmount = item.actualTotalPrice * 1 - item.freightPrice * 1
                this.form.oldOrderAmount = item.actualTotalPrice * 1 - item.freightPrice * 1
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },

        // 备货完毕
        sureStockUp(item) {
            this.$confirm('是否确认备货完毕？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                orderApi
                    .insertStockup({
                        orderNumber: item.orderNumber
                    })
                    .then((res) => {
                        if (res.code) {
                            this.$message.success('操作成功')
                            this.$emit('refreshData')
                        }
                    })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.iconfont {
    font-size: 12px;
    margin-right: 5px;
}
.trStyle {
    display: flex;
    justify-content: center;
}
.customTable__table {
    td {
        &:first-child {
            width: auto;
        }
    }
}
//清除合并表格后鼠标悬浮背景色问题
>>> .hoverStyle {
    &:hover > td {
        background: #fff !important;
    }
}
</style>
