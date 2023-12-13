<template>
    <div class="customTable__warp">
        <el-table
            ref="multipleTable"
            :span-method="objectSpanMethod"
            :data="dataList"
            tooltip-effect="dark"
            class="w-100"
            row-key="id"
            header-row-class-name="headerRow"
        >
            <el-table-column label="序号" width="48">
                <template slot-scope="scope">
                    {{ scope.row.rowIndex }}
                </template>
            </el-table-column>
            <el-table-column label="运费模板名称" min-width="118">
                <template slot-scope="scope">
                    {{ scope.row.transName }}
                </template>
            </el-table-column>
            <el-table-column label="类型" min-width="118">
                <template slot-scope="scope">
                    自定义
                    <!-- 去掉esLint的scope提示 -->
                    <span v-if="false">{{ scope.row }}</span>
                </template>
            </el-table-column>
            <el-table-column label="计费类型" min-width="118">
                <template slot-scope="scope">
                    <template v-if="scope.row.freeFlag">
                        <span>包邮</span>
                    </template>
                    <template v-else>
                        <span v-if="scope.row.transType == 1">按件数</span>
                        <span v-if="scope.row.transType == 2">按重量</span>
                        <span v-if="scope.row.transType == 3">按体积</span>
                        <span v-if="scope.row.transType == 4">固定运费</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                    <span class="table__action" style="justify-content: center">
                        <el-link :underline="false" type="primary" @click="toAddFreight(scope.row)">编辑</el-link>
                        <el-link :underline="false" type="primary" @click.stop="delFreight(scope.row)">删除</el-link>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: {
        tableList: {
            type: [Array, Object],
            required: true
        }
    },
    data() {
        return {
            form: {},
            currentOrder: {}, // 当前订单
            dataList: []
        }
    },
    computed: {},
    watch: {
        tableList: {
            handler(newVal) {
                var dataList = []
                if (!this.tableList.length) return
                for (let i = 0; i < this.tableList.length; i++) {
                    dataList.push({
                        ...this.tableList[i],
                        rowIndex: i + 1,
                        rowSpan: 1,
                        hideCell: false
                    })
                    // }
                }
                this.dataList = dataList
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {},
    methods: {
        toAddFreight(row) {
            this.$router.push({ name: 'freightAdd', query: { id: row.id || '' } })
        },
        delFreight(item) {
            console.log(this.$parent)
            this.$emit('delTrans', item)
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex <= 3 || columnIndex == 9) {
                if (!row.hideCell) {
                    return {
                        rowspan: row.rowSpan,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 1
                    }
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.freightTable__inTable.border__table {
    tr {
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1) !important;
        &:last-child {
            border-bottom: none !important;
        }
    }
}

.freightTable {
    &__table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        table-layout: fixed;
        text-align: left;
    }
    &__inTable {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        table-layout: fixed;
        text-align: left;
        td {
            padding-top: 0 !important;
            &:first-child {
                width: auto !important;
                padding-left: 0 !important;
            }
        }
        tr {
            border: none !important;
        }
        th,
        td {
            padding: 0px;
            &:first-child {
                width: 50px;
                text-align: center;
                padding: 0 10px;
            }
        }
    }
    &__warp {
        width: 100%;
        overflow-x: auto;

        th,
        td {
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333;
            text-align: left;
            min-height: 48px;
            line-height: 26px;
            font-size: 12px;
            &:first-child {
                width: 50px;
                text-align: center;
                padding: 0 10px;
            }
        }
        th {
            border: none;
            background-color: #f5f7fa;
        }
        tr {
            border-bottom: 1px solid #ebeef5;
            &:hover {
                background-color: #f5f7fa;
            }
        }
    }
    &__header {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        white-space: nowrap;
        width: 100%;
        table-layout: fixed;
        th {
            &:first-child {
                width: 100px;
                padding: 0 10px !important;
            }
        }
    }
}
</style>
