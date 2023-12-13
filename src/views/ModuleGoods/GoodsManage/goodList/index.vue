<!-- /*
 * @Descripttion:商品列表
*/ -->
<template>
    <section>
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
                        <el-button size="small" @click.stop="dbnResetSearch(['status'])">重置</el-button>
                        <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                        <el-button size="small" @click.stop="$refs.dialogSendFile.showDialog()">导入商品</el-button>
                        <el-button size="small" @click.stop="$refs.dialogSendResult.showDialog()">查看导入结果</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col class="flex-start">
                        <el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
                            <el-radio-button label="3">所有商品</el-radio-button>
                            <el-radio-button label="1">上架商品</el-radio-button>
                            <el-radio-button label="0">下架商品</el-radio-button>
                            <el-radio-button label="-10">未发布商品</el-radio-button>
                        </el-radio-group>
                        <el-button class="ml-20" type="primary" size="medium" @click="addGoods">发布商品</el-button>
                    </el-col>
                </el-row>
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    header-row-class-name="headerRow"
                    @sort-change="changeSort"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" reserve-selection width="42" align="left" />
                    <el-table-column label="序号" type="index" width="48" align="left" />
                    <el-table-column prop="pic" label="商品信息" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10 text-blue goodPic" :underline="false">
                                            <span class="line-clamp2" @click="proPreview(scope.row)">{{ scope.row.name }}</span>
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
                    <el-table-column prop="min_price" label="销售价" width="224" sortable="custom" align="left">
                        <template slot-scope="scope">￥{{ scope.row.price }}</template>
                    </el-table-column>
                    <el-table-column prop="buys" label="销量" width="100" align="left" sortable="custom" />
                    <el-table-column label="销售库存" prop="stocks" width="100" align="left" sortable="custom" />
                    <el-table-column prop="actualStocks" label="实际库存" align="left" />
                    <el-table-column prop="deliveryType" label="配送方式" width="80" align="left">
                        <template slot-scope="{ row }">
                            <span v-if="row.deliveryType == 0">快递配送</span>
                            <span v-else-if="row.deliveryType == 10">门店自提</span>
                            <template v-else-if="row.deliveryType == 20">
                                <p>快递配送</p>
                                <p>门店自提</p>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="status" label="状态" align="left">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == -10" class="status-veto">未发布</span>
                            <span v-if="scope.row.status == 0" class="status-veto">下线</span>
                            <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                            <span v-if="scope.row.status == 2" class="status-veto">违规商品</span>
                            <span v-if="scope.row.status == -1" class="status-veto">商家删除</span>
                            <span v-if="scope.row.status == -2" class="status-veto">商家永久删除</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="draftStatus" label="草稿状态" align="left">
                        <template slot-scope="scope">
                            <!-- -10:未发布 -1: 拒绝、0: 待审核、1: 通过 -->
                            <template v-if="[-10, 0, -1, 1].includes(scope.row.draftStatus)">
                                <span v-if="scope.row.draftStatus == -10" class="status-veto">未提审</span>
                                <span v-if="scope.row.draftStatus == 0" class="status-veto">待审核</span>
                                <span v-if="scope.row.draftStatus == -1" class="status-veto">拒绝</span>
                                <span v-if="scope.row.draftStatus == 1" class="status-pass">通过</span>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brief" label="备注" align="center" show-overflow-tooltip width="150px">
                        <template slot-scope="scope">
                            <template v-if="scope.row.tagList">
                                <el-tag v-for="item in scope.row.tagList" :key="item" class="ml-5">{{ item }}</el-tag>
                            </template>
                            <template v-else>-</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="250px">
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link v-if="scope.row.status == 0" :underline="false" type="primary" @click="updateStatus(scope.row)">
                                    上架
                                </el-link>
                                <el-link v-if="scope.row.status == 1" :underline="false" type="primary" @click="updateStatus(scope.row)">
                                    下架
                                </el-link>
                                <el-link :underline="false" type="primary">
                                    <el-dropdown size="medium" style="line-height: 19px" @command="setClick">
                                        <el-link style="padding: 0" :underline="false" type="primary">编辑</el-link>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item
                                                v-if="scope.row.draftStatus != 0"
                                                key="product"
                                                :command="{ type: 'product', params: scope.row }"
                                            >
                                                编辑商品
                                            </el-dropdown-item>

                                            <el-dropdown-item
                                                v-if="(scope.row.draftStatus == -10 && scope.row.status != -10) || scope.row.draftStatus == -1"
                                                key="editDraft"
                                                :command="{ type: 'editDraft', params: scope.row }"
                                            >
                                                编辑草稿
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.draftStatus === 0"
                                                key="cancelAudit"
                                                :command="{ type: 'cancelAudit', params: scope.row }"
                                            >
                                                撤回审核
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.draftStatus === 0 && scope.row.status != -10"
                                                key="lookDraft"
                                                :command="{ type: 'lookDraft', params: scope.row }"
                                            >
                                                查看草稿
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.draftStatus === 0"
                                                key="lookProduct"
                                                :command="{ type: 'lookProduct', params: scope.row }"
                                            >
                                                查看商品
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.status == 3 || scope.row.status == 1 || scope.row.status == 0"
                                                key="stock"
                                                :command="{ type: 'stock', params: scope.row }"
                                            >
                                                编辑库存
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.draftStatus == -10"
                                                key="draftArraignment"
                                                :command="{ type: 'draftArraignment', params: scope.row }"
                                            >
                                                提交审核
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-link>
                                <el-link :underline="false" type="primary" @click="goAddPage('copy', scope.row)">复制</el-link>
                                <el-link v-if="scope.row.status != 1" :underline="false" type="primary" @click="deleteGood(scope.row)">删除</el-link>
                                <el-link v-if="scope.row.status == 1" :underline="false" type="primary" @click="openLink(scope.row.id)">
                                    查看链接
                                </el-link>
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
                        <el-button v-if="searchFilters.status == 3 || searchFilters.status == 0" size="small" @click="batchUpdate(1)">
                            批量上线
                        </el-button>
                        <el-button v-if="searchFilters.status == 3 || searchFilters.status == 1" size="small" @click="batchUpdate(0)">
                            批量下线
                        </el-button>
                        <el-button v-if="searchFilters.status == 3 || searchFilters.status == 1" size="small" @click="showDialogEdit">
                            批量编辑
                        </el-button>
                    </el-col>
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </LsSticky>
        </el-card>
        <dialogLink ref="dialogLink" />
        <dialogStock ref="dialogStock" :product-id="currentItem.id" />
        <dialogCommission ref="dialogCommission" :product-id="currentItem.id" />
        <dialogPreview ref="dialogPreview" />
        <dialogEdit ref="dialogEdit" />
        <dialogSendResult ref="dialogSendResult" />
        <dialogSendFile ref="dialogSendFile" title="商品" url="/product/s/product/insert/batch/product" @success="getData()">
            <div slot="body">
                <span class="text-danger">导入商品前请先上传商品图片</span>
                <el-button class="w-100" size="mini" plain @click.stop="getTemplate">下载导入模板</el-button>
            </div>
        </dialogSendFile>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { GoodsManage, addGood } from '@/api/ModuleGoods'
