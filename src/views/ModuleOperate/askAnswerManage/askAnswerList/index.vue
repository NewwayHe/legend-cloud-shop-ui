<!-- /*
 * @Descripttion:问答列表
*/ -->
<template>
	<div>
		<section class="">
			<el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
				<div class="search">
					<el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
						<el-form-item label="商品名称">
							<el-input v-model="searchFilters.productName" placeholder="请输入" clearable />
						</el-form-item>
						<el-form-item label="咨询内容"><el-input v-model="searchFilters.content" placeholder="请输入" clearable /></el-form-item>
						<el-form-item label="咨询时间">
							<el-date-picker
								v-model="date"
								type="daterange"
								clearable
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								@change="changeFirsDate"
							/>
						</el-form-item>
						<el-form-item label="状态">
							<el-select v-model="searchFilters.status" placeholder="全部" clearable>
								<el-option label="全部" value="" />
								<el-option label="上线" :value="1" />
								<el-option label="下线" :value="0" />
							</el-select>
						</el-form-item>
						<el-form-item label="回复状态">
							<el-select v-model="searchFilters.replySts" placeholder="全部" clearable>
								<el-option label="全部" value="" />
								<el-option label="已回复" :value="1" />
								<el-option label="未回复" :value="0" />
							</el-select>
						</el-form-item>
						<el-form-item><el-button size="small" @click.stop="dbnSearch">搜索</el-button></el-form-item>
					</el-form>
				</div>
				<div class="table">
					<el-row class="mb-20">
						<el-alert class="theme" :closable="false" show-icon>
							<p>问答列表：用户对商品进行咨询提问，商家可针对提问进行回复。也可以把提问下线后删除。</p>
							<p>下线和未回复的提问不会显示在用户端中。</p>
						</el-alert>
					</el-row>
					<!--列表-->
					<el-table
						ref="multipleTable"
						v-loading="tableListLoading"
						:data="tableList"
						tooltip-effect="dark"
						header-row-class-name="headerRow"
						class="w-100"
					>
						<template slot="empty">
							<empty empty-type="pro" />
						</template>
						<el-table-column label="序号" type="index" width="48" />
						<el-table-column label="商品" width="280">
							<template slot-scope="scope">
								<div class="d-flex a-center">
									<ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
									<div class="ml-10">
										<el-popover placement="top-start" width="450" trigger="hover" :title="scope.row.productName">
											<el-link
												class="text-blue"
												type="primary"
												target="_blank"
												:underline="false"
												:href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
											>
												{{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId }}
											</el-link>
											<el-link slot="reference" class="line-clamp2 text-blue" :underline="false" type="primary">
												<div class="line-clamp2" @click="proPreview(scope.row.productId)">{{ scope.row.productName }}</div>
											</el-link>
										</el-popover>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="咨询内容" min-width="160" show-overflow-tooltip>
							<template slot-scope="scope">
								{{ scope.row.content || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="咨询用户" min-width="120">
							<template slot-scope="scope">
								<div>{{ scope.row.askUserName || '-' }}</div>
								<div>{{ scope.row.askUserIphone || '-' }}</div>
							</template>
						</el-table-column>
						<el-table-column label="咨询时间" width="140">
							<template slot-scope="scope">
								<div>{{ scope.row.recDate || '-' }}</div>
							</template>
						</el-table-column>
						<el-table-column label="状态">
							<template slot-scope="scope">
								<span class="status-pass" v-if="scope.row.status == 1">上线</span>
								<span class="status-done" v-if="scope.row.status == 0">下线</span>
							</template>
						</el-table-column>
						<el-table-column label="回复状态">
							<template slot-scope="scope">
								<span class="status-pass" v-if="scope.row.replySts == 1">已回复</span>
								<span class="status-done" v-if="scope.row.replySts == 0">未回复</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="left" width="200px">
							<template slot-scope="scope">
								<span class="table__action">
									<el-link :underline="false" type="primary" @click.stop="answerDetail(scope.row, scope.column, scope.$index)">
										查看
									</el-link>
									<el-link :underline="false" type="primary" @click.stop="updateState(scope.row, scope.column, scope.$index)">
										{{ scope.row.status ? '下线' : '上线' }}
									</el-link>
									<el-link
										v-if="scope.row.status == 0"
										:underline="false"
										type="primary"
										@click.stop="handleDel(scope.row, scope.column, scope.$index)"
									>
										删除
									</el-link>
									<el-link
										v-if="scope.row.replySts == 0"
										:underline="false"
										type="primary"
										@click.stop="handleAnswer(scope.row, scope.column, scope.$index)"
									>
										回复
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
			</el-card>
		</section>
		<!-- 查看-问答详情 -->
		<dialogAskAnswer ref="dialogAskAnswer" :data="rowData1" @answer="handleAnswer(rowData1)" />
		<!-- 回复 -->
		<dialogAnswer ref="dialogAnswer" :data="rowData2" @finish="getData" />
		<dialogPreview ref="dialogPreview" />
	</div>
</template>
<script>
import dialogAskAnswer from './components/dialogAskAnswer'
import dialogAnswer from './components/dialogAnswer'
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { askAnswerApi } from '@/api/ModuleOrder.js'
import { mapGetters } from 'vuex'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
export default {
	name: 'AskAnswerList',
	components: {
		dialogAskAnswer,
		dialogAnswer,
		dialogPreview
	},
	mixins: [common, cud],
	data() {
		return {
			url: {
				getData: '/product/s/product/consult/page',
				delete: '/product/s/product/consult/delete'
			},
			searchFilters: {
				shopId: ''
			},
			date: [], // 咨询时间
			rowData1: {},
			rowData2: {}
		}
	},
	computed: {
		...mapGetters(['shopInfo'])
	},
	created() {
		this.searchFilters.shopId = this.shopInfo.id
	},
	methods: {
		//预览
		proPreview(id) {
			this.$refs.dialogPreview.showDialog({ id: id })
		},
		// 时间改变
		changeFirsDate() {
			if (this.date) {
				this.$set(this.searchFilters, 'startDate', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
				this.$set(this.searchFilters, 'endDate', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
			} else {
				this.$set(this.searchFilters, 'startDate', '')
				this.$set(this.searchFilters, 'endDate', '')
			}
		},
		// 上/下线
		updateState(row, col, index) {
			this.$confirm(`${row.status ? '下线后，用户不可以浏览该内容。确定下线？' : '上线后，用户可以浏览该内容。确定上线？'}`, '提示', {
				type: 'warning'
			}).then(() => {
				askAnswerApi
					.consultOffline({ id: row.id, status: Number(!row.status) })
					.then((res) => {
						this.$message.success('操作成功')
						this.getData()
					})
					.catch((err) => {
						console.log(err)
					})
			})
		},
		// 问答详情
		answerDetail(row, col, index) {
			this.rowData1 = { ...row }
			this.$refs.dialogAskAnswer.showDialog()
		},
		// 回复
		handleAnswer(row, col, index) {
			this.rowData2 = { ...row }
			this.$refs.dialogAnswer.showDialog()
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
</style>
<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style>
.el-tooltip__popper {
	max-width: 60vw;
}
</style>
