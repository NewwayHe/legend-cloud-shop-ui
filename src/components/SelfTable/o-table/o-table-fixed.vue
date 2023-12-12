<template>
    <div class="o-table__fixed-wrapper" :class="{ 'o-table__fixed_right': position === 'right' }" :style="_style">
        <slot />
        <!--    <o-table-header :columns="_tableColumns" :data="_tableData" />-->
        <!--    <o-table-body :columns="_tableColumns" :data="_tableData" :node="_node"/>-->
    </div>
</template>

<script>
// import OTableHeader from './o-table-header'
// import OTableBody from './o-table-body'

export default {
    // components: { OTableHeader, OTableBody },
    props: {
        position: {
            type: String,
            default: 'left'
        },
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
        }
    },
    computed: {
        _tableColumns() {
            return this.columns || []
        },
        _tableData() {
            return this.data || []
        },
        _width() {
            let width = 0

            const columns = this._tableColumns.filter((item) => item.fixed === this.position).map((item) => +item.width)

            if (columns && columns.length) {
                width = columns.reduce((val1, val2) => {
                    return val1 + val2
                })
            }
            return width
        },
        _style() {
            let style = `width: ${this._width}px;`
            if (this.position === 'right') {
                style += 'left: auto; right: 0;'
            } else {
                style += 'left: 0; right: auto'
            }
            return style
        },
        _node() {
            return this.node || []
        }
    }
}
</script>

<style lang="scss" scoped>
.o-table__fixed-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 3;
    overflow: hidden;
    box-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.1);
    ::v-deep tr td,
    ::v-deep tr th {
        &:first-child {
            opacity: 1;
        }
    }
}
.o-table__fixed_right {
    ::v-deep .o-table__header-wrapper .o-table-layout {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
    }
    ::v-deep .o-table__body-wrapper .o-table-layout {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
    }
    ::v-deep tr td,
    ::v-deep tr th {
        &:last-child {
            opacity: 1;
        }
    }
}
</style>
