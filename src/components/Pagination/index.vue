<template>
    <div :class="{ hidden: hidden }" class="pagination-container">
        <el-pagination
            :page-sizes="pageSizes"
            :page-size="limit"
            :layout="layout"
            :current-page="page"
            :small="small"
            :total="total"
            :pager-count="pagerCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>
<script>
import { scrollTo } from './scroll-to'
export default {
    name: 'Pagination',
    props: {
        total: {
            type: [Number, String],
            required: true
        },
        small: {
            type: Boolean,
            default: false
        },
        currentPage: {
            type: Number,
            default: 1
        },
        pagerCount: {
            type: Number,
            default: 5
        },
        pageSize: {
            type: Number,
            default: 10
        },
        pageSizes: {
            type: Array,
            default() {
				return [10, 20, 30, 50, 100]
            }
        },
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        },
        background: {
            type: Boolean,
            default: true
        },
        autoScroll: {
            type: Boolean,
            default: true
        },
        hidden: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        page: {
            get() {
                return this.currentPage
            },
            set(val) {
                this.$emit('update:page', val)
            }
        },
        limit: {
            get() {
                return this.pageSize
            },
            set(val) {
                this.$emit('update:pageSize', val)
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            this.$emit('size-change', val)
            if (this.autoScroll) {
                scrollTo(0, 800)
            }
        },
        handleCurrentChange(val) {
            this.$emit('current-change', val)
            if (this.autoScroll) {
                scrollTo(0, 800)
            }
        }
    }
}
</script>

<style scoped>
</style>
