<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
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
            default: '100%'
        },
        height: {
            type: String,
            default: '500px'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
                console.log('变化了')
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
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
            this.setOptions(this.chartData)
        },
        setOptions({ totalDealAmount, dealAmount, dealGoodNum, totalDealGoodNum, date } = {}) {
            this.chart.setOption({
                xAxis: {
                    data: date,
                    boundaryGap: true,
                    axisTick: {
                        show: false
                    }
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 20,
                    top: 30,
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    padding: [5, 10]
                },
                yAxis: {
                    axisTick: {
                        show: false
                    }
                },
                legend: {
                    data: ['累计成交金额', '当天成交金额', '当天成交商品数量', '累计成交商品数量']
                },
                series: [
                    {
                        name: '累计成交金额',
                        itemStyle: {
                            normal: {
                                color: '#FF005A',
                                lineStyle: {
                                    color: '#FF005A',
                                    width: 2
                                }
                            }
                        },
                        smooth: true,
                        type: 'line',
                        data: totalDealAmount,
                        animationDuration: 2800,
                        animationEasing: 'cubicInOut'
                    },
                    {
                        name: '当天成交金额',
                        smooth: true,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#3888fa',
                                lineStyle: {
                                    color: '#3888fa',
                                    width: 2
                                },
                                areaStyle: {
                                    color: '#f3f8ff'
                                }
                            }
                        },
                        data: dealAmount,
                        animationDuration: 2800,
                        animationEasing: 'quadraticOut'
                    },
                    {
                        name: '当天成交商品数量',
                        smooth: true,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#13682e',
                                lineStyle: {
                                    color: '#13682e',
                                    width: 2
                                },
                                areaStyle: {
                                    color: '#f3f8ff'
                                }
                            }
                        },
                        data: dealGoodNum,
                        animationDuration: 2800,
                        animationEasing: 'quadraticOut'
                    },
                    {
                        name: '累计成交商品数量',
                        smooth: true,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#f36433',
                                lineStyle: {
                                    color: '#f36433',
                                    width: 2
                                },
                                areaStyle: {
                                    color: '#f3f8ff'
                                }
                            }
                        },
                        data: totalDealGoodNum,
                        animationDuration: 2800,
                        animationEasing: 'quadraticOut'
                    }
                ]
            })
        }
    }
}
</script>
