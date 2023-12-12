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
        chartName: {
            type: String
        },
    },
    data() {
        return {
            chart: null,
            series: []
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
        this.getChartData()
        // console.log('mount--',this.chartData)
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
            this.series = [
                {
                    name: this.chartName,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 2,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            // show: true,
                            // fontSize: '40',
                            // fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    // data: [
                    //     { value: 735, name: 'Direct' },
                    //     { value: 580, name: 'Email' },
                    //     { value: 300, name: 'Video Ads' }
                    // ]
                    data: this.chartData
                }
            ]
            if(!this.$utils.test.isEmpty(this.chartData)) {
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
                    trigger: 'item',
                    // position: ['50%', '50%']
                },
                legend: {           //图例
                    bottom: '0%',
                    left: 'center',
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