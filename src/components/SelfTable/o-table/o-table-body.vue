<template>
    <div class="o-table__body-wrapper">
        <template v-if="_tableData && _tableData.length">
            <o-table-layout :columns="_tableColumns" :data="_tableData">
                <tbody>
                    <tr v-for="(item, index) in _tableData" :key="index">
                        <template v-for="(node, index) in _node">
                            <o-table-body-col :key="index" :data="item" :node="node" :hide="isHide(node)" />
                        </template>
                    </tr>
                </tbody>
            </o-table-layout>
        </template>
        <template v-else>
            <div class="empty">暂无数据</div>
        </template>
    </div>
</template>

<script>
import OTableLayout from './o-table-layout'
import OTableBodyCol from './o-table-body-col'

export default {
    components: { OTableLayout, OTableBodyCol },
    props: {
        columns: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
        node: {
            type: Array,
            required: true
        },
        hideLeft: {
            type: Boolean,
            default: false
        },
        hideRight: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        _tableColumns() {
            return this.columns
        },
        _tableData() {
            return this.data || []
        },
        _node() {
            return this.node || []
        }
    },
    methods: {
        isHide(node) {
            if (node.propsData.fixed === 'left') {
                return this.hideLeft
            } else if (node.propsData.fixed === 'right') {
                return this.hideRight
            } else {
                return false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.o-table__body-wrapper {
    position: relative;
}
.empty {
    font-size: 0.32rem;
    color: #d6d6d6;
    padding: 0.8rem 0;
    text-align: center;
    font-weight: normal;
}
.o-table__body_hide-right {
    ::v-deep tr td {
        &:last-child {
            opacity: 0;
        }
    }
}
.o-table__body_hide-left {
    ::v-deep tr td {
        &:first-child {
            opacity: 0;
        }
    }
}
</style>
