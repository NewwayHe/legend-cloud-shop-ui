<template>
    <div class="border rounded-4 p-20 d-flex cursor-pointer" style="width: 352px; border-color: #ebeef5" @click="$router.push({ name: data.url })">
        <!-- 左边 -->
        <div class="flex-1">
            <div class="flex-start mb-5">
                <el-tag size="medium" class="border-none" style="line-height: 30px; height: 29px">{{ data.label }}</el-tag>
                <h3 class="ml-10 font-20">{{ data.title }}</h3>
            </div>
            <div class="font-12 text-999">
                <p v-for="(item, index) in data.describeList" :key="index">{{ item }}</p>
            </div>
        </div>
        <!-- 右边 -->
        <img style="width: 91px; height: 91px" :src="data.img" />
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    methods: {}
}
</script>

<style></style>
