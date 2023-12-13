<template>
    <div class="text-center">
        <div
            v-for="(item, index) in selectList"
            class="py-10 cursor-pointer main-hover"
            :class="{ 'text-blue': item.value === value }"
            @click="select(item)"
        >
            {{ item.label }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'SingleSelect',
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        selectList: {
            type: [Array],
            default() {
                return [
                    { value: '', label: '审核通过' },
                    { value: 0, label: '未开始' },
                    { value: 1, label: '进行中' },
                    { value: 2, label: '已暂停' },
                    { value: 10, label: '已结束' },
                    { value: 15, label: '已失效' }
                ]
            }
        }
    },
    methods: {
        select(item) {
            this.$emit('input', item.value)
            this.$emit('change', item.value)
        }
    }
}
</script>

<style></style>
