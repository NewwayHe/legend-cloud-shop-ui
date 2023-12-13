<!-- /*
 * @Descripttion:商品举报
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <el-card shadow>
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.productName" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item class="mb-20">
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    header-row-class-name="headerRow"
                    tooltip-effect="dark"
                    class="w-100"
                >
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="pic" label="商品主图" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '6' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10 text-blue" :underline="false" type="primary" style="height: 45px">
                                            <div class="line-clamp2">{{ scope.row.name }}</div>
                                        </el-link>
                                    </template>
                                    <div>{{ scope.row.name }}</div>
                                    <el-link
                                        class="text-blue"
                                        :underline="false"
                                        target="_blank"
                                        :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                                    >
                                        {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.id }}
                                    </el-link>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cnProperties" label="规格" />
                    <el-table-column prop="cash" label="销售价" />
                    <el-table-column label="操作" align="left" fixed="right">
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click="lookUser(scope.row.id)">查看</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-30">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </div>
        </el-card>

        <!-- 新增-编辑 -->
        <el-dialog title="查看" custom-class="dialog-form" width="495px" :visible.sync="dialogVisible">
            <el-row class="mb-20">
                <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f9f9f9' }">
                    <el-table-column type="index" label="序号" width="100" align="center" />
                    <el-table-column prop="nickName" label="用户" align="center" />
                    <el-table-column prop="createTime" label="编辑时间" align="center" />
                </el-table>
            </el-row>
            <el-row type="flex" justify="end">
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="dialogPage.curPage"
                    :total="dialogPage.total"
                    @size-change="dialogPageSizeChange"
                    @current-change="dialogPageChange"
                ></el-pagination>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import setting from '@/settings'
import { GoodsManage } from '@/api/ModuleGoods'

export default {
    name: 'ArrivalNotice',
    components: {},
    mixins: [common],
    data() {
        return {
            tableData: [],
            dialogPage: {
                curPage: 1,
                pageSize: 5,
                total: 0
            },
            currentId: '',
            dialogVisible: false,
            accusationDetail: {},
            url: {
                getData: '/product/s/productArrivalNotice/productPage'
            }
        }
    },
    mounted() {},
    methods: {
        dialogPageSizeChange(p) {
            this.dialogPage.curPage = p
            this.getData()
        },
        dialogPageChange(size) {
            this.dialogPage.pageSize = size
            this.getData()
        },
        getUserArrivalNotice() {
            GoodsManage.productArrivalNotice({ skuId: this.currentId, ...this.dialogPage }).then((res) => {
                if (res.code) {
                    this.tableData = res?.data?.resultList || []
                    this.dialogPage.total = res?.data?.total || 0
                }
            })
        },
        // 查看详情
        lookUser(id) {
            this.dialogVisible = true
            this.currentId = id
            this.dialogPage.curPage = 1
            this.getUserArrivalNotice()
        }
    }
}
</script>
