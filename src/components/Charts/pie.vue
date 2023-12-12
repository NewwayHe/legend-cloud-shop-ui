<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        chartData: {
            type: Array
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {
        chartData() {
            this.initChart()
        }
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons')

            this.chart.setOption({
                color: ['#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e7bcf3', '#8378ea'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                toolbox: {
                    show: true
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    left: '10%',
                    align: 'left',
                    top: 'middle',
                    textStyle: {
                        color: '#8C8C8C'
                    },
                    height: 150
                },
                series: [
                    {
                        name: '类目名称',
                        type: 'pie',
                        radius: [0, 150],

                        data: this.chartData
                    }
                ]
            })
        }
    }
}
</script>
