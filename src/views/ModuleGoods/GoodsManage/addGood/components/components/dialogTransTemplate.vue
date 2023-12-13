<template>
    <el-dialog title="选择运费模板" custom-class="dialog-form-small" :visible.sync="dialogVisible">
        <el-row>
            <el-form :inline="true" :model="dialogSearchFilters" size="small" label-width="110px" class="flex-between" @submit.native.prevent>
                <el-form-item label="运费模板名称：" style="flex: 1; margin-bottom: 15px">
                    <el-input v-model="dialogSearchFilters.transName" placeholder="运费模板名称" style="width: 175px" />
                </el-form-item>
                <el-form-item style="margin-bottom: 15px; margin-right: 0">
                    <el-button size="small" @click.stop="dialogSearch">搜索</el-button>
                    <router-link :to="{ name: 'freightTemplate' }" target="_blank">
                        <el-button size="small" type="primary">新增</el-button>
                    </router-link>
                </el-form-item>
            </el-form>
        </el-row>
        <el-radio-group v-model="tempTransId" style="width: 100%">
            <el-row>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="templateList"
                    tooltip-effect="dark"
                    class="w-100 dialog-form-table"
                    header-row-class-name="headerRow"
                    @current-change="handleCurrentChange"
                >
                    <el-table-column prop="transName" label="运费模板名称" show-overflow-tooltip class="font-0">
                        <template slot-scope="scope">
                            <div class="font-0">
                                <el-radio :label="scope.row.id" class="line-clamp1 line-h-md">{{ scope.row.transName }}</el-radio>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="transName" label="运费模板名称"  /> -->
                    <el-table-column prop="type" label="类型">
                        <template slot-scope="scope">
                            {{ scope.row.transType == 1 ? '自定义' : '系统设置' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="模板类型" />
                </el-table>
            </el-row>
        </el-radio-group>
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
            <el-button v-ls-loading size="small" type="primary" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { transportManage } from '@/api/ModuleGoods'
export default {
    props: {
        transId: {
            type: [String, Number]
        }
    },
    data() {
        return {
            tempTransId: '', //运费模板
            dialogVisible: false,
            dialogPage: {
                curPage: 1,
                pageSize: 5,
                total: 0
            },
            dialogSearchFilters: {
                propName: ''
            },
            templateList: [],
            tableListLoading: false
        }
    },

    computed: {},
    watch: {
        transId: {
            handler(newVal) {
                this.tempTransId = newVal
            },
            immediate: true
        }
    },

    created() {},
    methods: {
        dialogSearch() {
            this.getTemplateList()
        },
        submitForm() {
            this.dialogVisible = false
            let transName = this.templateList.find((item) => item.id == this.tempTransId).transName
            let transTemplate = this.templateList.find((item) => item.id == this.tempTransId)
            this.$emit('transChange', this.tempTransId, transName, transTemplate)
        },
        getTemplateList() {
            transportManage
                .transportChoose({ ...this.dialogSearchFilters, ...this.dialogPage })
                .then((res) => {
                    if (res.code) {
                        this.templateList = res?.data?.resultList || []
                        this.dialogPage.total = res?.data?.total || 0
                    }
                    this.tableListLoading = false
                })
                .catch((err) => {
                    this.tableListLoading = false
                })
        },
        dialogPageSizeChange(size) {
            this.dialogPage.pageSize = size
            this.getTemplateList()
        },
        dialogPageChange(p) {
            this.dialogPage.curPage = p
            this.getTemplateList()
        },
        showDialog() {
            this.dialogVisible = true
            this.getTemplateList()
        },
        handleCurrentChange(val) {
            if (val && val.id) this.tempTransId = val.id
        }
    }
}
</script>

<style lang="scss" scoped></style>
