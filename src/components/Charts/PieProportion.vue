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
                    text: '用户占比',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 12,
                        color: '#333333'
                    },
                    bottom: 0,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 10,
                //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                // },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        color: ['rgba(60, 144, 247, 1)', 'rgba(85, 191, 192, 1)', 'rgba(245, 131, 224, 1)'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            fontSize: 12
                        },
                        // label: {
                        //     show: true,
                        //     position: 'center'
                        // },
                        // emphasis: {
                        //     label: {
                        //         show: true,
                        //         fontSize: '30',
                        //         fontWeight: 'bold'
                        //     }
                        // },
                        // 标签的视觉引导线样式
                        labelLine: {
                            show: true
                        },
                        // 是否开启 hover 在扇区上的放大动画效果。
                        hoverAnimation: false,
                        // 标签
                        label: {
                            show: true,
                            normal: {
                                formatter: (params) => {
                                    return '{name|' + params.name + '}' + '\n' + '{value|' + params.percent + '}'
                                },
                                rich: {
                                    name: {
                                        fontSize: 12,
                                        padding: [0, 0, 0, 0],
                                        color: '#505050',
                                        display: 'block'
                                    },
                                    value: {
                                        padding: [0, 0, 0, 0],
                                        fontSize: 12,
                                        color: '#505050'
                                    }
                                }
                            }
                        },
                        data: [
                            { value: 1315, name: '旧用户占比' },
                            { value: 1548, name: '新用户占比' },
                            { value: 1548, name: '用户占比' }
                        ]
                    }
                ]
            })
        }
    }
}
</script>
