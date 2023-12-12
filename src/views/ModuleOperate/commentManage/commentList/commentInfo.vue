<!-- 评论详情。从【评论列表】点击【查看】进来 -->

<template>
	<div>
		<el-row>
			<section class="">
				<div class="table">
					<el-card class="" shadow :body-style="{ padding: `20px 20px 10px 20px` }">
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
							<el-table-column label="商品" min-width="280">
								<template slot-scope="scope">
									<div class="d-flex a-center">
										<ls-image style="flex: 0 0 50px" :src="scope.row.prodPic" :options="{ w: '50', h: '50', br: '4' }" />
										<el-popover placement="top-start" width="500" trigger="hover" :content="scope.row.productName">
											<el-link slot="reference" class="font-12 text-blue ml-10 goodPic" :underline="false" type="primary">
												<span class="line-clamp2">{{ scope.row.productName }}</span>
											</el-link>
										</el-popover>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="订单编号" min-width="200">
								<template slot-scope="scope">
									<span>{{ scope.row.orderNumber }}</span>
								</template>
							</el-table-column>
							<el-table-column label="订单评分" width="250">
								<template slot-scope="scope" class="text-999">
									<span>综合评分：&nbsp;{{ scope.row.averageScore.toFixed(1) }}</span>
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
							<el-table-column label="初评时间" width="140">
								<template slot-scope="scope">
									<div>{{ scope.row.addTime || '-' }}</div>
								</template>
							</el-table-column>
							<el-table-column label="追评时间" width="140">
								<template slot-scope="scope">
									<div>{{ scope.row.addAddTime || '-' }}</div>
								</template>
							</el-table-column>
							<el-table-column label="初评状态" width="120px">
								<template slot-scope="scope">
									<span v-if="scope.row.status == 0" class="status-wait">待审核</span>
									<span v-if="scope.row.status == 1" class="status-pass">通过</span>
									<span v-if="scope.row.status == -1" class="status-veto">拒绝</span>
								</template>
							</el-table-column>
							<el-table-column label="追评状态" width="120px">
								<template slot-scope="scope">
									<div v-if="scope.row.addCommFlag">
										<span v-if="scope.row.addStatus == 0" class="status-wait">待审核</span>
										<span v-if="scope.row.addStatus == 1" class="status-pass">通过</span>
										<span v-if="scope.row.addStatus == -1" class="status-veto">拒绝</span>
									</div>
									<div v-else>-</div>
								</template>
							</el-table-column>
							<el-table-column label="操作" align="left" fixed="right" width="150px">
								<template slot-scope="scope">
									<span class="table__action">
										<el-link
											class="font-12 flex-shrink"
											:underline="false"
											type="primary"
											@click="$router.push({ name: 'commentDetail', query: { id: scope.row.id, addId: scope.row.addId } })"
										>
											查看
										</el-link>
										<div class="action_box">
											<el-link
												v-if="scope.row.status == 1 && !scope.row.replyFlag"
												class="font-12"
												:underline="false"
												type="primary"
												@click="showDialog(scope.row, 1)"
											>
												回复初评
											</el-link>
											<el-link
												v-if="scope.row.addStatus == 1 && !scope.row.addReplyFlag && scope.row.addCommFlag"
												class="font-12"
												:underline="false"
												type="primary"
												@click="showDialog(scope.row, 2)"
											>
												回复追评
											</el-link>
										</div>
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
					</el-card>
				</div>
			</section>
		</el-row>
		<dialogComment
			ref="dialogComment"
			:comment-id="commentId"
			:comment-add-id="commentAddId"
			:comment-content="commentContent"
			:commentType="commentType"
			@getData="getData"
		/>
	</div>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { commentApi } from '@/api/ModuleOrder.js'
import dialogComment from './components/dialogComment'

export default {
	components: {
		dialogComment
	},
	mixins: [common, cud],
	data() {
		return {
			url: {
				getData: '/product/s/product/comment/sku/page'
			},
			searchFilters: {
				curPage: 1,
				pageSize: 10,
				productId: this.$route.query.productId
			},
			commentContent: {}, // 内容
			commentId: '', // 评论ID
			commentAddId: '', // 追评ID
			commentType: '' // 回复类型
		}
	},
	mounted() {
		this.getData()
	},
	methods: {
		// 回复评论
		showDialog(params, type) {
			// type 1=初评，2=追评
			commentApi
				.getCommentDetail({
					id: params.id
				})
				.then((res) => {
					if (res.code == 1) {
						this.commentType = type
						this.commentId = params.id
						this.commentAddId = params.addId
						this.commentContent = res.data
						// JSON.parse 传入的参数如果为空字符串则会报错
						this.commentContent.photos = res.data.photos == '' ? [] : JSON.parse(res.data.photos)
						this.commentContent.addPhotos = res.data.addPhotos == '' ? [] : JSON.parse(res.data.addPhotos)
					}
				})
			this.$refs.dialogComment.showDialog()
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
	.action_box {
		.el-link {
			padding: 0 5px;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				background-color: #2d8cf0;
				left: 0;
				height: 14px;
				width: 1px;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
}
</style>
