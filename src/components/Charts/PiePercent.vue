<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import 'echarts-liquidfill'
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
        }
    },
    data() {
        return {
            chart: null
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
            this.chart.setOption({
                title: {
                    text: '成交转化率',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#333333'
                    },
                    bottom: 0,
                    left: 'center'
                },
                series: [
                    {
                        type: 'liquidFill',
                        radius: '60%',
                        data: [0.8, 0.8, 0.8, 0.8],
                        backgroundStyle: {
                            borderWidth: 5,
                            borderColor: 'rgb(255,0,255,0.9)',
                            color: 'rgb(255,0,255,0.01)'
                        },
                        label: {
                            normal: {
                                formatter: (0.8 * 100).toFixed(2) + '%',
                                textStyle: {
                                    fontSize: 30
                                }
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>
