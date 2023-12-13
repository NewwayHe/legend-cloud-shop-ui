<!-- /*
 * @Descripttion:商品审核列表
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.name" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="searchFilters.brandId" clearable filterable placeholder="请选择">
                            <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch(['opStatus'])">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.opStatus" size="large" @change="changeStatus">
                            <el-radio-button label="5">所有商品</el-radio-button>
                            <el-radio-button label="0">待审核商品</el-radio-button>
                            <el-radio-button label="-1">审核拒绝商品</el-radio-button>
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
                    @sort-change="changeSort"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" align="left" />
                    <el-table-column prop="pic" label="商品主图" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10 text-blue goodPic" :underline="false" type="primary" @click="proPreview(scope.row)">
                                            <span class="line-clamp2">{{ scope.row.name }}</span>
                                        </el-link>
                                    </template>
                                    <div>{{ scope.row.name }}</div>
                                    <el-link
                                        class="text-blue"
                                        :underline="false"
                                        target="_blank"
                                        :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.id"
                                    >
                                        {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.id }}
                                    </el-link>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌" align="left">
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="skuCount" label="SKU数量" align="left" />
                    <el-table-column sortable="custom" prop="price" label="销售价" width="224" align="left">
                        <template slot-scope="scope">{{ scope.row.price | priceRangeFilters }}</template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="buys" label="销量" align="left" />
                    <el-table-column prop="siteName" label="店铺名称" width="140" align="left" />
                    <el-table-column prop="status" label="状态" align="left">
                        <template slot-scope="scope">
                            <span v-if="scope.row.opStatus == -1 || scope.row.draftStatus == -1" class="status-veto">审核不通过</span>
                            <span v-if="scope.row.opStatus == 0 || scope.row.draftStatus == 0" class="status-wait">待审核</span>
                            <span
                                v-if="
                                    (scope.row.opStatus == 1 && (scope.row.draftStatus == null || scope.row.draftStatus == -10)) ||
                                    scope.row.draftStatus == 1
                                "
                                class="status-pass"
                            >
                                通过审核
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditOpinion" label="备注" show-overflow-tooltip min-width="100">
                        <template slot-scope="scope">
                            {{ scope.row.auditOpinion || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="140">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <template>
                                    <span v-if="scope.row.opStatus == -1">
                                        <el-link :underline="false" type="primary" @click="editGood(scope.row)">编辑</el-link>
                                        <el-link :underline="false" type="primary" @click="deleteGood(scope.row)">删除</el-link>
                                    </span>
                                    <span v-else class="font-12">-</span>
                                </template>
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
        </el-card>

        <dialog-audit
            :id="auditList"
            ref="auditDialog"
            url="/admin/product/audit"
            :user-params="{ ids: 'idList', status: 'opStatus', content: 'auditOpinion' }"
            @finish="getData"
        />
        <dialogPreview ref="dialogPreview" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { GoodsManage } from '@/api/ModuleGoods'
import DialogAudit from '@/comCommon/dialogAudit'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'

export default {
    name: 'AduitList',
    components: {
        DialogAudit,
        dialogPreview
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                shopId: '',
                brandId: '',
                opStatus: 5 // 审核状态
            },
            shopList: [],
            brandList: [],
            auditList: [], // 提交审核的数组
            url: {
                getData: '/product/s/product/auditPage'
            }
        }
    },
    watch: {},
    mounted() {
        // this.getShop()
        this.getBrand()
    },
    methods: {
        //预览
        proPreview(row) {
            this.$refs.dialogPreview.showDialog({ id: row.id, viewDraft: [0, -1, '0', '-1'].includes(row.opStatus) ? true : false })
        },
        editGood(row) {
            this.$router.push({
                name: 'addGood',
                query: {
                    productId: row.id
                }
            })
        },
        deleteGood(row) {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                GoodsManage.batchUpdateDelStatus({ ids: [row.id], status: -1 }).then((res) => {
                    if (res.code == 1) {
                        this.$message.success('删除成功')
                        this.getData()
                    }
                })
            })
        },
        // 获取所有店铺
        getShop() {
            GoodsManage.getShopAllOnline()
                .then((res) => {
                    if (res.code) {
                        this.shopList = res.data
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.$message.error(err.msg)
                })
        },

        // 获取所有品牌
        getBrand() {
            GoodsManage.getBrandAllOnline()
                .then((res) => {
                    if (res.code) {
                        this.brandList = res.data
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.$message.error(err.msg)
                })
        },

        showAuditDialog() {
            this.$refs.auditDialog.showDialog()
        },

        // 审核单个
        auditItem(row) {
            this.auditList = []
            this.auditList.push(row.id)
            this.showAuditDialog()
        },

        // 批量审核
        batchAudit() {
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            this.auditList = this.mulSels
            this.showAuditDialog()
        },

        // 更新商品状态
        updateStatus(row) {
            this.$confirm(
                `${row.status ? '商品下架后，用户无法在商城中查看商品。确定下架？' : '商品上架后，用户可以在商城中查看商品。确定上架？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            )
                .then(() => {
                    GoodsManage.updateStatus({
                        id: row.id,
                        status: Number(!row.status)
                    })
                        .then((res) => {
                            if (res.code) {
                                this.$message.success('操作成功')
                                this.getData()
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                            this.$message.error(err.msg)
                        })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },

        // 导出
        exportData() {
            GoodsManage.productExport(
                {
                    name: this.searchFilters.name,
                    shopId: this.searchFilters.shopId,
                    status: this.searchFilters.status,
                    brandId: this.searchFilters.brandId
                },
                this
            )
        },

        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.getData()
        }
    }
}
</script>
<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style>
.el-tooltip__popper {
    max-width: 60vw;
}
</style>
