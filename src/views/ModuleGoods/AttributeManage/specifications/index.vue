<!-- /*
 * @Descripttion:规格管理
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="规格标题">
                        <el-input v-model="searchFilters.propName" placeholder="规格标题" clearable />
                    </el-form-item>
                    <el-form-item label="规格副标题">
                        <el-input v-model="searchFilters.memo" placeholder="规格副标题" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch(['attributeType'])">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20 font-0">
                    <el-button type="primary" size="medium" @click="toAdd">新增</el-button>
                    <el-button v-show="showSimilar" type="primary" size="medium" @click="showSimilarDialog">类似导入</el-button>
                </el-row>
                <el-row v-show="showSimilar" class="mb-20">
                    <el-alert class="theme" :closable="false" show-icon>
                        <p>规格：用于区别一款商品多种规格（例：颜色、尺寸、型号等），发布商品时可对规格组合搭配设置不同的价格</p>
                        <p>类似导入：选择已有的规格，并新增一个规则，自动填充选择的规格信息</p>
                    </el-alert>
                </el-row>

                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="propName" label="规格标题">
                        <template slot-scope="scope">{{ scope.row.propName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="memo" label="规格副标题">
                        <template slot-scope="scope">{{ scope.row.memo || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="prodPropStr" label="规格值" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.prodPropStr || '-' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" fixed="right" width="250px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">编辑</el-link>
                                <el-link
                                    v-if="!scope.deleteFlag"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleDel(scope.row, scope.column, scope.$index)"
                                >
                                    删除
                                </el-link>
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

            <dialog-similar ref="similarDialog" url="/product/s/productProperty/page" attribute-type="S" @chooseItem="exportSimilar" />
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { specifications } from '@/api/ModuleGoods'
import DialogSimilar from '../components/dialogSimilar'
import Step from '../components/Step'

export default {
    name: 'Specifications',
    components: {
        DialogSimilar,
        Step
    },
    mixins: [common, cud],
    data() {
        return {
            classifyOption: [
                {
                    key: 'TXT',
                    value: '文本'
                },
                {
                    key: 'PIC',
                    value: '图文'
                }
            ],
            showSimilar: true, // 是否显示类似导入按钮
            searchFilters: {
                attributeType: 'S',
                propName: '',
                type: ''
            },
            url: {
                getData: '/product/s/productProperty/page',
                delete: '/product/s/productProperty' // 删除
            },
            chooseItem: ''
        }
    },
    watch: {
        tableList() {
            if (this.tableList.length === 0) {
                this.showSimilar = false
            } else {
                this.showSimilar = true
            }
        }
    },
    mounted() {},
    methods: {
        // 类似导入Dialog
        showSimilarDialog() {
            this.$refs.similarDialog.dialogShow()
        },

        // 显示关联分组参数Dialog
        showGroupDialog(row) {
            this.chooseItem = row.id
            this.$refs.groupDialog.dialogShow()
        },

        // 保存关联参数分组
        saveRelatedGroup(selectedRow) {
            console.log('选择保存的关联组', selectedRow)
            specifications
                .specificationAgg({
                    aggIdlist: selectedRow.reduce((item, next) => {
                        item.push(next.id)
                        return item
                    }, []),
                    propId: this.chooseItem
                })
                .then((res) => {
                    console.log(res)
                    this.$refs.groupDialog.dialogClose()
                    this.$message.success('关联成功')
                    this.getData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 新增
        toAdd() {
            this.$router.push({
                path: '/ModuleGoods/attributeManage/speOperate',
                query: {
                    type: 'add'
                }
            })
        },

        // 编辑
        toEdit(row) {
            this.$router.push({
                path: '/ModuleGoods/attributeManage/speOperate',
                query: {
                    id: row.id,
                    type: 'edit'
                }
            })
        },

        // 类似导入
        exportSimilar(row) {
            console.log('test', row)
            this.$refs.similarDialog.dialogClose()
            this.$router.push({
                path: '/ModuleGoods/attributeManage/speOperate',
                query: {
                    id: row.id,
                    type: 'similar'
                }
            })
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
