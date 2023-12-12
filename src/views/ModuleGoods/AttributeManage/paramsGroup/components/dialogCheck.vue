<template>
    <el-dialog title="查看" :visible.sync="dialogVisible" custom-class="dialog-form-small">
        <div>
            <el-form :inline="false" label-position="right" label-width="98px" size="small">
                <el-form-item label="参数组名称：">
                    <span class="font">{{ itemDetail.name }}</span>
                </el-form-item>
                <el-form-item label="参数组副标题：">
                    <span class="font">{{ itemDetail.memo }}</span>
                </el-form-item>
                <el-form-item label="序号：">
                    <span class="font">{{ itemDetail.seq }}</span>
                </el-form-item>
                <el-form-item label="关联参数：" />
            </el-form>
            <el-table
                ref="groupTable"
                v-loading="tableListLoading"
                class="w-100 dialog-form-table mt-15"
                tooltip-effect="dark"
                size="small"
                :data="paramsList"
                header-row-class-name="headerRow"
            >
                <el-table-column prop="propName" label="参数标题" />
                <el-table-column prop="prodPropStr" label="参数值" />
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
        <span slot="footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'

export default {
    props: {
        itemId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialog: {
                total: 0,
                pageSize: 5,
                pageNo: 1
            },
            itemDetail: {},
            paramsList: [],
            tableListLoading: false
        }
    },
    methods: {
        // 初始化方法
        dialogInit() {
            request
                .get(`/product/s/paramGroup/${this.itemId}`)
                .then((res) => {
                    console.log(res)
                    this.itemDetail = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取相关联的参数
        getRelatedParams() {
            this.tableListLoading = true
            request
                .get('/product/s/paramGroup/param', {
                    id: this.itemId,
                    pageSize: this.dialog.pageSize,
                    curPage: this.dialog.pageNo
                })
                .then((res) => {
                    this.paramsList = res?.data?.resultList || []
                    this.dialog.total = res?.data?.total || 0
                    this.tableListLoading = false
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 显示dialog
        dialogShow() {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.dialogInit()
                this.getRelatedParams()
            })
        },

        // 上/下一页
        dialogcurrentPageChange(value) {
            this.dialog.pageNo = value
            this.getRelatedParams()
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table td{
    color: #333;
}
::v-deep .el-table__header th{
    color: #333;
}
::v-deep .el-form .el-form-item{
    .el-form-item__content{
        color: #333;
    }
}
</style>
