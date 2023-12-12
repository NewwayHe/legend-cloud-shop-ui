<!-- /*
 * @Descripttion:库存列表
*/ -->
<template>
    <section class="">
        <el-card shadow>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.name" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <el-button size="small" @click.stop="exportData">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                    <el-alert class="theme" :closable="false" show-icon>
                        <p>商品库存，显示所有的商品库存信息，可按照实际库存进行排序</p>
                    </el-alert>
                </el-row>
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    row-key="id"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" reserve-selection width="42" />
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="pic" label="商品信息" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="450" trigger="hover" :title="scope.row.name">
                                    <el-link class="text-blue" type="primary" target="_blank" :underline="false" :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId">{{$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId}}</el-link>
                                    <template slot="reference">
                                        <el-link class="ml-10 text-blue goodPic" :underline="false" type="primary">
                                            <span class="line-clamp2"  @click="proPreview(scope.row.productId)">{{ scope.row.name || '-'}}</span>
                                        </el-link>
                                    </template>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cnProperties" label="规格" min-width="120">
                        <template slot-scope="scope">{{ scope.row.cnProperties || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="price" label="销售价"  width="224" >
                         <template slot-scope="scope">{{ scope.row.price+'' | priceRangeFilters }}</template>
                        </el-table-column>
                    <el-table-column prop="buys" label="销量" >
                         <template slot-scope="scope">{{ scope.row.buys || '-' }}</template>
                    </el-table-column>
                    <el-table-column sortable prop="actualStocks" label="实际库存" width="130" >
                          <template slot-scope="scope">{{ scope.row.actualStocks || '-' }}</template>
                    </el-table-column>
                    <el-table-column sortable prop="stocks" label="销售库存"  width="130">
                        <template slot-scope="scope">{{ scope.row.stocks || '-' }}</template>
                    </el-table-column>
                    <el-table-column sortable prop="stocksArm" label="库存预警" width="130" >
                        <template slot-scope="scope">{{ scope.row.stocksArm || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span class="status-done" v-if="scope.row.status == 0" >下线</span>
                            <span class="status-pass" v-else>上线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link class="text-blue" :underline="false" type="primary" @click.stop="editStock(scope.row)">编辑库存</el-link>
                                <el-link class="text-blue" :underline="false" type="primary" @click="stockHistory(scope.row.id)">库存历史</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
						<el-col>
						    <el-button size="mini" class="allCheck pl-10 pr-10">
								<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
						    </el-button>
						    <el-button size="small" @click="toBatchEdit">批量编辑库存</el-button>
						</el-col>
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
                <div class="tip mt-20">
                    <div class="tip-wrapper">
                        <h2 class="title">说明</h2>
                        <p>1、销量：表示SKU累计的销售数量，以订单支付完成为准，商品退货则扣除对应销量；</p>
                        <p>2、销售库存：订单提交后即扣除销售库存；</p>
                        <p>3、实际库存：订单发货后即扣除实际库存；（销售库存≤实际库存）</p>
                        <p>4、库存预警：发布商品时设置的库存预警；当销售库存≤库存预警时，系统会以站内信形式提示；</p>
                    </div>
                </div>
            </div>
        </el-card>
		<!-- 编辑 -->
		<el-dialog title="编辑库存" custom-class="dialog-form" :visible.sync="dialogForm.isVisible" width="445px">
		    <el-form
		        ref="myForm"
		        :model="dialogForm.formData"
		        :rules="dialogForm.formRule"
		        label-width="95px"
		        label-position="right"
		        size="small"
		    >
		        <el-row>
		            <el-col>
		                <el-form-item label="编辑库存" prop="stocks">
		                    <el-input v-model="dialogForm.formData.stocks" placeholder="请输入库存" />
		                </el-form-item>
		            </el-col>
		        </el-row>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
		        <el-button size="small" type="primary" @click.stop="batchEdit('myForm')">保 存</el-button>
		    </div>
		</el-dialog>
		
		<el-dialog title="库存历史" :visible.sync="dialogVisible" custom-class="dialog-form-small">
		    <el-row class="mb-20">
		        <el-table :data="tableData" class="w-100 dialog-form-table mt-15" header-row-class-name="headerRow" size='small'>
		            <el-table-column type="index" label="序号" width="48" />
		            <el-table-column prop="cnProperties" label="增加库存">
		                <template slot-scope="scope">
		                    {{ scope.row.afterStock - scope.row.beforeStock > 0 ? '+' : '' }} {{ scope.row.afterStock - scope.row.beforeStock }}
		                </template>
		            </el-table-column>
		            <el-table-column prop="updateTime" label="编辑时间" width="140"/>
		        </el-table>
		    </el-row>
		    <el-row type="flex" justify="end" align="middle" class="mt-10">
		        <el-pagination
		            small
		            layout="prev, pager, next"
		            :current-page="dialogPage.curPage"
		            :page-size="5"
		            :total="dialogTotal"
		            @size-change="dialogPageSizeChange"
		            @current-change="dialogPageChange"
		        ></el-pagination>
		    </el-row>
		    <span slot="footer" class="dialog-footer">
		        <el-button size="small" type="primary" @click="dialogVisible = false">确 定</el-button>
		    </span>
		</el-dialog>
		<dialogStock ref="dialogStock" :product-id="currentId" type="sku" />
		<dialogPreview ref="dialogPreview" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { inventoryManage } from '@/api/ModuleGoods.js'
import { debounce } from '@/utils/utils.js'
import dialogStock from '@/comCommon/dialogStock'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
export default {
    name: 'InventoryManageList',
    components: {
        dialogStock,
        dialogPreview
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: ''
            },
            url: {
                getData: '/product/s/product/stocksPage'
            },
            currentId: '', // 存储查看库存id
            dialogForm: {
                formRule: {
                    productNo: [
                        {
                            required: true,
                            message: '请输入库存数量',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            dialogVisible: false,
            dialogPage: {
                curPage: 1,
                pageSize: 5
            },
            dialogTotal: 0,
            tableData: [],
            stocksIds: [],
            player: null,
        }
    },
    watch: {},
    mounted() {},
    methods: {
		//预览
		 proPreview(id) {
			this.$refs.dialogPreview.showDialog({id:id});
		},
        exportData(list) {
            inventoryManage.stocksExport({
                name: this.searchFilters.name,
                skuIdList: this.mulSels.join()
            })
        },
        dialogPageSizeChange(size) {
            this.dialogPage.pageSize = size
            this.getStockList()
        },
        dialogPageChange(p) {
            this.dialogPage.curPage = p
            this.getStockList()
        },
        //编辑库存
        editStock(row) {
            this.currentId = [row.id]
            this.$refs.dialogStock.showDialog()
        },
        getStockList() {
            inventoryManage
                .stocksLogPage({
                    skuId: this.currentId,
                    ...this.dialogPage
                })
                .then((res) => {
                    if (res.code) {
                        this.tableData = res?.data?.resultList || []
                        this.dialogTotal = res?.data?.total || 0
                    }
                })
        },
        // 打开编辑
        toEdit(row) {
            this.dialogForm.isVisible = true
            this.dialogForm.formData = Object.assign({}, row)
            this.stocksIds = [row.id]
        },

        // 批量编辑
        toBatchEdit() {
            if (!this.mulSels?.length) {
                this.$message.warning('至少选择一条数据')
                return
            }
            this.currentId = this.mulSels
            this.$refs.dialogStock.showDialog()
        },

        // 批量处理
        batchEdit: debounce(function () {
            this.$refs.myForm.validate((valid) => {
                if (valid) {
                    inventoryManage.batchUpdateStock(this.dialogForm.formData.stocks, this.stocksIds).then((res) => {
                        console.log(res)
                        this.$message.success('操作成功')
                        this.$refs.myForm.resetFields()
                        this.batchList = []
                        this.dialogForm.isVisible = false
                        this.getData()
                    })
                }
            })
        }),
        // 查看库存历史
        stockHistory(id) {
            this.dialogVisible = true
            this.currentId = id
            this.dialogPage.curPage = 1
            this.getStockList()
        }
    }
}
</script>

<style lang="scss" scoped>
.tip-wrapper {
    background-color: #f7f7f7;
    padding: 16px 0 0 15px;
    font-size: 12px;
    color: #999;
    border-radius: 5px;

    .title {
        font-size: 16px;
        margin-bottom: 16px;
    }

    p {
        padding-bottom: 9px;
    }
}
</style>
