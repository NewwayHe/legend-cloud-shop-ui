<template>
    <el-card shadow>
        <el-row slot="header">商品类目</el-row>
        <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
            <el-form-item>
                <el-input v-model="searchFilters.categoryName" placeholder="类目名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeDate"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click.stop="dbnSearch">搜索</el-button>
                <el-button @click.stop="dbnExcel">导出报表</el-button>
            </el-form-item>
        </el-form>
        <el-row type="flex" justify="space-around">
            <chart />
            <chart />
            <chart />
        </el-row>
        <div class="table">
            <el-table
                ref="multipleTable"
                v-loading="tableListLoading"
                :data="tableList"
                tooltip-effect="dark"
                class="w-100 mt-50"
                @sort-change="changeSort"
            >
                <template slot="empty">
                    <empty empty-type="pro" />
                </template>
                <el-table-column label="序号" type="index" width="100" />
                <el-table-column prop="firstName" label="一级类目" />
                <el-table-column prop="secondName" label="二级类目" />
                <el-table-column prop="thirdName" label="三级类目" />
                <el-table-column prop="skuAmount" sortable="custom" label="SKU数量" />
                <el-table-column prop="viewPeople" sortable="custom" label="访问人数" />
                <el-table-column prop="views" label="访问次数" />
                <el-table-column prop="turnover" label="成交金额" />
                <el-table-column prop="amount" label="成交数量" />
                <el-table-column prop="buyRate" label="访问购买率" />
            </el-table>
        </div>
        <el-row type="flex" justify="end" class="mt-20">
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
    name: 'CategorySurvey',
    components: {
        chart
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {},
            date: '',
            url: {
                getData: '/product/s/count/category/page',
                getExcel: '/product/s/count/category/page/excel'
            }
        }
    },
    created() {
        this.getTree()
    },
    methods: {
        getTree() {
            csyApi.getTree().then((res) => {
                console.log(res)
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
