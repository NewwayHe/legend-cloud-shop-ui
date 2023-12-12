<template>
    <el-dialog title="关联规格参数分组" :visible.sync="group.visible" width="445px" custom-class="dialog-form">
        <div>
            <el-form :inline="true" :model="groupForm" size="small" @submit.native.prevent>
                <el-form-item label="分组标题">
                    <el-input v-model="groupForm.title" placeholder="请输入">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click.stop="groupSearch" />
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table
                ref="groupTable"
                v-loading="tableListLoading"
                class="w-100 dialog-form-table"
                tooltip-effect="dark"
                size="mini"
                :data="groupList"
                :header-cell-style="{ background: '#fafafa' }"
                @select-all="selectAll"
                @select="selectRow"
            >
                <el-table-column type="selection" width="55" :selectable="checkRow" />
                <el-table-column prop="name" label="参数规格分组标题" align="center" />
            </el-table>
        </div>
        <el-row type="flex" justify="space-between" align="middle" class="mt-20">
            <el-checkbox v-model="group.checked" @change="checkedAll">全选</el-checkbox>
            <el-pagination
                layout="prev, pager, next"
                :total="group.total"
                :page-size="group.pageSize"
                :current-page="group.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>
        <span slot="footer">
            <span v-show="showTip" class="tip">勾选后保存即可完成关联</span>
            <el-button size="small" @click="group.visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitGroup">{{ showTip ? '保 存' : '确 定' }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'

export default {
    name: 'DialogGroup',
    props: {
        itemId: {
            type: [String, Number],
            default: ''
        },
        source: {
            type: String,
            required: true
        },
        showTip: {
            type: Boolean,
            default: true
        },
        // 关联的
        relatedRow: {
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
            groupList: [], // 表格数据
            tableListLoading: false
        }
    },
    methods: {
        // 初始化
        groupInit() {
            console.log(this.itemId)
            console.log(this.source)
            this.tableListLoading = true
            request
                .get('/s/productPropertyAgg/simplePage', {
                    curPage: this.group.pageNo,
                    pageSize: this.group.pageSize,
                    name: this.groupForm.title,
                    id: this.itemId,
                    source: this.source
                })
                .then((res) => {
                    this.tableListLoading = false
                    this.group.total = res?.data?.total || 0
                    this.groupList = res?.data?.resultList || []
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 保存关联组
        submitGroup() {
            if (this.group.selectedRow.length === 0) {
                this.$message.warning('至少选择一项')
                return
            }
            this.$emit('relateGroup', this.group.selectedRow)
        },

        // 搜索
        groupSearch() {
            console.log('search')
            this.groupInit()
        },

        // 全选
        selectAll(selection) {
            if (selection.length === 0) {
                this.group.checked = false
            } else {
                this.group.checked = true
            }
            this.group.selectedRow = selection
        },

        // 选择单行
        selectRow(selection, row) {
            this.group.selectedRow = selection
            if (selection.length === this.groupList.length) {
                this.group.checked = true
            }
        },

        // 点击单选框全选
        checkedAll() {
            this.$refs.groupTable.toggleAllSelection()
        },

        // 显示dialog
        dialogShow() {
            this.group.visible = true
            this.group.checked = false
            // 需要等待数据更新完才能初始化
            this.$nextTick(() => {
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
            this.groupInit()
        },

        // 是否禁用当前列
        checkRow(row) {
            return !this.relatedRow.map((item) => item.id).includes(row.id)
        }
    }
}
</script>

<style>
.tip {
    font-size: 10px;
    color: #9c9ca5;
    margin-right: 8px;
}
</style>
