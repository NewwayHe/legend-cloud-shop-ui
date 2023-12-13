<template>
    <!-- 规格模板 -->
    <el-dialog title="编辑库存" custom-class="dialog-form-large" :visible.sync="dialogVisible">
        <el-form ref="dialogForm" :inline="true" :model="dialogForm" size="small" @submit.native.prevent>
            <el-table
                ref="multipleTable"
                :data="dialogForm.templateList"
                tooltip-effect="dark"
                class="w-100 dialog-form-table"
                height="300"
                header-row-class-name="headerRow"
                row-key="id"
            >
                <el-table-column prop="cnProperties" label="商品规格">
                    <template slot-scope="scope">
                        {{ scope.row.cnProperties || scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column prop="stocks" label="销售库存" />
                <el-table-column prop="putStorageFlag" label="类型">
                    <template slot-scope="scope">
                        <el-radio v-model="scope.row.putStorageFlag" class="mr-5" :label="true">增加</el-radio>
                        <el-radio v-model="scope.row.putStorageFlag" class="mr-5" :label="false">减少</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="propName" label="编辑库存" width="200">
                    <template slot="header" slot-scope="scope">
                        <el-row type="flex" align="middle" justify="center">
                            <div class="flex-shrink mr-3 ml-3">编辑库存</div>
                            <el-input
                                v-model.number="batchVal"
                                :oninput="$inputInteger"
                                style="width: 100px"
                                size="small"
                                class="flex-1"
                                maxlength="8"
                            ></el-input>
                            <el-button type="text" class="ml-3" @click="batchAdd">
                                <span class="text-blue font-12">应用</span>
                                <i class="el-icon-caret-bottom el-icon--right text-blue"></i>
                            </el-button>
                        </el-row>
                    </template>
                    <template slot-scope="scope">
                        <el-input
                            v-model.number="scope.row.editStocks"
                            :oninput="$inputInteger"
                            style="width: 150px"
                            class="flex-1"
                            size="small"
                            maxlength="8"
                        ></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <ls-button size="small" type="primary" :async-function="onSubmit">确 定</ls-button>
        </span>
    </el-dialog>
</template>
<script>
import { inventoryManage } from '@/api/ModuleGoods'
export default {
    props: {
        productId: {
            type: [Number, String, Array]
        },
        type: {
            type: String,
            default: 'prod'
        }
    },
    data() {
        return {
            dialogSearchFilters: {},
            dialogVisible: false,
            values: '',
            batchVal: '',
            dialogForm: {
                templateList: []
            }
        }
    },

    computed: {},
    watch: {
        productId(newVal) {
            this.batchVal = ''
        }
    },

    created() {},
    methods: {
        dialogSearch() {},
        validatorEditStocks(e, rule, value, callback) {
            console.log(e)
            console.log(rule)
            if (true) {
                callback(new Error('尾款开始时间要大于定金开始时间'))
            }
            callback()
        },
        batchAdd() {
            this.dialogForm.templateList.forEach((item, index) => {
                item.editStocks = this.batchVal
            })
        },

        //初始化数据
        initData(list) {
            return list.map((item) => {
                //operate true 增加 false 减少
                item.putStorageFlag = true
                item.editStocks = Number()
                return item
            })
        },
        initResultData(list) {
            let resultList = []
            list.forEach((item) => {
                resultList.push({
                    id: item.id,
                    editStocks: Number(item.editStocks),
                    putStorageFlag: item.putStorageFlag
                })
                //operate true 增加 false 减少
            })
            return resultList
        },
        getStocksPage(id) {
            console.log(this.type)
            console.log(id, 'id')
            if (this.type == 'sku') {
                inventoryManage.queryStocksList({ skuIdList: id.join(',') }).then((res) => {
                    if (res.code == 1) {
                        this.dialogForm.templateList = this.initData(res.data)
                    }
                })
            } else {
                inventoryManage.stocksList({ productId: id }).then((res) => {
                    if (res.code == 1) {
                        this.dialogForm.templateList = this.initData(res.data)
                    }
                })
            }
        },
        onSubmit() {
            return new Promise((resolve) => {
                inventoryManage
                    .batchUpdateSku(this.initResultData(this.dialogForm.templateList))
                    .then((res) => {
                        if (res.code == 1) {
                            this.$message.success('操作成功')
                            if (this.type == 'sku') {
                                // 为解决库存管理里面编辑库存找不到组件里面的getData()方法
                                this.$parent.$parent.getData()
                            } else {
                                this.$parent.getData()
                            }
                            this.dialogVisible = false
                        }
                    })
                    .finally((_) => {
                        resolve()
                    })
            })
        },
        showDialog() {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.getStocksPage(this.productId)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table .cell {
    color: #333;
    font-size: 12px !important;
    .el-radio__label {
        color: #333;
        font-size: 12px !important;
    }
}
</style>
