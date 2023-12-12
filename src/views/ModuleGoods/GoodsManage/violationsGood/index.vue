<!-- /*
 * @Descripttion:违规商品列表
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
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
                        <el-button size="small" @click.stop="exportData">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.opStatus" size="large" @change="changeStatus">
                            <el-radio-button label="4">所有商品</el-radio-button>
                            <el-radio-button label="2">违规商品</el-radio-button>
                            <el-radio-button label="3">锁定商品</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    row-key="id"
                    class="w-100"
                    header-row-class-name="headerRow"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" reserve-selection width="42" />
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="pic" label="商品主图" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10 text-blue goodPic" :underline="false" type="primary"  @click="proPreview(scope.row.id)">
                                            <span class="line-clamp2">{{ scope.row.name || '-' }}</span>
                                        </el-link>
                                    </template>
                                    <div>{{scope.row.name}}</div>
                                    <el-link class="text-blue" :underline="false"  target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+scope.row.id">{{ $shareRedirectUrl+'?detailsType=good&id='+scope.row.id }}</el-link> 
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="销售价"  width="224">
                        <template slot-scope="scope">{{ scope.row.price | priceRangeFilters }}</template>
                    </el-table-column>
                    <el-table-column label="品牌">
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="accusationTime" label="违规下架时间"  width="160">
                        <template slot-scope="scope">{{ scope.row.accusationTime || '-' }}</template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span class="status-veto" v-if="scope.row.opStatus == 2">违规下架</span>
                            <span class="status-veto" v-if="scope.row.opStatus == 3">锁定商品</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="draftStatus" label="草稿状态" align="left">
                        <template slot-scope="scope">
                            <!-- -10:未发布 -1: 拒绝、0: 待审核、1: 通过 -->
                            <template v-if="scope.row.opStatus == 2 && [-10,0,-1,1].includes(scope.row.draftStatus)">
                                <span class="status-veto" v-if="scope.row.draftStatus == -10">未提审</span>
                                <span class="status-veto" v-if="scope.row.draftStatus == 0">待审核</span>
                                <span class="status-veto" v-if="scope.row.draftStatus == -1">拒绝</span>
                                <span class="status-pass" v-if="scope.row.draftStatus == 1">通过</span>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accusationContent" label="违规下架原因" width="160">
                        <template slot-scope="scope">{{ scope.row.accusationContent || '-' }}</template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="200" >
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary">
                                    <el-dropdown size="medium" @command="setClick" style="line-height:19px">
                                        <el-link style="padding: 0" :underline="false" type="primary">编辑</el-link>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item
                                                v-if="scope.row.opStatus == 2"
                                                key="edit" 
                                                :command="{ type: 'product', params: scope.row }"
                                            >
                                                编辑商品
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.opStatus == 2 && ((scope.row.draftStatus == -10 && scope.row.status != -10) || scope.row.draftStatus == -1)"
                                                key="editDraft" 
                                                :command="{ type: 'editDraft', params: scope.row }" 
                                            >
                                                编辑草稿
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.opStatus == 2 && scope.row.draftStatus === 0"
                                                key="cancelAudit" 
                                                :command="{ type: 'cancelAudit', params: scope.row }" 
                                            >
                                                撤回审核
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.status == 3 || scope.row.status == 1 || scope.row.status == 0"
                                                key="stock"
                                                :command="{ type: 'stock', params: scope.row }"
                                            >
                                                编辑库存
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-if="scope.row.opStatus == 2 && scope.row.draftStatus == -10"
                                                key="draftArraignment" 
                                                :command="{ type: 'draftArraignment', params: scope.row }" 
                                            >
                                                提交审核
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
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
							<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
						</el-button>
						<el-button size="small" @click="handleMulDel({ status: -1 })">批量删除</el-button>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>
        <dialogPreview ref="dialogPreview" />
        <dialogStock ref="dialogStock" :product-id="currentItem.id" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { GoodsManage, addGood } from '@/api/ModuleGoods'

import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
import dialogStock from '@/comCommon/dialogStock'

export default {
    name: 'ViolationsGood',
    components: {
        dialogPreview,
        dialogStock,
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                brandId: '',
                opStatus: 4
            },
            shopList: [],
            brandList: [],
            url: {
                getData: '/product/s/product/accusationPage',
                delete: '/product/s/product/batchUpdateStatus',
                mulDel: '/product/s/product/batchUpdateDelStatus' // 注意返回去的是id的数组['asb','sdf']
            },
            currentItem: {}, //当前编辑操作对象
        }
    },
    watch: {},
    mounted() {
        this.getBrand()
    },
    methods: {
		//预览
		 proPreview(id) {
			this.$refs.dialogPreview.showDialog({id:id});
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
        // 编辑下拉选择
        setClick(params) {
            if(params.type == 'draftArraignment'){
                this.productDraftArraignment(params.params.id)
            }else if(params.type == 'cancelAudit'){
                this.productDraftRevokeArraignment(params.params.id)
            }else if (params.type == 'editDraft' || params.type == 'product') {
                this.editGood(params.params)
            }else if(params.type == 'stock') {
                this.goodOper(params.type, params.params)
            }
        },
        editGood(row) {
            this.$router.push({ name: 'addGood', query: { productId: row.id || '', time: new Date().getTime(), isDraft:true }})
        },
        // 商品操作
        goodOper(type, row) {
            this.currentItem = row;
            this.$refs.dialogStock.showDialog()
        },
        // 导出
        exportData() {
            GoodsManage.illegalExport({
                name: this.searchFilters.name,
                brandId: this.searchFilters.brandId,
                opStatus: this.searchFilters.opStatus
            })
        },
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.$refs.multipleTable.clearSelection()       //清除表格选择勾选行
            this.getData()
        },
        // 单删
        handleSingleDel(row) {
            this.handleMulDel({ ids: [row.id], status: -1, single: true, callback: ()=> {
                this.$refs.multipleTable.toggleRowSelection(row, false)
            }})
            
        },
        // 提审
        productDraftArraignment(id){
            addGood.productDraftArraignment({productId:id}).then(res=>{
                if(res.code){
                    this.$message.success('提交审核成功')
                    this.getData()
                }
            })
        },
        // 撤审
        productDraftRevokeArraignment(id){
            this.$confirm('撤销提审后，可重新编辑商品提交审核，确定撤销','消息确认').then(res=>{
                    addGood.productDraftRevokeArraignment({productId:id}).then(res=>{
                        if(res.code){
                            this.$message.success('撤回审核成功')
                            this.getData()
                        }
                    })
                }
            )
        }
    }
}
</script>
