<!-- /*
 * @Descripttion:运费模板列表
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <div class="search">
            <el-card shadow>
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="运费模板名称">
                        <el-input v-model="searchFilters.transName" placeholder="运费模板名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-radio-group v-model="searchFilters.transQueryType" size="medium" class="mb-20" @change="changeStatus">
                    <el-radio-button label="1">按重/体积/件计算运费</el-radio-button>
                    <el-radio-button label="2">固定运费</el-radio-button>
                    <el-radio-button label="3">包邮</el-radio-button>
                </el-radio-group>
                <div class="table">
                    <el-row class="mb-20">
                        <el-button style="height: 32px" type="primary" size="small" @click="toAddFreight">新增</el-button>
                    </el-row>
                    <el-alert type="warning" show-icon>
                        <template slot="title">
                            <span class="text-333 font">
                                发布商品时如需要运费，则需要选择一个已设置好的运费模版用于计算。修改规则后，需要点击保存按钮完成保存
                            </span>
                        </template>
                    </el-alert>
                    <el-form class="mt-15" :inline="true" :model="transRule" size="small">
                        <el-form-item label="一单多品，运费规则不同时： ">
                            <el-radio-group v-model="transRule.type" size="medium">
                                <el-radio :label="1">叠加计算</el-radio>
                                <el-radio :label="2">按最高值计算</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click.stop="editTranRule">保存</el-button>
                        </el-form-item>
                    </el-form>

                    <!--列表-->
                    <freightTable
                        v-if="tableList && tableList.length"
                        :trans-query-type="searchFilters.transQueryType"
                        :table-list="tableList"
                        @delTrans="delTrans"
                    ></freightTable>
                    <empty v-else text="暂无运费模板"></empty>
                    <el-row type="flex" class="mt-20" justify="end">
                        <pagination
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </el-row>
                </div>
            </el-card>
        </div>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import freightTable from './components/freightTable.vue'
import { freightTemplate } from '@/api/ModuleSystem'
export default {
    name: 'FreightTemplate',
    components: {
        freightTable
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                transQueryType: 1
            },
            transRule: {
                //运费规则
                type: 1
            },
            url: {
                getData: '/product/s/transport/page',
                delete: '/product/s/transport/'
            },
            isShowLoading: true
        }
    },
    created() {
        // 查询不同类型的数据
        if (sessionStorage.getItem('type')) {
            this.searchFilters.transQueryType = sessionStorage.getItem('type')
            sessionStorage.removeItem('type')
        }
    },
    mounted() {
        this.getTranRule()
    },
    methods: {
        toAddFreight(row) {
            this.$router.push({
                name: 'freightAdd',
                query: {
                    id: row.id || ''
                }
            })
        },
        getTranRule() {
            freightTemplate.transRuleDet().then((res) => {
                if (res.code) {
                    this.transRule = res.data
                }
            })
        },
        editTranRule() {
            freightTemplate.transRuleEdit(this.transRule).then((res) => {
                if (res.code) {
                    this.$message.success('操作成功')
                }
            })
        },
        delTrans(item) {
            this.handleDel(item)
        },
        // 切换状态
        changeStatus() {
            this.doSearch()
        }
    }
}
</script>
