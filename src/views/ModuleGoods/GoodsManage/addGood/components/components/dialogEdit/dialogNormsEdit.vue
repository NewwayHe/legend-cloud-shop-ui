<template>
	<el-dialog title="新增规格" custom-class="dialog-form-small" :visible.sync="dialogVisible" append-to-body>
		<el-row class="table">
			<el-form ref="form" :inline="false" :model="form" size="small" label-width="98px" @submit.native.prevent>
				<el-form-item label="规格标题：" prop="propName" :rules="rules.propName">
					<el-row type="flex" align="middle">
						<el-input v-model.trim="form.propName" maxlength="20" show-word-limit placeholder="请输入" />
						<el-tooltip class="item" placement="right-start" content="图片格式需上传图片">
							<i class="el-icon-warning-outline text-ccc main-hover font-16 ml-5"></i>
						</el-tooltip>
					</el-row>
				</el-form-item>
				<el-form-item label="规格副标题：" prop="memo">
					<el-input v-model.trim="form.memo" placeholder="请输入" show-word-limit maxlength="30"/>
				</el-form-item>
				<el-form-item label="规格值：" prop="groupList">
					<el-button type="primary" @click="addSpe">添加规格值</el-button>
					<span class="ml-10 text-999">一个规格可添加多个规格值（拖动可以改变顺序）</span>
				</el-form-item>
				<el-table ref="dragTable" class="table-form w-100" tooltip-effect="dark" size="mini" :data="form.groupList" borders header-row-class-name="headerRow">
					<el-table-column prop="name" label="规格值" width="300">
						<template slot-scope="scope">
							<el-form-item :prop="'groupList.' + scope.$index + '.' + 'name'" :rules="rules.name" label-width="0" @submit.native.prevent>
								<el-input v-model.trim="scope.row.name" placeholder="请输入" show-word-limit :maxlength="50"/>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column v-if="form.type == 'PIC'" prop="name">
						<template slot="header">
							<span>图片</span>
							<p>建议尺寸：300*300px</p>
						</template>
						<template slot-scope="scope">
							<el-form-item><imgCenter v-model="scope.row.pic" :uploadStyle="{ width: '50px' }"></imgCenter></el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="操作" align="center">
						<template slot-scope="scope">
							<el-link :underline="false" type="primary" @click="delItem(scope)">删除</el-link>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="dialogVisible = false">取 消</el-button>
			<el-button size="small" type="primary" @click="submitForm">确 定</el-button>
		</span>
	</el-dialog>
</template>
<script>
import { specifications } from '@/api/ModuleGoods';
import Sortable from 'sortablejs';
export default {
	components: {},
	data() {
		return {
			dialogVisible: false,
			form: {
				id: '',
				type: 'TXT',
				propName: '',
				memo: '',
				groupList: [{ name: '', pic: '', sequence: 1 }], // 规格值数组
				relatedGroup: [] // 关联参数分组数组
			},
			rules: {
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				propName: [{ required: true, message: '规格标题不能为空', trigger: 'blur' }],
				groupList: [{ required: true, validator: this.checkGroupList }],
				name: [{ required: true, message: '规格值不能为空', trigger: 'blur' }],
				pic: [{ validator: this.checkPic }]
			},
			tableWid: 'w-450p',
			originalGroupList: {
				TXT: [],
				PIC: []
			},
			isEdit: false,
			sortable: null // 拖拽的实例
		};
	},
	computed: {},
	watch: {
		dialogVisible(newVal) {
			if (!newVal) {
				this.init();
			}
		}
	},
	created() {},
	methods: {
		init() {
			this.originalGroupList.TXT = [];
			this.originalGroupList.PIC = [];
			this.$nextTick(() => {
				this.$refs.form.resetFields();
			});
		},
		// 检查图片是否上传
		checkPic(rule, picValue, callback) {
			if (this.form.type === 'TXT') {
				callback();
			} else {
				if (picValue === '') {
					callback(new Error('请上传图片'));
				} else {
					callback();
				}
			}
		},
		// 添加
		addItem() {
			specifications
				.add({
					propName: this.form.propName,
					memo: this.form.memo,
					type: this.form.type,
					attributeType: 'S',
					prodPropList: this.form.groupList,
					aggIdList: this.form.relatedGroup.map(item => item.id),
					source: 'USER' // 这个写死
				})
				.then(res => {
					this.dialogVisible = false;
					this.$emit('freshList');
					this.$message({
						message: '新增成功',
						type: 'success'
					});
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 验证规格值表格是否为空
		checkGroupList(rule, groupList, callback) {
			// console.log(rule)
			if (groupList.length < 1) {
				callback(new Error('至少添加一个规格值'));
			} else {
				callback();
			}
		},
		dialogSearch() {},
		submitForm(formName) {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.addItem();
				}
			});
		},
		// 切换类型
		changeType(value) {
			if (this.originalGroupList[value].length !== 0) {
				this.form.groupList = this.originalGroupList[value];
			} else {
				this.form.groupList = [
					{
						name: '',
						pic: '',
						sequence: 1
					}
				];
			}
		},
		// 表格变成拖拽
		setSort() {
			const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
			this.sortable = Sortable.create(el, {
				ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
				setData: function(dataTransfer) {
					dataTransfer.setData('Text', '');
				},
				onEnd: evt => {
					// 拖拽后可进行一些数据处理
					const oldSeq = this.form.groupList[evt.oldIndex].sequence;
					const newSeq = this.form.groupList[evt.newIndex].sequence;
					this.$set(this.form.groupList[evt.oldIndex], 'sequence', newSeq);
					this.$set(this.form.groupList[evt.newIndex], 'sequence', oldSeq);
				}
			});
		},
		// 添加规格值
		addSpe() {
			if (this.form.groupList.length < 3) {
				this.form.groupList.push({
					name: '',
					sequence: this.form.groupList.length + 1
				});
			} else {
				this.$message.error('只能添加3个规格值');
			}
		},

		// 删除一个规格值
		delItem(scope) {
			this.form.groupList.splice(scope.$index, 1);
		},
		showDialog() {
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.dragTable.doLayout();
				this.setSort();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.table-form {
	.el-form-item {
		&.is-error {
			margin-bottom: 18px !important;
		}
	}
}
</style>
