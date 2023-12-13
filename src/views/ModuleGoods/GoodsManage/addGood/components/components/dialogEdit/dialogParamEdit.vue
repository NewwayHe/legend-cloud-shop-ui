<template>
    <el-dialog title="新增参数" custom-class="dialog-form-small" :visible.sync="dialogVisible" append-to-body>
        <el-row class="table">
            <el-form ref="form" :inline="false" :model="form" size="small" label-width="98px" @submit.native.prevent>
                <el-form-item label="参数标题：" prop="propName" :rules="rules.propName">
                    <el-input v-model.trim="form.propName" maxlength="20" show-word-limit placeholder="请输入" />
                </el-form-item>
                <el-form-item label="参数副标题：" prop="memo" :rules="rules.memo">
                    <el-input v-model.trim="form.memo" placeholder="请输入" show-word-limit maxlength="30" />
                </el-form-item>
                <el-form-item label="参数值：" prop="groupList">
                    <el-button type="primary" @click="addSpe">添加参数值</el-button>
                    <span class="ml-10 text-999">一个参数可添加多个参数值值（拖动可以改变顺序）</span>
                </el-form-item>
                <el-table
                    v-show="form.groupList.length > 0"
                    ref="dragTable"
                    class="table-form"
                    tooltip-effect="dark"
                    size="mini"
                    :data="form.groupList"
                    header-row-class-name="headerRow"
                >
                    <el-table-column prop="name" label="参数值" align="center" width="300" class="cursor-pointer">
                        <template slot-scope="scope">
                            <el-form-item :prop="'groupList.' + scope.$index + '.' + 'name'" :rules="rules.name" label-width="0">
                                <el-input v-model.trim="scope.row.name" placeholder="请输入" show-word-limit :maxlength="50" />
                            </el-form-item>
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
import { params } from '@/api/ModuleGoods'
import Sortable from 'sortablejs'
export default {
    props: ['normsMulSels'],
    data() {
        return {
            dialogVisible: false,
            form: {
                id: '',
                propName: '',
                memo: '',
                searchFlag: '',
                groupList: [{ name: '', sequence: 1 }], // 参数值数组
                relatedGroup: [] // 关联参数分组数组
            },
            rules: {
                propName: [{ required: true, message: '参数标题不能为空', trigger: 'blur' }],
                propName: [{ required: true, message: '参数标题不能为空', trigger: 'blur' }],
                searchFlag: [{ required: true, message: '请选择', trigger: 'change' }],
                groupList: [{ required: true, validator: this.checkGroupList }],
                name: [{ required: true, message: '参数值不能为空', trigger: 'blur' }]
            },
            isEdit: false,
            sortable: null // 拖拽的实例
        }
    },

    computed: {},
    watch: {
        dialogVisible(newVal) {
            if (!newVal) {
                this.init()
            }
        }
    },
    created() {},
    methods: {
        init() {
            this.$nextTick(() => {
                this.$refs.form.resetFields()
                this.form.groupList = [{ name: '', pic: '', sequence: 1 }]
            })
        },
        // 验证规格值表格是否为空
        checkGroupList(rule, groupList, callback) {
            if (groupList.length < 1) {
                callback(new Error('至少添加一个规格值'))
            } else {
                callback()
            }
        },
        dialogSearch() {},
        submitForm(formName) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.addItem()
                }
            })
        },
        // 新增
        addItem() {
            params
                .add({
                    propName: this.form.propName,
                    memo: this.form.memo,
                    searchFlag: Boolean(this.form.searchFlag),
                    type: 'TXT', // 这个写死
                    attributeType: 'P', // 这个写死
                    prodPropList: this.form.groupList,
                    aggIdList: this.form.relatedGroup.map((item) => item.id),
                    source: 'USER' // 这个写死
                })
                .then((res) => {
                    this.dialogVisible = false
                    this.$emit('freshList')
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 表格变成拖拽
        setSort() {
            const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                setData: function (dataTransfer) {
                    dataTransfer.setData('Text', '')
                },
                onEnd: (evt) => {
                    // 拖拽后可进行一些数据处理
                    const oldSeq = this.form.groupList[evt.oldIndex].sequence
                    const newSeq = this.form.groupList[evt.newIndex].sequence
                    this.$set(this.form.groupList[evt.oldIndex], 'sequence', newSeq)
                    this.$set(this.form.groupList[evt.newIndex], 'sequence', oldSeq)
                }
            })
        },
        // 添加规格值
        addSpe() {
            if (this.form.groupList.length < 3) {
                this.form.groupList.push({
                    name: '',
                    sequence: this.form.groupList.length + 1
                })
            } else {
                this.$message.error('只能添加3个参数值')
            }
        },

        // 删除一个规格值
        delItem(scope) {
            this.form.groupList.splice(scope.$index, 1)
        },

        showDialog() {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.setSort()
                this.$refs.dragTable.doLayout()
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
