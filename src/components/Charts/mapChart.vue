<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import 'echarts/lib/chart/map' // 这个是必须的
import 'echarts/map/js/china.js' // 如果你引入的是世界的就和这个一样 中国的 就需要是china.js
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
            default: '800px'
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
                // 进行相关配置
                backgroundColor: 'rgba(64,158,255,0.6)',
                tooltip: {}, // 鼠标移到图里面的浮动提示框
                dataRange: {
                    show: false,
                    min: 0,
                    max: 1000,
                    text: ['High', 'Low'],
                    realtime: true,
                    calculable: true,
                    color: ['orangered', 'yellow', 'lightskyblue']
                },
                // visualMap: {
                //     min: 0,
                //     max: 1000,
                //     left: 'center',
                //     bottom: 'center',
                //     text: ['高', '低'],
                //     calculable: false,
                //     orient: 'horizontal',
                //     inRange: {
                //         color: ['#e0ffff', '#006edd'],
                //         symbolSize: [30, 100]
                //     }
                // },
                geo: {
                    // 这个是重点配置区
                    map: 'china', // 表示中国地图
                    roam: true,
                    label: {
                        normal: {
                            show: true, // 是否显示对应地名
                            textStyle: {
                                color: 'rgba(0,0,0,0.4)'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(0, 0, 0, 0.2)'
                        },
                        emphasis: {
                            areaColor: null,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
                series: [
                    {
                        type: 'scatter',
                        coordinateSystem: 'geo' // 对应上方配置
                    },
                    {
                        name: '启动次数', // 浮动框的标题
                        type: 'map',
                        geoIndex: 0,
                        data: [
                            {
                                name: '北京',
                                value: 599
                            },
                            {
                                name: '上海',
                                value: 142
                            },
                            {
                                name: '黑龙江',
                                value: 44
                            },
                            {
                                name: '深圳',
                                value: 92
                            },
                            {
                                name: '湖北',
                                value: 810
                            },
                            {
                                name: '四川',
                                value: 453
                            }
                        ]
                    }
                ]
            })
        }
    }
}
</script>
