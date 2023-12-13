<!-- 结算账单 -->
<template>
    <section class="">
        <el-card shadow>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="结算单号">
                        <el-input v-model="searchFilters.sn" placeholder="结算单号" />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" placeholder="状态" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="待确认" :value="1" />
                            <el-option label="待审核" :value="2" />
                            <el-option label="待结算" :value="3" />
                            <el-option label="已完成" :value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="exportReport(searchFilters.sn, searchFilters.status)">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    header-row-class-name="headerRow"
                    class="w-100"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column prop="flag" label="结算档期" />
                    <el-table-column prop="sn" label="结算单号" />
                    <el-table-column label="起始日期" width="160`">
                        <template slot-scope="scope">
                            <span>{{ scope.row.startDate | dateFilter }}</span>
                            -
                            <span>{{ scope.row.endDate | dateFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="本期应收金额">
                        <template slot-scope="scope">
                            <div>{{ scope.row.resultTotalAmount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算状态">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status == '1'" class="status-wait">待确认</div>
                            <div v-if="scope.row.status == '2'" class="status-wait">待审核</div>
                            <div v-if="scope.row.status == '3'" class="status-wait">待结算</div>
                            <div v-if="scope.row.status == '4'" class="status-done">已完成</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="付款时间" width="140">
                        <template slot-scope="scope">
                            <div>{{ scope.row.payDate || '-' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-link :underline="false" type="primary">
                                <router-link class="text-blue" :to="{ name: 'billDetail', query: { id: scope.row.id } }">查看</router-link>
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <LsSticky :data="tableList">
                    <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                        <pagination
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </el-row>
                </LsSticky>
                <el-alert type="warning" class="defalult mt-20 mb-20" :closable="false">
                    <div style="line-height: 30px" class="text-999">
                        <p class="font-16 font-weight">说明</p>
                        <p>1、当前商家结算日为: 每周 ,每次结算会形成一个结算档期；</p>
                        <p>2、账单计算公式：</p>
                        <p class="ml-20">2.1、订单金额(含运费) - 退单金额 - 平台佣金 - 分销佣金 + 优惠券总额 - 退单优惠券金额 + 预售定金</p>
                        <p class="ml-20">
                            2.2、 结算价模式:（自营店铺，且结算模式为结算价模式 ） 不计算平台佣金，平台向店铺应付金额为：(按订单的商品数量-退单数量) *
                            商品结算价计算帐单
                        </p>
                        <p>
                            3、账单处理流程为：系统出账 > 商家确认 > 平台审核 > 财务支付(完成结算)
                            4个环节，其中平台审核和财务支付需要平台介入，请予以关注
                        </p>
                    </div>
                </el-alert>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { settle } from '@/api/ModuleFinance.js'
export default {
    name: 'BillList',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/order/s/shop/order/bill/page'
            }
        }
    },
    created() {},

    methods: {
        // 导出
        exportReport(sn, status) {
            settle
                .exportBillList({
                    sn,
                    status
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.success('导出成功')
                    }
                })
        }
    }
}
</script>
