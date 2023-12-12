<template>
    <div class="customTable__warp">
        <table class="customTable__header">
            <thead>
                <tr>
                    <th style="width: 200px">订单编号</th>
                    <th>商品</th>
                    <th colspan="3" width='280'>商品名称</th>
                    <th>商品规格</th>
                    <th>购买用户</th>
                    <th width='140'>购买日期</th>
                    <th width='140'>商家</th>
                </tr>
            </thead>
        </table>
        <div class="customTable__con">
            <table class="customTable__table">
                <tbody>
                    <tr>
                        <td style="width: 200px">{{ tableList.orderNumber }}</td>
                        <td>
                            <ls-image style="flex: 0 0 50px" :src="tableList.prodPic" :options="{ w: '50', h: '50', br: '4' }"/>
                        </td>
                        <td colspan="3" width='280'>
                            <el-popover placement="top-start" width="500" trigger="hover" :title="tableList.productName">
                                <el-link :underline="false" class="text-blue" target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+tableList.productId">{{ $shareRedirectUrl+'?detailsType=good&id='+tableList.productId }}</el-link>                                                      
                                <el-link slot="reference" class="line-clamp2 text-blue font-12" :underline="false" type="primary" target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+tableList.productId">{{ tableList.productName }}</el-link>                                                        
                            </el-popover>                     
                        </td>
                        <td>{{ tableList.attribute || '-' }}</td>
                        <td>{{ tableList.nickName || '-' }}</td>
                        <td width='140'>{{ tableList.buyTime || '-' }}</td>
                        <td width='140'>{{ tableList.shopName || '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    components: { },
    props: {
        tableList: {
            type: [Array, Object],
            required: true
        }
    },
    data() {
        return {}
    },
    watch: {},
    mounted() {},
    methods: {}
}
</script>
<style lang="scss" scoped>
.customTable__table {
    margin-top: 0px;
}
</style>
