<template>
    <div :ref="ref" class="o-table-column">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'OTableColumn',
    props: {
        fixed: {
            type: String,
            default: 'left'
        },
        label: {
            type: String
        },
        width: {
            type: String
        },
        minWidth: {
            type: String
        },
        prop: {
            type: String
        },
        align: {
            type: String,
            default: 'left'
        }
    },
    data() {
        return {
            ref: `ref-${(Math.random() * 100000).toFixed(0)}`
        }
    },
    mounted() {
        console.log(this.$slots)
    }
}
</script>

<style lang="scss" scoped></style>
