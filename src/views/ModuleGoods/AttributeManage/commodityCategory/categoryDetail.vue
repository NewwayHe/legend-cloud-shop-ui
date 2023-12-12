<template>
    <section class="mb-50">
        <div class="table">
            <el-card class="mb-15" shadow>
                <el-table ref="table" v-loading="tableDetailListLoading" header-row-class-name="headerRow" border :data="categoryTable" class="w-100 mb-50">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column prop="name" label="类目类型" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.grade == 1" class="ml-10">一级类目</span>
                            <span v-if="scope.row.grade == 2" class="ml-10">二级类目</span>
                            <span v-if="scope.row.grade == 3" class="ml-10">三级类目</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="父类" align="center">
                        <template slot-scope="scope">{{ parentName || '顶级' }}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="类目名称" align="center" />
                    <el-table-column prop="seq" label="排序" align="center" />
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0" class="status-done">下线</span>
                            <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                        </template>
                    </el-table-column>
                </el-table>

                <!--列表-->
                <p class="font text-333 mb-20">类目下的商品：</p>
                <el-table ref="multipleTable" v-loading="tableListLoading" header-row-class-name="headerRow" :data="tableList" tooltip-effect="dark" class="w-100">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48"/>
                    <el-table-column prop="pic" label="商品主图">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.productName">
                                    <template slot="reference">
                                        <el-link class="ml-5 goodPic" :underline="false" type="primary">
                                            <span class="line-clamp2">{{ scope.row.productName }}</span>
                                        </el-link>
                                    </template>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌名称">
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="price" label="销售价">
                        <template slot-scope="scope">
							￥{{ scope.row.price }}
						</template>
                    </el-table-column>
                    <el-table-column prop="buys" label="销量"/>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.opStatus == -1" class="status-veto">审核不通过</span>
                            <span v-else-if="scope.row.opStatus == 0" class="status-wait">待审核</span>
                            <template v-else>
                                <span v-if="scope.row.status == 0" class="status-done">下架</span>
                                <span v-if="scope.row.status == 1" class="status-pass">上架</span>
                                <span v-if="scope.row.status == 2" class="status-veto">违规商品</span>
                                <span v-if="scope.row.status == -1" class="status-veto">商家删除</span>
                                <span v-if="scope.row.status == -2" class="status-veto">商家永久删除</span>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" class="mt-30">
                    <el-pagination :page-sizes="[10, 30, 50, 100, 500, 1000]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                        :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </el-card>
        </div>
        <sticky>
            <el-button size="small" @click="goBack">返回</el-button>
        </sticky>
    </section>
</template>

<script>
    import { category } from '@/api/ModuleGoods'
    import Sticky from '@/components/Sticky'

    export default {
        components: {
            Sticky
        },
        data() {
            return {
                tableDetailListLoading: false, // 表格请求loading
                categoryTable: [], // 类目信息
                id: '',
                parentName: '',
                url: {
                    getData: '/product/s/product/page'
                },
                searchFilters: {
                    shopFirstCatId: this.$route.query.gradeId == 1 ? this.$route.query.id : '',
                    shopSecondCatId: this.$route.query.gradeId == 2 ? this.$route.query.id : '',
                    shopThirdCatId: this.$route.query.gradeId == 3 ? this.$route.query.id : ''
                },
                page: {
                    // 表格页码
                    pageSize: 10,
                    curPage: 1
                },
                tableList: [], // 表格列表
                tableTotal: 0, // 表格列表总数
                tableListLoading: false // 表格请求loading
            }
        },
        mounted() {
            this.id = this.$route.query.id
            this.parentName = this.$route.query.parentName
            this.init(this.$route.query.id)
            this.getPage()
        },
        methods: {
            //类目下的商品列表
            getPage() {
                this.tableListLoading = true
                category
                    .page2({
                        categoryId: this.id,
                        curPage: this.page.curPage,
                        pageSize: this.page.pageSize
                    })
                    .then((res) => {
                        this.tableListLoading = false
                        this.tableTotal = res?.data?.total || 0
                        this.tableList = res?.data?.resultList || []
                    })
            },
            /**
             *  页码改变
             */
            currentPageChange(p) {
                this.page.curPage = p
                this.getPage()
            },
            /**
             *  页数改变
             */
            pageSizeChange(size) {
                this.page.pageSize = size
                this.getPage()
            },
            // 初始化页面
            init(id) {
                this.tableDetailListLoading = true
                category
                    .detail(id)
                    .then((res) => {
                        console.log(res)
                        this.tableDetailListLoading = false
                        this.categoryTable = [res.data]
                    })
                    .catch((err) => {
                        this.tableDetailListLoading = false
                        console.log(err)
                    })
            },

            // 返回列表页
            goBack() {
                this.$router.push({
                    name: 'commodityCategory'
                })
            }
        }
    }
</script>
