<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../../../../../components/Charts/mixins/resize'
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
        tree: {
            type: Array
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {},
    mounted() {
        this.aaa()
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy() {},
    methods: {
        aaa() {
            console.log(this.tree, 'tree')
        },
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions(this.chartData)
        },
        setOptions({ expectedData, actualData } = {}) {
            this.chart.setOption({
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {
                                value: 1048,
                                name: '搜索引擎'
                            },
                            {
                                value: 735,
                                name: '直接访问'
                            },
                            {
                                value: 580,
                                name: '邮件营销'
                            },
                            {
                                value: 484,
                                name: '联盟广告'
                            },
                            {
                                value: 300,
                                name: '视频广告'
                            }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>
