<!-- /*
 * @Descripttion: 财务管理->发票管理
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="订单编号">
                        <el-input v-model="searchFilters.orderNumber" placeholder="订单编号" />
                    </el-form-item>
                    <el-form-item label="发票类型">
                        <el-select v-model="searchFilters.type" clearable placeholder="发票类型">
                            <el-option label="普通发票" value="NORMAL" />
                            <el-option label="增值税专票" value="DEDICATED" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发票抬头">
                        <el-input v-model="searchFilters.company" placeholder="发票抬头" />
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input v-model="searchFilters.userName" placeholder="用户名" />
                    </el-form-item>
                    <el-form-item label="下单时间">
                        <el-date-picker v-model="searchFilters.createTime" value-format="yyyy-MM-dd" placeholder="下单时间" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <el-button size="small" @click.stop="exportData(searchFilters)">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.hasInvoiceFlag" size="large" @change="changeStatus">
                            <el-radio-button>所有发票</el-radio-button>
                            <el-radio-button :label="false">未开发票</el-radio-button>
                            <el-radio-button :label="true">已开发票</el-radio-button>
                        </el-radio-group>
                    </el-col>
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
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column
                        type="selection"
                        reserve-selection
                        width="42"
                        :selectable="
                            (row) => {
                                return !row.hasInvoiceFlag
                            }
                        "
                    />
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="orderNumber" label="订单商品" width="200">
                        <template slot-scope="scope">
                            <div class="overflow-x text-nowrap">
                                <span v-for="(item, index) in scope.row.orderProductPics" :class="{ 'ml-10': index }">
                                    <ls-image class="v-middle" :src="item" :options="{ w: '50', h: '50', br: '4' }" />
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="订单编号" min-width="180" />
                    <el-table-column label="订单金额">
                        <template slot-scope="scope">
                            <div>{{ scope.row.actualTotalPrice | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="发票类型">
                        <template slot-scope="scope">
                            <div>{{ scope.row.type == 'NORMAL' ? '普通发票' : '增值税专票' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="发票抬头" width="224">
                        <template slot-scope="scope">
                            <div v-if="scope.row.titleType == 'PERSONAL' && scope.row.type == 'NORMAL'">[个人抬头]&nbsp;{{ scope.row.company }}</div>
                            <div v-if="scope.row.titleType == 'COMPANY' && scope.row.type == 'NORMAL'">[企业抬头]&nbsp;{{ scope.row.company }}</div>
                            <div v-if="scope.row.type == 'DEDICATED'">
                                <div>[公司名称]&nbsp;{{ scope.row.company }}</div>
                                <div>[税号]&nbsp;{{ scope.row.invoiceHumNumber }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userName" label="用户名" min-width="100" />
                    <el-table-column prop="createTime" label="下单时间" width="140" />
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <div :class="scope.row.hasInvoiceFlag ? 'status-pass' : 'status-done'">
                                {{ scope.row.hasInvoiceFlag ? '已开发票' : '未开发票' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link v-if="scope.row.type == 'DEDICATED'" :underline="false" type="primary" @click="showDialog(scope.row)">
                                    查看
                                </el-link>
                                <el-link v-if="!scope.row.hasInvoiceFlag" :underline="false" type="primary" @click="batchOpenInvoicing(scope.row.id)">
                                    开票
                                </el-link>
                                <span v-if="scope.row.type !== 'DEDICATED' && scope.row.hasInvoiceFlag" class="font">-</span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <LsSticky :data="tableList">
                <el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <el-col class="text-nowrap flex-start">
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
                        <el-button size="small" @click="batchOpenInvoicing()">批量开票</el-button>
                    </el-col>
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </LsSticky>
        </el-card>
        <dialogInvoice ref="dialogInvoice" :invoice-info="invoiceInfo" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { orderApi } from '@/api/ModuleOrder.js'
import dialogInvoice from './components/dialogInvoice'

export default {
    name: 'Invoice',
    components: {
        dialogInvoice
    },
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/order/s/order/invoice/page'
            },
            invoiceInfo: {} // 增值税专票信息
        }
    },
    computed: {},
    methods: {
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.mulSels = []
            this.getData()
        },
        // 查看
        showDialog(params) {
            this.invoiceInfo = params
            this.$refs.dialogInvoice.showDialog()
        },
        // 导出
        exportData(params) {
            orderApi.exportInvoicing(params).then((res) => {
                if (res.code == 1) {
                    this.$message.success('导出成功')
                }
            })
        },
        // 开票
        batchOpenInvoicing(id = null) {
            if (id == null && !this.mulSels?.length) {
                this.$message.warning('至少选择一条数据')
                return
            }
            orderApi.batchOpenInvoicing(id ? [id] : this.mulSels).then((res) => {
                if (res.code == 1) {
                    this.$message.success('开票成功')
                    if (id) {
                        //单删
                        let index = this.mulSels.indexOf(id)
                        if (index > -1) {
                            this.mulSels.splice(index, 1)
                        }
                    } else {
                        this.mulSels = []
                    }
                    this.getData()
                }
            })
        }
    }
}
</script>
