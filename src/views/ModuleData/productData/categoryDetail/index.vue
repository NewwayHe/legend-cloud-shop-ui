<template>
    <el-card shadow>
        <el-row slot="header">
            <div class="d-flex a-center">
                <span>商品类目概况</span>
                <el-tooltip class="item" placement="right">
                    <div slot="content" style="max-width: 1000px">
                        商品类目概况包括，SKU数量、访问人数、访问次数、商品成交金额、商品成交量、访问购买率；
                        <br />
                        统计维度，统计筛选时间段内每个类目关联的商品的数据；
                        <br />
                        <br />
                        SKU数量 =
                        以商品类目为维度，累计到进入页面当前时间，类目关联的所有商品SKU数量；统计商家发布后的所有商品，只需要剔除被商家永久删除的商品数量；
                        <br />
                        访问人数 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有SPU商品被浏览的用户人数累加之和；一个用户ID/游客IP从任意入口访问商品详情页，统计为一条数据，当天多次浏览需要去重；
                        <br />
                        访问次数 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有SPU商品被浏览的次数累加之和；一个用户ID/游客IP从任意入口访问商品详情页，统计为一条数据，当天多次浏览不需要去重；
                        <br />
                        商品成交金额 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有商品被提交订单并支付的订单金额；若订单项完成了售后，则需要扣除数据；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                        <br />
                        成交商品数量 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有商品被提交订单并支付的商品数量；成交商品数量是统计订单项中的所有商品数量；若订单项完成了售后，则需要扣除数据；
                        <br />
                        访问购买率 = 以商品类目为维度，访问购买率 = 类目关联的所有商品累计成交量 / 类目关联的所有商品全渠道访问次数 * 100%；
                    </div>
                    <i class="el-icon-question text-000 font-16 opacity-3 ml-5"></i>
                </el-tooltip>
            </div>
        </el-row>
        <div class="search">
            <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
                <el-form-item>
                    <el-input v-model="searchFilters.categoryName" placeholder="类目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="date"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        @change="changeDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click.stop="search">搜索</el-button>
                    <el-button @click.stop="dbnExcel">导出报表</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" justify="space-around" align="top" class="mt-20">
            <el-col :span="8">
                <div>
                    <div class="text-center">一级类目</div>
                    <chart id="tree1" :tree="tree1" @change="(val) => changeChart(val, 'tree1')" />
                    <div v-if="tree1 && tree1.length" class="text-center">{{ treeName1 }}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <div class="text-center">二级类目</div>
                    <chart id="tree2" :tree="tree2" @change="(val) => changeChart(val, 'tree2')" />
                    <div v-if="tree2 && tree2.length" class="text-center">{{ treeName2 }}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <div class="text-center">三级类目</div>
                    <chart id="tree3" :tree="tree3" @change="(val) => changeChart(val, 'tree3')" />
                    <div v-if="tree3 && tree3.length" class="text-center">{{ treeName3 }}</div>
                </div>
            </el-col>
        </el-row>
        <div class="table">
            <el-table
                ref="multipleTable"
                v-loading="tableListLoading"
                :data="tableList"
                tooltip-effect="dark"
                class="w-100 mt-50"
                header-row-class-name="headerRow"
                @sort-change="changeSort"
            >
                <template slot="empty">
                    <empty empty-type="pro" />
                </template>
                <el-table-column label="序号" type="index" width="100" align="center" />
                <el-table-column prop="firstName" label="一级类目" align="center" />
                <el-table-column prop="secondName" label="二级类目" align="center" />
                <el-table-column prop="thirdName" label="三级类目" align="center" />
                <el-table-column prop="skuAmount" sortable="custom" label="SKU数量" align="center" />
                <el-table-column prop="viewPeople" sortable="custom" label="访问人数" align="center" />
                <el-table-column prop="views" label="访问次数" align="center" />
                <el-table-column prop="turnover" label="商品成交金额" align="center" />
                <el-table-column prop="amount" label="成交商品数量" align="center" />
                <el-table-column prop="buyRate" label="访问购买率" align="center" />
            </el-table>
        </div>
        <el-row type="flex" justify="end" class="mt-30">
            <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
        </el-row>
    </el-card>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import chart from './components/chart.vue'
import { csyApi } from '@/api/ModuleData'
export default {
    name: 'CategoryDetail',
    components: {
        chart
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {},
            date: [],
            url: {
                getData: '/product/s/count/category/page',
                getExcel: '/product/s/count/category/page/excel'
            },
            tree1: [],
            tree2: [],
            tree3: [],
            treeName1: '',
            treeName2: '',
            treeName3: '',
            treeIndex1: 0,
            treeIndex2: 0,
            treeIndex3: 0,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 3600 * 1000 * 24 // 选当前时间之前的时间
                }
            }
        }
    },
    created() {
        this.getDate()
        this.getData()
        this.getTree()
    },
    methods: {
        changeChart(params, type) {
            this.datefilter(this.tree1, type, params.dataIndex)
        },
        search() {
            this.page.curPage = 1
            this.getData()
            this.getTree()
        },
        getDate() {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.date.push(
                start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate() + ' 00:00:00',
                end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate() + ' 00:00:00'
            )
        },
        datefilter(data, type, index = 0) {
            this.tree1 = []
            this.tree2 = []
            this.tree3 = []
            switch (type) {
                case 'tree1':
                    this.treeIndex1 = index
                    this.treeIndex2 = 0
                    this.treeIndex3 = 0
                    break
                case 'tree2':
                    this.treeIndex2 = index
                    this.treeIndex3 = 0
                    break
                case 'tree3':
                    this.treeIndex3 = index
                    break
                default:
                    break
            }
            this.tree1 = data
            this.treeName1 = data[this.treeIndex1].categoryName
            if (data[this.treeIndex1] && data[this.treeIndex1].categoryDTOList && data[this.treeIndex1].categoryDTOList.length) {
                let twoData = data[this.treeIndex1].categoryDTOList
                this.tree2 = twoData
                this.treeName2 = twoData[this.treeIndex2].categoryName
                if (twoData[this.treeIndex2] && twoData[this.treeIndex2].categoryDTOList && twoData[this.treeIndex2].categoryDTOList.length) {
                    let threeData = twoData[this.treeIndex2].categoryDTOList
                    this.tree3 = threeData
                    this.treeName3 = threeData[this.treeIndex3].categoryName
                }
            }
        },
        getTree() {
            csyApi
                .getTree({
                    startDate: this.date[0],
                    endDate: this.date[1]
                })
                .then((res) => {
                    console.log(res, 'res')
                    this.tree1 = res.data
                    this.datefilter(res.data)
                })
        },
        // 时间改变
        changeDate() {
            if (this.date) {
                console.log(this.date)
                this.$set(this.searchFilters, 'startDate', this.date[0])
                this.$set(this.searchFilters, 'endDate', this.date[1])
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        }
    }
}
</script>

<style></style>
