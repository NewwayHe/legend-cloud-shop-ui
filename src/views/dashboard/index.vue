<template>
    <div class="dashboard-container">
        <el-card shadow class="mb-15">
            <div slot="header">
                <span class="font-18 text-333 font-weight">订单信息</span>
            </div>
            <el-row type="flex" justify="center">
                <el-col class="p-25 w-20">
                    <div class="font-14 text-999" style="line-height: 16px">未发货订单数量</div>
                    <p
                        class="font-weight font-28 mt-10 cursor-pointer"
                        style="line-height: 41px"
                        @click="$router.push({ name: 'order', query: { isDashboard: 3 } })"
                    >
                        {{ orderInfoList.waitDelivery || 0 }}
                    </p>
                </el-col>
                <el-col class="p-25 w-20">
                    <div class="font-14 text-999" style="line-height: 16px">未付款订单数量</div>
                    <p
                        class="font-weight font-28 mt-10 cursor-pointer"
                        style="line-height: 41px"
                        @click="$router.push({ name: 'order', query: { isDashboard: 2 } })"
                    >
                        {{ orderInfoList.unPaid || 0 }}
                    </p>
                </el-col>
                <el-col class="p-25 w-20">
                    <div class="font-14 text-999" style="line-height: 16px">未收货订单数量</div>
                    <p
                        class="font-weight font-28 mt-10 cursor-pointer"
                        style="line-height: 41px"
                        @click="$router.push({ name: 'order', query: { isDashboard: 1 } })"
                    >
                        {{ orderInfoList.takeDeliver || 0 }}
                    </p>
                </el-col>
                <el-col class="p-25 w-20">
                    <div class="font-14 text-999" style="line-height: 16px">未评论订单数量</div>
                    <p class="font-weight font-28 mt-10" style="line-height: 41px">{{ orderInfoList.noComm || 0 }}</p>
                </el-col>
                <el-col class="p-25 w-20">
                    <div class="font-14 text-999" style="line-height: 16px">未处理售后订单数量</div>
                    <p class="font-weight font-28 mt-10" style="line-height: 41px">{{ orderInfoList.refundCount || 0 }}</p>
                </el-col>
            </el-row>
        </el-card>
        <user-detail />
        <table-detail />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { indexApi } from '@/api/Dashboard.js'
import userDetail from './components/userDetail'
import tableDetail from './components/tableDetail'
import { shopMoveIn } from '@/api/ModuleCommon'

export default {
    name: 'Dashboard',
    components: {
        userDetail,
        tableDetail
    },
    data() {
        return {
            orderInfoList: []
        }
    },
    computed: {
        ...mapGetters(['name', 'roles', 'userInfo'])
    },
    mounted() {
        shopMoveIn.openShopStatus().then((res) => {
            if (res.code == 1) {
                // res.data 审核通过=1，待审核=0，审核拒绝=-1，未提交入驻申请=2
                if (res.data == 1) {
                    this.orderInfo()
                } else {
                    this.$router.push({ path: '/shopMoveIn' })
                }
            }
        })
    },
    methods: {
        //订单信息
        orderInfo() {
            indexApi.orderInfo().then((res) => {
                this.orderInfoList = res.data
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
    padding: 14px 20px;
    font-weight: 600;
    font-size: 18px;
    color: #333;
    line-height: 25px;
}
.w-20 {
    width: 20%;
}
</style>
