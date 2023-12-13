<template>
    <!-- 规格模板 -->
    <el-dialog :title="attributeType == 'S' ? '规格' : '参数' + '模板'" custom-class="dialog-form-large" :visible.sync="dialogVisible">
        <dialogParamEdit ref="dialogParamEdit" @freshList="getTemplateList" />
        <dialogNormsEdit ref="dialogNormsEdit" @freshList="getTemplateList" />
        <el-row>
            <el-form :inline="true" :model="dialogSearchFilters" size="small" class="d-flex" @submit.native.prevent>
                <el-form-item :label="attributeType == 'S' ? '规格：' : '参数' + '名称：'" class="flex-1 d-flex" style="margin-bottom: 15px">
                    <el-input v-model="dialogSearchFilters.propName" :placeholder="attributeType == 'S' ? '规格' : '参数' + '名称'" />
                </el-form-item>
                <el-form-item style="margin-bottom: 15px">
                    <el-button size="small" @click.stop="dialogSearch">搜索</el-button>
                    <el-button size="small" type="primary" @click="addData">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table
                ref="multipleTable"
                v-loading="tableListLoading"
                :data="templateList"
                tooltip-effect="dark"
                class="w-100 dialog-form-table"
                header-row-class-name="headerRow"
                row-key="id"
                @select-all="handleAllSelectionChange"
                @select="handleSelectionChange"
            >
                <el-table-column type="selection" width="42" align="center" />
                <el-table-column prop="propName" :label="attributeType == 'S' ? '规格' : '参数' + '标题'" />
                <el-table-column prop="prodPropStr" :label="(attributeType == 'S' ? '规格' : '参数') + '值'" />
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
import { specifications } from '@/api/ModuleGoods'
import { request } from '@/utils/request.js'
import dialogParamEdit from './dialogEdit/dialogParamEdit.vue'
import dialogNormsEdit from './dialogEdit/dialogNormsEdit.vue'

export default {
    components: {
        dialogParamEdit,
        dialogNormsEdit
    },
    props: {
        normsMulSels: {
            type: Array,
            default() {
                return []
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
        }
    },

    computed: {},
    watch: {
        normsMulSels(newVal) {
            // console.log(newVal)
        }
    },

    created() {},
    methods: {
        toggleSelection(rows) {
            rows.forEach((row) => {
                if (this.normsMulSels.includes(row.id)) {
                    this.$refs.multipleTable.toggleRowSelection(row, true)
                }
            })
        },
        handleAllSelectionChange(selection) {
            //如果全选
            if (selection.length) {
                this.dialogMulSels = selection.map((item) => item.id)
                this.$nextTick(() => {
                    this.$emit('update:normsMulSels', Array.from(new Set([...this.normsMulSels, ...this.dialogMulSels])))
                })
            } else {
                let currentList = this.templateList.map((item) => item.id)
                this.$nextTick(() => {
                    this.$emit(
                        'update:normsMulSels',
                        this.normsMulSels.filter((item) => !currentList.includes(item))
                    )
                })
            }
        },
        handleSelectionChange(val, row) {
            let selected = val.length && val.filter((item) => item.id == row.id).length
            //如果是取消勾选
            if (!selected) {
                this.$emit(
                    'update:normsMulSels',
                    this.normsMulSels.filter((item) => item != row.id)
                )
            }
            this.dialogMulSels = val.map((item) => item.id)
            this.$nextTick(() => {
                this.$emit('update:normsMulSels', Array.from(new Set([...this.normsMulSels, ...this.dialogMulSels])))
            })
        },
        dialogSearch() {
            this.getTemplateList()
        },
        addData() {
            if (this.attributeType == 'S') {
                this.$refs.dialogNormsEdit.showDialog()
            } else {
                this.$refs.dialogParamEdit.showDialog()
            }
        },
        submitForm(formName) {
            this.dialogVisible = false
            this.$emit('templateDataChange')
        },
        getTemplateList() {
            specifications
                .specificationPage({ attributeType: this.attributeType, ...this.dialogSearchFilters, ...this.dialogPage })
                .then((res) => {
                    if (res.code) {
                        this.templateList = res?.data?.resultList || []
                        this.dialogPage.total = res?.data?.total || 0
                        this.$nextTick(() => {
                            this.toggleSelection(this.templateList)
                        })
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
        }
    }
}
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
