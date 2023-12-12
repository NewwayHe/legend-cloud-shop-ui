<template>
    <section class="mb-50">
        <!-- 进度 -->
        <div class="mb-15">
            <el-card shadow :body-style="{ padding: '0px' }">
                <div class="d-flex a-center order">
                    <div class="d-flex flex-column a-center order-wrapper">
                        <p class="order-code">订单编号: {{ detailsInfo.sn }}</p>
                        <h1 class="order-status">{{ orderStatus }}</h1>
                    </div>
                    <div class="order-line" style="" />
                    <div class="flex-1">
                        <el-steps
                            class="order-step"
                            :space="200"
                            :active="Number(detailsInfo.status == 4 ? 5 : detailsInfo.status)"
                            finish-status="success"
                            align-center
                        >
                            <el-step :description="detailsInfo.createDate" title="已出账" />
                            <el-step :description="detailsInfo.shopConfirmDate" title="待商家确认" />
                            <el-step :description="detailsInfo.platformAuditDate" title="待平台审核" />
                            <el-step :description="detailsInfo.payDate" title="待平台结算" />
                            <el-step :description="detailsInfo.payDate" title="已完成" />
                        </el-steps>
                    </div>
                </div>
            </el-card>
        </div>
        <!-- 结算信息 -->
        <div>
            <el-card class="mb-15" shadow>
                <el-form label-width="90px" label-position="right" size="small" class="order-form">
                    <div class="d-flex pl-10 pt-10">
                        <div class="flex-1">
                            <div class="mb-20 font-14 font-weight">结算信息</div>
                            <el-form-item label="结算档期：" size="small">{{ detailsInfo.flag }}</el-form-item>
                            <el-form-item label="结算单号：">{{ detailsInfo.sn }}</el-form-item>
                            <el-form-item label="起止日期：">
                                {{ detailsInfo.startDate+'' | dateFilter }} &nbsp;至&nbsp; {{ detailsInfo.endDate+'' | dateFilter }}
                            </el-form-item>
                            <el-form-item label="出账日期：">{{ detailsInfo.createDate+'' | dateFilter }}</el-form-item>
                        </div>
                        <div class="flex-2">
                            <div class="mb-20 font-14 font-weight">金额信息</div>
                            <el-form-item label="平台佣金比例：" label-width="100px">
                                {{ detailsInfo.commisRate || '0.0' }}%（平台佣金按照订单金额进行计算）
                            </el-form-item>
                            <el-form-item label="平台应付："  label-width="100px">￥{{ detailsInfo.resultTotalAmount || '0.0' }}</el-form-item>
                            <el-form-item  label-width="100px">
                                =&nbsp;
                                <span>
                                    {{ detailsInfo.orderAmount || '0.0' }}
                                    <el-tooltip class="item" effect="dark" content="订单金额：本档期内已经完成的订单（包括了运费）" placement="top">
                                        <span class="price-color">（订单金额）</span>
                                    </el-tooltip>
                                </span>
                                &nbsp;-&nbsp;
                                <span>
                                    {{ detailsInfo.orderReturnTotals || '0.0' }}
                                    <el-tooltip class="item" effect="dark" content="退单金额：本周期内，已经通过的退单金额" placement="top">
                                        <span class="price-color">（退单金额）</span>
                                    </el-tooltip>
                                </span>
                                &nbsp;-&nbsp;
                                <span>
                                    {{ detailsInfo.commisTotals || '0.0' }}
                                    <el-tooltip class="item" effect="dark" content="平台佣金：平台抽取的佣金=订单金额-退单金额" placement="top">
                                        <span class="price-color">（平台佣金）</span>
                                    </el-tooltip>
                                </span>
                                &nbsp;-&nbsp;
								<span>
								    {{ detailsInfo.distCommisTotals || '0.0' }}
								    <el-tooltip class="item" effect="dark" content="分销佣金：若订单项申请售后，则对应的佣金不需要结算；" placement="top">
								        <span class="price-color">（分销佣金）</span>
								    </el-tooltip>
								</span>
								&nbsp;+&nbsp;
                                <span>
                                    {{ detailsInfo.redpackTotals || '0.0' }}
                                    <el-tooltip class="item" effect="dark" content="优惠券金额 ：平台发出的优惠券金额，按用户消费的%" placement="top">
                                        <span class="price-color">（优惠券总额）</span>
                                    </el-tooltip>
                                </span>
                                &nbsp;-&nbsp;
                                <span>
                                    {{ detailsInfo.orderReturnRedpackTotals || '0.0' }}
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        content="退款订单退的优惠券金额，订单产生全退款就不退还(部分商品的退货按比例补回)退款优惠券金额=订单项使用的优惠券金额*原价/订单总金额"
                                        placement="top"
                                    >
                                        <span class="price-color">（退单优惠券总额）</span>
                                    </el-tooltip>
                                </span>
                                &nbsp;+&nbsp;
                                <span>
                                    {{ detailsInfo.preDepositPriceTotal || '0.0' }}
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        content="预售定金：买家支付了预付定金，但是没有支付尾款订单不成立时的预付金额"
                                        placement="top"
                                    >
                                        <span class="price-color">（预售定金）</span>
                                    </el-tooltip>
                                </span>
                                &nbsp;+&nbsp;
                                <span>
                                    {{ detailsInfo.totalSettlementPrice || '0.0' }}
                                </span>
                            </el-form-item>
                            <el-form-item label="商家承担：" label-width="100px">
                                <span>
                                    {{ detailsInfo.totalDeductionAmount | priceFilter }}
                                </span>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </el-card>
        </div>
        <!-- 查询 -->
        <el-card shadow>
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn" label-width="86px">
                    <el-form-item label="订单编号"><el-input v-model="searchFilters.orderNumber" placeholder="订单编号" /></el-form-item>
                    <el-form-item label="下单时间：">
                        <el-date-picker
                            v-model="templateSearch.orderDate"
                            style="width: 250px"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate('order')"
                        />
                    </el-form-item>
                    <el-form-item label="支付时间：">
                        <el-date-picker
                            v-model="templateSearch.paysDate"
                            style="width: 250px"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate('pay')"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="searchData">搜索</el-button>
                        <el-button size="small" @click.stop="exportReport">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </div>
         <el-row type="flex">
                    <el-col>
                        <el-radio-group v-model="orderType" size="medium" class="mb-20">
                            <el-radio-button label="orderAmount">订单金额</el-radio-button>
                            <el-radio-button label="chargebackAmount">退单金额</el-radio-button>
                            <el-radio-button label="collectAmount">预售定金</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <!-- 表格 -->
                <component :is="orderType" ref="orderCom" :search-params="searchFilters"></component>
                <Sticky>
                    <el-button size="small" @click="$router.push({ name: 'billList' })">返回</el-button>
                    <ls-button v-if="detailsInfo.status == 1" size="small" type="primary" :asyncFunction="determine">确认</ls-button>
                </Sticky>
         </el-card>
    </section>
