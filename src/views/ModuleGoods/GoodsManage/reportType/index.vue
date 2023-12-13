<!-- /*
 * @Descripttion:商品举报类型
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <div class="search">
            <el-card shadow>
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="举报类型">
                        <el-input v-model="searchFilters.name" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" clearable placeholder="请选择">
                            <el-option label="上线" :value="1" />
                            <el-option label="下线" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-20">
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="table">
            <el-card class="mb-20" shadow>
                <el-row class="mb-20">
                    <el-button style="height: 32px" type="primary" size="small" @click="handleCreate">新增</el-button>
                </el-row>
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                    row-key="id"
                    @selection-change="selectionChange"
                >
                    <el-table-column type="selection" reserve-selection width="42" />
                    <el-table-column label="序号" type="index" width="100" />
                    <el-table-column prop="name" label="举报类型" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="Number(scope.row.status)">上线</span>
                            <span v-else>下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="250px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="updateState(scope.row)">
                                    {{ Number(scope.row.status) == 0 ? '下线' : '上线' }}
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    编辑
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="deleteItem(scope.row)">删除</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="space-between" class="mt-20">
                    <el-col>
                        <el-button size="mini" class="allCheck">
                            <el-checkbox
                                v-model="checkAll"
                                label="全选"
                                size="small"
                                :indeterminate="checkHalf"
                                :disabled="!selectableList.length"
                                @change="selAll"
                            />
                        </el-button>
                        <el-button size="small" @click="batchUpdateState(1)">批量上架</el-button>
                        <el-button size="small" @click="batchUpdateState(0)">批量下架</el-button>
                        <el-button size="small" @click="handleMulDel">批量删除</el-button>
                    </el-col>
                    <el-pagination
                        :page-sizes="[100, 200, 300, 400]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="page.curPage"
                        :total="tableTotal"
                        @current-change="currentPageChange"
                    />
                </el-row>
            </el-card>
        </div>

        <!-- 新增-编辑 -->
        <el-dialog :title="dialogForm.title" custom-class="dialog-form" width="420px" :visible.sync="dialogForm.isVisible">
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="95px" label-position="right" size="small">
                <el-form-item label="举报类型" prop="name">
                    <el-input v-model="dialogForm.formData.name" placeholder="举报类型" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="dialogForm.formData.status">
                        <el-radio label="1">上线</el-radio>
                        <el-radio label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.stop="debounceSubmit('myForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { reportType } from '@/api/ModuleGoods'

export default {
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                status: ''
            },
            url: {
                getData: '/admin/accusationType/page',
                mulDel: '/admin/accusationType/batchDeleteStatus',
                create: '/admin/accusationType',
                update: '/admin/accusationType'
            },
            dialogForm: {
                formRule: {
                    name: [{ required: true, message: '请输入商品举报类型', trigger: 'blur' }],
                    status: { required: true, message: '请选择状态', trigger: 'change' }
                }
            }
        }
    },
    mounted() {},
    methods: {
        // 上下线
        updateState(row) {
            this.$confirm(
                `${row.status ? '下线后，用户不可在商城中查看举报类型。确定下线？' : '上线后，用户可以在商城中查看举报类型。确定上线？'}`,
                '提示',
                { type: 'warning' }
            )
                .then(() => {
                    reportType
                        .updateStatus({
                            ids: [row.id],
                            status: Number(!row.status)
                        })
                        .then((res) => {
                            this.$message.success('操作成功')
                            this.getData()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },

        // 批量上下限
        batchUpdateState(status) {
            // console.log(this.mulSels)
            if (!this.mulSels?.length) {
                this.$message.warning('请至少选择一条数据')
                return
            }
            this.$confirm(
                `${status ? '上线后，用户可以在商城中查看举报类型。确定上线？' : '下线后，用户不可在商城中查看举报类型。确定下线？'}`,
                '提示',
                { type: 'warning' }
            )
                .then(() => {
                    reportType
                        .updateStatus({
                            ids: this.mulSels,
                            status: status
                        })
                        .then((res) => {
                            this.$message.success('操作成功')
                            this.getData()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },

        // 删除
        deleteItem(row) {
            this.$confirm('数据删除后，无法恢复。确定删除？', '消息确认', {
                type: 'warning'
            })
                .then(() => {
                    reportType
                        .delete({
                            ids: [row.id]
                        })
                        .then((res) => {
                            this.$message.success('删除成功')
                            this.getData()
                        })
                })
                .catch(() => {
                    this.$message.info('取消删除')
                })
        }
    }
}
</script>
