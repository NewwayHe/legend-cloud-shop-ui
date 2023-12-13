<!-- /*
 * @Descripttion:商品举报
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.productName" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item label="举报类型">
                        <el-select v-model="searchFilters.typeId" clearable placeholder="请选择">
                            <el-option v-for="(item, index) in reporeList" :key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="举报日期">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy/MM/dd HH:mm:ss"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" clearable placeholder="请选择">
                            <el-option label="未处理" :value="0" />
                            <el-option label="已处理" :value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="处理结果">
                        <el-select v-model="searchFilters.result" clearable placeholder="请选择">
                            <el-option label="无效举报" :value="-1" />
                            <el-option label="有效举报" :value="1" />
                            <el-option label="恶意举报" :value="-2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-20">
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
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
                >
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="pic" label="商品主图" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.productName">
                                    <template slot="reference">
                                        <el-link
                                            class="ml-10 text-blue goodPic"
                                            :underline="false"
                                            type="primary"
                                            @click="proPreview(scope.row.productId)"
                                        >
                                            <span class="line-clamp2">{{ scope.row.productName }}</span>
                                        </el-link>
                                    </template>
                                    <div>{{ scope.row.productName }}</div>
                                    <el-link
                                        class="text-blue"
                                        :underline="false"
                                        target="_blank"
                                        :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                                    >
                                        {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.id }}
                                    </el-link>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickName" label="用户名">
                        <template slot-scope="scope">{{ scope.row.nickName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="typeName" label="举报类型">
                        <template slot-scope="scope">{{ scope.row.typeName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="content" label="举报内容">
                        <template slot-scope="scope">{{ scope.row.content || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="举报日期" width="140">
                        <template slot-scope="scope">{{ scope.row.createTime || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="userDelStatus" label="状态">
                        <template slot-scope="scope">
                            <span :class="[scope.row.status == 0 ? 'status-wait' : 'status-done']">
                                {{ scope.row.status == 0 ? '未处理' : '已处理' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="result" label="处理结果">
                        <template slot-scope="scope">
                            {{
                                scope.row.result == 1
                                    ? '有效举报'
                                    : scope.row.result == -1
                                    ? '无效举报'
                                    : scope.row.status == 0
                                    ? ' - '
                                    : ' 恶意举报 '
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="180px">
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click="lookDetail(scope.row.id)">查看</el-link>
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
        </el-card>
        <!-- 查看 -->
        <el-dialog title="查看" custom-class="dialog-form-small" width="420px" :visible.sync="isVisible">
            <el-form ref="myForm" label-width="95px" label-position="right" size="small">
                <el-form-item label="产品名称:">
                    {{ accusationDetail.productName }}
                </el-form-item>
                <el-form-item label="举报类型:">
                    {{ accusationDetail.typeName }}
                </el-form-item>
                <el-form-item label="举报人ID:">
                    {{ accusationDetail.id }}
                </el-form-item>
                <el-form-item label="举报人用户名:">
                    {{ accusationDetail.nickName }}
                </el-form-item>
                <el-form-item label="创建日期:">
                    {{ accusationDetail.createTime }}
                </el-form-item>
                <el-form-item label="照片凭证：">
                    <div v-if="accusationDetail.picList && accusationDetail.picList.length" class="flex-start flex-wrap">
                        <ls-image
                            v-for="pic in accusationDetail.picList"
                            :key="pic"
                            :src="pic"
                            :options="{ w: '100', h: '100', br: '6' }"
                            class-name="mr-5 mb-5"
                            style="vertical-align: middle"
                        />
                    </div>
                    <span v-else>-</span>
                </el-form-item>
                <el-form-item label="举报内容:">
                    {{ accusationDetail.content }}
                </el-form-item>
                <el-form-item label="处理状态:">
                    <span v-if="accusationDetail.status != 0" class="status-pass">已处理</span>
                    <span v-else class="status-done">未处理</span>
                </el-form-item>
                <template v-if="accusationDetail.status != 0">
                    <el-form-item label="处理结果:">
                        {{ accusationDetail.result == 1 ? '有效举报' : accusationDetail.result == -1 ? '无效举报' : '恶意举报' }}
                    </el-form-item>
                    <el-form-item label="处理操作:">
                        <span v-if="accusationDetail.illegalOff == 0">不处理</span>
                        <span v-else-if="accusationDetail.illegalOff == 1">商品下架</span>
                        <span v-else-if="accusationDetail.illegalOff == 2">违规锁定</span>
                        <span v-else>-</span>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="isVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
        <dialogPreview ref="dialogPreview" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import setting from '@/settings'
import { report } from '@/api/ModuleGoods'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'

export default {
    name: 'Report',
    components: { dialogPreview },
    mixins: [common],
    data() {
        return {
            isVisible: false,
            date: '',
            reporeList: [], // 举报类型
            reporeType: {}, //活动类型对应的id
            accusationDetail: {},
            url: {
                getData: '/product/s/accusation/page'
            }
        }
    },
    mounted() {
        this.getAccusationType()
    },
    methods: {
        //预览
        proPreview(id) {
            this.$refs.dialogPreview.showDialog({ id: id })
        },
        // 改变日期
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'begDate', this.date[0])
                this.$set(this.searchFilters, 'endDate', this.date[1])
            } else {
                this.$set(this.searchFilters, 'begDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        },
        // 查看详情
        lookDetail(id) {
            this.isVisible = true
            report.accusationDetail(id).then((res) => {
                if (res.code == 1) {
                    this.accusationDetail = res.data || []
                }
            })
        },
        //获取举报类型
        getAccusationType() {
            report.getAccusationTypeAll().then((res) => {
                if (res.code == 1) {
                    this.reporeList = res.data
                    res.data.forEach((item) => {
                        this.reporeType[item.id] = item.name
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form .el-form-item {
    .el-form-item__content {
        color: #333;
        font-size: 12px;
    }
}
</style>
