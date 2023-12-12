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
            default: '535px'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Array,
            required: true
        },
        dateList: {
            type: Array
        },
        paidAmountList: {
            type: Array
        },
        subCountsList: {
            type: Array
        }
    },
    data() {
        return {
            chart: null,
        }
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
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
        setOptions({ expectedData, actualData } = {}) {
            let that = this
            this.chart.setOption({
                backgroundColor: 'transparent',
                legend: [
                    {
                        data: ['订单金额', '订单数量'],
                        bottom: 30
                    }
                ],
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: 0,
                    right: 0,
                    top: '20px',
                    containLabel: true,
                    backgroundColor: 'transparent'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisLine: {
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    data: this.dateList
                },
                yAxis: {
                    type: 'value',
                    // 坐标轴轴线配置
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    // 分割线配置
                    splitLine: {
                        show: false
                    },
                    // 坐标轴在 grid 区域中的分隔区域
                    splitArea: {
                        show: false
                    },
                    // 坐标轴刻度相关设置。
                    axisTick: {
                        show: false
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: false,
                        realtime: false,
                        height: 20,
                        start: 80, //时间轴长度起始位置的百分比
                        end: 100, //时间轴结束为止的百分比
                        startValue: 100, //图表展示的内容，初始化展示的数据时间位置
                        endValue: 100,
                        bottom: 0,
                        backgroundColor: '#fff', // 时间轴左右拖动的背景色
                        borderColor: '#ddd',
                        fillerColor: '#EBEEF5', //时间轴拖得动部分的颜色
                        brushStyle: {
                            color: 'rgba(135,175,274,0.15)'
                        },
                        zoomOnMouseWheel: true, //如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
                        moveOnMouseMove: true, //如何触发数据窗口平移。true：表示不按任何功能键
                        textStyle: {
                            color: '#333'
                        },
                        //拖动轴的两侧图标，使用SVG格式
                        // handleIcon: 'M512 512m-208 0a6.5 6.5 0 1 0 416 0 6.5 6.5 0 1 0-416 0Z M512 192C335.264 192 192 335.264 192 512c0 176.736 143.264 320 320 320s320-143.264 320-320C832 335.264 688.736 192 512 192zM512 800c-159.072 0-288-128.928-288-288 0-159.072 128.928-288 288-288s288 128.928 288 288C800 671.072 671.072 800 512 800z',
                        handleSize: '50%',
                        handleStyle: {
                            color: '#fff'
                        },

                    }
                ],
                series: [
                    {
                        smooth: false,
                        name: '订单金额',
                        type: 'line',
                        symbolSize: 4,
                        symbol: 'circle',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#1395EB'
                                // borderColor: 'rgb(203,226,253)'
                            }
                        },
                        areaStyle: {
                            // color: 'rgb(203,226,253)',
                            // shadowColor: 'rgb(203,226,253)'
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: 'rgb(203,226,253)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgb(203,226,253)'
                                    }
                                ],
                                false
                            ),
                            shadowColor: 'rgb(203,226,253)'
                        },
                        data: this.paidAmountList
                    },
                    {
                        name: '订单数量',
                        type: 'line',
                        symbolSize: 4,
                        symbol: 'circle',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#00CB65'
                                // borderColor: 'rgb(183,222,240)'
                            }
                        },
                        areaStyle: {
                            // color: 'rgba(0, 204, 102, .1)',
                            // shadowColor: 'rgba(0, 204, 102, .1)'
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: 'rgba(0, 204, 102, .1)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(0, 204, 102, .1)'
                                    }
                                ],
                                false
                            ),
                            shadowColor: 'rgba(0, 204, 102, .1)'
                        },
                        data: this.subCountsList
                    }
                ]
            })
            this.chart.on('datazoom', function (event) {
                that.$emit('update', event)
            })
        }
    }
}
</script>
