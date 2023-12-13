<!-- /*
 * @Descripttion:用户列表
*/ -->
<template>
    <div>
        <!-- 顶部信息 -->
        <!-- 内容部分 -->
        <el-row type="flex" class="a-stretch mt-15">
            <!-- 左侧信息 -->
            <el-col class="flex-1">
                <el-card class="h-100" shadow>
                    <div slot="header">销售额数据趋势</div>
                    <many-line-chart
                        class="position-relative"
                        :chart-data="chartList"
                        :date-list="dateList"
                        :paid-amount-list="paidAmountList"
                        :sub-counts-list="subCountsList"
                    />
                </el-card>
            </el-col>
            <!-- 左侧信息 -->
            <!-- 右侧信息 -->
            <el-col class="table ml-15" style="width: 420px">
                <el-card shadow>
                    <div slot="header">
                        <span>库存预警</span>
                        <span class="ml-10 font-12 font-weight-400 status-veto" style="line-height: 17px">商品库存过低（{{ tableTotal || 0 }}）</span>
                    </div>
                    <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" header-row-class-name="headerRow">
                        <el-table-column label="序号" type="index" width="48" />
                        <el-table-column prop="productName" label="商品信息">
                            <template slot-scope="scope">
                                <div class="d-flex">
                                    <ls-image style="flex: 0 0 70px" :src="scope.row.pic" :options="{ w: '70', h: '70', br: '4' }" />
                                    <div class="ml-10 d-flex flex-column j-sb flex-1 overflow-h">
                                        <div class="d-flex flex-column">
                                            <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                                <div slot="reference">
                                                    <span class="text-333 font-12 line-clamp1" style="line-height: 18px">
                                                        {{ scope.row.name }}
                                                    </span>
                                                </div>
                                            </el-popover>
                                            <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.cnProperties">
                                                <div slot="reference">
                                                    <span class="text-999 line-clamp1 font-12" style="line-height: 18px">
                                                        {{ scope.row.cnProperties }}
                                                    </span>
                                                </div>
                                            </el-popover>
                                        </div>
                                        <div class="status-veto">剩余销售库存{{ scope.row.stocks || 0 }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="left" width="68">
                            <template>
                                <el-link :underline="false" class="text-blue" type="primary" @click="toInventoryManageList">编辑库存</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row type="flex" justify="end" class="mt-10">
                        <pagination
                            layout="prev, pager, next"
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </el-row>
                </el-card>
            </el-col>
            <!-- 右侧信息 -->
        </el-row>
        <!-- 内容部分 -->
    </div>
</template>
<script>
import common from '@/mixins/pages/commom'
import PieProportion from '@/components/Charts/PieProportion'
import ManyLineChart from '@/components/Charts/ManyLineChart'
import CopyManyline from '@/components/Charts/copyManyline'
import { indexApi } from '@/api/Dashboard.js'
export default {
    name: 'TableDetail',
    components: {
        PieProportion,
        ManyLineChart,
        CopyManyline
    },
    mixins: [common],
    data() {
        return {
            url: {
                getData: '/product/s/product/stocksArmPage'
            },
            page: {
                // 表格页码
                pageSize: 5,
                curPage: 1
            },
            chartList: [],
            dateList: [],
            paidAmountList: [],
            subCountsList: []
        }
    },
    created() {
        this.isMounted = true
    },
    mounted() {
        this.indexSales()
    },
    methods: {
        //销售额-数据
        indexSales() {
            indexApi.indexSales().then((res) => {
                this.chartList = res.data
                this.chartList.map((item) => {
                    this.dateList.push(item.date)
                    this.paidAmountList.push(item.paidAmount)
                    this.subCountsList.push(item.subCounts)
                })
            })
        },

        toInventoryManageList() {
            this.$router.push('ModuleGoods/InventoryManage/inventoryManageList')
        },
        update(data) {}
    }
}
</script>
<style lang="scss" scoped>
.self__table ::v-deep {
    &.el-table thead {
        color: #000;
    }
}
</style>
