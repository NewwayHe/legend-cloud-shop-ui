<template>
    <section class="">
        <!-- 进度 -->
        <div class="mb-20">
            <el-card shadow>
                <div class="d-flex a-center order p-20">
                    <div class="d-flex flex-column a-center order-wrapper">
                        <h1 class="order-status">{{ orderStatus(detailsInfo.status) }}</h1>
                        <p class="order-code">订单编号: {{ detailsInfo.orderNumber }}</p>
                    </div>
                    <div class="order-line" style="" />
                    <div class="flex-1 d-flex j-center">
                        <el-steps
                            :key="stepsKey"
                            class="order-step"
                            :space="200"
                            :active="orderStatus(detailsInfo.status, false)"
                            finish-status="success"
                            align-center
                        >
                            <el-step :description="detailsInfo.payTime" title="待付款" :status="stepStatus(detailsInfo, 1)" />
                            <el-step
                                v-if="detailsInfo.orderType === 'P' && detailsInfo.preSellOrderBO.payPctType === 1"
                                :description="detailsInfo.preSellOrderBO.depositPayTime"
                                title="支付定金"
                            />
                            <el-step
                                v-if="detailsInfo.orderType === 'P' && detailsInfo.preSellOrderBO.payPctType === 1"
                                :description="detailsInfo.preSellOrderBO.payFinalTime"
                                title="支付尾款"
                            />
                            <el-step v-if="detailsInfo.orderType === 'MG' || detailsInfo.orderType === 'G'" :description="'-'" title="待成团" />
                            <el-step :description="detailsInfo.deliveryTime" title="待发货" :status="stepStatus(detailsInfo, 3)" />
                            <el-step :description="detailsInfo.logisticsReceivingTime" title="待签收" :status="stepStatus(detailsInfo, 4)" />
                            <el-step :description="detailsInfo.completeTime" title="待收货" :status="stepStatus(detailsInfo, 5)" />
                            <el-step :description="detailsInfo.completeTime" title="已完成" :status="stepStatus(detailsInfo, 6)" />
                            <el-step v-if="detailsInfo.status == -5" :description="''" title="已取消" :status="stepStatus(detailsInfo, 7)" />
                        </el-steps>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 商品表格 -->
        <div class="">
            <el-card shadow>
                <!-- 快递 -->
                <div v-if="detailsInfo.status > 5" class="mb-20">
                    <div v-if="detailsInfo.orderLogisticsDTO" class="d-flex order p-20" style="background-color: #f5f7fa">
                        <div class="flex-col-start order-wrapper font">
                            <el-form label-width="90px" label-position="left" size="small" class="order-form" style="flex-basis: auto; width: 300px">
                                <p class="font-14 font-weight-600 flex-start" style="line-height: 32px">
                                    配送信息
                                    <el-link
                                        v-if="detailsInfo.status == '10' || detailsInfo.status == '15'"
                                        class="ml-10 font-14 cursor-pointer iconfont icon-bianji3"
                                        type="primary"
                                        :underline="false"
                                        @click="updateLogisticDialog = true"
                                    ></el-link>
                                </p>
                                <el-form-item label="配送方式：">
                                    <span class="text-pre-wrap">{{ detailsInfo.orderLogisticsDTO.logisticsCompany || '-' }}</span>
                                </el-form-item>
                                <el-form-item label="单号：">
                                    <span class="text-pre-wrap">{{ detailsInfo.orderLogisticsDTO.shipmentNumber || '-' }}</span>
                                </el-form-item>
                            </el-form>
                            <ls-image :src="detailsInfo.orderItemDTOList[0].pic" :options="{ w: '80', h: '80', br: '4' }" class="mt-20" />
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
                <el-form
                    v-if="detailsInfo.orderAftersalesInformationDTO"
                    label-width="90px"
                    label-position="left"
                    size="small"
                    class="order-form mb-20"
                >
                    <div class="d-flex p-20" style="background-color: #f5f7fa">
                        <div class="flex-1">
                            <div>
                                <div class="font-14 font-weight-600" style="line-height: 32px">售后信息</div>
                                <el-form-item label="" size="small" label-width="0">
                                    {{ detailsInfo.orderAftersalesInformationDTO.applyType === 3 ? '商家申请取消' : '用户申请售后' }}
                                </el-form-item>
                                <el-form-item v-if="detailsInfo.orderAftersalesInformationDTO.applyType !== 3" label="售后编号：">
                                    <span class="word-breakall">{{ detailsInfo.orderAftersalesInformationDTO.refundSn || '-' }}</span>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="flex-1 ml-20">
                            <!-- 配送信息 -->
                            <div v-if="detailsInfo.orderAftersalesInformationDTO.applyType !== 3">
                                <el-form-item label="售后类型：">
                                    {{ detailsInfo.orderAftersalesInformationDTO.applyType == 1 ? '仅退款' : '退货' }}
                                </el-form-item>
                                <el-form-item label="申请时间：">{{ detailsInfo.orderAftersalesInformationDTO.createTime || '-' }}</el-form-item>
                                <el-form-item label="状态：">{{ detailsInfo.orderAftersalesInformationDTO.statusInformation || '-' }}</el-form-item>
                            </div>
                            <div v-else>
                                <el-form-item label="取消原因：">
                                    {{ detailsInfo.orderAftersalesInformationDTO.reason || '-' }}
                                    <span class="ml-10">
                                        <el-link
                                            type="primary"
                                            :underline="false"
                                            @click="
                                                $router.push({
                                                    name: 'shopApplicationDetail',
                                                    query: { id: detailsInfo.id, orderNumber: detailsInfo.orderNumber }
                                                })
                                            "
                                        >
                                            查看详情>
                                        </el-link>
                                    </span>
                                </el-form-item>
                                <el-form-item label="备注说明：">{{ detailsInfo.orderAftersalesInformationDTO.sellerMessage || '-' }}</el-form-item>
                                <el-form-item label="状态：">{{ detailsInfo.orderAftersalesInformationDTO.statusInformation || '-' }}</el-form-item>
                            </div>
                        </div>
                    </div>
                </el-form>

                <el-form label-width="90px" label-position="left" size="small" class="order-form mb-20">
                    <div class="d-flex p-20" style="background-color: #f5f7fa">
                        <div class="flex-1">
                            <div>
                                <div class="font-14 font-weight-600" style="line-height: 32px">收货人信息</div>
                                <el-form-item label="收货人：" size="small">
                                    {{ detailsInfo.receiver || '-' }}
                                </el-form-item>
                                <el-form-item label="地址：">
                                    <span class="word-breakall">{{ detailsInfo.receiverAddress || '-' }}</span>
                                </el-form-item>
                                <el-form-item label="手机号码">
                                    {{ detailsInfo.mobile || '-' }}
                                </el-form-item>
                                <el-form-item v-if="detailsInfo.orderType != 'I'" label="买家留言：">{{ detailsInfo.message || '-' }}</el-form-item>
                                <el-form-item label="备注：">
                                    <span class="word-breakall">{{ detailsInfo.remark || '-' }}</span>
                                </el-form-item>
                                <el-button v-if="detailsInfo.remark == null" class="font" type="text" @click="showDialog()">添加备注</el-button>
                            </div>
                        </div>
                        <div class="flex-1 ml-20">
                            <!-- 配送信息 -->
                            <div>
                                <div class="font-14 font-weight-600" style="line-height: 32px">配送信息</div>
                                <el-form-item label="配送方式：">快递</el-form-item>
                                <el-form-item label="运费：">{{ detailsInfo.freightPrice | priceFilter }}</el-form-item>
                            </div>
                            <!-- 发票信息 -->
                            <div v-if="detailsInfo.orderType != 'I'" style="margin-top: 32px">
                                <div class="font-14 font-weight" style="line-height: 32px">发票信息</div>
                                <div v-if="detailsInfo.needInvoiceFlag">
                                    <el-form-item label="发票类型：">
                                        {{ detailsInfo.invoiceType == 'NORMAL' ? '普通发票' : '增值税专票' }}
                                    </el-form-item>
                                    <el-form-item :label="detailsInfo.invoiceType == 'NORMAL' ? '发票抬头：' : '公司名称：'">
                                        {{
                                            `${
                                                detailsInfo.invoiceType == 'NORMAL'
                                                    ? detailsInfo.invoiceTitleType == 'PERSONAL'
                                                        ? '[个人抬头]'
                                                        : '[企业抬头]'
                                                    : ''
                                            } `
                                        }}{{ detailsInfo.invoiceCompany }}
                                    </el-form-item>
                                    <el-form-item
                                        v-if="detailsInfo.invoiceTitleType == 'COMPANY' || detailsInfo.invoiceType == 'DEDICATED'"
                                        label="纳税人编号："
                                    >
                                        {{ detailsInfo.invoiceHumNumber }}
                                    </el-form-item>
                                    <div v-if="detailsInfo.invoiceType == 'DEDICATED'">
                                        <el-form-item label="开户银行：">{{ detailsInfo.invoiceDepositBank }}</el-form-item>
                                        <el-form-item label="开户账号：">{{ detailsInfo.invoiceBankAccountNum }}</el-form-item>
                                        <el-form-item label="注册地址：">{{ detailsInfo.invoiceRegisterAddr }}</el-form-item>
                                        <el-form-item label="注册电话：">{{ detailsInfo.invoiceRegisterPhone }}</el-form-item>
                                    </div>
                                </div>
                                <div v-else>
                                    <el-form-item label="开具发票："><div>不开具</div></el-form-item>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 ml-20">
                            <!-- 付款信息 -->
                            <div>
                                <div class="font-14 font-weight-600" style="line-height: 32px">付款信息</div>
                                <template v-if="detailsInfo.orderType != 'I'">
                                    <template v-if="detailsInfo.payTime">
                                        <el-form-item label="付款方式：">{{ detailsInfo.payTypeName || '-' }}</el-form-item>
                                        <el-form-item label="付款时间：">{{ detailsInfo.payTime || '-' }}</el-form-item>
                                    </template>
                                    <el-form-item label="商品总额：">{{ detailsInfo.totalPrice | priceFilter }}</el-form-item>
                                    <el-form-item label="运费：">{{ detailsInfo.freightPrice | priceFilter }}</el-form-item>
                                    <el-form-item label="应付金额：">{{ detailsInfo.actualTotalPrice | priceFilter }}</el-form-item>
                                    <el-form-item label="订单优惠：">
                                        <span>-{{ discountTotal | priceFilter }}</span>
                                        <el-popover placement="right" width="220" trigger="hover" popper-class="detailPop">
                                            <div class="font-12">
                                                <p>
                                                    <span class="d-inline-block" style="width: 80px">促销优惠：</span>
                                                    <span class="ml-10">-{{ detailsInfo.discountTotalAmount | priceFilter }}</span>
                                                </p>
                                                <p>
                                                    <span class="d-inline-block" style="width: 80px">平台优惠券：</span>
                                                    <span class="ml-10">-{{ detailsInfo.platformCouponAmount | priceFilter }}</span>
                                                </p>
                                                <p>
                                                    <span class="d-inline-block" style="width: 80px">店铺优惠券：</span>
                                                    <span class="ml-10">-{{ detailsInfo.couponAmount | priceFilter }}</span>
                                                </p>
                                                <p v-if="detailsInfo.selfPurchaseAmount">
                                                    <span class="d-inline-block" style="width: 80px">自购返优惠：</span>
                                                    <span class="ml-10">-{{ detailsInfo.selfPurchaseAmount | priceFilter }}</span>
                                                </p>
                                            </div>
                                            <el-link slot="reference" :underline="false" type="primary" class="font-12 ml-5 line-h v-baseline">
                                                优惠明细
                                            </el-link>
                                        </el-popover>
                                    </el-form-item>
                                </template>
                            </div>

                            <!-- 结算信息 -->
                            <div v-if="detailsInfo.orderType == 'I'" style="margin-top: 32px">
                                <div class="font-weight-600 font-14" style="line-height: 32px">结算信息</div>
                                <el-form-item label="结算价：">{{ detailsInfo.settlementPrice | priceFilter }}</el-form-item>
                            </div>
                        </div>
                    </div>
                </el-form>
                <!--列表-->
                <orderTable ref="table" :table-list="tableList" :order-info="detailsInfo" @printOrder="goOrderPrint" @refreshData="getDetailsInfo" />
                <el-row type="flex" justify="end" class="mt-20">
                    <div class="check">
                        <div class="mb-20 flex-center">
                            <span class="settle-title">商品总额：</span>
                            <span class="money">{{ detailsInfo.totalPrice | priceFilter }}</span>
                        </div>
                        <div class="mb-20 flex-center">
                            <span class="settle-title">商品优惠：</span>
                            <span class="money">-{{ detailsInfo.totalDiscountAmount | priceFilter }}</span>
                        </div>
                        <div v-if="detailsInfo.changedPrice && detailsInfo.changedPrice != 0" class="mb-20 flex-center">
                            <span class="settle-title">商家改价：</span>
                            <span class="money">{{ detailsInfo.changedPrice > 0 ? '+' : '' }} {{ detailsInfo.changedPrice | priceFilter }}</span>
                        </div>
                        <div v-if="detailsInfo.orderType != 'SM'" class="mb-20 flex-center">
                            <span class="settle-title">运费：</span>
                            <span class="money">{{ detailsInfo.freightPrice | priceFilter }}</span>
                        </div>
                        <div class="mb-20 flex-center">
                            <span class="settle-title">应付总额：</span>
                            <span class="total">{{ detailsInfo.actualTotalPrice | priceFilter }}</span>
                        </div>
                    </div>
                </el-row>
                <LsSticky :data="tableList">
                    <el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
                        <el-button size="small" plain @click="back">返回</el-button>
                    </el-row>
                </LsSticky>
            </el-card>
        </div>
        <!-- 取消订单/调整订单 -->
        <el-dialog title="添加备注" :visible.sync="cancelDialog" custom-class="dialog-form-small remarkDialog" @close="$refs.form.resetFields()">
            <div>
                <el-form ref="form" :model="form" label-width="98px" label-position="right" size="small">
                    <el-form-item label="添加备注：" prop="remark" :rules="{ required: true, trigger: 'blur', message: '备注不能为空' }">
                        <el-input v-model="form.remark" :maxlength="100" placeholder="请输入内容" show-word-limit />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="debounceSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改物流 -->
        <el-dialog
            title="添加备注"
            :visible.sync="updateLogisticDialog"
            custom-class="dialog-form-small remarkDialog"
            width="500px"
            @close="$refs.updateLogisticForm.resetFields()"
        >
            <div class="d-flex">
                <el-form ref="updateLogisticForm" class="flex-1" :model="updateLogisticForm" label-width="98px" label-position="right" size="small">
                    <el-form-item label="快递公司：" prop="logisticsCompanyId" :rules="[{ required: true, message: '请选择快递公司' }]">
                        <el-select v-model="updateLogisticForm.logisticsCompanyId" placeholder="请选择">
                            <el-option v-for="item in logisticsList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号：" prop="logisticsNumber" :rules="[{ required: true, message: '请填写快递单号' }]">
                        <el-input v-model="updateLogisticForm.logisticsNumber" placeholder="请输入内容" :maxlength="30" clearable />
                    </el-form-item>
                </el-form>
                <el-link
                    type="primary"
                    :underline="false"
                    class="w-100p ml-10"
                    style="width: 85px; align-self: baseline"
                    @click="$router.push({ name: 'logistics' })"
                >
                    新增快递公司
                </el-link>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="updateLogisticDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="updateLogistic">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import orderTable from './components/orderTableDetail'
