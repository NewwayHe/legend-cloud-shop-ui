<template>
    <div>
        <el-card :body-style="{ padding: `20px 20px 10px 20px` }">
            <el-row slot="header">
                <span>商品销售排行</span>
                <el-tooltip class="item" placement="right">
                    <div slot="content">
                        商品销售排行包括，销售价、累计成交金额、累计成交量、累计访问次数、累计商品收藏量；
                        <br />
                        统计维度，统计筛选时间段内所有渠道每个SKU商品的数据；
                        <br />
                        销售价 = 该SKU最新的当前的销售价格；
                        <br />
                        累计成交金额 =
                        以SKU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SKU商品被提交订单并为已完成的订单金额；若订单项完成了售后，则需要扣除数据；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                        <br />
                        累计成交量 =
                        以SKU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SKU商品被提交订单并为已完成的商品数量；成交量是统计订单项中的所有商品数量；若订单项完成了售后，则需要扣除数据；
                        <br />
                        累计访问次数 =
                        以SPU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SPU商品被浏览的次数累加之和；一个用户ID/游客IP从任意入口访问商品详情页，统计为一条数据，当天多次浏览不需要去重；
                        <br />
                        累计商品收藏量 = 以SPU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SPU商品当前被收藏量累加之和；
                    </div>
                    <i class="el-icon-question text-000 font-16 opacity-3 ml-5"></i>
                </el-tooltip>
            </el-row>
            <el-row class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item>
                        <el-input v-model="searchFilters.productName" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row class="mt-15 table">
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                    @sort-change="changeSort"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="image" label="商品" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.image" :options="{ w: '50', h: '50', br: '6' }" />
                                <el-popover placement="top-start" trigger="hover" :content="scope.row.productName" class="d-flex flex-column a-start">
                                    <div>{{ scope.row.productName }}</div>
                                    <el-link
                                        class="text-blue"
                                        type="primary"
                                        target="_blank"
                                        :underline="false"
                                        :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                                    >
                                        {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId }}
                                    </el-link>
                                    <div slot="reference">
                                        <el-link class="ml-10 text-blue" :underline="false" style="height: 45px">
                                            <div class="line-clamp2">{{ scope.row.productName }}</div>
                                        </el-link>
                                        <el-row class="ml-10 font-12 text-bbb">
                                            <div class="line-clamp2">{{ scope.row.skuName }}</div>
                                        </el-row>
                                    </div>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="销售价" sortable="custom">
                        <template slot-scope="scope">{{ (scope.row.price + '') | priceRangeFilters }}</template>
                    </el-table-column>
                    <el-table-column label="累计成交金额" prop="dealAmount" sortable="custom" min-width="120px">
                        <template slot-scope="scope">{{ (scope.row.dealAmount + '') | priceRangeFilters }}</template>
                    </el-table-column>
                    <el-table-column prop="dealGoodNum" label="累计成交数量" sortable="custom" min-width="120px" />
                    <el-table-column prop="viewNum" label="累计访问次数" sortable="custom" min-width="120px"></el-table-column>
                    <el-table-column prop="favoriteNum" label="累计商品收藏量" sortable="custom" min-width="130px" />
                    <el-table-column label="操作" align="left" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="toDataTrend(scope.row)">查看销售趋势</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <LsSticky :data="tableList">
                <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </LsSticky>
        </el-card>
    </div>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
export default {
    name: 'SalesRanking',
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {},
            date: [],
            url: {
                getData: '/product/s/count/sale/order',
                getExcel: '/product/s/count/sale/order/excel'
            }
        }
    },
    created() {
        this.isMounted = true
        this.getDate()
    },
    methods: {
        getDate() {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.date.push(start, end)
        },
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'startDate', this.date[0])
                this.$set(this.searchFilters, 'endDate', this.date[1])
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        },
        toDataTrend(row) {
            this.$router.push({
                name: 'dataTrends',
                query: {
                    productId: row.productId
                }
            })
        }
    }
}
</script>

<style></style>
