<!-- /*
 * @Descripttion:用户列表
*/ -->
<template>
    <div>
        <!-- 内容部分 -->
        <el-row type="flex" class="a-stretch">
            <el-col class="flex-1">
                <div class="h-100 d-flex flex-column j-sb a-stretch">
                    <el-card class="mb-15">
                        <div slot="header">成交数据</div>
                        <el-row type="flex">
                            <el-col :span="12">
                                <div class="px-20 py-10">
                                    <div class="font-14 text-999" style="line-height: 16px">今日支付订单数量</div>
                                    <div class="font-24 text-333 font-weight mt-10" style="line-height: 41px">
                                        {{ paidOrderList.todayPaidOrderCount || 0 }}
                                    </div>
                                    <div class="font-14 text-999 flex-start mt-10" style="line-height: 16px">
                                        <span class="mr-15">较昨日</span>
                                        <img style="width: 16px; height: 16px" :src="paidOrderList.comparePaidOrderCount > 0 ? upPic : downPic" />
                                        <span :class="paidOrderList.comparePaidOrderCount > 0 ? 'status-pass' : 'status-veto'">
                                            {{ Math.abs(paidOrderList.comparePaidOrderCount) || '0' }}
                                        </span>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="px-20 py-10">
                                    <div class="font-14 text-999" style="line-height: 16px">今日支付金额（元）</div>
                                    <div class="font-24 text-333 font-weight mt-10" style="line-height: 41px">
                                        {{ paidOrderList.todayPaidOrderAmount | priceComma }}
                                    </div>
                                    <div class="font-14 text-999 d-flex j-start a-center mt-10" style="line-height: 16px">
                                        <span class="mr-15">较昨日</span>
                                        <img
                                            style="width: 16px; height: 16px"
                                            :src="paidOrderList.comparePaidOrderAmount > 0 ? upPic : downPic"
                                            alt
                                        />
                                        <span :class="paidOrderList.comparePaidOrderAmount > 0 ? 'status-pass' : 'status-veto'">
                                            {{ Math.abs(paidOrderList.comparePaidOrderAmount) | priceComma }}
                                        </span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                    <!-- 这里不要加 flex-1 要与下面的注解进行互斥 否则在IE上布局会崩掉 -->
                    <el-card class="">
                        <div slot="header" class="d-flex j-sb a-center">
                            <div class="d-flex a-end">
                                <span style="margin-right: 12px">本次结算</span>
                                <span class="font-12 text-999 font-weight-400" style="line-height: 17px">
                                    结算时间：{{ currentBillList.startDate }}至{{ currentBillList.endDate }}
                                </span>
                            </div>
                            <el-button size="mini" type="primary" @click="settlement">马上结算</el-button>
                        </div>
                        <div class="px-20 py-10 d-flex">
                            <img style="width: 96px; height: 96px" src="@/assets/icons/index/icon-settlement@2x.png" />
                            <div class="ml-20 d-flex flex-column">
                                <div class="font-14 text-999" style="line-height: 16px">应结算金额（元）</div>
                                <div class="font-weight font-28 mt-10" style="line-height: 41px">
                                    {{ currentBillList.resultTotalAmount | priceComma }}
                                </div>
                                <div class="font-14 text-333 mt-10" style="line-height: 16px">
                                    <span>总销售金额：{{ currentBillList.orderAmount | priceComma }}元</span>
                                    <span class="ml-15">总订单佣金：{{ currentBillList.orderCommissionTotals | priceComma }}元</span>
                                    <span class="ml-15">总退单金额：{{ currentBillList.orderReturnTotals | priceComma }}元</span>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col class="ml-15" style="width: 420px">
                <div class="h-100 d-flex flex-column j-sb a-stretch">
                    <el-card v-if="publist && publist.title" shadow class="mb-15">
                        <div slot="header" class="d-flex j-sb">
                            <span>公告</span>
                            <el-link
                                class="text-blue"
                                :underline="false"
                                type="primary"
                                @click="$router.push({ path: '/messageManage/message', query: { radioCur: 1 } })"
                            >
                                更多
                            </el-link>
                        </div>
                        <div class="d-flex j-sb a-center">
                            <div class="flex-1 font-14 text-222 line-clamp1" style="line-height: 21px; cursor: pointer" @click="showDetails">
                                {{ publist.title }}
                            </div>
                            <div class="font-14 text-999" style="line-height: 21px">
                                {{ publist.createTime ? publist.createTime.substring(0, 10) : '--' }}
                            </div>
                        </div>
                    </el-card>
                    <!-- 这里可以加flex-1 上面加了 这里就不能加 IE的stretch属性应该是选取一个盒子作为参照物 然后另一个盒子才可以使用flex-1 而不能两个盒子都使用flex-1 -->
                    <el-card id="guide-step1" class="flex-1">
                        <div slot="header">待处理事项</div>
                        <div>
                            <p class="font-14 text-666" style="margin-bottom: 8px; line-height: 21px">
                                被举报商品({{ pending.reportedProductCount || 0 }})
                                <el-link
                                    v-if="pending.reportedProductCount"
                                    class="text-blue"
                                    type="primary"
                                    style="float: right"
                                    :underline="false"
                                    @click="
                                        $router.push({
                                            name: 'report',
                                            query: {
                                                isDashboard: 3
                                            }
                                        })
                                    "
                                >
                                    处理
                                </el-link>
                            </p>
                            <p class="font-14 text-666" style="margin-bottom: 8px; line-height: 21px">
                                待发货订单({{ pending.pendingOrderCount || 0 }})
                                <el-link
                                    v-if="pending.pendingOrderCount"
                                    class="text-blue"
                                    type="primary"
                                    style="float: right"
                                    :underline="false"
                                    @click="
                                        $router.push({
                                            name: 'order',
                                            query: {
                                                isDashboard: 3
                                            }
                                        })
                                    "
                                >
                                    处理
                                </el-link>
                            </p>
                            <p class="font-14 text-666" style="margin-bottom: 8px; line-height: 21px">
                                待处理售后订单({{ pending.pendingAfterSalesOrderCount || 0 }})
                                <el-link
                                    v-if="pending.pendingAfterSalesOrderCount"
                                    class="text-blue"
                                    type="primary"
                                    style="float: right"
                                    :underline="false"
                                    @click="
                                        $router.push({
                                            name: 'serviceOrderList',
                                            query: {
                                                isDashboard: 3
                                            }
                                        })
                                    "
                                >
                                    处理
                                </el-link>
                            </p>
                            <p class="font-14 text-666" style="margin-bottom: 8px; line-height: 21px">
                                待开发票({{ pending.toBeInvoicedOrderCount || 0 }})
                                <el-link
                                    v-if="pending.toBeInvoicedOrderCount"
                                    class="text-blue"
                                    type="primary"
                                    style="float: right"
                                    :underline="false"
                                    @click="
                                        $router.push({
                                            name: 'invoice',
                                            query: {
                                                isDashboard: 3
                                            }
                                        })
                                    "
                                >
                                    处理
                                </el-link>
                            </p>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import PieProportion from '@/components/Charts/PieProportion'