import { orderApi } from '@/api/ModuleOrder'
export default {
    components: {
        orderTable
    },
    data() {
        return {
            stepsKey: 0,
            tableList: [],
            cancelDialog: false,
            updateLogisticDialog: false,
            form: {
                remark: ''
            },
            // url: {
            // 	getData: '/admin/order/page'
            // },
            logisticsArr: [], //物流数组
            logisticsList: [],
            detailsInfo: {},
            updateLogisticForm: {}
        }
    },
    computed: {
        orderStatus() {
            return (state, istext = true) => {
                const stateText = {
                    1: istext ? '待付款' : 0,
                    2: istext ? '待成团' : 1,
                    3: istext ? '待付尾款' : 2,
                    5: istext ? '待发货' : 1,
                    10: istext ? '待签收' : 2,
                    15: istext ? '待收货' : 3,
                    20: istext ? '已完成' : 5,
                    '-5': istext ? '已取消' : 5
                }
                if (!istext) {
                    if ((this.detailsInfo.orderType === 'G' || this.detailsInfo.orderType === 'MG') && state >= 5) {
                        return stateText[state] + 1
                    }
                    if (
                        this.detailsInfo.orderType === 'P' &&
                        this.detailsInfo.preSellOrderBO.payPctType == 1 &&
                        this.detailsInfo.preSellOrderBO.depositPayTime
                    ) {
                        return 2
                    }
                    if (this.detailsInfo.orderType === 'P' && this.detailsInfo.preSellOrderBO.payPctType == 1 && state >= 5) {
                        return stateText[state] + 2
                    }
                }
                return stateText[state]
            }
        },
        stepStatus() {
            return function (detailsInfo, state) {
                if (detailsInfo.status == -5 && detailsInfo.payedFlag == false) {
                    //未支付 取消
                    if (state == 1) {
                        return 'success'
                    } else if (state == 2 || state == 3 || state == 4 || state == 5 || state == 6) {
                        return 'wait'
                    } else if (state == 7) {
                        return 'error'
                    }
                } else if (detailsInfo.status == -5 && detailsInfo.payedFlag == true) {
                    //已支付 申请退款后取消
                    if (state == 1 || state == 2 || state == 3) {
                        return 'success'
                    } else if (state == 4 || state == 5 || state == 6) {
                        return 'wait'
                    } else if (state == 7) {
                        return 'error'
                    }
                }
            }
        },
        // 优惠明细总和
        discountTotal() {
            const {
                discountTotalAmount = 0,
                platformCouponAmount = 0,
                couponAmount = 0,
                totalDeductionAmount = 0,
                selfPurchaseAmount = 0
            } = this.detailsInfo
            return discountTotalAmount + platformCouponAmount + couponAmount + totalDeductionAmount + selfPurchaseAmount
        }
    },
    mounted() {
        if (this.$route.query.DetailId) {
            this.getDetailsInfo()
        } else {
            this.$router.go(-1)
        }
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        // 获取商品详情
        getDetailsInfo() {
            orderApi
                .getOrderDetails({
                    orderId: this.$route.query.DetailId
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.detailsInfo = res.data
                        this.tableList = res.data.orderItemDTOList || []
                        if (res.data.orderLogisticsDTO) {
                            this.logisticsArr = JSON.parse(res.data.orderLogisticsDTO.trackingInformation)
                        }
                        if (res.data.preSellOrderBO) {
                            this.tableList.push(
                                { title: '阶段1，定金', price: res.data.preSellOrderBO.preDepositPrice },
                                {
                                    title: '阶段2，尾款',
                                    price: res.data.preSellOrderBO.finalPrice,
                                    finalMStart: res.data.preSellOrderBO.finalMStart,
                                    finalMEnd: res.data.preSellOrderBO.finalMEnd
                                },
                                { title: '阶段3，发货', preDeliveryTime: res.data.preSellOrderBO.preDeliveryTime }
                            )
                        }
                        if (true) {
                            //如果是待收货状态则获取物流公司，给修改物流信息用
                            orderApi.getLogisticsCompany().then((res) => {
                                if (res.code == 1) {
                                    this.logisticsList = res.data
                                }
                            })
                        }
                    }
                    this.stepsKey = Math.random()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 添加备注点开窗口
        showDialog(item) {
            this.cancelDialog = true
        },

        // 提交备注
        debounceSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    orderApi
                        .subRemake({
                            orderNumber: this.detailsInfo.orderNumber,
                            remark: this.form.remark
                        })
                        .then((res) => {
                            if (!res.code) {
                                return
                            }
                            this.$message.success('添加成功')
                            this.cancelDialog = false
                            this.getDetailsInfo()
                        })

                    console.log('ok')
                }
            })
        },
        //打印订单
        goOrderPrint() {
            const { href } = this.$router.resolve({
                name: 'orderPrint',
                query: {
                    data: JSON.stringify(this.detailsInfo)
                }
            })
            window.open(href, '_blank')
        },
        //修改物流信息
        updateLogistic() {
            this.updateLogisticForm.orderNumber = this.detailsInfo.orderNumber
            this.updateLogisticForm.id = this.detailsInfo.orderLogisticsDTO.id
            orderApi.updateLogistic(this.updateLogisticForm).then((res) => {
                if (res.code) {
                    //
                    this.$message.success('修改物流信息成功')
                    this.updateLogisticDialog = false
                    this.getDetailsInfo()
                }
            })
        },

        // 切割时间段
        splitTimes(times) {
            return times.split(',')
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
}

.order {
    .order-wrapper {
        flex-basis: 300px;

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
        width: 95%;
        // margin: 0 auto;

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

::v-deep .remarkDialog {
    .el-input {
        .el-input__inner {
            padding-right: 56px; //备注输入框限制字数时 右侧会出现遮挡
        }
    }
}
</style>
