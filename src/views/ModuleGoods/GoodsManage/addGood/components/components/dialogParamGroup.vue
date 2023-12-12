<template>
	<!-- 规格模板 -->
	<el-dialog title="参数组模板" custom-class="dialog-form-small" :visible.sync="dialogVisible">
		<el-row>
			<el-form :inline="true" :model="dialogSearchFilters" size="small" label-width="98px" class="d-flex" @submit.native.prevent>
				<el-form-item label="参数组标题：" class="flex-1 d-flex" style="margin-bottom: 0;">
					<el-input v-model="dialogSearchFilters.name" placeholder="参数组标题" />
				</el-form-item>
				<el-form-item><el-button size="small" @click.stop="dialogSearch">搜索</el-button></el-form-item>
			</el-form>
		</el-row>
		<el-row class="mt-15">
			<el-table
				ref="multipleTable"
				v-loading="tableListLoading"
				:data="templateList"
				tooltip-effect="dark"
				class="w-100 dialog-form-table"
				row-key="id"
				header-row-class-name="headerRow"
				@select-all="handleAllSelectionChange"
				@select="handleSelectionChange"
			>
				<el-table-column type="selection" width="42" reserve-selection />
				<el-table-column prop="name" label="参数组标题" />
				<el-table-column prop="memo" label="参数组副标题" />
				<el-table-column prop="paramsStr" label="关联参数">
					<template slot-scope="scope">
						{{ scope.row.paramsStr || '-' }}
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<el-row type="flex" justify="end" class="mt-10">
			<pagination
				small
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
import { paramGroup } from '@/api/ModuleGoods';
export default {
	props: {
		normsMulSels: {
			type: Array,
			default() {
				return [];
			}
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
				name: ''
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
			if (!selected) {
				this.$emit('update:normsMulSels', this.normsMulSels.filter(item => item != row.id));
			}
			this.dialogMulSels = val.map(item => item.id);
			this.$nextTick(() => {
				this.$emit('update:normsMulSels', Array.from(new Set([...this.normsMulSels, ...this.dialogMulSels])));
			});
		},
		dialogSearch() {
			this.dialogPage.curPage = 1;
			this.getTemplateList();
		},
		submitForm(formName) {
			this.dialogVisible = false;
			this.$emit('templateDataChange');
		},
		getTemplateList() {
			paramGroup
				.paramGroupPage({ ...this.dialogSearchFilters, ...this.dialogPage })
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

<style lang="scss" scoped>
.el-form {
	::v-deep .el-form-item.d-flex {
		display: flex;
		.el-form-item__content {
			flex: 1;
		}
	}
}
</style>
