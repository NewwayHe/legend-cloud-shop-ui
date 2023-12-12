<template>
    <!-- 规格模板 -->
    <el-dialog title="选择商品" custom-class="dialog-form" width="1000px" :visible.sync="dialogVisible">
        <el-row>
            <el-form :inline="true" :model="dialogSearchFilters" size="small" @submit.native.prevent>
                <el-form-item label="商品名称">
                    <el-input v-model="dialogSearchFilters.name" placeholder="商品名称" />
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click.stop="dialogSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="mb-20 table">
            <el-table
                ref="multipleTable"
                v-loading="tableListLoading"
                :data="templateList"
                tooltip-effect="dark"
                class="w-100 expandTable"
                row-key="id"
                header-row-class-name="headerRow"
                :expand-row-keys="expands"
                height="500"
                @expand-change="toggleRowExpansion"
            >
                <el-table-column type="expand" class="dialogSpuExpand">
                    <template slot-scope="scope">
                        <el-table
                            ref="multipleTable"
                            :data="scope.row.skuBOList"
                            tooltip-effect="dark"
                            class="w-100 pl-10"
                            row-key="id"
                            :show-header="false"
                        >
                            <el-table-column width="55">
                                <template slot-scope="childScope">
                                    <el-checkbox
                                        :key="skuKey"
                                        :checked="childScope.row.check"
                                        :label="childScope.row.id"
                                        @change="
                                            (v) => {
                                                checkboxChange(scope.row, childScope.row, v)
                                            }
                                        "
                                    >
                                        {{ '' }}
                                    </el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="pic" label="商品主图" min-width="150">
                                <template slot-scope="childScope">
                                    <div class="d-flex a-center">
                                        <ls-image style="flex: 0 0 50px" :src="childScope.row.pic" :options="{ w: '50', h: '50', br: '6' }" />
                                        <span>{{ childScope.row.cnProperties }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-checkbox
                            :key="spuKey"
                            :checked="scope.row.checkAll"
                            @change="
                                (v) => {
                                    spuItemChange(scope.row, v)
                                }
                            "
                        ></el-checkbox>
                    </template>
                </el-table-column>

                <el-table-column prop="pic" label="商品主图" min-width="150">
                    <template slot-scope="scope">
                        <div class="d-flex">
                            <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '6' }" />
                            <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                <template slot="reference">
                                    <el-link class="ml-5" :underline="false" type="primary" style="height: 45px">
                                        <div class="line-clamp2">{{ scope.row.name }}</div>
                                    </el-link>
                                </template>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注"></el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end">
            <pagination
                layout="prev, pager, next"
                :page-size="dialogPage.pageSize"
                :page-sizes="[5, 10, 15]"
                :total="dialogPage.total"
                @size-change="dialogPageSizeChange"
                @current-change="dialogPageChange"
            />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { couponApi } from '@/api/ModuleMarketing'
export default {
    props: ['normsMulSels', 'selectIds', 'couponId'],
    data() {
        return {
            dialogVisible: false,
            dialogPage: {
                curPage: 1,
                pageSize: 10,
                total: 0
            },
            dialogSearchFilters: {}, //搜索条件
            valtext: [],
            templateList: [],
            spuKey: 0,
            skuKey: 0,
            tableListLoading: false,
            expands: []
        }
    },

    computed: {},
    watch: {
        templateList: {
            handler(newVal) {
                this.spuKey++
                this.skuKey++
                console.log(this.spuKey++)
            },
            deep: true
        }
    },

    created() {},
    methods: {
        //初始化列表选中状态
        initList(list) {
            return list.map((item) => {
                item.checkAll = this.getSpuCheckState(item)
                return item
            })
        },

        // 修改优惠券关联商品

        editCoupon(list) {
            let params = {
                id: this.couponId,
                selectSkuId: [],
                unSelectSkuId: []
            }
            this.templateList.forEach((item) => {
                let itemParam = this.getSkuCheckIds(item)
                params.selectSkuId.push(...itemParam.selectSkuId)
                params.unSelectSkuId.push(...itemParam.unSelectSkuId)
            })

            return couponApi.couponProductPut(params).then((res) => {
                if (res.code == 1) {
                    console.log(232323)
                    this.$emit('update:couponId', res.data)
                }
            })
        },

        //spu选择框改变
        spuItemChange(spuItem, value) {
            spuItem.checkAll = value
            this.changeCheckState(spuItem, value)
        },

        //改变状态
        changeCheckState(spuItem, value) {
            if (!spuItem.skuBOList && !spuItem.skuBOList.length) return
            spuItem.skuBOList.forEach((skuItem) => {
                skuItem.check = value
            })
        },
        //判断spu以下是否都为true如果是返回true，不是返回false
        getSpuCheckState(skuItem) {
            if (!skuItem.skuBOList && !skuItem.skuBOList.length) return
            let checkedState = true
            for (let i in skuItem.skuBOList) {
                let checked = skuItem.skuBOList.every((cartItem) => cartItem.check)
                console.log(checked)
                if (!checked) {
                    checkedState = false
                    break
                }
            }
            return checkedState
        },
        //获取店铺下勾选的数据的id。给多选删除使用
        getSkuCheckIds(spuItem) {
            if (!spuItem.skuBOList && !spuItem.skuBOList.length) return
            let resultDto = {
                selectSkuId: [],
                unSelectSkuId: []
            }
            spuItem.skuBOList.forEach((item) => {
                if (item.check) {
                    resultDto.selectSkuId.push(item.id)
                } else {
                    resultDto.unSelectSkuId.push(item.id)
                }
            })
            return resultDto
        },

        checkboxChange(spuItem, skuItem, value) {
            if (!value) {
                spuItem.checkAll = value
            }
            skuItem.check = value
            if (this.getSpuCheckState(spuItem)) {
                spuItem.checkAll = value
            }
        },
        toggleRowExpansion(row) {
            if (this.expands.includes(row.id)) {
                this.expands = []
            } else {
                this.expands = []
                this.expands.push(row.id)
            }
        },

        dialogSearch() {
            this.getTemplateList()
        },
        async submitForm(formName) {
            await this.editCoupon(this.templateList)
            await this.$emit('sumbitTable')
            this.dialogVisible = false
        },
        async getTemplateList() {
            if (this.templateList && this.templateList.length) {
                await this.editCoupon()
            }
            couponApi
                .productPage({ ...this.dialogSearchFilters, ...this.dialogPage, couponId: this.couponId })
                .then((res) => {
                    if (res.code&&res.data&&res.data.resultList) {
                        this.templateList = this.initList(res.data.resultList)
                        this.dialogPage.total = res.data.total
                    }
                    this.tableListLoading = false
                })
                .catch((err) => {
                    this.tableListLoading = false
                })
        },
        dialogPageSizeChange(size) {
            this.dialogPage.pageSize = size
            this.getTemplateList()
        },
        dialogPageChange(p) {
            this.dialogPage.curPage = p
            this.getTemplateList()
        },
        showDialog() {
            this.dialogVisible = true
            this.getTemplateList()
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .expandTable .el-table__expanded-cell {
    padding-right: 0 !important;
}
</style>