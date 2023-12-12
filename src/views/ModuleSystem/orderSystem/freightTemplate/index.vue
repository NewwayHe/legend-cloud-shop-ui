<!-- /*
 * @Descripttion:运费模板列表
*/ -->
<template>
	<section class="">
		<!-- 查询 -->
		<el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
			<el-alert type="warning" class="theme" :closable="false">
				<div class="d-flex a-start">
					<i class="el-alert__icon el-icon-info" style="margin-right: 8px; color: #ffa800" />
					<div class="text-333 font">
						发布商品时如需要运费，则需要选择一个已设置好的运费模版用于计算。修改规则后，需要点击保存按钮完成保存
					</div>
				</div>
			</el-alert>
			<el-form class="mt-15" :inline="true" :model="transRule" size="small">
				<el-form-item label="一单多品，运费规则不同时： ">
					<el-radio-group v-model="transRule.type">
						<el-radio :label="1">叠加计算</el-radio>
						<el-radio :label="2">按最高值计算</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" size="small" @click.stop="editTranRule">保存</el-button>
				</el-form-item>
			</el-form>

			<div class="search">
				<el-form :inline="true" :model="searchFilters" size="small">
					<el-form-item label="运费模板名称">
						<el-input v-model="searchFilters.transName" placeholder="运费模板名称" />
					</el-form-item>
					<el-form-item>
						<el-button size="small" @click.stop="dbnSearch">搜索</el-button>
					</el-form-item>
					<el-button class="" type="primary" size="small" @click="toAddFreight">新增</el-button>
				</el-form>
			</div>
			<div class="table">
				<freightTable v-if="tableList && tableList.length" :table-list="tableList" @delTrans="delTrans"></freightTable>
				<empty v-else text="暂无运费模板"></empty>
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
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import freightTable from './components/freightTable.vue'
import { freightTemplate } from '@/api/ModuleSystem'
export default {
	name: 'FreightTemplate',
	components: {
		freightTable
	},
	mixins: [common, cud],
	data() {
		return {
			transRule: {
				//运费规则
				type: 1
			},
			url: {
				getData: '/product/s/transport/page',
				delete: '/product/s/transport/'
			},
			isShowLoading: true
		}
	},
	created() { },
	mounted() {
		this.getTranRule()
	},
	methods: {
		toAddFreight(row) {
			this.$router.push({
				name: 'freightAdd',
				query: {
					id: row.id || ''
				}
			})
		},
		getTranRule() {
			freightTemplate.transRuleDet().then((res) => {
				if (res.code) {
					this.transRule = res.data
				}
			})
		},
		editTranRule() {
			freightTemplate.transRuleEdit(this.transRule).then((res) => {
				if (res.code) {
					this.$message.success('操作成功')
				}
			})
		},
		delTrans(item) {
			this.handleDel(item)
		},
		// 切换状态
		changeStatus() {
			this.doSearch()
		}
	}
}
</script>
