<template>
    <table class="o-table-layout" :style="`width: ${this._tableWidth}px`">
        <colgroup>
            <col v-for="(item, index) in columnWidth" :key="index" :width="item" />
        </colgroup>
        <slot />
    </table>
</template>

<script>
export default {
    props: {
        columns: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tableStyle: '',
            tableData: [],
            // 每一列的宽度
            columnWidth: []
        }
    },
    computed: {
        _tableWidth() {
            if (this.columnWidth && this.columnWidth.length) {
                return this.columnWidth.reduce((val1, val2) => val1 + val2)
            } else {
                return 0
            }
        },
        _tableColumns() {
            return this.columns || []
        },
        _tableData() {
            return this.data || []
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            // 外层盒子的宽度
            const wrapWidth = this.$parent.$parent.$el.clientWidth
            // 已知的每一列的宽
            const hasColumnWidth = this.columns.filter((item) => item.width !== undefined).map((item) => parseFloat(item.width))
            // 没有设置宽度和最小宽的列数
            // const notWidthColumnNumber = this.columns.filter(item => (item.width === undefined && item.minWidth === undefined)).length
            // 已知的总宽
            const hasTotalWidth = hasColumnWidth.reduce((val1, val2) => val1 + val2)
            // 未知宽度的列数
            const unknownWidthColumnNumber = this.columns.length - hasColumnWidth.length
            // 未知列的平均宽度
            const unknownColumnMeanWidth = unknownWidthColumnNumber !== 0 ? (wrapWidth - hasTotalWidth) / unknownWidthColumnNumber : 0

            this.columns.forEach((item) => {
                if (item.width) {
                    // 设置的是宽度，将当前列设置未此宽度
                    this.columnWidth.push(parseFloat(item.width))
                } else if (item.minWidth) {
                    // 设置的是最小宽度，将平均宽度设置为当前列的宽，平均宽度不能小于最小宽度，如果小于最小宽，将已最小宽为准
                    this.columnWidth.push(unknownColumnMeanWidth < parseFloat(item.minWidth) ? parseFloat(item.minWidth) : unknownColumnMeanWidth)
                } else {
                    // 没有设置宽也没有设置最小宽，设置默认值
                    // columnWidth.push(20)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.o-table-layout {
    border: 0;
    border-spacing: 0;
    border-collapse: 0;
}
</style>
