<!-- /*
 * @Descripttion:支付配置
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{ padding: `20px 20px 0 20px` }">
            <el-form ref="form" v-loading="isLoading" :model="resData" label-width="135px" size="small">
                <el-form-item label="客服设置：">
                    <el-switch v-model="resData.openFlag"></el-switch>
                    <span class="ml-20 text-999">设置客服后用户可以在商品详情页或店铺首页展示店铺客服</span>
                </el-form-item>
                <template v-if="resData.openFlag">
                    <el-form-item
                        label="微信二维码："
                        prop="wvCode"
                        :rules="[{ required: true, message: '请上传微信二维码图片', trigger: 'change' }]"
                    >
                        <div class="flex-start" style="align-items: flex-start">
                            <imgCenter
                                v-model="resData.wvCode"
                                is-preview
                                :upload-style="{ width: '120px', height: '120px', marginRight: '10px' }"
                                @input="$refs.form ? $refs.form.validate() : ''"
                            ></imgCenter>
                        </div>
                    </el-form-item>
                    <el-form-item label="微信号：" prop="wxNumber" :rules="[{ required: true, message: '请输入微信号', trigger: 'blur' }]">
                        <el-input v-model="resData.wxNumber" class="w-450p" maxlength="50" />
                    </el-form-item>
                    <el-form-item label="客服电话：">
                        <el-input v-model="resData.contactPhone" class="w-450p" maxlength="15" />
                    </el-form-item>
                </template>
            </el-form>
            <LsSticky :data="resData">
                <el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <el-button v-ls-loading type="primary" size="small" @click="onSubmit">保存</el-button>
                </el-row>
            </LsSticky>
        </el-card>
    </section>
</template>

<script>
import { storeManage } from '@/api/ModuleCommon'
export default {
    name: 'ContactSet',
    components: {},
    data() {
        return {
            resData: {
                openFlag: false,
                wvCode: '',
                wxNumber: '',
                contactPhone: ''
            },
            isLoading: true
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.isLoading = true
            storeManage
                .contactInformationGet()
                .then((res) => {
                    if (res.code && res.data) {
                        this.resData = res.data
                    }
                })
                .finally(() => {
                    this.isLoading = false
                })
        },
        // 提交
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    storeManage.contactInformationSave(this.resData).then((res) => {
                        if (res.code) {
                            this.$message.success('编辑成功')
                            this.getData()
                        }
                    })
                }
            })
        }
    }
}
</script>
