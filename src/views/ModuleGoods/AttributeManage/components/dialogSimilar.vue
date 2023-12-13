<template>
    <el-dialog title="类似导入" :visible.sync="dialog.visible" custom-class="dialog-form-small">
        <div>
            <el-form :model="dialogForm" size="small" label-width="98px" @submit.native.prevent>
                <el-form-item label="规格标题：">
                    <el-input v-model="dialogForm.value" placeholder="请输入">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="dialogSearch" />
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table
                ref="similarTable"
                size="small"
                :data="dialogTableList"
                tooltip-effect="dark"
                class="w-100 dialog-form-table mt-15"
                header-row-class-name="headerRow"
            >
                <el-table-column prop="propName" label="规格标题" />
                <el-table-column prop="memo" label="规格副标题">
                    <template slot-scope="scope">
                        {{ scope.row.memo || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-link class="font-12 text-blue" :underline="false" type="primary" @click="chooseItem(scope.row)">选择</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row type="flex" justify="end" class="mt-10">
            <el-pagination
                small
                layout="prev, pager, next"
                :total="dialog.total"
                :page-size="dialog.pageSize"
                :current-page="dialog.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="dialog.visible = false">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'

export default {
    name: 'DialogSimilar',
    props: {
        // 请求的地址
        url: {
            type: String,
            default: '/product/s/productProperty/page',
            required: true
        },
        // 规格和参数的识别参数
        attributeType: {
            type: String,
            default: 'S',
            required: true
        }
    },
    data() {
        return {
            dialog: {
                visible: false,
                total: 0,
                pageNo: 1,
                pageSize: 5
            },
            dialogForm: {
                value: ''
            },
            dialogTableList: []
        }
    },
    mounted() {
        // this.dialogInit()
    },
    methods: {
        // 初始化数据
        dialogInit() {
            request
                .get(this.url, {
                    propName: this.dialogForm.value,
                    pageSize: this.dialog.pageSize,
                    curPage: this.dialog.pageNo,
                    attributeType: this.attributeType
                })
                .then((res) => {
                    console.log(res)
                    this.dialog.total = res?.data?.total || 0
                    this.dialogTableList = res?.data?.resultList || []
                })
                .catch((err) => {
                    console.log('dialog error', err)
                })
        },

        // 选择指定子项，传递子项row数据，由父组件控制
        chooseItem(row) {
            this.$emit('chooseItem', row)
        },

        // 打开
        dialogShow() {
            this.dialogInit()
            this.dialog.visible = true
        },

        // 关闭
        dialogClose() {
            this.dialog.visible = false
        },

        // 搜索
        dialogSearch() {
            this.dialog.pageNo = 1
            this.dialogInit()
        },

        // 上/下一页
        dialogcurrentPageChange(value) {
            console.warn(value)
            this.dialog.pageNo = value
            this.dialogInit()
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table td {
    color: #333;
}
::v-deep .el-table__header th {
    color: #333;
}
::v-deep .el-form .el-form-item {
    .el-form-item__content {
        color: #333;
    }
}
</style>
