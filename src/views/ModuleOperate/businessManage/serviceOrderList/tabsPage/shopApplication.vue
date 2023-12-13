<!--
    商家申请列表
-->
<template>
    <section class="">
        <!-- 搜索条件区域 -->
        <div class="lead">
            <h3>商家申请售后流程</h3>
            <div>
                <p>申请售后：商家可以主动申请售后，需要平台确认。若平台确认，可以进行售后流程。若平台拒绝，则商家可重新发起售后。</p>
                <p>商家申请取消订单时，用户无法同时申请售后。（只能同时存在一条售后数据）</p>
            </div>
            <div class="line-h">
                <div class="flex-start mb-20">
                    <span class="text-333 font-12">商家申请售后</span>
                    <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                    <span class="text-333 font-12">平台审核</span>
                    <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                    <span class="text-333 font-12">平台审核同意</span>
                    <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                    <span class="text-333 font-12">售后流程</span>
                </div>
                <div class="flex-start">
                    <span class="text-333 font-12">商家申请售后</span>
                    <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                    <span class="text-333 font-12">平台审核</span>
                    <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc" />
                    <span class="text-333 font-12">平台审核拒绝</span>
                </div>
            </div>
        </div>
        <div class="search">
            <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                <el-form-item label="商品名称">
                    <el-input v-model="searchFilters.productName" :maxlength="50" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="订单编号">
                    <el-input v-model="searchFilters.orderNumber" :maxlength="30" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="取消原因">
                    <el-select v-model="searchFilters.reason" clearable>
                        <el-option v-for="item in reasonList" :key="item.id" :label="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
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
                <el-form-item>
                    <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格区域 -->
        <div class="table">
            <el-row type="flex" class="mb-20">
                <el-col>
                    <el-radio-group v-model="searchFilters.applyStatus" size="large" @change="changeStatus">
                        <el-radio-button :label="undefined">所有订单</el-radio-button>
                        <el-radio-button label="2">待审核</el-radio-button>
                        <el-radio-button label="3">已同意</el-radio-button>
                        <el-radio-button label="-4">已拒绝</el-radio-button>
                        <el-radio-button label="-1">已取消</el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>

            <!-- 订单列表 -->
            <!-- v-loading不能直接用在自定义表格上[order-table] 否则会在<1366px的屏幕刷新后 表格会白屏 -->
            <div v-loading="tableListLoading">
                <order-apply-cancel-table
                    ref="table"
                    :table-list="tableList"
                    :selectable-arr="selectableList"
                    @changeStatus="changeStatus"
                    @selecteItem="getSelectedList"
                    @toDetail="toDetail"
                    @operate="successOperate"
                />
            </div>
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
                            @change="selectAll"
                        />
                    </el-button>
                    <el-button size="small" @click="batchExamine">批量撤回</el-button>
                </el-col>
                <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
            </el-row>
        </LsSticky>
    </section>
</template>
<script>
import orderApplyCancelTable from '../components/orderApplyCancelTable.vue'
import common from '@/mixins/pages/commom'
import { serviceOrderApi } from '@/api/ModuleOrder'
export default {
    name: 'ServiceOrderList',
    components: {
        orderApplyCancelTable
    },
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
            checkAll: false, // 全选状态
            checkList: [], //选中的数组
            url: {
                getData: '/order/s/order/refund/pageCancelOrder',
                getExcel: '/order/s/order/refund/excel/cancel'
            },
            reasonList: [],
            isMounted: true
        }
    },
    computed: {
        //底部全选按钮与表格顶部的全选按钮状态同步[半选状态]
        checkHalf() {
            if (this.checkAll) {
                return false
            } else if (this.checkList.length) {
                return true
            } else {
                return false
            }
        },
        // 可批量审核的数据
        selectableList() {
            return this.tableList.filter((item) => item.applyStatus == 2)
        }
    },
    watch: {
        // 监听换页导致数据切换而造成的选择框状态
        selectableList(nSel) {
            if (nSel.some((item) => !this.checkList.includes(item.id))) {
                this.checkAll = false
            } else {
                this.checkAll = true
            }
        }
    },
    mounted() {
        serviceOrderApi.refundReason().then((res) => {
            if (res.code) {
                this.reasonList = res.data
            }
        })
    },
    methods: {
        // 跳转详情
        toDetail(id) {
            console.log(id)
        },

        // 子组件全选
        getSelectedList(checkType, selectedList) {
            this.checkAll = checkType
            this.checkList = selectedList
        },

        // 全选
        selectAll(selected) {
            this.$refs.table.selectedAllOrNot(selected)
        },

        // 导出数据
        exportData() {
            console.log('导出数据')
            serviceOrderApi.refundExport(this.searchFilters)
        },
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.$refs.table.checkList = [] //切换状态 清空选中的数据
            this.getData()
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
            this.$refs.table.auditWithdrawGood({}, true)
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
</style>
