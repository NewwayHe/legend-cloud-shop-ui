<template>
	<el-dialog title="新增" :visible.sync="group.visible" :close-on-click-modal="false" width="500px" custom-class="dialog-form">
		<div>
			<div>
				<el-form ref="form" :inline="true" :model="groupForm" size="small" @submit.native.prevent>
					<el-form-item label="物流公司名称" prop="title">
						<el-input
							v-model="groupForm.title"
							placeholder="搜索物流公司名称"
							size="small"
							maxlength="10"
							style="width: 247.5px"
						></el-input>
						<el-button size="small" @click.stop="groupSearch">搜索</el-button>
					</el-form-item>
				</el-form>
				<el-table
					ref="groupTable"
					v-loading="tableListLoading"
					label="可选物流公司名称"
					class="w-200 dialog-form-table"
					tooltip-effect="dark"
					:data="groupList"
					:header-cell-style="{ background: '#F5F7FA' }"
					@select-all="handleAllSelectionChange"
					@select="handleSelectionChange"
				>
					<el-table-column type="selection" width="42" />
					<el-table-column prop="name" label="物流公司名称" show-overflow-tooltip align="center">
						<template slot-scope="scope">
							{{ scope.row.name }}
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-row type="flex" justify="space-between" align="middle" class="mt-20">
			<el-col>
				<el-button size="mini" class="allCheck pl-10 pr-10">
					<el-checkbox v-model="checkAll" :indeterminate="coumCheck" label="全选" size="small" @change="checkedAll" />
				</el-button>
			</el-col>
			<el-pagination
				layout="prev, pager, next"
				:total="group.total"
				:page-size="group.pageSize"
				:current-page="group.pageNo"
				@current-change="dialogcurrentPageChange"
			/>
		</el-row>
		<span slot="footer">
			<el-button size="small" @click="group.visible = false">取 消</el-button>
			<ls-button size="small" type="primary" :asyncFunction="submitGroup">确 定</ls-button>
		</span>
		<el-row class="mt-20">
			<span class="mr-20 mb-20">已选择：</span>
			<el-tag v-for="(value, i) in tempGoodList" :key="i" type="warning" class="mr-10 mt-10">{{ value.name }}</el-tag>
		</el-row>
	</el-dialog>
</template>