import { indexApi } from '@/api/Dashboard.js'
import { messageApi } from '@/api/ModuleCommon'
const upPic = require('@/assets/icons/index/up.png')
const downPic = require('@/assets/icons/index/down.png')
export default {
    name: 'Userinfo',
    components: {
        PieProportion
    },
    data() {
        return {
            paidOrderList: [],
            currentBillList: {},
            upPic,
            downPic,
            pending: {},
            pages2: {
                pageSize: 10,
                curPage: 1,
                total: 0
            },
            publist: {}
        }
    },
    mounted() {
        this.paidOrder()
        this.currentBill()
        this.pendingApi()
        this.messageList()
    },
    methods: {
        /* 以下三个接口在新店铺时 res.data为null */
        //支付订单数量
        paidOrder() {
            indexApi.paidOrder().then((res) => {
                if (res.code) {
                    this.paidOrderList = res.data
                }
            })
        },
        currentBill() {
            indexApi.currentBill().then((res) => {
                if (res.code) {
                    this.currentBillList = res.data || {}
                }
            })
        },
        //待处理事项
        pendingApi() {
            indexApi.pending().then((res) => {
                if (res.code) {
                    this.pending = res.data
                }
            })
        },
        //结算
        settlement() {
            if (this.$utils.test.isEmpty(this.currentBillList)) {
                return this.$message.warning('暂不存在结算数据')
            }
            this.$router.push({
                name: 'billDetail',
                query: {
                    id: this.currentBillList.id
                }
            })
        },
        messageList() {
            // 我的公告
            messageApi
                .getPubList({
                    curPage: this.pages2.curPage,
                    pageSize: this.pages2.pageSize
                })
                .then((res) => {
                    if (res.code && res.data && res.data.resultList) {
                        this.publist = res.data.resultList[0]
                    }
                })
        },
        showDetails() {
            this.$router.push({ name: 'messageDetail', query: { pubId: this.publist.id } })
        }
    }
}
</script>
<style lang="scss" scoped></style>
