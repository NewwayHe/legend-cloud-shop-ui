<template>
    <div>
        <el-card>
            <el-row slot="header" type="flex" justify="space-between" align="middle">
                <div class="d-flex a-center">
                    <span>商品概况</span>
                    <span class="text-999 font-14">（数据截止：{{ date }})</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            商品概况包括，商品SPU总数、商品SKU总数、在售SKU总数、商品SPU访问次数；
                            <br />
                            统计维度包括，昨日新增（昨天一天24小时）、本周新增（最近七天）、本月新增（最近三十天）、累计总数（系统所有的累计）数据；
                            <br />
                            商品SPU总数 = 统计累计到前一天23:59:59商家发布后的所有商品，只需要剔除被商家永久删除的SPU商品数量；
                            <br />
                            商品SKU总数 = 统计累计到前一天23:59:59商家发布后的所有商品，只需要剔除被商家永久删除的SKU商品数量；
                            <br />
                            在售SKU总数 = 统计累计到前一天23:59:59商家上线&&平台上架的可以在用户端中正常销售的SKU商品数量；
                            <br />
                            商品SPU访问总数 = 统计累计到前一天23:59:59 一个用户/游客从任意入口访问商品详情页，统计为一条数据，当天多次浏览不需要去重；
                            <br />
                            昨日新增 = 统计前一天24小时内内新增的数据；（统计时间为前一天00:00:00至23:59:59）
                            <br />
                            本周新增 = 统计前七天新增的数据；（统计时间前一天23:59:59往前推一共七天）
                            <br />
                            本月新增 = 统计前三十天新增的数据；（统计时间前一天23:59:59往前推一共三十天）
                            <br />
                            累计总数 = 统计截至当天的前一天23:59:59的所有累计数据（统计系统开始到前一天23:59:59）；
                        </div>
                        <i class="el-icon-question text-000 font-16 opacity-3 ml-5"></i>
                    </el-tooltip>
                </div>
                <el-button type="text" class="p-0" @click="toDetail('productSurvey')">查看详情</el-button>
            </el-row>
            <el-row v-loading="tableListLoading" type="flex" justify="space-around" class="mb-50 mt-50">
                <el-col type="flex" align="middle">
                    <el-row class="font-12">商品SPU总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ spuList.spuTotalNum }}</el-row>
                    <el-row class="font-12">日 +{{ spuList.spuTotalNumByDay }}</el-row>
                    <el-row class="font-12 mt-10 mb-10">周 +{{ spuList.spuTotalNumByWeek }}</el-row>
                    <el-row class="font-12">月 +{{ spuList.spuTotalNumByMonth }}</el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-12">商品SKU总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ skuList.skuTotalNum }}</el-row>
                    <el-row class="font-12">日 +{{ skuList.skuTotalNumByDay }}</el-row>
                    <el-row class="font-12 mt-10 mb-10">周 +{{ skuList.skuTotalNumByWeek }}</el-row>
                    <el-row class="font-12">月 +{{ skuList.skuTotalNumByMonth }}</el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-12">在售SKU总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ skuSaleList.skuTotalNumOnSale }}</el-row>
                    <el-row class="font-12">日 +{{ skuSaleList.skuTotalNumByDayOnSale }}</el-row>
                    <el-row class="font-12 mt-10 mb-10">周 +{{ skuSaleList.skuTotalNumByWeekOnSale }}</el-row>
                    <el-row class="font-12">月 +{{ skuSaleList.skuTotalNumByMonthOnSale }}</el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-12">商品SPU访问次数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ spuClickList.spuClickTotalNum }}</el-row>
                    <el-row class="font-12">日 +{{ spuClickList.spuClickNumByDay }}</el-row>
                    <el-row class="font-12 mt-10 mb-10">周 +{{ spuClickList.spuClickNumByWeek }}</el-row>
                    <el-row class="font-12">月 +{{ spuClickList.spuClickNumByMonth }}</el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <el-row slot="header" type="flex" justify="space-between" align="middle">
                <div class="d-flex a-center">
                    <span>类目概况</span>
                    <span class="text-999 font-12">（数据截止：{{ date }})</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            统计截至当天的前一天23:59:59的，一级类目商品SKU数量排名前五的一级类目排名；
                            <br />
                            统计一级类目下关联的二级类目/三级类目下的所有商品SKU数量；
                            <br />
                            统计商家发布后的所有商品，只需要剔除被商家永久删除的商品数量；
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </div>
                <el-button type="text" class="p-0" @click="toCategoryDetail('categoryDetail')">查看详情</el-button>
            </el-row>
            <el-row type="flex">
                <el-col :span="13">
                    <pie height="400px" :chart-data="chartData" />
                </el-col>
                <el-col :span="11">
                    <el-row>类目商品数量前五:</el-row>
                    <el-row class="mt-15">
                        <div class="table">
                            <el-table
                                ref="multipleTable"
                                v-loading="tableListLoading"
                                header-row-class-name="headerRow"
                                :data="skuCategory"
                                tooltip-effect="dark"
                                class="w-100"
                            >
                                <template slot="empty">
                                    <empty empty-type="pro" />
                                </template>
                                <el-table-column label="序号" type="index" width="48" />
                                <el-table-column prop="categoryName" label="类目名称" />
                                <el-table-column prop="skuNum" label="商品SKU数量" />
                            </el-table>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { pssApi } from '@/api/ModuleData'
import pie from '@/components/Charts/pie'
export default {
    name: 'ProductStatistics',
    components: {
        pie
    },
    data() {
        return {
            spuList: [],
            skuList: [],
            skuSaleList: [],
            spuClickList: [],
            skuCategory: [],
            tableListLoading: true,
            chartData: [],
            date: ''
        }
    },
    created() {
        this.getSpu()
        this.getSku()
        this.getSkuSale()
        this.getSpuClick()
        this.getSkuCategory()
        this.getCategoryTree()
        this.getDate()
    },
    methods: {
        getDate() {
            const day1 = new Date()
            day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000)
            this.date = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate() + ' 23:59:59'
        },
        getSpu() {
            pssApi.getSpu().then((res) => {
                this.spuList = res.data
            })
        },
        getSku() {
            pssApi.getSku().then((res) => {
                this.skuList = res.data
            })
        },
        getSkuSale() {
            pssApi.getSkuSale().then((res) => {
                this.skuSaleList = res.data
            })
        },
        getSpuClick() {
            pssApi.getSpuClick().then((res) => {
                this.spuClickList = res.data
            })
        },
        getSkuCategory() {
            pssApi.getSkuCategory().then((res) => {
                this.tableListLoading = false
                this.skuCategory = res.data
                let list = []
                this.skuCategory.map((item) => {
                    console.log(item, 'item')
                    list.push({
                        value: item.skuNum,
                        name: item.categoryName
                    })
                })
                this.chartData = list
            })
        },
        getCategoryTree() {
            pssApi.getCategoryTree().then((res) => {})
        },
        toCategoryDetail() {
            this.$router.push('/ModuleData/productData/categoryDetail')
        },
        toDetail(e) {
            this.$router.push({
                name: e
            })
        }
    }
}
</script>

<style></style>