</template>
<script>
import { settle } from '@/api/ModuleFinance.js'
import orderAmount from './components/orderAmount'
import chargebackAmount from './components/chargebackAmount'
import collectAmount from './components/collectAmount'
import common from '@/mixins/pages/commom'
export default {
    mixins: [common],
    components: {
        orderAmount,
        chargebackAmount,
        collectAmount,
    },
    data() {
        return {
            searchFilters: {},
            templateSearch: {
                orderDate: [], // 下单时间
                paysDate: [] // 支付时间
            },
            orderType: 'orderAmount', // 查询类型   默认 订单金额
            detailsInfo: {
                status: '' // 状态
            },
            orderTypeList: {
                orderAmount: 1,
                chargebackAmount: 2,
                distributionCommission: 3,
                collectAmount: 4,
                auctionDeposit: 6
            }
        }
    },
    computed: {
        // 订单状态
        orderStatus() {
            if (this.detailsInfo.status == 1) {
                return '待确认'
            } else if (this.detailsInfo.status == 2) {
                return '待审核'
            } else if (this.detailsInfo.status == 3) {
                return '待结算'
            } else {
                return '已完成'
            }
        }
    },

    created() {
        this.getBillDetail()
       
    },
    methods: {
        searchData() {
            this.$refs.orderCom.dbnSearch()
        },
        // 时间改变
        changeDate(type) {
            if (type == 'order') {
                if (this.templateSearch.orderDate) {
                    this.$set(this.searchFilters, 'orderStartTime', this.$utils.time.parseTime(this.templateSearch.orderDate[0], '{y}-{m}-{d}'))
                    this.$set(this.searchFilters, 'orderEndTime', this.$utils.time.parseTime(this.templateSearch.orderDate[1], '{y}-{m}-{d}'))
                } else {
                    this.$set(this.searchFilters, 'orderStartTime', '')
                    this.$set(this.searchFilters, 'orderEndTime', '')
                }
            } else {
                if (this.templateSearch.paysDate) {
                    this.$set(this.searchFilters, 'payStartTime', this.$utils.time.parseTime(this.templateSearch.paysDate[0], '{y}-{m}-{d}'))
                    this.$set(this.searchFilters, 'payEndTime', this.$utils.time.parseTime(this.templateSearch.paysDate[1], '{y}-{m}-{d}'))
                } else {
                    this.$set(this.searchFilters, 'payStartTime', '')
                    this.$set(this.searchFilters, 'payEndTime', '')
                }
            }
        },

        // 获取账单详情
        getBillDetail() {
            settle
                .getBillDetail(this.$route.query.id)
                .then((res) => {
                    if (res.code) {
                        this.detailsInfo = res.data
                        console.log(this.detailsInfo.startDate)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 导出
        exportReport() {
            settle
                .exportBillData({
                    id: this.$route.query.id,
                    orderType: this.orderTypeList[this.orderType], // 类型
                    orderNumber: this.searchFilters.orderNumber, // 订单号
                    orderStartTime: this.searchFilters.orderStartTime, // 订单开始时间
                    orderEndTime: this.searchFilters.orderEndTime, // 订单结束时间
                    payStartTime: this.searchFilters.payStartTime, // 支付开始时间
                    payEndTime: this.searchFilters.payEndTime // 支付结束时间
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.success('导出成功')
                    }
                })
        },

        //确认
        determine() {
            return new Promise(resolve=>{
                this.$confirm('一旦确认将无法恢复，系统将自动进入结算环节,确认系统出账单计算无误吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await settle.determinebill(this.$route.query.id).then((res) => {
                            if (res.code) {
                                this.getBillDetail()
                                this.$message({
                                    type: 'success',
                                    message: '确认成功!'
                                })
                            }
                        })
                    })
                    .catch(() => {})
                    .finally(_=>{
                        resolve()
                    })
            })
            
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
            margin-bottom: 24px;
            margin-top: 30px;
        }

        .order-info {
            font-size: 14px;
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
        margin-bottom: 20px;
        margin-top: 20px;
    }

    // 步骤条默认样式修改
    .order-step ::v-deep {
        width: 95%;
        margin: 0 auto;

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
.price-color {
    cursor: pointer;
    color: #007bff;
}
</style>
