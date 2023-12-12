<template>
    <el-cascader
        ref="cascaderAddr"
        :key="keyName"
        v-model="cascaderValue"
        :props="props"
        :options="options"
        :placeholder="placeholderText"
        clearable
    />
</template>

<script>
/**
 * 使用注意：
 * 该组件在使用多选的情况下，组件不支持懒加载回显，只能使用多选(数据由后端返回完整的树形结构)
 * 单选是可以使用懒加载的
 * 使用该组件回显时，v-model的值必须在this.$nextTick(() => {})中进行赋值
 */

import { basicApi } from '@/api/ModuleCommon'

const placeholderDict = {
    1: '省',
    2: '省-市',
    3: '省-市-区',
    4: '省-市-区-街道'
}

export default {
    props: {
        value: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 1：省，2：省市，3：省市区，4：省市区街
        level: {
            type: Number,
            default: 4
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: false
        },
        childrenName: {
            type: String,
            default: 'children'
        },
        keyName: {
            type: [String, Number],
            default: 'cascaderAddr'
        }
    },
    data() {
        let _that = this
        return {
            options: [], // 多选时使用的树形结构数据
            cascaderValue: [], // 所选值的数组
            props: {
                lazy: !this.multiple, // 如果是多选，不能使用懒加载
                value: 'id',
                label: 'name',
                children: this.childrenName,
                multiple: this.multiple,
                async lazyLoad(node, resolve) {
                    const { level, value } = node
                    let nodes = ''
                    if (level == 0) {
                        nodes = await _that.getPosition()
                    } else if (level == 1 && _that.level >= 2) {
                        nodes = await _that.getPosition(value)
                    } else if (level == 2 && _that.level >= 3) {
                        nodes = await _that.getPosition(value)
                    } else if (level == 3 && _that.level >= 4) {
                        nodes = await _that.getPosition(value)
                    }
                    resolve(nodes)
                }
            }
        }
    },
    computed: {
        placeholderText() {
            return placeholderDict[this.level]
        }
    },
    watch: {
        value: {
            handler(newValue) {
                this.cascaderValue = newValue
            }
        },
        cascaderValue(newValue) {
            this.$emit('input', newValue)
        }
    },
    mounted() {
        // 多选情况下，使用树形结构数据作为选型
        if (this.multiple) {
            this.getPositionTreeData()
        }
    },
    methods: {
        // 省市区街道数据获取
        async getPosition(id = 0) {
            let positionData = ''
            let { data } = await basicApi.position(id)
            positionData = [...data]
            // 如果是grade为4，则为最后一级
            if (data[0].grade != this.level) {
                for (let item of positionData) {
                    item.children = []
                }
            } else {
                for (let item of positionData) {
                    item.leaf = true
                }
            }
            return positionData
        },

        // 多选时获取的树形结构
        getPositionTreeData() {
            basicApi
                .provincesTree()
                .then((res) => {
                    this.options = res.data
                    console.log(res)
                })
                .catch((err) => {
                    console.log('option List err', err)
                })
        },

        // 返回联级的label名字
        getLabelName() {
            console.log("this.$refs['cascaderAddr']")
            console.log(this.$refs['cascaderAddr'])
            console.log(this.$refs['cascaderAddr'].getCheckedNodes())
            return this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
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
