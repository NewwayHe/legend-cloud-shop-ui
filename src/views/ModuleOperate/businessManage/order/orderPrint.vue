<template>
    <div class="print-wrapper">
        <div class="mb-20 pt-20">
			<ls-image class="v-middle" :src="systemConfigTemp.pcUserLogo" :options="{ h: '50'}" :isPreview="false" v-if="systemConfigTemp&&systemConfigTemp.pcUserLogo"/>
        </div>
        <div class="print-info mb-20">
            <h1 class="info-title">{{ goodsData.receiver }}-购物清单</h1>
            <div class="shop-info">
                <div class="flex-1">
                    <div class="info-item">
                        <label class="label">收货人：</label>
                        <label class="content">{{ goodsData.receiver }}</label>
                    </div>
                    <div class="info-item">
                        <label class="label">邮编：</label>
                        <label class="content">无</label>
                    </div>
                    <div class="info-item">
                        <label class="label">订单编号：</label>
                        <label class="content">{{ goodsData.orderNumber }}</label>
                    </div>
                    <div class="info-item">
                        <label class="label">发货订单：</label>
                        <label class="content">{{ orderStatus(goodsData.status) }}</label>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="info-item">
                        <label class="label">手机：</label>
                        <label class="content">{{ goodsData.mobile }}</label>
                    </div>
                    <div class="info-item">
                        <label class="label">地址：</label>
                        <label class="content">{{ goodsData.receiverAddress }}</label>
                    </div>
                    <div class="info-item">
                        <label class="label">发票信息：</label>
                        <label v-if="!goodsData.needInvoiceFlag" class="content">不开发票</label>
                        <label v-else class="content">{{ goodsData.invoiceCompany }}——{{ goodsData.invoiceHumNumber }}</label>
                    </div>
                    <div class="info-item">
                        <label class="label">下单时间：</label>
                        <label class="content">{{ goodsData.createTime }}</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="print-goods">
            <el-table
                ref="multipleTable"
                :data="goodsData.orderItemDTOList"
                tooltip-effect="light"
                class="w-100"
                :header-cell-style="{ background: '#fafafa' }"
            >
                <template slot="empty">
                    <empty empty-type="pro" />
                </template>
                <el-table-column label="序号" type="index" width="100" />
                <el-table-column prop="productName" label="商品" />
                <el-table-column prop="price" label="单价">
                    <template slot-scope="scope">
                        <span>{{ scope.row.price | priceFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="basketCount" label="数量" />
                <el-table-column prop="productTotalAmount" label="小计">
                    <template slot-scope="scope">
                        <span class="text-danger">
                            <template>{{ scope.row.productTotalAmount | priceFilter }}</template>
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <el-row type="flex" class="mt-20">
                <div>
                    <div class="account mr-15 d-flex">
                        <div class="account-item">
                            <label class="label">商品总价：</label>
                            <label class="content">{{ goodsData.totalPrice | priceFilter }}</label>
                        </div>
                        <div class="account-item">
                            <label class="label">运费：</label>
                            <label class="content">{{ goodsData.freightPrice }}</label>
                        </div>
                        <div class="account-item">
                            <label class="label">订单总价：</label>
                            <label class="account-count">{{ goodsData.actualTotalPrice | priceFilter }}</label>
                        </div>
                    </div>
                </div>
            </el-row>
        </div>
        <div class="mt-20">
            <el-row type="flex" justify="center" class="mt-20">
                <div class="d-flex flex-column a-center">
                    <p class="mb-30 font text-999">专业塑造传奇，用心成就电商</p>
                    <el-button class="text-center mb-60" type="primary" @click="print">打印</el-button>
                    <div class="line"></div>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import { orderApi } from '@/api/ModuleOrder.js'
export default {  
    components: {},
    data() {
        return {
            goodsData: '',
			systemConfigTemp:'',// 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
			systemConfigFinally:false
        }
    },
    computed: {
        orderStatus() {
            return function (state, isText = true) {
                const stateText = {
                    0: '未退款',
                    2: '已完成',
                    3: '已取消',
                    1: isText ? '待付款' : '退款处理中',
                    5: '待发货',
                    10: '待收货',
                    15: '已收货',
                    20: '已完成',
                    25: '已取消'
                }
                return stateText[state]
            }
        }
    },
    mounted() {
        if(this.$route.query.data){
            this.goodsData = JSON.parse(this.$route.query.data)
            console.log(JSON.parse(this.$route.query.data), '打印')
        }else if(this.$route.query.id){
            orderApi
                .getOrderDetails({
                    orderId: this.$route.query.id
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.goodsData = res.data
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
		
		let systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
		// 如果main.js里面执行了方法获取到系统设置
		if (systemConfig&&systemConfig.id) {
			this.systemConfigTemp = systemConfig
			this.systemConfigFinally = true
		// 如果VUEX里没有设置systemConfig(系统设置)
		}else{
			this.$store
			    .dispatch('user/getSystemConfig')
			    .then((res) => {
					this.systemConfigTemp = res
					// console.log('systemConfig:',this.systemConfigTemp);
			    })
			    .catch(() => {
			    }).finally(()=>{
					this.systemConfigFinally = true
				})
		}
    },
    methods: {
        print() {
            window.print()
        }
    }
}
</script>
<style>
html,
body {
    background-color: #fff;
}
</style>
<style lang="scss" scoped>
.print-wrapper {
    width: 990px;
    margin: 0 auto;
    background: #fff;

    .print-info {
        border: 1px solid #ebedf5;
        border-top: 3px solid #999;

        .info-title {
            font-size: 24px;
            color: rgba(51, 51, 51, 1);
            font-weight: 400;
            text-align: center;
            margin-bottom: 30px;
        }

        .shop-info {
            padding-left: 15px;
            font-size: 12px;
            display: flex;

            .info-item {
                margin-bottom: 35px;
                color: #333333;

                .label {
                    display: inline-block;
                    width: 85px;
                    text-align: right;
                }

                .content {
                    display: inline-block;
                }
            }
        }

        .info-item {
            margin-bottom: 35px;
            color: #333333;
            font-size: 12px;
            .label {
                display: inline-block;
                width: 85px;
                text-align: right;
            }

            .content {
                display: inline-block;
            }
        }
    }

    .print-goods {
        border: 1px solid #ebedf5;

        .account {
            .account-item {
                font-size: 12px;
                margin-bottom: 20px;

                .label {
                    display: inline-block;
                    width: 135px;
                    text-align: right;
                }

                .content {
                    display: inline-block;
                    width: 80px;
                    text-align: right;
                }

                .account-count {
                    display: inline-block;
                    width: 80px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #333333;
                    text-align: right;
                }
            }
        }
    }

    .line {
        width: 990px;
        height: 1px;
        background-color: #ebedf5;
    }
}
</style>
