<template>
    <div class="o-table" :class="_tableClass">
        <div class="o-table-wrap">
            <o-table-header :columns="_columnData" :data="_tableData" :hide-left="hasLeftTable" :hide-right="hasRightTable" />
            <o-table-body :columns="_columnData" :data="_tableData" :node="_node" :hide-left="hasLeftTable" :hide-right="hasRightTable" />
        </div>
        <o-table-fixed v-if="hasLeftTable" position="left" :columns="_columnData" :data="_tableData" :node="_node">
            <o-table-header :columns="_columnData" :data="_tableData" />
            <o-table-body :columns="_columnData" :data="_tableData" :node="_node" />
        </o-table-fixed>
        <o-table-fixed v-if="hasRightTable" position="right" :columns="_columnData" :data="_tableData" :node="_node">
            <o-table-header :columns="_columnData" :data="_tableData" />
            <o-table-body :columns="_columnData" :data="_tableData" :node="_node" />
        </o-table-fixed>
    </div>
</template>

<script>
import OTableHeader from './o-table-header'
import OTableBody from './o-table-body'
import OTableFixed from './o-table-fixed'

export default {
    name: 'OTable',
    components: { OTableFixed, OTableHeader, OTableBody },
    props: {
        data: {
            type: Array,
            required: true
        },
        borderRow: {
            type: Boolean,
            default: false
        },
        borderCol: {
            type: Boolean,
            default: false
        },
        stripe: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columnData: []
        }
    },
    computed: {
        _tableData() {
            return this.data || []
        },
        _columnData() {
            console.log(this._node)
            console.log(777777777777)
            const data = this._node.map((item) => item.propsData) || []
            data.forEach((item) => {
                // 如果列没有设置宽和最小宽，默认设置一个最小值
                if (item.width === undefined && item.minWidth === undefined) {
                    item.minWidth = 20
                }
            })
            return data
        },
        _node() {
            console.log(this.$slots)
            return this.$slots.default.map((item) => item.componentOptions)
        },
        _tableClass() {
            let str = ''
            if (this.borderRow) {
                str += ' o-table_border-row'
            }
            if (this.borderCol) {
                str += ' o-table_border-col'
            }
            if (this.stripe) {
                str += ' o-table_stripe'
            }
            return str
        },
        hasLeftTable() {
            const leftTable = this._columnData.filter((item) => item.fixed && item.fixed === 'left')
            return leftTable && leftTable.length > 0
        },
        hasRightTable() {
            const rightTable = this._columnData.filter((item) => item.fixed && item.fixed === 'right')
            return rightTable && rightTable.length > 0
        }
    }
}
</script>

<style lang="scss" scoped>
$headerHeight: 0.7rem;
$headerBg: #f5f5f5;

.o-table {
    position: relative;
    /*background-color: red;*/
    overflow: hidden;
    &-wrap {
        overflow: auto;
    }
    ::v-deep tr {
        background-color: white;
    }
    ::v-deep td,
    ::v-deep th {
        padding: 0.22rem 0;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: center;
    }
    ::v-deep th {
        font-weight: 500;
        font-size: 0.28rem;
        color: #666666;
        & + th {
            &::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                top: 50%;
                width: 0.02rem;
                height: 0.26rem;
                background-color: #d2d2d2;
                margin-top: -0.13rem;
            }
        }
    }
    &.o-table_border-row {
        ::v-deep tr + tr {
            & td,
            & th {
                border-top: 1px solid #e3e3e3;
            }
        }
    }
    &_stripe {
        ::v-deep .o-table__body-wrapper tr:nth-child(2n) {
            background-color: rgba(254, 195, 166, 0.08);
        }
    }
}
::v-deep .o-table__header-wrapper {
    height: $headerHeight;
    & th {
        background-color: $headerBg;
    }
}
</style>
