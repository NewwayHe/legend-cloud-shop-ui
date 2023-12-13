<!-- /*
 * @Descripttion:新增职位
*/ -->
<template>
    <!-- 新增-编辑 -->
    <el-dialog title="配置权限" custom-class="dialog-form-small" :visible.sync="isVisible">
        <el-form ref="myForm" label-width="98px" label-position="right" size="small" :rules="formRule" :model="formData" @submit.native.prevent>
            <el-form-item label="职位名称：" prop="roleName">
                <el-input v-model="formData.roleName" placeholder="请输入职位名称" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="权限列表：" prop="menuIdList">
                <el-scrollbar style="height: 400px">
                    <el-tree
                        ref="tree"
                        :data="roleTreeData"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        :default-checked-keys="formData.menuIdList"
                        :check-strictly="checkStrictly"
                    />
                </el-scrollbar>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click.stop="isVisible = false">取 消</el-button>
            <ls-button size="small" type="primary" :async-function="submitForm">确 定</ls-button>
        </div>
    </el-dialog>
</template>
<script>
import { positionManage } from '@/api/ModuleUser.js'

export default {
    props: ['roleId'],
    data() {
        return {
            isVisible: false,
            roleTreeData: [],
            formData: {
                menuIdList: [],
                roleName: ''
            },
            formRule: {
                roleName: [{ required: true, message: '请输入职位名称', trigger: 'blur' }]
            },
            roleList: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            isEdit: false,
            checkStrictly: false
        }
    },
    computed: {},
    watch: {
        roleId(newVal) {
            //如果roleId有就是修改，没有既是增加
            if (newVal) {
                this.isEdit = true
                this.getRoleList(newVal)
            } else {
                this.isEdit = false
            }
        }
    },
    created() {
        this.getRoleTree()
    },
    methods: {
        submitForm(formName) {
            return new Promise((resolve) => {
                this.$refs.myForm.validate((valid) => {
                    if (valid) {
                        const checkedKeys = this.$refs.tree.getCheckedKeys()
                        const hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
                        //需要深复制，才不会改变原来的值
                        let params = { ...this.formData, menuIdList: checkedKeys.concat(hafCheckedKeys) }
                        positionManage[this.isEdit ? 'editUserRole' : 'addUserRole']({ ...params })
                            .then((res) => {
                                if (res.code === 1) {
                                    this.$parent.getData()
                                    this.$message.success((this.isEdit ? '编辑' : '添加') + `成功`)
                                } else {
                                    this.$message.error(`操作失败`)
                                }
                                this.isVisible = false
                            })
                            .finally((_) => {
                                resolve()
                            })
                    } else {
                        resolve()
                    }
                })
            })
        },
        getRoleList(id) {
            positionManage.getRoleList(id).then((res) => {
                if (res.code === 1) {
                    this.checkStrictly = true
                    this.formData = res.data || []
                    console.log(this.formData.menuIdList)
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys(this.formData.menuIdList)
                        this.checkStrictly = false
                    })
                }
            })
        },
        getRoleTree() {
            positionManage.getMenuList().then((res) => {
                if (res.code === 1) {
                    this.roleTreeData = res.data
                }
            })
        },
        resetForm(formName) {},
        showDialog(type = 'add') {
            this.isVisible = true
            if (type == 'add') {
                this.formData = this.$options.data().formData
                this.$nextTick(() => {
                    this.$refs.myForm.resetFields()
                    this.$refs.tree.setCheckedKeys([])
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__label {
    font-size: 12px;
}
</style>