<script>
import { request } from '@/utils/request'
import { logisticsManage } from '@/api/ModuleSystem'
export default {
	name: 'DialogGroup',
	props: {
		itemId: {
			type: [String, Number],
			default: ''
		},
		// 商品列表
		goodList: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			group: {
				visible: false,
				pageNo: 1,
				pageSize: 5,
				total: 5,
				checked: false,
				selectedRow: [] // 选中的行
			},
			// 搜索条件
			groupForm: {
				title: ''
			},
			tempGoodList: [], // 商品传入的临时数据。用于组件缓存数据
			groupList: [], // 表格数据
			tableListLoading: false,
			selectedRow: [] // 选中的行
		}
	},
	computed: {
		//返回所有列表的ids
		tempGoodIds() {
			return this.tempGoodList.map((item) => item.id)
		},
		checkAll: {
			get() {
				const tableIds = this.groupList.map((item) => item.id)
				return tableIds && tableIds.length && tableIds.every((item) => this.tempGoodIds.includes(item))
			},
			set(val) {
				return val
			}
		},
		coumCheck() {
			return this.selectedRow && this.selectedRow.length > 0 && this.selectedRow.length < this.groupList.length
		}
	},
	watch: {},
	methods: {
		getLogists() {
			return logisticsManage.allList().then((res) => {
				if (res.code == 1) {
					this.tempGoodList = res.data.map((item) => {
						item.id = item.parentId
						return item
					})
				}
			})
		},
		// 初始化
		groupInit() {
			console.log(this.itemId)
			this.tableListLoading = true
			request
				.get('/order/s/logistics/company/add/page', {
					curPage: this.group.pageNo,
					pageSize: this.group.pageSize,
					name: this.groupForm.title
				})
				.then((res) => {
					this.tableListLoading = false
					this.group.total = res?.data?.total || 0
					this.groupList = res?.data?.resultList || []
					this.$nextTick(() => {
						this.toggleSelection(this.groupList)
					})
				})
				.catch((err) => {
					this.tableListLoading = false
					console.log(err)
				})
		},
		//去重
		removeSame(arr) {
			const obj = {}
			return (arr = arr.reduce((item, next) => {
				if (!obj[next.id]) {
					item.push(next)
					obj[next.id] = true
				}
				return item
			}, []))
			console.log(arr)
		},
		//全选
		handleAllSelectionChange(selection) {
			// 如果全选
			if (selection.length) {
				const selectionIds = selection.map((item) => item.id)
				this.tempGoodList = this.removeSame([...this.tempGoodList, ...selection])
			} else {
				const currentList = this.groupList.map((item) => item.id)
				this.tempGoodList = this.tempGoodList.filter((item) => !currentList.includes(item.id))
			}
		},
		//单选，一个一个选
		handleSelectionChange(val, row) {
			this.selectedRow.push(row.id)
			const selected = val.length && val.filter((item) => item.id == row.id).length
			// 如果是取消勾选
			if (!selected) {
				this.tempGoodList = this.tempGoodList.filter((item) => item.id != row.id)
			} else {
				//勾选
				const selectionIds = val.map((item) => item.id)
				this.tempGoodList = this.removeSame([...this.tempGoodList, ...val])
			}
		},
		//勾选已选项
		toggleSelection(rows) {
			//rows表格数据
			rows.forEach((row) => {
				if (this.tempGoodIds.includes(row.id)) {
					this.selectedRow.push(row.id)
					this.$refs.groupTable.toggleRowSelection(row, true)
				}
			})
		},

		// 保存关联组
		submitGroup() {
			return new Promise((resolve) => {
				if (this.tempGoodList.length === 0) {
					this.$message.warning('至少选择一项')
					return
				}
				request
					.post('/order/s/logistics/company', this.tempGoodList)
					.then((res) => {
						if (res.code) {
							this.$emit('relateGoods', this.tempGoodList)
							this.group.visible = false
						}
					})
					.finally((_) => {
						resolve()
					})
			})
		},

		// 搜索
		groupSearch() {
			this.group.pageNo = 1
			this.groupInit()
		},

		// 选择单行
		selectRow(selection, row) {
			this.group.selectedRow = selection
			if (selection.length === this.groupList.length) {
				this.group.checked = true
			}
		},

		// 点击单选框全选
		checkedAll(val) {
			if (val) {
				this.$refs.groupTable.toggleAllSelection()
			} else {
				this.$refs.groupTable.clearSelection()
				const currentList = this.groupList.map((item) => item.id)
				this.tempGoodList = this.tempGoodList.filter((item) => !currentList.includes(item.id))
			}
		},

		// 显示dialog
		dialogShow() {
			this.group.visible = true
			this.group.checked = false
			// 需要等待数据更新完才能初始化
			this.$nextTick(async () => {
				await this.getLogists()
				this.$refs.form.resetFields()
				this.groupInit()
			})
		},

		// 关闭dialog
		dialogClose() {
			this.group.visible = false
			this.group.selectedRow = []
		},

		// 下一页
		dialogcurrentPageChange(value) {
			this.group.pageNo = value
			this.group.checked = false
			this.selectedRow = []
			this.groupInit()
		}
	}
}
</script>

<style lang="scss" scoped>
.tip {
	font-size: 10px;
	color: #9c9ca5;
	margin-right: 8px;
}
::v-deep .el-table-column--selection .cell {
	padding: 0 10px;
}
::v-deep .el-table td {
	color: #333;
	> .cell {
		padding: 0 10px;
	}
}
::v-deep .el-table__header th {
	color: #333;
	background: #f5f7fa;
}
::v-deep .el-form .el-form-item {
	.el-form-item__content {
		color: #333;
	}
}
</style>
