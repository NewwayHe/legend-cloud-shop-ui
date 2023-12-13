<template>
    <div v-loading="loading" class="empty">
        <template v-if="!loading">
            <img style="object-fit: scale-down" :src="typeList[emptyType].img" alt="" />
            <p class="text-999 font-12">{{ typeList[emptyType].text }}</p>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Empty',
    props: {
        emptyType: {
            type: String,
            default: 'pro'
        },
        text: {
            type: String,
            default: '暂无数据'
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            typeList: {
                pro: { img: require('@/assets/images/empty/pro__empty.png'), text: this.text },
                search: { img: require('@/assets/images/empty/search__empty.png'), text: '暂无搜索信息' }
            }
        }
    }
}
</script>

<style scoped>
.empty {
    text-align: center;
    padding: 80px 0;
}
.empty p {
    line-height: 1;
    margin: 0;
    margin-bottom: 20px;
}
</style>
