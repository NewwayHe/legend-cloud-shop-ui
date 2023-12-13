<template>
    <el-dialog title="查看导入结果" custom-class="dialog-form-large" destroy-on-close :visible.sync="dialogVisible">
        <el-row class="mb-20">
            <el-date-picker
                v-model="date"
                class="mr-20"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                size="small"
                @change="changeDate"
            />
            <el-button size="small" @click.stop="getData">搜索</el-button>
            <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
        </el-row>
        <el-table v-loading="loading" :data="data.resultList" style="width: 100%">
            <el-table-column prop="id" label="文件名称" width="80"></el-table-column>
            <el-table-column prop="operator" label="操作人账号"></el-table-column>
            <el-table-column prop="createTime" label="导入时间" width="160"></el-table-column>
            <el-table-column prop="success" label="导入结果" width="250">
                <template slot-scope="scope" width="100">
                    <span>共{{ scope.row.fail + scope.row.success }}条，导入成功{{ scope.row.success }}条，导入失败{{ scope.row.fail }}条</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                    <span v-if="scope.row.fail" class="text-main cursor-pointer" @click.stop="getFailPage(scope.row.id)">下载错误列表</span>
                </template>
            </el-table-column>
            <empty slot="empty" style="padding: 20px 0" text="暂无导入结果" />
        </el-table>
        <el-row v-if="data" type="flex" justify="center" class="mt-30">
            <el-pagination
                :current-page.sync="data.curPageNO"
                :page-size="data.pageSize"
                layout="prev, pager, next, jumper"
                :total="data.total"
                @current-change="currentChange"
            />
        </el-row>
        <div slot="footer"><el-button @click="dialogVisible = false">关闭</el-button></div>
    </el-dialog>
</template>
<script>
import { GoodsManage } from '@/api/ModuleGoods'
import { request } from '@/utils/request.js'
export default {
    props: {},
    data() {
        return {
            dialogVisible: false,
            date: '',
            data: '',
            apiParmas: {
                curPage: 1, //当前页,默认第一页
                pageSize: 5, //每页大小，默认每页大小10条记录
                startDate: '',
                endDate: ''
            },
            loading: false
        }
    },

    computed: {},
    watch: {},

    created() {},
    methods: {
        showDialog() {
            this.dialogVisible = true
            if (!this.data) {
                this.getData()
            }
        },
        // 改变日期
        changeDate() {
            if (this.date) {
                this.$set(this.apiParmas, 'startDate', this.date[0])
                this.$set(this.apiParmas, 'endDate', this.date[1])
            } else {
                this.$set(this.apiParmas, 'startDate', '')
                this.$set(this.apiParmas, 'endDate', '')
            }
        },

        getData() {
            this.loading = true
            GoodsManage.batchInsertProductFailPage(this.apiParmas)
                .then((res) => {
                    if (res.data) {
                        this.data = res.data
                    }
                })
                .finally(() => {
                    this.loading = false
                })
        },
        currentChange(val) {
            this.apiParmas.curPage = val
            this.getData()
        },

        dbnResetSearch() {
            this.apiParmas.startDate = ''
            this.apiParmas.endDate = ''
            this.date = ''
            this.getData()
        },

        getFailPage(id) {
            request.getFile(`/product/s/product/getInsertProductFailPage/${id}`)
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .textarea-item {
    .el-textarea__inner {
        height: 42px !important;
    }
}
::v-deep .stocksArm {
    .el-input__inner {
        padding-right: 0 !important;
        padding-left: 5px !important;
    }
}
</style>
