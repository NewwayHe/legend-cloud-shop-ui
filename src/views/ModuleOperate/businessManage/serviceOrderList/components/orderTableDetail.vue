<template>
	<div class="customTable__warp table">
		<el-table
			ref="multipleTable"
			:data="tableList"
			tooltip-effect="dark"
			class="w-100"
			header-row-class-name="headerRow"
			:span-method="spanMerge"
		>
			<template slot="empty">
				<empty empty-type="pro" />
			</template>
			<el-table-column label="序号" type="index" width="48" />
			<el-table-column prop="pic" label="商品" width="280">
				<template slot-scope="scope">
					<div class="d-flex a-center line-h-md">
						<ls-image style="flex: 0 0 60px" :src="scope.row.pic" :options="{ w: '60', h: '60', br: '4' }" />
						<el-popover placement="top-start" width="300" trigger="hover" :title="scope.row.productName" class="ml-10">
							<template slot="reference">
								<el-link class="ml-5" :underline="false" type="primary" style="font-size: 0">
									<div class="line-clamp2 font-12">{{ scope.row.productName }}</div>
								</el-link>
							</template>
						</el-popover>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="单价" width="115">
				<template slot-scope="scope">{{ scope.row.price | priceFilter }}</template>
			</el-table-column>
			<el-table-column prop="basketCount" label="数量">
				<template slot-scope="scope">{{ scope.row.basketCount || '-' }}</template>
			</el-table-column>
			<el-table-column prop="actualAmount" label="商品实付款" min-width="140">
				<template slot-scope="scope">
					<p>
						{{ scope.row.actualAmount | priceFilter }}
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="orderAmount" label="订单实付款" min-width="140">
				<template slot-scope="scope">
					<p>
						{{ orderPriceAmount | priceFilter }}
						<br />
						<span class="text-999">(含运费: {{ refuseInfo.freightPrice | priceFilter }})</span>
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="shopInfo" label="店铺信息" width="140">
				<template slot-scope="scope">
					<p class="text-blue">{{ refuseInfo.shopName }}</p>
				</template>
			</el-table-column>
			<el-table-column prop="orderStatus" label="交易状态">
				<template slot-scope="scope">
					<span :class="'1,5,10,15'.includes(refuseInfo.orderStatus) ? 'status-wait' : 'status-done'">
						{{ refuseInfo.orderStatus | getOrderStatus(refuseInfo.orderType) }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="afterStatus" label="售后状态" width="120">
				<template slot-scope="scope">
					<span :class="refundStatus(refuseInfo).status">{{ refundStatus(refuseInfo).msg }}</span>
				</template>
			</el-table-column>
		</el-table>
		<!-- 确认表格 -->
		<el-dialog title="确认售后" :visible.sync="orderDialogVisible" custom-class="dialog-form-small">
			<el-form ref="form" :model="form" :rules="rules" label-width="98px" label-position="right" size="small">
				<el-form-item label="确认类型：" prop="auditFlag">
					<el-radio-group v-model="form.auditFlag">
						<el-radio :label="1">同意</el-radio>
						<el-radio :label="0">拒绝</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					class="transition-all05 overflow-h"
					v-if="currentOrder.applyType == 2"
					:style="{ height: form.auditFlag == 1 ? '33px' : '0px' }"
					label="是否弃货："
					prop="abandonedGoodFlag"
				>
					<el-switch v-model="form.abandonedGoodFlag" active-color="#13ce66" inactive-color="#CCCCCC"></el-switch>
				</el-form-item>
				<el-form-item label="审核意见：" prop="sellerMessage">
					<el-input
						v-model="form.sellerMessage"
						type="textarea"
						:maxlength="100"
						placeholder="请输入审核意见"
						autosize
						show-word-limit
					></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="orderDialogVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="sureSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { serviceOrderApi } from '@/api/ModuleOrder'
export default {
	components: {},
	filters: {
		getOrderStatus(status, orderType) {
			const orderStatusDict = {
				1: '待付款',
				2: '待成团',
				3: '已付定金',
				5: '待发货',
				10: '待签收',
				15: '待收货',
				20: '已完成',
				[-5]: '已取消'
			}
			return orderStatusDict[status] || '-'
		}
	},
	props: {
		tableList: {
			type: [Object, Array],
			required: true
		},
		refuseInfo: {
			type: [Object, Array],
			required: true
		}
	},
	data() {
		return {
			orderType: {
				O: '普通订单',
				P: '预售订单',
				G: '团购订单',
				S: '秒杀订单',
				MG: '拼团订单'
			},
			orderDialogVisible: false, // 确认售后订单dialog
			form: {
				abandonedGoodFlag: false, // 是否弃货
				auditFlag: 1, // 	是否通过售后
				refundId: '', // 	退款编号
				sellerMessage: '' // 	卖家备注
			},
			currentOrder: {}, // 激活的售后订单
			rules: {
				abandonedGoodFlag: [{ required: true, message: '是否弃货', trigger: 'blur' }],
				auditFlag: [{ required: true, message: '是否同意', trigger: 'blur' }]
			}
		}
	},
	computed: {
		// 订单实付款 金额总和
		orderPriceAmount() {
			return this.tableList.reduce((pre, cur) => pre + cur.actualAmount, this.refuseInfo.freightPrice || 0)
		},
	},
	watch: {
		orderDialogVisible(newVal) {
			if (!newVal) {
				this.$refs.form.resetFields()
			}
		}
	},

	methods: {
		//确认
		openSubmitDialog(order) {
			this.currentOrder = order
			this.$set(this.form, 'refundId', order.id)
			this.orderDialogVisible = true
		},
		// 确认提交
		sureSubmit() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let api = ''
					if (this.currentOrder.applyType == 1) {
						api = 'auditRefund'
					} else {
						api = 'auditRefundGood'
					}
					serviceOrderApi[api](this.form)
						.then((res) => {
							this.orderDialogVisible = false
							this.$emit('operate', res)
						})
						.catch((err) => {
							console.log('sumit err', err)
						})
				}
			})
		},
		//确认收货
		confirmDeliver(row) {
			this.$confirm('确认收货后，不可恢复。确认收货？', '消息确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				serviceOrderApi.confirmDeliver({ refundId: row.id }).then((res) => {
					if (res.code) {
						this.$emit('operate', res)
					}
				})
			})
		},
		// 去订单详情
		toDetail(order, name) {
			this.$router.push({ name: name, query: { DetailId: order.orderId } })
		},
		// 售后状态
		refundStatus(data) {
			if (data.applyStatus == -1 || data.applyStatus == -2) {
				return {
					msg: '已取消',
					status: 'status-done'
				}
			}
			if (data.applyStatus == -3 || data.sellerStatus == -1) {
				return {
					msg: '已拒绝',
					status: 'status-veto'
				}
			}
			if (data.applyStatus == 3) {
				return {
					msg: '已完成',
					status: 'status-done'
				}
			}
			if (data.applyStatus == 1 && data.sellerStatus == 0) {
				return {
					msg: '待确认',
					status: 'status-wait'
				}
			}
			if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
				return {
					msg: '待收货',
					status: 'status-wait'
				}
			}
			if (data.applyStatus == 2) {
				return {
					msg: '待审核',
					status: 'status-wait'
				}
			}
			if (data.goodsStatus == 1 && data.sellerStatus == 1) {
				return {
					msg: '待用户退货',
					status: 'status-wait'
				}
			}
			return {
				msg: '-',
				status: 'status-done'
			}
		},
		// 行/列合并
		spanMerge({ row, column, rowIndex, columnIndex }) {
			// 行合并
			const rowSpan = this.tableList.length
			const rowSpanProps = ['userInfo', 'shopInfo', 'orderStatus', 'afterStatus', 'orderAmount']
			if (rowSpanProps.includes(column.property)) {
				if (rowIndex == 0) {
					//第一行
					return [rowSpan, 1]
				} else {
					return [0, 1]
				}
			} else {
				return [1, 1]
			}
		}
	}
}
</script>