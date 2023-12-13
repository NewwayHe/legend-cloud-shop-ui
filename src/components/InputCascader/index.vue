<template>
    <el-cascader
        ref="cascaderAddr"
        v-model="cascaderValue"
        :props="props"
        :clearable="$attrs.clearable"
        :separator="$attrs.separator || '/'"
        :placeholder="$attrs.placeholder || '省-市-区-街道'"
        v-on="$listeners"
    />
</template>

<script>
import { addressApi } from '@/api/ModuleCommon.js'

export default {
    props: {
        value: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        let _that = this
        return {
            cascaderValue: [], // 所选值的数组
            cascaderLabel: [], // 所选值的label数组
            props: {
                lazy: true,
                value: 'id',
                label: 'name',
                async lazyLoad(node, resolve) {
                    const { level, value } = node
                    let nodes = ''
                    if (level == 0) {
                        nodes = await _that.getProvinces()
                    } else if (level == 1) {
                        nodes = await _that.getCities(value)
                    } else if (level == 2) {
                        nodes = await _that.getAreas(value)
                    } else if (level == 3) {
                        nodes = await _that.getStreets(value)
                    }
                    resolve(nodes)
                }
            },
            refreshKey: 0
        }
    },
    watch: {
        value: {
            handler(newValue) {
                this.cascaderValue = newValue
                this.$nextTick(() => {
                    this.changeCity()
                })
            },
            immediate: true,
            deep: true
        },
        cascaderValue(newValue) {
            this.$emit('input', newValue)
        }
    },
    methods: {
        async getProvinces() {
            let provinces = ''
            let { data } = await addressApi.location(0)
            provinces = [...data]
            for (let item of provinces) {
                item.children = []
            }
            return provinces
        },
        async getCities(value) {
            let cities = ''
            let { data } = await addressApi.location(value)
            cities = [...data]
            for (let item of cities) {
                item.children = []
            }
            return cities
        },
        async getAreas(value) {
            let areas = ''
            let { data } = await addressApi.location(value)
            areas = [...data]
            for (let item of areas) {
                item.children = []
            }
            return areas
        },
        async getStreets(value) {
            let streets = ''
            let { data } = await addressApi.location(value)
            streets = [...data]
            for (let item of streets) {
                item.leaf = true
            }
            return streets
        },

        // 确定一个节点item
        changeCity() {
            let nodes = this.$refs['cascaderAddr'].getCheckedNodes()
            this.cascaderLabel = nodes && !!nodes[0] ? nodes[0].pathLabels : []
            this.$emit('getAddrLabel', this.cascaderLabel)
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-cascader-menu__list {
    width: 100%;
    height: 100%;
}
</style>
