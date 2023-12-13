<template>
    <!-- 规格模板 -->
    <el-dialog title="批量编辑" custom-class="dialog-form-large" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-row class="mb-15">
            <el-checkbox-group v-model="checkList">
                <el-checkbox
                    v-for="(val, index) in arr"
                    :key="index"
                    :label="val.title"
                    :disabled="checkList.length == 1 && checkList[0] == val.title"
                ></el-checkbox>
            </el-checkbox-group>
        </el-row>
        <el-row type="flex" class="my-15">
            <el-button v-if="!isBatch" type="primary" plain size="small" @click="isBatch = true">批量设置</el-button>
            <template v-if="isBatch">
                <el-button type="primary" plain size="small" @click="isBatch = false">取消</el-button>
                <el-button type="primary" plain size="small" @click="sureBatch">确定</el-button>
            </template>
        </el-row>
        <el-form ref="formTable" :model="{ list }" label-width="0" size="small" @submit.native.prevent>
            <el-table
                ref="multipleTable"
                class="table-form"
                tooltip-effect="dark"
                size="mini"
                row-key="id"
                border
                :cell-style="{ background: '#fff' }"
                :row-style="{ height: '65px' }"
                :data="list"
                max-height="485"
                header-row-class-name="headerRow"
            >
                <el-table-column key="index" type="index" align="center" width="40">
                    <template slot-scope="scope">
                        <i
                            class="el-icon-remove text-ccc"
                            :class="list.length == 1 ? 'cursor-not-allowed' : 'main-hover'"
                            style="font-size: 16px"
                            @click="delItem(scope.$index)"
                        ></i>
                    </template>
                </el-table-column>

                <el-table-column v-for="item in columnData" :key="item.field" align="center" :min-width="item.minWidth">
                    <template slot="header" slot-scope="scope">
                        <el-row type="flex" align="middle" justify="center">
                            <div class="flex-shrink mr-3 ml-3">{{ item.title }}</div>
                        </el-row>
                        <!-- 以下这个为新增功能(批量设置) -->
                        <el-row v-if="isBatch" class="" type="flex" align="middle" justify="center">
                            <el-input
                                v-if="item.field == 'name' || item.field == 'brief'"
                                v-model.trim="batchData[item.field]"
                                class="textarea-item"
                                type="textarea"
                                :maxlength="item.field == 'brief' ? 500 : 60"
                                show-word-limit
                                placeholder="请输入"
                            />
                            <el-checkbox-group v-if="item.field == 'deliveryType'" v-model="batchData[item.field]" class="line-h-md">
                                <el-checkbox
                                    v-for="deliveryType in deliveryTypes"
                                    :key="deliveryType.value"
                                    class="mr-0 d-block"
                                    :label="deliveryType.value"
                                    :disabled="deliveryType.disabled"
                                >
                                    {{ deliveryType.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-select v-if="item.field == 'transId'" v-model="batchData[item.field]" filterable placeholder="请选择">
                                <el-option v-for="item in templateList" :key="item.id" :label="item.transName" :value="item.id"></el-option>
                            </el-select>
                            <el-input
                                v-if="item.field == 'stocksArm'"
                                v-model.trim="batchData[item.field]"
                                class="stocksArm"
                                :maxlength="6"
                                show-word-limit
                                type="number"
                                :oninput="item.oninput"
                            />
                            <div v-if="item.field == 'stockCounting'" class="">
                                <el-radio v-model="batchData[item.field]" class="mr-0 d-block mt-5" :label="false">拍下减库存</el-radio>
                                <el-radio v-model="batchData[item.field]" class="mr-0 d-block mt-5" :label="true">付款减库存</el-radio>
                            </div>
                        </el-row>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :key="scope.row.id">
                            <el-input
                                v-if="item.field == 'name' || item.field == 'brief'"
                                v-model.trim="scope.row[item.field]"
                                class="textarea-item"
                                type="textarea"
                                :maxlength="item.field == 'brief' ? 500 : 60"
                                show-word-limit
                                placeholder="请输入"
                            />
                            <el-checkbox-group v-if="item.field == 'deliveryType'" v-model="scope.row[item.field]" class="line-h-md">
                                <el-checkbox
                                    v-for="deliveryType in deliveryTypes"
                                    :key="deliveryType.value"
                                    class="mr-0 d-block"
                                    :label="deliveryType.value"
                                    :disabled="deliveryType.disabled"
                                >
                                    {{ deliveryType.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-select v-if="item.field == 'transId'" v-model="scope.row[item.field]" filterable placeholder="请选择">
                                <el-option v-for="item in templateList" :key="item.id" :label="item.transName" :value="item.id"></el-option>
                            </el-select>
                            <el-input
                                v-if="item.field == 'stocksArm'"
                                v-model.trim="scope.row[item.field]"
                                class="stocksArm"
                                :maxlength="6"
                                type="number"
                                :oninput="$inputInteger"
                            />
                            <div v-if="item.field == 'stockCounting'" class="">
                                <el-radio v-model="scope.row[item.field]" class="mr-0 d-block" :label="false">拍下减库存</el-radio>
                                <el-radio v-model="scope.row[item.field]" class="mr-0 d-block mt-10" :label="true">付款减库存</el-radio>
                            </div>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <ls-button size="small" type="primary" :async-function="onSubmit">保 存</ls-button>
        </span>
    </el-dialog>
</template>
<script>
import { transportManage, GoodsManage } from '@/api/ModuleGoods'
export default {
    props: {},
    data() {
        return {
            checkList: ['商品名称', '商品卖点', '配送方式', '运费模板', '库存预警值', '库存计数'],
            arr: [
                { field: 'name', title: '商品名称', minWidth: 180 },
                { field: 'brief', title: '商品卖点', minWidth: 170 },
                { field: 'deliveryType', title: '配送方式', minWidth: 90 },
                { field: 'transId', title: '运费模板', minWidth: 120 },
                { field: 'stocksArm', title: '库存预警值', minWidth: 65 },
                { field: 'stockCounting', title: '库存计数', minWidth: 90 }
            ],
            deliveryTypes: [
                //配送方式复选框
                { label: '快递配送', value: 0, disabled: true }
                // { label: '到店自提', value: 10, disabled: false }
                // { label: '二者', value: 20 },
            ],
            dialogVisible: false,
            isBatch: false,
            // 批量数据
            batchData: {
                name: '',
                deliveryType: [0, 10],
                transId: '',
                stocksArm: '',
                brief: '',
                stockCounting: ''
            },
            list: [],
            templateList: []
        }
    },

    computed: {
        //固定列数据
        columnData() {
            return this.arr.filter((item) => {
                return this.checkList.includes(item.title)
            })
        }
    },
    watch: {},

    created() {},
    methods: {
        showDialog(list) {
            this.list = this.$utils.object.deepClone(list).map((item) => {
                return { ...item, deliveryType: item.deliveryType == 20 ? [0, 10] : [item.deliveryType] }
            })
            this.batchData.deliveryType = this.list[0].deliveryType
            this.dialogVisible = true
            this.$nextTick(() => {
                if (this.$utils.test.isEmpty(this.templateList)) {
                    this.getTemplateList()
                }
            })
        },

        getTemplateList() {
            transportManage.transportChoose({ pageSize: 9999 }).then((res) => {
                if (res.code) {
                    this.templateList = res?.data?.resultList || []
                }
            })
        },

        sureBatch() {
            this.isBatch = false
            for (let key in this.batchData) {
                this.list.forEach((item, index) => {
                    if (this.batchData[key]) {
                        item[key] = this.batchData[key]
                    }
                })
            }
        },

        delItem(index) {
            if (this.list.length != 1) {
                this.list.splice(index, 1)
            }
        },

        onSubmit() {
            return new Promise((resolve) => {
                this.list = this.list.map((item) => {
                    return { ...item, deliveryType: item.deliveryType.length > 1 ? 20 : item.deliveryType[0] }
                })
                console.log('parmas~~', this.list)
                GoodsManage.updateProductList({ productDTOList: this.list })
                    .then((res) => {
                        if (res.code == 1) {
                            this.$message.success('操作成功')
                            this.$parent.getData()
                            this.dialogVisible = false
                        }
                    })
                    .finally((_) => {
                        this.$parent.getData()
                        resolve()
                    })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .textarea-item {
    .el-textarea__inner {
        height: 42px !important;
    }
}
::v-deep .stocksArm {
    .el-input__inner {
        padding-right: 0 !important;
        padding-left: 5px !important;
    }
}
</style>
