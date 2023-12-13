<!-- /*
 * @Descripttion:员工管理
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="员工账号">
                        <el-input v-model="searchFilters.userAccount" placeholder="员工账号" />
                    </el-form-item>
                    <el-form-item label="员工姓名">
                        <el-input v-model="searchFilters.username" placeholder="员工姓名" />
                    </el-form-item>
                    <el-form-item label="职位名称">
                        <el-select v-model="searchFilters.roleId" clearable placeholder="职位名称">
                            <el-option v-for="item in roleList" :key="item.roleCode" :label="item.roleName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.delFlag" clearable placeholder="状态">
                            <el-option label="上线" :value="true" />
                            <el-option label="下线" :value="false" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="handleCreate({ delFlag: true })">新增</el-button>
                </el-row>

                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    header-row-class-name="headerRow"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="userAccount" label="员工账号" />
                    <el-table-column prop="username" label="员工姓名" />
                    <el-table-column prop="username" label="职位名称">
                        <template slot-scope="scope">
                            <span>{{ scope.row.roleNames.length ? scope.row.roleNames.join(',') : '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="delFlag" label="状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.delFlag ? 'status-pass' : 'status-done'">
                                {{ scope.row.delFlag ? '上线' : '下线' }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="productName" label="创建时间"/> -->
                    <el-table-column label="操作" align="left" fixed="right" width="180px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    修改
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleEditPwd(scope.row, scope.column, scope.$index)">
                                    修改密码
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="updateState(scope.row, scope.column, scope.$index)">
                                    {{ scope.row.delFlag ? '下线' : '上线' }}
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
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

        <!-- 修改密码 -->
        <el-dialog title="修改密码" custom-class="dialog-form" width="420px" :visible.sync="editForm.isVisible" @close="resetEditForm">
            <el-form ref="editForm" :model="editForm.formData" :rules="editForm.formRule" label-width="95px" size="small" label-position="right">
                <el-form-item label="新密码：" prop="newPassword">
                    <el-input v-model="editForm.formData.newPassword" placeholder="请输入新密码" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="editForm.isVisible = false">取 消</el-button>
                <ls-button type="primary" size="small" :async-function="handleEditConfirm">确 定</ls-button>
            </div>
        </el-dialog>

        <!-- 新增-编辑 -->
        <el-dialog :title="dialogForm.title" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible">
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="98px" size="small" label-position="right">
                <el-form-item label="员工账号：" prop="userAccount">
                    <el-input v-model.trim="dialogForm.formData.userAccount" placeholder="员工账号" maxlength="20" />
                </el-form-item>
                <el-form-item label="员工姓名：" prop="username">
                    <el-input v-model.trim="dialogForm.formData.username" placeholder="员工姓名" maxlength="10" />
                </el-form-item>
                <el-form-item v-if="!dialogForm.isEdit" label="密码：" prop="password">
                    <el-input v-model.trim="dialogForm.formData.password" placeholder="密码" />
                </el-form-item>
                <el-form-item label="职位名称：" prop="roleIds">
                    <el-select v-model="dialogForm.formData.roleIds" multiple filterable placeholder="请选择职位名称">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="'' + item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="delFlag">
                    <el-radio-group v-model="dialogForm.formData.delFlag">
                        <el-radio :label="true">上线</el-radio>
                        <el-radio :label="false">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click.stop="debounceSubmit('myForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { positionManage } from '@/api/ModuleUser.js'
export default {
    name: 'StaffManage',
    components: {},
    mixins: [common, cud],
    data() {
        const validatePassword = (rule, value, callback) => {
            if (!value || !this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            } else {
                callback()
            }
        }
        return {
            dialogForm: {
                formData: {
                    delFlag: true
                },

                formRule: {
                    userAccount: [
                        {
                            required: true,
                            message: '请输入员工账号',
                            trigger: 'blur'
                        }
                    ],
                    username: [
                        {
                            required: true,
                            message: '请输入员工名称',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 32,
                            message: '长度在 2 到 32 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                    roleIds: [
                        {
                            required: true,
                            message: '请选择员工职位',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            //修改密码
            editForm: {
                isVisible: false,
                formData: {
                    id: '',
                    newPassword: ''
                },
                formRule: {
                    newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
                }
            },
            roleList: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            checkStrictly: true,
            switchType: 'top',
            url: {
                getData: '/user/s/shop/subUser/queryUserPage',
                update: '/user/s/shop/subUser',
                delete: '/user/s/shop/subUser',
                create: '/user/s/shop/subUser'
            },
            isMounted: false //该页面不能做缓存 否则在[职位管理]页面中做了删除职位操作 再切回该页面 对于行的职位还是会保存为旧的数据[此时正确的情况应该是空]
        }
    },
    watch: {
        // 修改信息时 需要重新获取职位名称的列表 否则新增/编辑职位后 数据都不是最新的
        'dialogForm.isVisible'(nV) {
            nV && this.getAllRoles()
        }
    },
    created() {},
    mounted() {},
    methods: {
        //修改员工密码
        handleEditPwd(row) {
            this.editForm.formData.id = row.id
            this.editForm.formData.newPassword = ''
            this.editForm.isVisible = true
        },
        handleEditConfirm() {
            return new Promise(async (resolve) => {
                await this.getAllRoles()
                positionManage
                    .staffUpdatePwd(this.editForm.formData)
                    .then((res) => {
                        if (res.code) {
                            this.$message.success('修改成功')
                        }
                        this.editForm.isVisible = false
                    })
                    .finally((_) => {
                        resolve()
                    })
            })
        },

        updateState(row) {
            this.$confirm('确认修改该子账号状态', '消息确认', {
                type: 'warning'
            }).then(() => {
                positionManage.staffUpdate(row.id).then((res) => {
                    if (res.code) {
                        this.$message.success('操作成功')
                        this.getData()
                    }
                })
            })
        },
        // 获取职位名称列表
        async getAllRoles() {
            await positionManage.getAllRoleList(this.editForm.formData).then((res) => {
                if (res.code == 1) {
                    this.roleList = res.data
                    return res.data
                }
            })
        },

        resetEditForm() {
            this.$refs.editForm.resetFields()
        }
    }
}
</script>
