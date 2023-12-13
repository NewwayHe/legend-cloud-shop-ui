<!-- /*
 * @Descripttion:商品品牌
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="品牌名称">
                        <el-input v-model="searchFilters.brandName" placeholder="品牌名称" maxlength="200" />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" clearable filterable placeholder="请选择">
                            <el-option label="上线" :value="1" />
                            <el-option label="下线" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.opStatus" size="large" @change="getData">
                            <el-radio-button label>所有品牌</el-radio-button>
                            <el-radio-button label="0">待审核</el-radio-button>
                            <el-radio-button label="1">已通过</el-radio-button>
                            <el-radio-button label="-1">未通过</el-radio-button>
                        </el-radio-group>
                        <el-button class="ml-20" type="primary" size="medium" @click="handleCreate">新增</el-button>
                    </el-col>
                </el-row>
                <el-row class="mb-20">
                    <el-alert class="theme" :closable="false" show-icon>
                        <p>商家可向平台提交品牌申请，提交品牌申请后需要登台平台审核，审核通过后平台所有商家都可使用该品牌</p>
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
                    <el-table-column prop="brandName" label="品牌名称" />
                    <el-table-column prop="brandPic" label="品牌LOGO">
                        <template slot-scope="scope">
                            <ls-image style="flex: 0 0 50px" :src="scope.row.brandPic" :options="{ w: '50', h: '50', br: '4' }" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="bigImage" label="品牌大图">
                        <template slot-scope="scope">
                            <ls-image style="flex: 0 0 60px" :src="scope.row.bigImage" :options="{ w: '80', h: '80', br: '6' }" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="brief" label="品牌介绍" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.opStatus == 0" class="status-wait">待审核</span>
                            <span v-else-if="scope.row.opStatus == -1" class="status-veto">审核不通过</span>
                            <template v-else>
                                <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                                <span v-if="scope.row.status == 0" class="status-done">下线</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="200px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <template v-if="scope.row.opStatus == -1">
                                    <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                        编辑
                                    </el-link>
                                    <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                        删除
                                    </el-link>
                                </template>
                                <span v-else class="font">-</span>
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
        <!-- 新增-编辑 -->
        <el-dialog
            :title="dialogForm.title"
            :visible.sync="dialogForm.isVisible"
            custom-class="dialog-form-small"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="myForm"
                :inline="false"
                :model="dialogForm.formData"
                :rules="dialogForm.formRule"
                :destroy-on-close="true"
                label-position="right"
                label-width="98px"
                size="small"
            >
                <el-form-item label="品牌名称：" prop="brandName">
                    <el-input v-model="dialogForm.formData.brandName" :maxlength="50" show-word-limit placeholder="请输入" />
                </el-form-item>
                <el-form-item label="品牌LOGO：" prop="brandPic">
                    <imgCenter :key="'1'" v-model="dialogForm.formData.brandPic" @input="$refs.myForm.validateField('brandPic')"></imgCenter>
                    <span class="text-999 font ml-15 v-top">建议尺寸：200*200</span>
                </el-form-item>
                <el-form-item label="品牌大图：" prop="bigImage">
                    <imgCenter :key="'2'" v-model="dialogForm.formData.bigImage" @input="$refs.myForm.validateField('bigImage')"></imgCenter>
                    <span class="text-999 font ml-15 v-top">建议尺寸：590*350</span>
                </el-form-item>
                <el-form-item label="排序：" prop="seq">
                    <lsInput v-model="dialogForm.formData.seq" :precision="0" :min="0" :max="999999" text-align="left" />
                </el-form-item>
                <el-form-item label="品牌介绍：" prop="brief">
                    <el-input v-model="dialogForm.formData.brief" :maxlength="300" placeholder="请输入" type="textarea" autosize show-word-limit />
                </el-form-item>
                <el-form-item label="商标注册证号：" prop="trademarkingNumber">
                    <el-input v-model="dialogForm.formData.trademarkingNumber" :maxlength="30" show-word-limit placeholder="请输入" />
                </el-form-item>
                <el-form-item label="注册人：" prop="registrationPeople">
                    <el-input v-model="dialogForm.formData.registrationPeople" :maxlength="20" show-word-limit placeholder="请输入" />
                </el-form-item>
                <el-form-item label="注册地址：" prop="registrationAddess">
                    <el-input v-model="dialogForm.formData.registrationAddess" :maxlength="50" show-word-limit placeholder="请输入" />
                </el-form-item>
                <el-form-item label="商标有效期：" prop="time">
                    <el-date-picker
                        v-model="dialogForm.formData.time"
                        style="width: 100%"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :picker-options="pickerOptions"
                        @input="timeChange"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="商标注册证：" prop="registrationPic">
                    <imgCenter :key="'3'" v-model="dialogForm.formData.registrationPic"></imgCenter>
                    <span class="text-999 font ml-15 v-top">建议尺寸：590*350</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogForm.isVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.stop="debounceSubmit('myForm')">保 存</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import Upload from '@/components/Upload'
import { commodityBrand } from '@/api/ModuleGoods'

export default {
    name: 'CommodityBrand',
    components: {
        Upload
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                brandName: '',
                status: '',
                opStatus: ''
            },
            dialogForm: {
                formRule: {
                    brandName: [
                        {
                            required: true,
                            message: '请输入品牌名称',
                            trigger: 'blur'
                        }
                    ],
                    brandPic: [
                        {
                            required: true,
                            message: '请上传品牌LOGO',
                            trigger: 'change'
                        }
                    ],
                    bigImage: [
                        {
                            required: true,
                            message: '请上传品牌大图',
                            trigger: 'change'
                        }
                    ],
                    seq: [
                        {
                            required: true,
                            message: '请输入排序',
                            trigger: 'change'
                        }
                    ],
                    brief: [
                        {
                            required: true,
                            message: '请输入品牌介绍',
                            trigger: 'change'
                        }
                    ]
                }
            },
            url: {
                getData: '/product/s/brand/page',
                create: '/product/s/brand', // 新增
                update: '/product/s/brand', // 编辑
                delete: '/product/s/brand' // 删除
            },
            formData: {
                name: '',
                seq: '',
                intro: '',
                status: ''
            },
            pickerOptions: {
                disabledDate: (time) => {
                    let currentTime = new Date().getTime() - 24 * 3600 * 1000
                    return currentTime > time.getTime()
                }
            }
        }
    },
    watch: {
        'dialogForm.formData.startTime'(val) {
            if (val) {
                this.dialogForm.formData.time = [val, this.dialogForm.formData.endTime]
            }
        }
    },
    mounted() {},
    methods: {
        // 查看详情
        checkDetail(row) {
            this.$router.push({
                name: 'commodityBrandDetail',
                query: {
                    id: row.id
                }
            })
        },
        // 开始/结束时间
        timeChange(value) {
            if (!value) {
                value = []
            }
            this.dialogForm.formData.startTime = value[0] || ''
            this.dialogForm.formData.endTime = value[1] || ''
        }
    }
}
</script>
<style scoped lang="scss">
::v-deep .dialog-form-small {
    .el-form {
        .el-form-item {
            ::v-deep .el-input-number .el-input__inner {
                text-align: left;
            }
            ::v-deep .el-textarea .el-input__count {
                line-height: 1;
            }
        }
    }
}
</style>
