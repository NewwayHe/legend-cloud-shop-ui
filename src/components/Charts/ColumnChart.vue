<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        id: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '500px'
        }
    },
    data() {
        return {
            chart: null
        }
    },
    mounted() {
        this.initChart()
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
            this.chart = echarts.init(document.getElementById(this.id))
            this.chart.setOption({
                legend: {
                    bottom: 0
                },
                tooltip: {},
                dataset: {
                    source: [
                        ['product', 'sku总数', '在售sku总数', '售罄sku总数'],
                        ['2020/5/1', 43.3, 85.8, 93.7],
                        ['2020/5/2', 83.1, 73.4, 55.1],
                        ['2020/5/3', 86.4, 65.2, 82.5],
                        ['2020/5/4', 86.4, 65.2, 82.5],
                        ['2020/5/5', 86.4, 65.2, 82.5],
                        ['2020/5/6', 86.4, 65.2, 82.5],
                        ['2020/5/7', 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: { type: 'category' },
                yAxis: {
                    // 坐标轴轴线配置
                    axisLine: {
                        show: false
                    },
                    // 分割线配置
                    splitLine: {
                        show: false
                    },
                    // 坐标轴刻度相关设置。
                    axisTick: {
                        show: false
                    }
                },
                grid: {
                    left: 30,
                    right: 30
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: 20,
                        barGap: 0,
                        itemStyle: {
                            normal: {
                                color: 'rgba(60, 144, 247, 1)'
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 20,
                        itemStyle: {
                            normal: {
                                color: 'rgba(85, 191, 192, 1)'
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 20,
                        itemStyle: {
                            normal: {
                                color: 'rgba(94, 190, 103, 1)'
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>
