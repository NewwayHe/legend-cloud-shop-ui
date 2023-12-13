<!-- /*
 * @Descripttion:营销广场
*/ -->
<template>
    <div class="bg-fff d-flex flex-wrap p-20">
        <template v-for="(item, index) in dataList">
            <Card :key="index" :data="item" class="mr-20 mb-20" />
        </template>
    </div>
</template>

<script>
import Card from './components/card'

export default {
    components: { Card },
    data() {
        return {
            dataList: [
                {
                    label: '老客留存',
                    title: '满减优惠券',
                    img: require('@/assets/icons/marketing/coupon.png'),
                    url: 'activeCoupon',
                    describeList: ['1、激发用户消费欲望', '2、新用户引流神器', '3、老客户唤醒法宝']
                }
            ]
        }
    },
    created() {},
    methods: {}
}
</script>
<style scoped lang="scss"></style>
