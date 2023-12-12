<!-- /*
 * @Descripttion:参数组管理
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" @submit.native.prevent>
                    <el-form-item label="参数组标题">
                        <el-input v-model="searchFilters.name" placeholder="参数组标题" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="toAdd">新增</el-button>
                </el-row>

                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="name" label="参数组标题" />
                    <el-table-column prop="memo" label="参数组副标题" />
                    <el-table-column prop="paramsStr" label="关联参数" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.paramsStr || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="250px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="showCheckDialog(scope.row)">查看</el-link>
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">编辑</el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
            </div>

            <!-- 关联分组 -->
            <dialog-group ref="groupDialog" :item-id="chooseItem" source="paramGroup" @relateGroup="saveRelatedGroup" />

            <!-- 查看详情 -->
            <dialog-check ref="checkDialog" :item-id="checkItem" />

            <!-- 新增/编辑 -->
            <el-dialog
                :title="formData.id ? '编辑' : '新增'"
                :visible.sync="dialogVisible"
                custom-class="dialog-form-large"
                @close="closeDialog"
            >
                <div>
                    <el-form
                        ref="dialogForm"
                        :model="formData"
                        :rules="formDataRules"
                        :inline="false"
                        label-position="right"
                        label-width="110px"
                        size="small"
                    >
                        <el-form-item label="参数组标题：" prop="name">
                            <el-input v-model="formData.name" class="w-450p" maxlength="20" show-word-limit placeholder="请输入"/>
                            <span class="ml-5 text-999 font">参数组标题，显示在用户端界面中</span>
                        </el-form-item>
                        <el-form-item label="参数组副标题：" prop="memo">
                            <el-input v-model="formData.memo" class="w-450p" maxlength="50" show-word-limit placeholder="请输入"/>
                            <span class="ml-5 text-999 font">参数组副标题，类似于备注，不显示在用户端界面中</span>
                        </el-form-item>
                        <el-form-item label="关联参数：" prop="paramsList" :inline-message="true">
                            <template slot-scope="scope">
                                {{ paramsNameArr }}
                            </template>
                        </el-form-item>
                        <el-form-item label="参数标题：">
                            <el-input v-model="dialog.searchName" class="w-450p" placeholder="请输入" maxlength="50">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="search" />
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <el-table
                        ref="groupTable"
                        class="w-100 dialog-form-table mt-15"
                        tooltip-effect="dark"
                        size="small"
                        :data="paramsList"
                        header-row-class-name="headerRow"
                    >
                        <el-table-column prop="propName" label="参数标题" />
                        <el-table-column prop="memo" label="参数副标题">
                            <template slot-scope="scope">
                                {{ scope.row.memo || '-'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="状态">
                            <template slot-scope="scope">
                                <span :class="scope.row.related ? 'status-pass' : 'status-done'">{{ scope.row.related ? '已选择' : '未选择' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-link class="text-blue" v-if="!scope.row.related" :underline="false" type="primary" style="font-size:12px" @click="relateParams(scope.row)">
                                    关联
                                </el-link>
                                <el-link class="text-blue"  v-else :underline="false" type="primary" style="font-size:12px" @click="cancelRelateParams(scope)">取消关联</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-row type="flex" justify="end" align="middle" class="mt-10">
                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :total="dialog.total"
                        :page-size="dialog.pageSize"
                        :current-page="dialog.pageNo"
                        @current-change="dialogcurrentPageChange"
                    />
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                    <ls-button size="small" type="primary" :asyncFunction="submit">保 存</ls-button>
                </span>
            </el-dialog>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { paramGroup } from '@/api/ModuleGoods'
import Step from '../components/Step'
import DialogGroup from '../components/dialogGroup'
import DialogCheck from './components/dialogCheck'

export default {
    name: 'ParamsGroup',
    components: {
        Step,
        DialogGroup,
        DialogCheck
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: ''
            },
            url: {
                getData: '/product/s/paramGroup/page',
                delete: '/product/s/paramGroup' // 删除
            },
            checkItem: '', // 查看详情的itemId
            chooseItem: '', // 选择的item
            // 新增-编辑
            dialogVisible: false,
            dialog: {
                total: 0,
                pageSize: 5,
                pageNo: 1,
                searchName: ''
            },
            formData: {
                id: '',
                name: '',
                memo: '',
                paramsList: [] // 关联的paramsList
            },
            formDataRules: {
                name: [
                    {
                        required: true,
                        message: '内容不能为空',
                        trigger: 'blur'
                    }
                ],
                memo: [
                    {
                        required: true,
                        message: '内容不能为空',
                        trigger: 'blur'
                    }
                ],
                paramsList: [
                    {
                        required: true,
                        validator: this.checkParamsList
                    }
                ]
            },
            paramsList: [], // 参数表格数据
            relatedParamsList: [],      //缓存已关联的参数[{id,propName}] 用于编辑回显
        }
    },
    computed: {
        paramsNameArr() {
            return this.relatedParamsList.map(item => item.propName).join()
        }
    },
    watch: {
        'relatedParamsList'(nL){
            this.formData.paramsList = nL.map(item => {return item.id})
            this.$refs.dialogForm.validateField('paramsList')
        }
    },
    mounted() {},
    methods: {
        // 显示关联分组参数Dialog
        showGroupDialog(row) {
            this.chooseItem = row.id
            this.$refs.groupDialog.dialogShow()
        },

        // 保存关联参数分组
        saveRelatedGroup(selectedRow) {
            console.log('选择保存的关联组', selectedRow)
            paramGroup
                .paramsGroupAgg({
                    aggIdlist: selectedRow.reduce((item, next) => {
                        item.push(next.id)
                        return item
                    }, []),
                    paramGroupId: this.chooseItem
                })
                .then((res) => {
                    console.log(res)
                    this.$refs.groupDialog.dialogClose()
                    this.$message.success('关联成功')
                    this.getData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 详情Dialog
        showCheckDialog(row) {
            this.checkItem = row.id
            this.$refs.checkDialog.dialogShow()
        },

        // 提交
        submit() {
            return new Promise(resolve=>{
                this.$refs.dialogForm.validate((valid) => {
                    if (valid) {
                        if (this.formData.id) {
                            // 编辑
                            paramGroup
                                .editParamsGroup({
                                    id: this.formData.id,
                                    name: this.formData.name,
                                    memo: this.formData.memo,
                                    paramsIdList: this.formData.paramsList
                                })
                                .then((res) => {
                                    console.log(res)
                                    this.$message.success('编辑成功')
                                    this.dialogVisible = false
                                    this.getData()
                                }).finally(_=>{
                                    resolve()
                                })
                        } else {
                            // 新增
                            console.log(123123)
                            paramGroup
                                .addParamsGroup({
                                    name: this.formData.name,
                                    memo: this.formData.memo,
                                    paramsIdList: this.formData.paramsList
                                })
                                .then((res) => {
                                    this.$message.success('新增成功')
                                    this.dialogVisible = false
                                    this.getData()
                                }).finally(_=>{
                                    resolve()
                                })
                        }
                    } else {
                        console.log(valid)
                        resolve()
                        console.log('error')
                    }
                })
            })
        },

        // 打开新增
        toAdd() {
            this.dialogVisible = true
            this.$set(this.formData, 'name', '')
            this.$set(this.formData, 'memo', '')
            this.$set(this.formData, 'paramsList', [])
            this.getParamsList()
        },

        // 打开编辑
        toEdit(row) {
            this.dialogVisible = true
            this.getDetail(row.id)
            console.log(this.formData)
        },

        // 获取参数组的详情
        getDetail(id) {
            paramGroup
                .paramsGroupDeatail(id)
                .then((res) => {
                    if(res.code) {
                        this.formData = res?.data || this.$options.data().formData;
                        let paramsList = (res?.data?.params || []).map(item => ({ id:item.id, propName: item.propName }))
                        this.relatedParamsList = paramsList;
                    }
                    this.getParamsList(id)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取参数列表
        getParamsList() {
            paramGroup
                .paramsProperty({
                    attributeType: 'P',
                    curPage: this.dialog.pageNo,
                    pageSize: this.dialog.pageSize,
                    propName: this.dialog.searchName
                })
                .then((res) => {
                    if(res.code) {
                        this.paramsList = res?.data?.resultList || []
                        this.dialog.total = res?.data?.total || 0
                        if (this.formData.paramsList.length !== 0) {
                            this.processParams()
                        }
                    }
                })
        },

        // 编辑时，迭代数据获取状态
        processParams() {
            for (const i of this.paramsList) {
                for (const j of this.formData.paramsList) {
                    if (i.id === j) {
                        this.$set(i, 'related', 1)
                    }
                }
            }
        },

        // 关联
        relateParams(row) {
            this.$set(row, 'related', 1)
            this.relatedParamsList.push({ id: row.id, propName: row.propName })
            this.$forceUpdate()
            this.$refs.dialogForm.clearValidate('paramsList')
        },

        // 取消关联
        cancelRelateParams(scope) {
            this.$set(scope.row, 'related', 0)
            let index = this.formData.paramsList.indexOf(scope.row.id)
            if(index > -1) {
                this.relatedParamsList.splice(index, 1);
            }
        },

        // dialog搜索
        search() {
            this.dialog.pageNo = 1
            this.getParamsList()
        },

        // 新增-编辑表格分页
        dialogcurrentPageChange(value) {
            this.dialog.pageNo = value
            this.getParamsList()
        },

        // 检查参数列表
        checkParamsList(rule, value, callback) {
            if (value.length === 0) {
                callback(new Error('至少关联一个参数'))
            }
            callback()
        },
        // 关闭对话框
        closeDialog() {
            this.dialogVisible = false
            this.relatedParamsList = [];        //清空回显
            this.dialog.searchName = '';        //清空搜索输入
            this.dialog.pageNo = 1;
            this.formData = {}
        }
    }
}
</script>
<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style >
.el-tooltip__popper {
    max-width: 60vw;
}
</style>
