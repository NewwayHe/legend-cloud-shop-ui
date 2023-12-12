 * @Descripttion:商品回收站
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
                        <el-button size="small" @click.stop="dbnResetSearch(['delStatus'])">重置</el-button>
                        <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form> 
            </div>
            <div class="table">
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                    row-key="id"
                    @sort-change="changeSort"
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
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10 text-blue goodPic" :underline="false" type="primary" @click="proPreview(scope.row)">
                                            <span class="line-clamp2">{{ scope.row.name || '-' }}</span>
                                        </el-link>
                                    </template>
                                    <div>{{scope.row.name}}</div>
                                    <el-link class="text-blue" :underline="false"  target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+scope.row.id">{{ $shareRedirectUrl+'?detailsType=good&id='+scope.row.id }}</el-link> 
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌" >
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="skuCount" label="SKU数量"  >
                        <template slot-scope="scope">{{ scope.row.skuCount || '-' }}</template>
                    </el-table-column>
                    <el-table-column sortable prop="price" width="224" label="销售价"  >
                        <template slot-scope="scope">{{ scope.row.price | priceRangeFilters }}</template>
                    </el-table-column>
                    <el-table-column sortable prop="buys" label="销量" >
                        <template slot-scope="scope">{{ scope.row.buys || '-' }}</template>
                    </el-table-column>
                    <el-table-column sortable prop="actualStocks" label="实际库存"  width="130">
                        <template slot-scope="scope">{{ scope.row.actualStocks || '-' }}</template>
                    </el-table-column>
                    <el-table-column label="销售库存" prop="stocks"  />
                    <el-table-column label="状态" >
                        <template>
                            <span class="status-veto">删除</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brief" label="备注" show-overflow-tooltip min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.brief || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="300px" >
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click="updateDelStatus(scope.row, true)">恢复</el-link>
                                <el-link :underline="false" type="primary" @click="updateDelStatus(scope.row, false)">永久删除</el-link>
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
						<el-button size="small" @click="handleMulDel({ status: 1 }, '确认恢复所选数据吗?')">批量恢复</el-button>
						<el-button size="small" @click="handleMulDel({ status: -2 }, '确认永久删除所选数据吗?')">批量永久删除</el-button>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>
       <dialogPreview ref="dialogPreview"/>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { GoodsManage } from '@/api/ModuleGoods'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'

export default {
    name: 'GoodsRecoveryList',
    components: {
        dialogPreview
    },
    mixins: [common, cud],
    data() {
        return {
            radio1: '',
            searchFilters: {
                name: '',
                shopId: '',
                brandId: '',
                delStatus: -1 // 删除商品状态
            },
            productId: '', //当前编辑库存id
            linkUrl: '', //当前复制链接的id
            shopList: [],
            brandList: [],
            auditList: [], // 提交审核的数组
            url: {
                getData: '/product/s/product/page',
                getExcel: '/product/s/product/recycleBin/export',
                delete: '/product/s/product/batchUpdateDelStatus',
                mulDel: '/product/s/product/batchUpdateDelStatus'
            },
        }
    },
    watch: {},
    mounted() {
        this.getBrand()
    },
    methods: {
		//预览
		 proPreview(row) {
			this.$refs.dialogPreview.showDialog({id:row.id,viewDraft:[0,-1,'0','-1'].includes(row.opStatus)?true:false});
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
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.getData()
        },
        //查看链接
		async viewLinks(id) {
		    let res = await GoodsManage.productPreview({ productId: id })
		    this.$refs.dialogLink.showDialog(`?detailsType=good&id=${id}&token=${res.data}`)
		},
        // 更新被删除商品状态
        updateDelStatus(row, flag) {
            this.$confirm(`${flag ? '确定恢复商品？' : '永久删除商品后不可恢复，确定删除？'}`, '消息确认', {
                type: 'warning'
            }).then(() => {
                GoodsManage.batchUpdateDelStatus({
                    ids: [row.id],
                    status: Number(flag ? 1 : -2)
                }).then((res) => {
                    if (res.code) {
                        this.$refs.multipleTable.toggleRowSelection(row, false)
                        this.$message.success('操作成功')
                        this.getData()
                    }
                })
            })
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
<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style >
.el-tooltip__popper {
    max-width: 60vw;
}
</style>