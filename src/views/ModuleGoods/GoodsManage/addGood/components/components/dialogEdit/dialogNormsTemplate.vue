<template>
	<!-- 规格模板 -->
	<el-dialog :title="attributeType == 'S' ? '规格' : '参数' + '模板'" custom-class="dialog-form" width="495px" :visible.sync="dialogVisible">
		<el-row class="mb-20">
			<el-form :inline="true" :model="dialogSearchFilters" size="small" @submit.native.prevent>
				<el-form-item :label="attributeType == 'S' ? '规格' : '参数' + '名称'">
					<el-input v-model="dialogSearchFilters.propName" :placeholder="attributeType == 'S' ? '规格' : '参数' + '名称'" />
				</el-form-item>
				<el-form-item><el-button size="small" @click.stop="dialogSearch">搜索</el-button></el-form-item>
			</el-form>
		</el-row>
		<el-row class="mb-20">
			<el-table
				ref="multipleTable"
				v-loading="tableListLoading"
				:data="templateList"
				tooltip-effect="dark"
				class="w-100 dialog-form-table"
				style="border: 1px solid #ebeef5"
				row-key="id"
				:header-row-style="{ background: '#F5F7FA' }"
				@select-all="handleAllSelectionChange"
				@select="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="propName" label="规格类型" align="center">
					<template slot-scope="scope">
						{{ scope.row.type == 'TXT' ? '文本' : '图片' }}
					</template>
				</el-table-column>
				<el-table-column prop="propName" :label="attributeType == 'S' ? '规格' : '参数' + '标题'" align="center" />

				<el-table-column prop="memo" :label="attributeType == 'S' ? '规格' : '参数' + '副标题'" align="center" />
			</el-table>
		</el-row>
		<el-row type="flex" justify="end">
			<pagination
				layout="prev, pager, next"
				:page-size="dialogPage.pageSize"
				:page-sizes="[5, 10, 15]"
				:total="dialogPage.total"
				@size-change="dialogPageSizeChange"
				@current-change="dialogPageChange"
			/>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="dialogVisible = false">取 消</el-button>
			<el-button size="small" type="primary" @click="submitForm">确 定</el-button>
		</span>
	</el-dialog>
</template>
<script>
import { specifications } from '@/api/ModuleGoods';
import { request } from '@/utils/request.js';
export default {
	props: {
		normsMulSels: {
			type: Array,
			default() {
				return [];
			}
		},
		attributeType: {
			type: String,
			default: 'S'
		}
	},
	data() {
		return {
			dialogVisible: false,
			dialogPage: {
				curPage: 1,
				pageSize: 5,
				total: 0
			},
			dialogSearchFilters: {
				propName: ''
			},
			dialogMulSels: [],
			templateList: [],
			tableListLoading: false
		};
	},

	computed: {},
	watch: {
		normsMulSels(newVal) {
		}
	},

	created() {},
	methods: {
		toggleSelection(rows) {
			rows.forEach(row => {
				if (this.normsMulSels.includes(row.id)) {
					this.$refs.multipleTable.toggleRowSelection(row, true);
				}
			});
		},
		handleAllSelectionChange(selection) {
			//如果全选
			if (selection.length) {
				this.dialogMulSels = selection.map(item => item.id);
				this.$nextTick(() => {
					this.$emit('update:normsMulSels', Array.from(new Set([...this.normsMulSels, ...this.dialogMulSels])));
				});
			} else {
				let currentList = this.templateList.map(item => item.id);
				this.$nextTick(() => {
					this.$emit('update:normsMulSels', this.normsMulSels.filter(item => !currentList.includes(item)));
				});
			}
		},
		handleSelectionChange(val, row) {
			let selected = val.length && val.filter(item => item.id == row.id).length;
			//如果是取消勾选
			if (!selected) {
				this.$emit('update:normsMulSels', this.normsMulSels.filter(item => item != row.id));
			}
			this.dialogMulSels = val.map(item => item.id);
			this.$nextTick(() => {
				this.$emit('update:normsMulSels', Array.from(new Set([...this.normsMulSels, ...this.dialogMulSels])));
			});
		},
		dialogSearch() {
			this.getTemplateList();
		},
		submitForm(formName) {
			this.dialogVisible = false;
			this.$emit('templateDataChange');
		},
		getTemplateList() {
			specifications
				.specificationPage({ attributeType: this.attributeType, ...this.dialogSearchFilters, ...this.dialogPage })
				.then(res => {
					if (res.code) {
						this.templateList = res?.data?.resultList || [];
						this.dialogPage.total = res?.data?.total || 0;
						this.$nextTick(() => {
							this.toggleSelection(this.templateList);
						});
					}
					this.tableListLoading = false;
				})
				.catch(err => {
					this.tableListLoading = false;
				});
		},
		dialogPageSizeChange(size) {
			this.dialogPage.pageSize = size;
			this.getTemplateList();
		},
		dialogPageChange(p) {
			this.dialogPage.curPage = p;
			this.getTemplateList();
		},
		showDialog() {
			this.dialogVisible = true;
			this.getTemplateList();
		}
	}
};
</script>

<style lang="scss" scoped></style>