import dialogLink from '@/comCommon/dialogLink'
import dialogStock from '@/comCommon/dialogStock'
import dialogCommission from './components/dialogCommission'
import dialogEdit from './components/dialogEdit'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
import dialogSendFile from '@/comCommon/dialogSendFile.vue'
import dialogSendResult from './components/dialogSendResult.vue'
import { request } from '@/utils/request.js'
export default {
    name: 'GoodList',
    components: {
        dialogStock,
        dialogLink,
        dialogCommission,
        dialogEdit,
        dialogPreview,
        dialogSendFile,
        dialogSendResult
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                shopId: '',
                brandId: '',
                status: '3', // 商品状态
                opStatus: '1'
            },
            productId: '', //当前编辑库存id
            currentItem: {}, //当前编辑库存id
            brandList: [],
            url: {
                getData: '/product/s/product/page',
                delete: '/product/s/product/batchUpdateStatus',
                mulDel: '/product/s/product/batchUpdateStatus', // 注意返回去的是id的数组['asb','sdf']
                getExcel: '/product/s/product/export'
            }
        }
    },
    computed: {},
    watch: {},
    mounted() {
        this.getBrand()
    },
    methods: {
        //预览
        proPreview(row) {
            this.$refs.dialogPreview.showDialog({ id: row.id, viewDraft: [0, -1, '0', '-1'].includes(row.opStatus) ? true : false })
        },
        // 下拉选择
        setClick(params) {
            if (params.type == 'draftArraignment') {
                this.productDraftArraignment(params.params.id)
                return
            }
            if (params.type == 'cancelAudit') {
                this.productDraftRevokeArraignment(params.params.id)
                return
            }
            if (params.type == 'editDraft') {
                this.editGood(params.params, true)
                return
            }
            if (params.type == 'lookDraft' || params.type == 'lookProduct') {
                this.checkGood(params.params, params.type == 'lookDraft' ? true : false)
                return
            }
            if (params.type == 'product') {
                this.editGood(params.params, false)
                return
            } else {
                this.goodOper(params.type, params.params)
            }
        },

        // 前往新增 | 编辑 | 复制
        goAddPage(type, row) {
            this.$router.push({ name: 'addGood', query: { productId: row.id || '', type: type, time: new Date().getTime() } })
        },

        //商品操作
        goodOper(type, row) {
            this.currentItem = row || {}
            switch (type) {
                case 'stock': //编辑库存
                    this.$refs.dialogStock.showDialog()
                    break
                case 'commission': //编辑分佣比例
                    this.$refs.dialogCommission.showDialog(row)
                    break
                default:
                    break
            }
        },
        deleteGood(row) {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                GoodsManage.batchUpdateDelStatus({ ids: [row.id], status: -1 }).then((res) => {
                    if (res.code == 1) {
                        this.$message.success('删除成功')
                        this.$refs.multipleTable.toggleRowSelection(row, false)
                        this.getData()
                    }
                })
            })
        },
        editGood(row, isDraft) {
            this.$router.push({ name: 'addGood', query: { productId: row.id || '', time: new Date().getTime(), isDraft: isDraft } })
        },
        addGoods() {
            this.$router.push({ name: 'addGood', query: { time: new Date().getTime() } })
        },
        checkGood(row, isDraft) {
            this.$router.push({ name: 'addGood', query: { productId: row.id || '', time: new Date().getTime(), isDraft: isDraft, isLookInfo: true } })
        },
        editStock(row) {
            this.productId = row.id
            this.$refs.dialogStock.showDialog()
        },
        async openLink(id) {
            let res = await GoodsManage.productPreview({ productId: id })
            this.$refs.dialogLink.showDialog(`?detailsType=good&id=${id}&token=${res.data}`)
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
        // 更新商品状态
        updateStatus(row) {
            let nowTime = new Date().getTime()
            this.$confirm(
                `${row.status ? '商品下架后，用户无法在商城中查看商品。确定下架？' : '商品上架后，用户可以在商城中查看商品。确定上架？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            ).then(() => {
                if (row.preSellFlag && nowTime >= row.preSaleEndTimestamp && row.status == false) {
                    this.$confirm('预售商品超出预售时间，将以正常销售价进行销售。确定上架？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        GoodsManage.batchUpdateStatus({
                            ids: [row.id],
                            status: Number(!row.status)
                        })
                            .then((res) => {
                                if (res.code) {
                                    this.$refs.multipleTable.toggleRowSelection(row, false)
                                    this.$message.success('操作成功')
                                    this.getData()
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.$message.error(err.msg)
                            })
                    })
                } else {
                    GoodsManage.batchUpdateStatus({
                        ids: [row.id],
                        status: Number(!row.status)
                    })
                        .then((res) => {
                            if (res.code) {
                                this.$refs.multipleTable.toggleRowSelection(row, false)
                                this.$message.success('操作成功')
                                this.getData()
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                            this.$message.error(err.msg)
                        })
                }
            })
        },

        // 批量上下架
        batchUpdate(status) {
            let nowTime = new Date().getTime()
            // console.log(this.mulSelsRows, 'item')
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            let isTip = false
            let preSaleEndTimestamp = false
            let pdStatus = false
            this.mulSelsRows.map((item) => {
                if (item.preSellFlag) {
                    isTip = true
                }
                if (nowTime >= item.preSaleEndTimestamp) {
                    preSaleEndTimestamp = true
                }
                if (item.status) {
                    pdStatus = true
                }
            })
            this.$confirm(
                `${status ? '商品上架后，用户可以在商城中查看商品。确定上架？' : '商品下架后，用户无法在商城中查看商品。确定下架？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            )
                .then(() => {
                    if (isTip && preSaleEndTimestamp && pdStatus == false) {
                        this.$confirm('选中商品包含预售商品，预售商品超出预售时间，将以正常销售价进行销售', '提示', {
                            type: 'warning'
                        }).then(() => {
                            GoodsManage.batchUpdateStatus({
                                ids: this.mulSels,
                                status: status
                            })
                                .then((res) => {
                                    if (res.code) {
                                        this.$refs.multipleTable.clearSelection() //清除表格选择勾选行
                                        this.$message.success('操作成功')
                                        this.getData()
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                    this.$message.error(err.msg)
                                })
                        })
                    } else {
                        GoodsManage.batchUpdateStatus({
                            ids: this.mulSels,
                            status: status
                        })
                            .then((res) => {
                                if (res.code) {
                                    this.$refs.multipleTable.clearSelection() //清除表格选择勾选行
                                    this.$message.success('操作成功')
                                    this.getData()
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.$message.error(err.msg)
                            })
                    }
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },
        // 批量编辑
        showDialogEdit() {
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            this.$refs.dialogEdit.showDialog(this.mulSelsRows)
        },
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.$refs.multipleTable.clearSelection() //清除表格选择勾选行
            this.getData()
        },
        productDraftArraignment(id) {
            addGood.productDraftArraignment({ productId: id }).then((res) => {
                if (res.code) {
                    this.$message.success('提交审核成功')
                    this.getData()
                }
            })
        },
        productDraftRevokeArraignment(id) {
            this.$confirm('撤销提审后，可重新编辑商品提交审核，确定撤销', '消息确认').then((res) => {
                addGood.productDraftRevokeArraignment({ productId: id }).then((res) => {
                    if (res.code) {
                        this.$message.success('撤回审核成功')
                        this.getData()
                    }
                })
            })
        },
        getTemplate() {
            request.getFile('/product/s/product/template')
        }
    }
}
</script>
<style lang="scss" scoped>
.hidden__radio ::v-deep {
    .el-radio-button__inner {
        border-radius: 0 !important;
    }
}
</style>
