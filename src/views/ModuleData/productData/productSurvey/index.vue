<template>
    <div>
        <el-card class="mb-15">
            <el-row slot="header" class="font-weight font-26">
                <span>商品概况</span>
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content" class="line-h-md">
                        商品概况包括，商品SPU总数、商品SKU总数、在售SKU总数；
                        <br />
                        统计维度，统计筛选时间段内的数据；
                        <br />
                        商品SPU总数 =
                        统计筛选时间段内，第一天00:00:00至最后一天23:59:59的商品SPU在时间段内新增的总数；统计商家发布后的所有商品，只需要剔除被商家永久删除的商品数量；
                        <br />
                        商品SKU总数 =
                        统计筛选时间段内，第一天00:00:00至最后一天23:59:59的商品SKU在时间段内新增的总数；统计商家发布后的所有商品，只需要剔除被商家永久删除的商品数量；
                        <br />
                        在售SKU总数 =
                        统计筛选时间段内，第一天00:00:00至最后一天23:59:59的商品SKU在时间段内在售总数；只统计商家上线&&平台上架的可以在用户端中正常销售的商品数量；
                    </div>
                    <i class="el-icon-question text-000 font-16 opacity-3"></i>
                </el-tooltip>
            </el-row>

            <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
                <el-form-item>
                    <el-date-picker
                        v-model="date1"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click.stop="search">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-row v-loading="isLoading" type="flex" class="mt-60 mb-50">
                <el-col>
                    <el-row class="text-center font-weight font-36 mb-10">{{ detail.spuNum }}</el-row>
                    <el-row class="text-center mb-5 font-12">商品SPU总数</el-row>
                </el-col>
                <el-col>
                    <el-row class="text-center font-weight font-36 mb-10">{{ detail.skuNum }}</el-row>
                    <el-row class="text-center mb-5 font-12">商品SKU总数</el-row>
                </el-col>
                <el-col>
                    <el-row class="text-center font-weight font-36 mb-10">{{ detail.skuNumSale }}</el-row>
                    <el-row class="text-center mb-5 font-12">在售SKU总数</el-row>
                </el-col>
            </el-row>
        </el-card>

        <el-card>
            <el-row slot="header" class="font-weight font-26">
                <span>商品概况访问人数</span>
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content" class="line-h-md">
                        商品访问包括，商品访问人数、商品访问次数；
                        <br />
                        统计维度，统计筛选时间段内每个渠道的数据；
                        <br />
                        商品访问人数 =
                        统计筛选时间段内，第一天00:00:00至最后一天23:59:59对应渠道，商家店铺所有SPU商品被浏览的用户人数累加之和；一个用户ID/游客IP从任意入口访问商品详情页停留3秒或以上，统计为一条数据，当天多次浏览需要去重；
                        <br />
                        商品访问次数 =
                        统计筛选时间段内，第一天00:00:00至最后一天23:59:59对应渠道，商家店铺所有SPU商品被浏览的次数累加之和；一个用户ID/游客IP从任意入口访问商品详情页停留3秒或以上，统计为一条数据，当天多次浏览不需要去重；
                    </div>
                    <i class="el-icon-question text-000 font-16 opacity-3"></i>
                </el-tooltip>
            </el-row>
            <el-form :inline="true" :model="searchFilters" size="small" label-width="0">
                <el-form-item>
                    <el-select v-model="state2" :clearable="true" filterable placeholder="商品名称" @change="changeState2">
                        <el-option v-for="item in restaurants" :key="item.goodId" :label="item.goodName" :value="item.goodId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="date2"
                        :clearable="false"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        class="ml-15"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="changeDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml-10" @click.stop="dbnSearch">搜索</el-button>
                    <el-button @click.stop="dbnExcel">导出报表</el-button>
                </el-form-item>
            </el-form>
            <linechart :all-list="allList" />
            <div class="table">
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100 mt-50"
                    header-row-class-name="headerRow"
					row-key="id"
                    @sort-change="changeSort"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" fixed="left" width="80" />
                    <el-table-column prop="shopName" label="店铺名称" fixed="left" width="100" />
                    <el-table-column prop="goodId" label="商品ID" fixed="left" width="80" />
                    <el-table-column prop="goodName" label="商品名称" fixed="left" width="150" />
                    <el-table-column prop="people" sortable="custom" width="180" label="全渠道商品访问量" />
                    <el-table-column prop="frequency" sortable="custom" width="180" label="全渠道商品访问数" />
                    <el-table-column prop="miniPeople" sortable="custom" width="180" label="小程序商品访问量" />
                    <el-table-column prop="miniFrequency" sortable="custom" width="180" label="小程序商品访问数" />
                    <el-table-column prop="h5People" sortable="custom" width="180" label="H5商品访问量" />
                    <el-table-column prop="h5Frequency" sortable="custom" width="180" label="H5商品访问数" />
                </el-table>
                <el-row type="flex" justify="end" class="mt-30">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
import common from './mixins/commom'
import linechart from './components/lineChart'
import { psyApi } from '@/api/ModuleData'
export default {
    name: 'ProductSurvey',
    components: {
        linechart
    },
    mixins: [common],
    data() {
        return {
            restaurants: [],
            restaurants2: [],
            state2: '',
            detail: {},
            shopList: {},
            linList: [],
            id: null,
            date: null,
            url: {
                getData: '/product/s/count/shop/page',
                getLine: '/product/s/count/shop/line',
                getExcel: '/product/s/count/shop/page/excel'
            },
            input: '',
            searchFilters: {},
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            date1: [],
            date2: [],
            dateList: [],
            people: [],
            frequency: [],
            appPeople: [],
            appFrequency: [],
            isLoading: true
        }
    },
    watch: {
        value2(a) {
            console.log(a)
        }
    },
    created() {
        this.isMounted = true
        this.getDetail()
        this.loadAll()
        this.getDate()
    },
    methods: {
        getDate() {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            // this.date1.push(start, end)
            this.date2.push(start, end)
        },
        changeState2(e) {
            this.searchFilters.goodId = e
        },
        //商品概况
        getDetail(e) {
            psyApi.getDetail(e).then((res) => {
                this.isLoading = false
                this.detail = res.data
            })
        },
        search() {
            this.getDetail({
                id: this.id,
                startDate: this.date1 ? this.date1[0] : null,
                endDate: this.date1 ? this.date1[1] : null
            })
        },
        querySearch2(queryString, cb) {
            var restaurants = this.restaurants
            var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants
            // 调用 callback 返回建议列表的数据
            cb(results)
        },
        createFilter(queryString) {
            return (restaurant) => {
                return restaurant.shopName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            }
        },
        createFilter2(queryString) {
            return (restaurant) => {
                return restaurant.goodName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            }
        },
        //商品list
        loadAll(id) {
            psyApi
                .getgoodList({
                    shopId: id
                })
                .then((res) => {
                    this.restaurants = res.data
                })
        },
        handleSelect2(item) {
            this.state2 = item.goodName
            this.searchFilters.goodId = item.goodId
        },
        handleIconClick(ev) {
            console.log(ev, 'ev')
        },
        changeDate() {
            if (this.date2) {
                console.log(this.date)
                this.$set(this.searchFilters, 'startDate', this.date2[0])
                this.$set(this.searchFilters, 'endDate', this.date2[1])
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.my-autocomplete {
    li {
        line-height: normal;
        padding: 7px;

        .name {
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .addr {
            font-size: 12px;
            color: #b4b4b4;
        }

        .highlighted .addr {
            color: #ddd;
        }
    }
}
</style>
