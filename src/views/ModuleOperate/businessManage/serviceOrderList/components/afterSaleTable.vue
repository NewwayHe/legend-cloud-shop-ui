<template>
	<div>
		<div class="customTable__warp" ref="wrapTable">
			<table class="customTable__header" :style="{ width: tableLayout.bodyWidth }">
				<thead>
					<tr>
						<th width="48">序号</th>
						<th colspan="3" min-width="280" :width="tableLayout.m_280" style="text-align: left">商品</th>
						<th :width="tableLayout.d_80">售后数量</th>
						<th :width="tableLayout.d_80">订单状态</th>
						<th min-width="100" :width="tableLayout.m_100">收货人信息</th>
						<th width="140">订单金额</th>
						<th width="140">退款金额</th>
						<th width="140">申请时间</th>
						<th :width="tableLayout.m_100">售后原因</th>
						<th width="120">售后状态</th>
						<th min-width="100" :width="tableLayout.m_100">操作</th>
					</tr>
				</thead>
			</table>
			<div class="customTable__con" :style="{ width: tableLayout.bodyWidth }">
				<template v-if="tableList.length">
					<el-checkbox-group v-model="checkList">
						<table v-for="(item, indexs) in tableList" :key="indexs" class="customTable__table">
							<colgroup>
								<col width="48" />
								<col min-width="80" :width="tableLayout.m_80" />
								<col min-width="100" :width="tableLayout.m_100" />
								<col min-width="100" :width="tableLayout.m_100" />
								<col :width="tableLayout.d_80" />
								<col :width="tableLayout.d_80" />
								<col :width="tableLayout.m_100" />
								<col width="140" />
								<col width="140" />
								<col width="140" />
								<col :width="tableLayout.m_100" />
								<col width="120" />
								<col min-width="100" :width="tableLayout.m_100" />
							</colgroup>
							<tbody>
								<tr class="customTable__trHead">
									<td>
										<el-checkbox :label="item.id" :disabled="!(item.applyStatus == 1 && item.sellerStatus == 0)" />
									</td>
									<td colspan="12" style="text-align: left">
										<span class="customTable__trHead--action">申请时间：{{ item.createTime || '-' }}</span>
										<span class="customTable__trHead--action text-blue cursor-pointer" @click="toDetail(item, 'orderDetail')">
											订单号: {{ item.orderNumber || '-' }}
										</span>
										<span class="customTable__trHead--action">售后编号: {{ item.refundSn || '-' }}</span>
										<span class="customTable__trHead--action">
											售后类型: {{ item.applyType == 1 ? '退款' : item.applyType == 2 ? '退货退款' : '已撤销' }}
										</span>
									</td>
								</tr>
								<tr>
									<td>{{ indexs + 1 }}</td>
									<td colspan="3">
										<div class="d-flex a-center line-h-md" v-if="item.orderItemDTOList.length == 1">
											<ls-image
												style="flex: 0 0 60px"
												:src="item.orderItemDTOList[0].pic"
												:options="{ w: '60', h: '60', br: '4' }"
											/>
											<div class="ml-10 flex-col-between">
												<!-- 这里外盒子与内盒子的高度不一 所以用font-size:0来清除 -->
												<el-link
													:underline="false"
													type="primary"
													@click="proPreview(item.orderItemDTOList[0])"
													style="font-size: 0"
												>
													<el-popover
														placement="top-start"
														width="500"
														trigger="hover"
														:title="item.orderItemDTOList[0].productName"
													>
														<div slot="reference" class="text-blue text-left line-clamp2 font-12">
															{{ item.orderItemDTOList[0].productName || '-' }}
														</div>
														<el-link
															class="text-blue"
															:underline="false"
															target="_blank"
															:href="$shareRedirectUrl + '?detailsType=good&id=' + item.orderItemDTOList[0].productId"
														>
															{{ $shareRedirectUrl + '?detailsType=good&id=' + item.orderItemDTOList[0].productId }}
														</el-link>
													</el-popover>
												</el-link>
												<span class="text-999 mt-10 text-left" v-if="item.orderItemDTOList[0].attribute">
													{{ item.orderItemDTOList[0].attribute }}
												</span>
											</div>
										</div>
										<div
											v-else
											class="position-relative w-100 overflow-h swiper-container"
											:class="{ 'swiper-wrap': item.orderItemDTOList.length > 4 }"
										>
											<div class="d-flex a-center line-h-md position-relative overflow-h" :ref="`swiper-container-${indexs}`">
												<el-popover
													placement="top-start"
													width="500"
													trigger="hover"
													:title="orderItem.productName"
													v-for="orderItem in item.orderItemDTOList"
													:key="orderItem.id"
												>
													<el-link
														:underline="false"
														type="primary"
														target="_blank"
														:href="$shareRedirectUrl + '?detailsType=good&id=' + orderItem.productId"
													>
														{{ $shareRedirectUrl + '?detailsType=good&id=' + orderItem.productId }}
													</el-link>
													<ls-image
														slot="reference"
														style="flex: 0 0 60px"
														class="mr-5"
														:src="orderItem.pic"
														:options="{ w: '60', h: '60', br: '4' }"
													/>
												</el-popover>
											</div>
											<div v-show="item.orderItemDTOList.length > 4" class="swiper turn-left" @click="swipeLeft(indexs)">
												<span class="iconfont icon-ArrowLeft" style="color: #fff"></span>
											</div>
											<div v-show="item.orderItemDTOList.length > 4" class="swiper turn-right" @click="swipeRight(indexs)">
												<span class="iconfont icon-ArrowRight" style="color: #fff"></span>
											</div>
										</div>
									</td>

									<!-- 售后数量 -->
									<td>
										<span>{{ item.goodsNum }}</span>
									</td>

									<!-- 订单状态 -->
									<td>
										<span :class="'1,2,5,10,15'.includes(item.orderStatus) ? 'status-wait' : 'status-done'">
											{{ item.orderStatus | getOrderStatus(item.orderType) }}
										</span>
									</td>

									<!-- 用户信息 -->
									<td>
										<div class="word-breakall">{{ item.nickName }}</div>
										<div>{{ item.receiver }}</div>
										<div>{{ item.mobile }}</div>
									</td>

									<!-- 订单金额 -->
									<td>{{ item.orderItemMoney | priceFilter }}</td>

									<!-- 退款金额 -->
									<td>{{ item.refundAmount | priceFilter }}</td>

									<!-- 申请时间 -->
									<td>{{ item.createTime || '-' }}</td>

									<!-- 售后原因 -->
									<td>
										<div class="word-breakall">{{ item.reason }}</div>
									</td>

									<!-- 售后状态 -->
									<td>
										<span :class="refundStatus(item).colorType">{{ refundStatus(item).status }}</span>
									</td>

									<td>
										<el-link
											:underline="false"
											class="d-block text-nowrap text-blue"
											type="primary"
											@click="toRefuseDetail(item)"
										>
											查看
											<!--售后详情-->
										</el-link>
										<el-link
											v-if="
												(item.goodsStatus == 3 && item.sellerStatus == 1) || (item.goodsStatus == 5 && item.sellerStatus == 1)
											"
											:underline="false"
											class="d-block text-nowrap text-blue"
											type="primary"
											@click="confirmDeliver(item)"
										>
											确认收货
										</el-link>
										<template v-if="item.applyStatus == 1 && item.sellerStatus == 0">
											<el-link class="d-block text-blue" :underline="false" type="primary" @click="openSubmitDialog(item)">
												确认
											</el-link>
										</template>
									</td>
								</tr>
							</tbody>
						</table>
					</el-checkbox-group>
				</template>
				<empty v-else />
			</div>
		</div>

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
						:autosize="true"
						:maxlength="50"
						:show-word-limit="true"
						placeholder="请输入审核意见"
					></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="orderDialogVisible = false">取 消</el-button>
				<ls-button size="small" type="primary" :asyncFunction="sureSubmit">确 定</ls-button>
			</span>
		</el-dialog>
		<dialogPreview ref="dialogPreview" />
	</div>
