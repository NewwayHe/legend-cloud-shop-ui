<template>
    <div :id="id" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../../../../../components/Charts/mixins/resize'
export default {
    mixins: [resize],
    props: {
        id: {
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
            chart: null,
            categoryList: []
        }
    },
    watch: {
        tree(a) {
            let list = []
            this.tree.map((item) => {
                list.push({
                    value: item.skuNum,
                    name: item.categoryName
                })
            })
            this.categoryList = list
            // console.log('chart1');
            this.initChart()
        },
        id(e) {
            true
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy() {},
    methods: {
        initChart() {
            let activeIndex = 0
            this.chart = echarts.init(document.getElementById(this.id))
            this.setOptions()
            this.chart.dispatchAction({
                type: 'highlight',
                dataIndex: 0
            })
            this.chart.on('click', (info) => {
                this.$emit('change', info)
                if (activeIndex !== info.dataIndex) {
                    this.chart.dispatchAction({
                        type: 'downplay',
                        dataIndex: activeIndex
                    })
                    this.chart.dispatchAction({
                        type: 'highlight',
                        dataIndex: info.dataIndex
                    })
                    activeIndex = info.dataIndex
                }
            })
        },
        setOptions({ expectedData, actualData } = {}) {
            this.chart.setOption({
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: 'SKU数量',
                        type: 'pie',
                        radius: '50%',
                        data: this.categoryList,
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
