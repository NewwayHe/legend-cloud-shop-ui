<template>
    <div class="o-table__header-wrapper">
        <o-table-layout :columns="_tableColumns" :data="_tableData" :show-header="false">
            <thead>
                <tr>
                    <th v-for="(item, index) in _tableColumns" :key="index" rowspan="1" colspan="1">{{ item.label }}</th>
                </tr>
            </thead>
        </o-table-layout>
    </div>
</template>

<script>
import OTableLayout from './o-table-layout'

export default {
    components: { OTableLayout },
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
    computed: {
        _tableColumns() {
            return this.columns
        },
        _tableData() {
            return this.data || []
        }
    }
}
</script>

<style lang="scss" scoped>
.o-table__header-wrapper {
    position: relative;
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
