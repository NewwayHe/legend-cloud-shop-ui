<!--
    优惠券报表—>拉新复购饼图
-->
<template>
    <div :class="className" :style="{ height: height, width: width }"/>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/Charts/mixins/resize'
import moment from 'moment'
export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '160px'
        },
        height: {
            type: String,
            default: '160px'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: [Object, Array],
            required: true
        },
        // 16组颜色
        colors: {
            type: Array,
            default: () => [
                '#5470c6', 
                '#91cc75', 
                '#fac858', 
                '#ee6666', 
                '#73c0de', 
                '#3ba272', 
                '#fc8452', 
                '#9a60b4', 
                '#ea7ccc',
                '#32b67a',
                '#facac0',
                '#f3c9dd',
                '#0bbcd6',
                '#bfb5d7',
                '#bea1a5',
                '#f0cf61'
            ]
        },
        xAxis: {    //x轴的日期范围
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            chart: null,
            series: []
        }
    },
    computed: {
        // 对x轴的日期做展开
        xAxisDate() {
            let section = []
            let [startDate, endDate] = this.xAxis
            section.push(startDate)
            startDate = moment(startDate);
            endDate = moment(endDate);
            let diff = endDate.diff(startDate,'d')
            let i = 0;
            while(i < diff) {
                section.push(startDate.add(1,'d').format('YYYY-MM-DD'))
                ++i
            }
            return section
        }
    },
    watch: {
        chartData:{
            handler(){
                this.getChartData()
            },
            deep:true,
            immediate:true
        }
    },
    created() {
       
    },
    mounted() {
        // console.log('mount--',this.chartData)
        /* 示例
            this.series = [
            {        
                name: 'Email',
                type: 'line',
                stack: 'Total',
                data: [1,10]
            },
        ] */
        // this.getChartData(this.chartData)
        
        
        // this.initChart()
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        getChartData(){
            if(!this.$utils.test.isEmpty(this.chartData)) {
            this.series = this.chartData.map((item,index) => ({
                name: item.name,
                data: item.value,
                type: 'line',
                // stack: 'Total'，
                itemStyle: {
                    // color: 'red'
                    color: this.colors[index]
                }
            }))
            this.$nextTick(() => {
                this.initChart()
            })
        }
        },
        initChart() {
            this.chart = echarts.init(this.$el)
            this.setOptions()
        },
        setOptions(){
            const option = {
                tooltip: {
                    trigger: 'axis',
                    // position: ['50%', '50%']
                },
                legend: {           //图例
                    // bottom: '0%',
                    // left: 'center',
                },
                xAxis: {        //x轴
                    type: 'category',
                    boundaryGap: false,
                    // data: ['Mon', 'Tue']
                    data: this.xAxisDate
                },
                yAxis: {        //y轴
                    type: 'value'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                series: this.series,
            };
            this.chart.setOption(option)
        },


    }
}
</script>

<style>

</style>