<!--
    批量发货
-->
<template>
    <el-card :body-style="{ padding: `20px 20px 10px 20px` }">
        <section class="">
            <!-- 搜索条件区域 -->
            <div class="lead">
                <h3>批量发货流程</h3>
                <div class="">
                    <p>1、导出批量发货模板，模板中自动填充显示所有待发货状态的订单编号</p>
                    <p>2、在模板中填写对应的快递公司和快递单号，需要填写平台管理的快递公司</p>
                    <p>
                        3、导入已填写数据的模板，并查看结果，导入成功的订单将变为已发货状态，导入失败的订单可重新进行发货操作
                        <el-link class="ml-5 font-12" type="primary" :underline="false" @click="$router.push({ name: 'logistics' })">
                            查看快递公司
                        </el-link>
                    </p>
                </div>
                <div class="line-h">
                    <div class="flex-start mb-20">
                        <span class="text-333 font-12">导出模板</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">填写内容</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">导入数据</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">导入成功</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">订单发货</span>
                    </div>
                    <div class="flex-start">
                        <span class="text-333 font-12">导出模板</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">填写内容</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">导入数据</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">导入失败</span>
                        <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                        <span class="text-333 font-12">订单重新发货</span>
                    </div>
                </div>
            </div>
            <div class="search" style="margin-bottom: 20px">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="操作日期">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            clearable
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item><el-button size="small" @click.stop="dbnSearch">搜索</el-button></el-form-item>
                </el-form>
            </div>

            <div class="mb-20">
                <el-button type="primary" size="small" @click.stop="dbnExcel">下载模板</el-button>
                <el-button type="primary" size="small" @click.stop="$refs.dialogSendFile.showDialog()">导入数据</el-button>
            </div>
            <!-- 表格区域 -->
            <div class="table">
                <!-- 订单列表 -->
                <!-- v-loading不能直接用在自定义表格上[order-table] 否则会在<1366px的屏幕刷新后 表格会白屏 -->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    header-row-class-name="headerRow"
                    class="w-100"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="index" label="序号" />
                    <el-table-column label="事件">
                        <template slot-scope="scope">
                            <span>
                                导入{{ scope.row.count || 0 }}条数据，成功{{ scope.row.success || 0 }}条数据，失败{{ scope.row.fail || 0 }}条数据
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人">
                        <template slot-scope="scope" width="180">
                            <div>{{ scope.row.operator || '-' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间">
                        <template slot-scope="scope" width="180">
                            <div>{{ scope.row.createTime || ' -' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" @click="excelDownload(scope.row.id)">导出结果</el-link>
                            <!-- <span v-else>-</span> -->
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
            <dialogSendFile ref="dialogSendFile" title="订单" url="/order/s/order/insert/batch/logistic" @success="getData()"></dialogSendFile>
        </section>
    </el-card>
</template>

<script>
import common from '@/mixins/pages/commom'
import dialogSendFile from '@/comCommon/dialogSendFile.vue'
import { orderApi } from '@/api/ModuleOrder'

export default {
    name: 'BatchSend',
    components: { dialogSendFile },
    mixins: [common],
    data() {
        return {
            searchFilters: {
                productName: '',
                orderNumber: '',
                refundSn: '',
                userName: '',
                applyType: '',
                customStatus: ''
            },
            date: '', // 时间
            url: {
                getData: '/order/s/order/import/logistics/page',
                getExcel: '/order/s/order/import/logistics/template'
            }
        }
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
        // 跳转详情
        toDetail(id) {
            console.log(id)
        },
        // 时间改变
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'startTime', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'endTime', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'startTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        },

        excelDownload(id) {
            orderApi.logisticsExport(id)
        },

        // 操作成功回调
        successOperate(res) {
            if (res.success) {
                this.$message({
                    message: '操作成功',
                    type: 'success',
                    onClose: this.getData()
                })
            }
        },

        // 批量审核
        batchExamine() {
            this.$refs.table.examine()
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .tipsInfo {
    font-size: 12px;
    background: #d7e7f8;
    border: 1px solid #a2c9f3;
    .el-card__body {
        padding: 5px;
    }
    .el-icon-warning {
        color: '#409EFF';
        font-size: 14px;
        margin-right: 5px;
    }
}
.lead {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f5f7fa;
    > h3 {
        font-size: 18px;
    }
    > div {
        margin-top: 15px;
        color: #333;
        p {
            font-size: 12px;
            & + p {
                margin-top: 5px;
            }
        }
        &:last-child {
            margin-top: 30px;
            .el-button {
                padding: 0;
            }
        }
    }
}
</style>
