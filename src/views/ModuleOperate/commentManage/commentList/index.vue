<template>
	<div>
		<el-row>
			<el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
				<section class="">
					<div class="search">
						<el-form :inline="true" :model="searchFilters" size="small">
							<el-form-item label="商品名称">
								<el-input v-model="searchFilters.productName" placeholder="请输入" />
							</el-form-item>
							<el-form-item>
								<el-button size="small" @click.stop="dbnSearch">搜索</el-button>
								<el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div class="table">
						<!--列表-->
						<el-table
							ref="multipleTable"
							v-loading="tableListLoading"
							:data="tableList"
							tooltip-effect="dark"
							class="w-100 font-12 customTable__header"
							header-row-class-name="headerRow"
							row-key="id"
						>
							<template slot="empty">
								<empty empty-type="pro" />
							</template>

							<el-table-column label="序号" type="index" width="48" />

							<el-table-column label="商品信息" width="280">
								<template slot-scope="scope">
									<div class="d-flex a-center">
										<ls-image style="flex: 0 0 50px" :src="scope.row.productPic" :options="{ w: '50', h: '50', br: '4' }" />
										<div class="ml-10">
											<el-popover placement="top-start" width="500" trigger="hover">
												<div>{{ scope.row.productName }}</div>
												<el-link
													class="text-blue"
													:underline="false"
													type="primary"
													target="_blank"
													:href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
												>
													{{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId }}
												</el-link>
												<el-link slot="reference" class="line-clamp2 text-blue goodPic" :underline="false" type="primary">
													<span class="line-clamp2" @click="proPreview(scope.row.productId)">
														{{ scope.row.productName }}
													</span>
												</el-link>
											</el-popover>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column sortable prop="count" label="评论数" show-overflow-tooltip />
							<el-table-column sortable prop="composite" label="订单评分" width="350">
								<template slot-scope="scope" class="text-999">
									<span>综合评分：&nbsp;{{ scope.row.composite }}</span>
									<br />
									<span>
										商品评分：
										<el-rate disabled :value="scope.row.score" style="display: inherit" />
									</span>
									<br />
									<span>
										店铺服务：
										<el-rate disabled :value="scope.row.shopScore" style="display: inherit" />
									</span>
									<br />
									<span>
										物流服务：
										<el-rate disabled :value="scope.row.logisticsScore" style="display: inherit" />
									</span>
								</template>
							</el-table-column>
							<el-table-column label="操作" align="left" fixed="right">
								<template slot-scope="scope">
									<span class="table__action">
										<el-link
											class="font-12"
											:underline="false"
											type="primary"
											@click="$router.push({ name: 'commentInfo', query: { productId: scope.row.productId } })"
										>
											查看
										</el-link>
									</span>
								</template>
							</el-table-column>
						</el-table>
						<LsSticky :data="tableList">
							<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
								<pagination
									:current-page="page.curPage"
									:total="tableTotal"
									@size-change="pageSizeChange"
									@current-change="currentPageChange"
								/>
							</el-row>
						</LsSticky>
					</div>
				</section>
			</el-card>
		</el-row>
		<dialogPreview ref="dialogPreview" />
	</div>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { commentApi } from '@/api/ModuleOrder.js'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
export default {
	name: 'CommentList',
	components: { dialogPreview },
	mixins: [common, cud],
	data() {
		return {
			url: {
				getData: '/product/s/product/comment/page'
			},
			searchFilters: {
				curPage: 1,
				pageSize: 10
			}
		}
	},
	computed: {},
	created() {},
	methods: {
		//预览
		proPreview(id) {
			this.$refs.dialogPreview.showDialog({ id: id })
		}
	}
}
</script>
<style lang="scss" scoped>
.haoPingStyle {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: rgba(252, 236, 204, 1);
	margin: 0 auto;
	padding-top: 3px;
}
.cell {
	text-align: left;
}
.table__action {
	justify-content: flex-start;
}
</style>
