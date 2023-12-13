<template>
    <section class="">
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" @submit.native.prevent>
                    <el-form-item label="物流公司">
                        <el-input v-model="searchFilters.name" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="mb-20">
                <el-button v-ls-loading type="primary" size="medium" @click="showGoodDialog">新增</el-button>
            </div>
            <div class="table">
                <!--列表-->
                <div class="mb-20">
                    <el-row class="mb-20 mt-20">
                        <el-alert type="warning" class="theme" :closable="false">
                            <div class="d-flex a-start">
                                <i class="el-alert__icon el-icon-info" style="margin-right: 8px; color: #ffa800" />
                                <div>
                                    <span class="text-333 font">商家在平台预设值的物流公司中选择常用的物流公司，订单发货时使用</span>
                                </div>
                            </div>
                        </el-alert>
                    </el-row>
                </div>
                <el-table v-loading="tableListLoading" :data="tableList" header-row-class-name="headerRow" tooltip-effect="dark" class="w-100">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="name" label="物流公司" />
                    <el-table-column label="操作" align="left" width="250">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="handleDel(scope.row, scope.column, scope.$index)">删除</el-link>
                            </span>
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
            <dialog-good ref="goodDialog" :good-list="form.groupList" @relateGoods="getRelatedGoods" />
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import dialogGood from './components/dialogGood'
import { request } from '@/utils/request'
export default {
    name: 'Logistics',
    components: {
        dialogGood
    },
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/order/s/logistics/company/page',
                delete: '/order/s/logistics/company'
            },
            form: {
                groupList: [], // 表格数据
                prodIds: [] // 关联商品id
            }
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        //显示Dialog
        showGoodDialog() {
            this.$refs.goodDialog.dialogShow()
        },
        // 获取选择的商品
        getRelatedGoods(selectedGoods) {
            this.getData()
        }
    }
}
</script>
