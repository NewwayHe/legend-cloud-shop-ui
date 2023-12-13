<template>
    <section class="">
        <div class="table">
            <el-card class="mb-15" shadow>
                <el-table
                    ref="table"
                    v-loading="tableDetailListLoading"
                    :data="brandTable"
                    class="w-100 mb-50"
                    header-row-class-name="headerRow"
                    :header-cell-style="{ background: '#fafafa' }"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column prop="brandName" label="品牌名称" />
                    <el-table-column prop="brandPic" label="品牌LOGO">
                        <template slot-scope="scope">
                            <ls-image style="vertical-align: middle" :src="scope.row.brandPic" :options="{ w: '50', h: '50', br: '6' }" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="bigImage" label="品牌大图">
                        <template slot-scope="scope">
                            <ls-image style="vertical-align: middle" :src="scope.row.bigImage" :options="{ w: '50', h: '50', br: '6' }" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="brief" label="品牌介绍" />
                    <el-table-column prop="commendFlag" label="是否推荐">
                        <template slot-scope="scope">
                            <span>{{ scope.row.commendFlag ? '是' : '否' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.status == 0" :underline="false" type="danger">下线</el-link>
                            <el-link v-if="scope.row.status == 1" :underline="false" type="success">上线</el-link>
                            <el-link v-if="scope.row.status == -1" :underline="false" type="warning">待审核</el-link>
                            <el-link v-if="scope.row.status == -2" :underline="false" type="danger">未通过</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="审核时间" />
                </el-table>

                <!--列表-->
                <p class="font text-333 mb-20">关联商品：</p>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                    :header-cell-style="{ background: '#f5f7fa' }"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="100" />
                    <el-table-column prop="pic" label="商品主图">
                        <template slot-scope="scope">
                            <ls-image style="vertical-align: middle" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '6' }" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-link class="line-clamp1" :underline="false" type="primary">{{ scope.row.name }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌">
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="siteName" label="店铺名称" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.status == 0" :underline="false" type="danger">下架</el-link>
                            <el-link v-if="scope.row.status == 1" :underline="false" type="success">上架</el-link>
                            <el-link v-if="scope.row.status == 2" :underline="false" type="danger">违规商品</el-link>
                            <el-link v-if="scope.row.status == 3" :underline="false" type="warning">待审核</el-link>
                            <el-link v-if="scope.row.status == 4" :underline="false" type="warning">审核拒绝</el-link>
                            <el-link v-if="scope.row.status == -1" :underline="false" type="info">商家删除</el-link>
                            <el-link v-if="scope.row.status == -2" :underline="false" type="info">商家永久删除</el-link>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" class="mt-20">
                    <el-pagination
                        :page-sizes="[10, 30, 50, 100, 500, 1000]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="page.curPage"
                        :total="tableTotal"
                        @size-change="pageSizeChange"
                        @current-change="currentPageChange"
                    />
                </el-row>
            </el-card>
        </div>
    </section>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { commodityBrandDetail } from '@/api/ModuleGoods'

export default {
    components: {},
    mixins: [common, cud],
    data() {
        return {
            tableDetailListLoading: false, // 表格请求loading
            brandTable: [], // 店铺信息
            id: '',
            url: {
                getData: '/product/s/product/page'
            },
            searchFilters: {
                brandId: this.$route.params.id
            }
        }
    },
    mounted() {
        this.id = this.$route.query.id || null
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            this.tableDetailListLoading = true
            commodityBrandDetail
                .brandDetail(this.id)
                .then((res) => {
                    this.tableDetailListLoading = false
                    this.brandTable = [res.data]
                })
                .catch((err) => {
                    this.tableDetailListLoading = false
                    console.log(err)
                })
        }
    }
}
</script>
