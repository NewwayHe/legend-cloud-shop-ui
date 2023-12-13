<!-- /*
 * @Descripttion:商品订单
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="订单编号">
                        <el-input v-model="searchFilters.orderNumber" clearable placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.productName" clearable placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="收件人"><el-input v-model="searchFilters.receiverName" clearable placeholder="请输入" /></el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="searchFilters.receiverMobile" clearable placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="物流单号">
                        <el-input v-model="searchFilters.shipmentNumber" clearable placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="订单类型">
                        <el-select v-model="searchFilters.orderType" clearable placeholder="全部">
                            <el-option label="普通订单" value="O" />
                            <el-option label="预售订单" value="P" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="售后状态">
                        <el-select v-model="searchFilters.refundStatus" clearable placeholder="请选择">
                            <el-option label="未退款" :value="0" />
                            <el-option label="在处理" :value="1" />
                            <el-option label="已完成" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="下单时间">
                        <el-date-picker
                            v-model="date"
                            clearable
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <el-button size="small" @click.stop="exportData">导出数据</el-button>
                        <el-button size="small" @click.stop="$router.push({ name: 'batchSend' })">批量发货</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
                            <el-radio-button label="0">所有订单</el-radio-button>
                            <el-radio-button label="1">待付款</el-radio-button>
                            <el-radio-button label="5">待发</el-radio-button>
                            <el-radio-button label="10">待签收</el-radio-button>
                            <el-radio-button label="15">待收货</el-radio-button>
                            <el-radio-button label="20">已完成</el-radio-button>
                            <el-radio-button label="-5">已取消</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <!--列表-->
                <!-- v-loading不能直接用在自定义表格上[orderTable] 否则会在<1366px的屏幕刷新后 表格会白屏 -->
                <div v-loading="tableListLoading">
                    <orderTable
                        ref="table"
                        v-model="checkList"
                        :table-list="tableList"
                        :selectable-arr="selectableList"
                        @toDetail="toDetail"
                        @refreshData="refreshData"
                    />
                </div>
            </div>
            <LsSticky :data="tableList">
                <el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <el-col class="text-nowrap flex-start">
                        <el-button size="mini" class="allCheck">
                            <el-checkbox
                                v-model="checkAll"
                                label="全选"
                                size="small"
                                :indeterminate="checkHalf"
                                :disabled="!selectableList.length"
                                @change="selectAll"
                            />
                        </el-button>
                        <el-button size="small" @click="batchCancel">取消订单</el-button>
                    </el-col>
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </LsSticky>
        </el-card>
    </section>
</template>
<script>
import orderTable from './components/orderTable.vue'
import common from '@/mixins/pages/commom'
import { orderApi } from '@/api/ModuleOrder.js'

export default {
    name: 'Order',
    components: {
        orderTable
    },
    mixins: [common],
    data() {
        return {
            searchFilters: {
                orderNumber: '', // 订单编号
                productName: '', // 商品名称
                receiver: '', // 收获人
                mobile: '', // 收货人电话
                orderType: '', // 订单类型
                refundStatus: '', // 售后状态
                status: '0' // 订单状态
            },
            date: '', // 时间
            url: {
                getData: '/order/s/order/page'
            },
            checkAll: false, // 全选状态
            checkList: [],
            tableList: []
        }
    },
    computed: {
        //底部全选按钮与表格顶部的全选按钮状态同步[半选状态]
        checkHalf() {
            if (this.checkAll) {
                return false
            } else if (this.checkList.length) {
                return true
            } else {
                return false
            }
        },
        // 可批量取消的数据
        selectableList() {
            return this.tableList
                .filter((item) => item.status == '1' || (item.status == '3' && item.refundStatus == 0))
                .map((item) => item.orderNumber)
        }
    },
    watch: {
        // 监听换页导致数据切换而造成的选择框状态
        selectableList(nSel) {
            if (nSel.some((item) => !this.checkList.includes(item))) {
                this.checkAll = false
            } else {
                this.checkAll = true
            }
        },
        // 监听选中的数组
        checkList(nCheckList) {
            if (this.selectableList.some((item) => !nCheckList.includes(item))) {
                this.checkAll = false
            } else {
                this.checkAll = true
            }
        }
    },
    created() {
        const { orderType, isDashboard, pickId } = this.$route.query
        Object.assign(this.searchFilters, {
            orderType: orderType || (pickId ? 'SM' : ''),
            status: isDashboard == 3 ? 5 : isDashboard == 2 ? 1 : isDashboard == 1 ? 15 : 0 //从首页跳转改变tab栏状态
        })
    },
    mounted() {},
    methods: {
        refreshData() {
            this.dbnSearch()
        },

        // 跳转详情页
        toDetail(id) {
            this.$router.push({
                name: 'orderDetail',
                query: {
                    DetailId: id
                }
            })
        },

        // 全选
        selectAll(flag) {
            this.$refs.table.selectedAllOrNot(flag)
        },

        // 批量取消订单
        batchCancel() {
            this.$refs.table.batchShowDialog('cancel')
        },

        // 导出数据
        exportData() {
            orderApi.orderExport(this.searchFilters)
        },

        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.checkList = []
            this.getData()
        },
        // 时间改变
        changeDate() {
            if (this.date) {
                console.log(this.date)
                this.$set(this.searchFilters, 'startDate', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'endDate', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        }
    }
}
</script>
