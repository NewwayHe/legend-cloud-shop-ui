<template>
    <div class="table">
        <el-table ref="multipleTable" size="small" border :data="tableList" header-row-class-name="headerRow" tooltip-effect="dark" class="w-100">
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column prop="pic" label="商品" width="280">
                <template slot-scope="scope">
                    <div class="d-flex a-center">
                        <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '6' }" />
                        <el-popover placement="top-start" width="500" trigger="hover" :title="scope.row.prodName || scope.row.productName">
                            <el-link
                                :underline="false"
                                type="primary"
                                target="_blank"
                                :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                            >
                                {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId }}
                            </el-link>
                            <el-link
                                slot="reference"
                                class="line-clamp2 ml-10 text-blue"
                                :underline="false"
                                type="primary"
                                target="_blank"
                                :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                            >
                                {{ scope.row.prodName || scope.row.productName }}
                            </el-link>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="cnProperties" label="商品规格">
                <template slot-scope="scope">
                    {{ scope.row.cnProperties || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="stocks" label="销售库存" />
            <el-table-column prop="price" show-overflow-tooltip label="销售价">
                <template slot-scope="scope">
                    {{ scope.row.price | priceFilter }}
                </template>
            </el-table-column>
            <el-table-column prop="estimatedIncome" label="预估收益">
                <template slot="header" slot-scope="scope">
                    <el-row type="flex" align="middle" justify="start">
                        预估收益
                        <el-tooltip class="item" placement="top">
                            <div slot="content">
                                计算单个SKU满足该活动规则时的预估收益：
                                <br />
                                预估收益 = 销售价 - 优惠券活动优惠金额 - 成本价；
                                <br />
                                若单个SKU不满足活动规则时，预估收益不统计商品参与活动的金额：
                                <br />
                                预估收益 = 销售价 - 成本价；
                            </div>
                            <i class="el-icon-question font-16 text-000 opacity-3 ml-5"></i>
                        </el-tooltip>
                    </el-row>
                </template>
                <template slot-scope="scope">
                    <template v-if="scope.row.price >= couponForm.minPoint">
                        {{ ((scope.row.price * 100 - couponForm.amount * 100 - scope.row.costPrice * 100) / 100) | priceFilter }}
                    </template>
                    <template v-else>
                        {{ ((scope.row.price * 100 - scope.row.costPrice * 100) / 100) | priceFilter }}
                    </template>
                </template>
            </el-table-column>

            <el-table-column v-if="pageType != 'lookInfo'" label="操作" align="center">
                <template slot-scope="scope">
                    <span class="table__action">
                        <el-link :underline="false" type="primary" @click="couponProductDel(scope.row)">删除</el-link>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { couponApi } from '@/api/ModuleMarketing.js'
export default {
    components: {},
    props: {
        tableList: {
            type: [Array, Object],
            required: true
        },
        couponForm: {
            type: [Array, Object]
        },
        couponType: {
            type: [String, Number],
            default: 0
        },
        pageType: {
            type: String
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
        couponProductDel(row) {
            couponApi.couponProductDel(row.id, this.couponForm.id).then((res) => {
                if (res.code) {
                    this.$emit('delCouponPro')
                }
            })
        }
    }
}
</script>
<style lang="scss"></style>
