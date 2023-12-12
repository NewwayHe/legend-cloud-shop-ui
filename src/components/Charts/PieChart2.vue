<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const bgColor = '#fff'
const title = '成交订单（笔）'
const color = ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0']
const echartData = [
    {
        name: '微信端',
        value: '3720'
    },
    {
        name: 'pc端',
        value: '2920'
    },
    {
        name: 'web端',
        value: '2200'
    },
    {
        name: '订单来源',
        value: '1420'
    },
    {
        name: 'app端',
        value: '1520'
    }
]

const formatNumber = function (num) {
    const reg = /(?=(\B)(\d{3})+$)/g
    return num.toString().replace(reg, ',')
}
const total = echartData.reduce((a, b) => {
    return a + b.value * 1
}, 0)

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
                backgroundColor: bgColor,
                color: color,
                // tooltip: {
                //     trigger: 'item'
                // },
                title: [
                    {
                        text: '{name|' + title + '}\n{val|' + formatNumber(total) + '}',
                        top: 'center',
                        left: 'center',
                        textStyle: {
                            rich: {
                                name: {
                                    fontSize: 14,
                                    fontWeight: 'normal',
                                    color: '#666666',
                                    padding: [10, 0]
                                },
                                val: {
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    color: '#333333'
                                }
                            }
                        }
                    }
                    // {
                    //     text: '单位：个',
                    //     top: 20,
                    //     left: 20,
                    //     textStyle: {
                    //         fontSize: 14,
                    //         color: '#666666',
                    //         fontWeight: 400
                    //     }
                    // }
                ],
                // legend: {
                //     orient: 'vertical',
                //     icon: 'rect',
                //     x: '80%',
                //     y: 'center',
                //     itemWidth: 12,
                //     itemHeight: 12,
                //     align: 'left',
                //     textStyle: {
                //         rich: {
                //             name: {
                //                 fontSize: 12
                //             },
                //             value: {
                //                 fontSize: 16,
                //                 padding: [0, 5, 0, 15]
                //             },
                //             unit: {
                //                 fontSize: 12
                //             }
                //         }
                //     },
                //     formatter: function(name) {
                //         let res = echartData.filter(v => v.name === name);
                //         res = res[0] || {};
                //         let unit = res.unit || '';
                //         return '{name|' + name + '}  {value|' + res.value + '}{unit|' + unit + '}'
                //     }
                //     // data: legendName
                // },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '60%'],
                        center: ['50%', '50%'],
                        data: echartData,
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                borderColor: bgColor,
                                borderWidth: 2
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 20,
                                length2: 120,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            }
                        },
                        label: {
                            normal: {
                                formatter: (params) => {
                                    return '{icon|●}{name|' + params.name + '}{value|' + formatNumber(params.value) + '}'
                                },
                                padding: [0, -100, 25, -100],
                                rich: {
                                    icon: {
                                        fontSize: 16
                                    },
                                    name: {
                                        fontSize: 14,
                                        padding: [0, 10, 0, 4],
                                        color: '#666666'
                                    },
                                    value: {
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#333333'
                                    }
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