</template>
<script>
import { serviceOrderApi } from '@/api/ModuleOrder'
import { orderSet } from '@/api/ModuleSystem'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
import cud from '@/mixins/pages/cud'
export default {
	mixins: [cud],
	components: {
		dialogPreview
	},
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
			type: Array,
			required: true
		},
		selectableArr: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			checkList: [], // 选中的item
			customCheck: false, // 全选状态
			orderDialogVisible: false, // 确认售后订单dialog
			currentOrder: {}, // 激活的售后订单
			form: {
				abandonedGoodFlag: false, // 是否弃货
				auditFlag: 1, // 	是否通过售后
				refundId: '', // 	退款编号
				sellerMessage: '' // 	卖家备注
			},
			rules: {
				abandonedGoodFlag: [{ required: true, message: '是否弃货', trigger: 'blur' }],
				auditFlag: [{ required: true, message: '是否同意', trigger: 'blur' }]
			},
			tableLayout: {
				// 单元格大小分配
				colTotalWidth: 48 + 80 + 100 + 100 + 80 + 80 + 100 + 100 + 140 * 3 + 120 + 100
			}
		}
	},
	watch: {
		orderDialogVisible(newVal) {
			if (!newVal) {
				this.$refs.form.resetFields()
			}
		},

		// 监听选中的数组，如果选中的数组长度等于当前分页的数量，则会全选
		checkList: {
			handler(val) {
				// 如果当前页有一项 不在当前选中的数组里 则一定不全选
				if (this.selectableArr.some((item) => !val.includes(item.id))) {
					this.customCheck = false
				} else {
					this.customCheck = true
				}
				this.$emit('selecteItem', this.customCheck, val)
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		refundStatus(data) {
			// applyStatus：1为待发货,3为待签收,5为待收货,7为已收货,默认为0
			// sellerStatus：卖家处理状态:0为待审核,1为同意,-1为不同意
			let typeobj = {}
			if (data.applyStatus == -1 || data.applyStatus == -2) {
				typeobj.status = '已取消'
				typeobj.colorType = 'status-done'
				// return '已取消'
				return typeobj
			}
			if (data.applyStatus == -3 || data.sellerStatus == -1) {
				typeobj.status = '已拒绝'
				typeobj.colorType = 'status-veto'
				// return '已拒绝'
				return typeobj
			}
			if (data.applyStatus == 3) {
				typeobj.status = '已完成'
				typeobj.colorType = 'status-done'
				// return '已完成'
				return typeobj
			}
			if (data.applyStatus == 1 && data.sellerStatus == 0) {
				typeobj.status = '待确认'
				typeobj.colorType = 'status-wait'
				// return '待确认'
				return typeobj
			}
			if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
				typeobj.status = '待收货'
				typeobj.colorType = 'status-wait'
				// return '待收货'
				return typeobj
			}
			if (data.applyStatus == 2) {
				typeobj.status = '待审核'
				typeobj.colorType = 'status-wait'
				// return '待审核'
				return typeobj
			}
			if (data.goodsStatus == 1 && data.sellerStatus == 1) {
				typeobj.status = '待用户退货'
				typeobj.colorType = 'status-wait'
				// return '待用户退货'
				return typeobj
			}
			return '-'
		},
		proPreview(row) {
			let url = this.$shareRedirectUrl + `?detailsType=snapshot&device=mobile&id=${row.id}&snapshotId=${row.snapshotId}`
			this.$refs.dialogPreview.showDialog({ url: url })
		},
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
		// 父组件点击全选
		selectedAllOrNot() {
			if (this.checkList.length === this.tableList.length) {
				this.checkList = []
			} else {
				this.checkList = this.tableList.map((item) => {
					if (item.applyStatus == 1 && item.sellerStatus == 0) return item.id
				})
			}
		},

		// 打开确认dialog
		openSubmitDialog(order) {
			this.currentOrder = order
			this.$set(this.form, 'refundIds', [order.id])
			this.orderDialogVisible = true
		},

		examine() {
			if (!this?.checkList?.length) {
				this.$message.warning('请至少选择一条数据')
				return
			}
			this.currentOrder = this.tableList[0]
			this.$set(this.form, 'refundIds', this.checkList)
			this.orderDialogVisible = true
		},

		// 确认提交
		sureSubmit() {
			return new Promise((resolve) => {
				this.$refs.form.validate((valid) => {
					if (valid) {
						let api = ''
						if (this.currentOrder.applyType == 1) {
							api = 'batchAuditRefund'
						} else {
							api = 'batchAuditRefundGood'
						}

						// 调接口验证有没有收货地址
						orderSet.orderSetting().then((res) => {
							if (res.success) {
								// 如果已经设置了退货地址，则正常调接口
								if (res.data && res.data.returnProvinceId && res.data.returnCityId && res.data.returnShopAddr) {
									serviceOrderApi[api](this.form)
										.then((res) => {
											if (res.success) {
												this.orderDialogVisible = false
												this.$emit('operate', res)
												this.checkList = []
												// 请填写退货收货人
											}
										})
										.catch((err) => {
											console.log('sumit err', err)
										})
										.finally((_) => {
											resolve()
										})

									// 如果未设置退货地址,则跳去设置
								} else {
									resolve()
									this.$confirm('您还未设置退货地址，要去设置退货地址吗?', '提示', {
										type: 'warning'
									}).then(() => {
										this.orderDialogVisible = false
										this.$router.push({ name: 'baseSet', query: { switchType: 'ortherSet' } })
									})
								}
							} else {
								resolve()
							}
						})
					} else {
						resolve()
					}
				})
			})
		},

		// 去订单详情
		toDetail(order, name) {
			this.$router.push({ name: name, query: { DetailId: order.orderId } })
		},
		// 去订单详情
		toRefuseDetail(order) {
			this.$router.push({ name: 'refuseDetail', query: { id: order.id } })
		},
		// 左滑
		swipeLeft(index) {
			this.$refs[`swiper-container-${index}`][0].scrollLeft -= 65
		},
		// 右滑
		swipeRight(index) {
			this.$refs[`swiper-container-${index}`][0].scrollLeft += 65
		}
	}
}
</script>

<style lang="scss" scoped>
/* 由于使用了字数提示 但是ELEMENT并未做好处理 当输入过长时 输入的字符会被字数提示(position:absolute)给遮挡 */
.el-textarea {
	::v-deep .el-textarea__inner {
		padding-right: 46px;
	}
}

/* 商品图片过多时 滑动 */
.swiper {
	position: absolute;
	width: 25px;
	height: 25px;
	border-radius: 50%;
	background-color: #f5f5f5;
	top: 50%;
	transform: translateY(-50%);
	cursor: pointer;
	transition: all ease 0.4s;
	&.turn-left {
		left: 0;
		visibility: hidden;
	}
	&.turn-right {
		right: 0;
		visibility: hidden;
	}
}

.swiper-container {
	&.swiper-wrap {
		transition: all ease 0.4s;
	}
	&:hover {
		&.swiper-wrap {
			padding: 0 25px;
		}
		.turn-left,
		.turn-right {
			visibility: visible;
		}
	}
}
</style>
