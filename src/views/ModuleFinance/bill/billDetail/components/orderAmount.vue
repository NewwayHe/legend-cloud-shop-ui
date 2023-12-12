<!--
    财务管理->结算账单->账单详情—>订单金额
-->
<template>
	<div class="table">
		<el-table
			ref="multipleTable"
			v-loading="tableListLoading"
			header-row-class-name="headerRow"
			:data="tableList"
			tooltip-effect="dark"
			class="w-100"
		>
			<template slot="empty">
				<empty empty-type="pro" />
			</template>
			<el-table-column label="序号" type="index" width="48" />
			<el-table-column label="订单编号" prop="orderNumber" min-width="180" />
			<el-table-column label="下单时间" prop="orderTime" width="140" />
			<el-table-column label="支付时间" prop="payTime" width="140" />
			<el-table-column label="订单金额" width="115">
				<template slot-scope="scope">
					<div>{{ scope.row.orderAmount | priceFilter }}</div>
				</template>
			</el-table-column>
			<el-table-column label="运费金额" width="115">
				<template slot-scope="scope">
					<div>{{ scope.row.freightAmount | priceFilter }}</div>
				</template>
			</el-table-column>
			<el-table-column label="平台佣金" width="115">
				<template slot-scope="scope">
					<div>{{ scope.row.commissionAmount | priceFilter }}</div>
				</template>
			</el-table-column>
			<el-table-column label="优惠券金额" width="115">
				<template slot-scope="scope">
					<div>{{ scope.row.redpackAmount | priceFilter }}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary">
						<router-link class="text-blue" :to="{ name: 'orderDetail', query: { DetailId: scope.row.orderId } }">查看</router-link>
					</el-link>
				</template>
			</el-table-column>
		</el-table>
		<el-row type="flex" justify="end" class="mt-30">
			<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
		</el-row>
	</div>
</template>

<script>
import common from '@/mixins/pages/commom'

export default {
	mixins: [common],
	props: {
		searchParams: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			isMounted: true,
			url: {
				getData: '/order/s/shop/order/bill/orderPage'
			},
			fixFilters: {
				orderType: 1,
				id: this.$route.query.id
			}
		}
	},
	watch: {
		searchParams: {
			handler(newVal) {
				this.fixFilters = { ...this.fixFilters, ...newVal }
			},
			deep: true,
			immediate: true
		}
	}
}
</script>

<style></style>
