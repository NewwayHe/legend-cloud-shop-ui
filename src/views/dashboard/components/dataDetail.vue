<!-- /*
 * @Descripttion:用户列表
*/ -->
<template>
    <el-card class="mt-15" shadow="never">
        <el-row slot="header">销售额-数据趋势</el-row>
        <many-line-chart
            :chart-data="chartList"
            :date-list="dateList"
            :paid-amount-list="paidAmountList"
            :sub-counts-list="subCountsList"
            @update="update"
        />
    </el-card>
</template>
<script>
import ManyLineChart from '@/components/Charts/ManyLineChart'
import { indexApi } from '@/api/Dashboard.js'
export default {
    name: 'Userinfo',
    components: {
        ManyLineChart
    },
    data() {
        return {
            activeName: 'second',
            chartList: [],
            dateList: [],
            paidAmountList: [],
            subCountsList: []
        }
    },
    mounted() {
        this.indexSales()
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        },
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
