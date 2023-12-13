<template>
    <section class="formWarp h-100">
        <el-card class="h-100" shadow :body-style="{ padding: `20px 20px 0 20px` }">
            <el-form ref="form" :model="form" :rules="rules" size="small" label-position="right" autocomplete="off">
                <el-form-item label="支持订单开具发票:" label-width="150px">
                    <el-switch v-model="form.invoiceFlag" active-color="#FFA800"></el-switch>
                    <el-form-item v-if="form.invoiceFlag" prop="invoiceType">
                        <el-checkbox-group v-model="form.invoiceType" style="margin-top: 22px">
                            <el-checkbox label="NORMAL">增值税普通发票</el-checkbox>
                            <el-checkbox label="DEDICATED">增值税专用发票</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="退货地址：" prop="region" label-width="150px">
                    <InputCascader :key="regionKey" v-model="form.region" autocomplete="off" class="w-450p" />
                </el-form-item>
                <el-form-item label="退货详细地址：" prop="returnShopAddr" label-width="150px">
                    <el-input v-model="form.returnShopAddr" autocomplete="off" :maxlength="50" class="w-450p" />
                </el-form-item>
                <el-form-item label="退货联系人姓名：" prop="returnConsignee" label-width="150px">
                    <el-input v-model="form.returnConsignee" autocomplete="off" :maxlength="10" class="w-450p" />
                </el-form-item>
                <el-form-item label="退货联系人手机号码：" prop="returnConsigneePhone" label-width="150px">
                    <el-input v-model="form.returnConsigneePhone" autocomplete="off" :maxlength="11" class="w-450p" />
                </el-form-item>
            </el-form>
            <LsSticky :data="form">
                <el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <el-button size="small" type="primary" @click="saveSet('form')">保存订单设置</el-button>
                </el-row>
            </LsSticky>
        </el-card>
    </section>
</template>
<script>
import { orderSet } from '@/api/ModuleSystem'
import InputCascader from '@/components/InputCascader'
export default {
    components: {
        InputCascader
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (this.form.invoiceFlag && value == '') {
                return callback(new Error('发票类型不能为空'))
            }
            callback()
        }
        return {
            regionKey: 0,
            form: {
                invoiceFlag: false, // 是否开启发票
                invoiceType: [], // 允许开具发票类型 发票类型，NORMAL:增值税普票 DEDICATED:增值税专票
                region: [], // 退货地址
                returnShopAddr: '', // 退货详细地址
                returnConsignee: '', // 退货联系人姓名
                returnConsigneePhone: '' // 退货联系人手机号码
            },
            // 预验证
            rules: {
                invoiceType: [{ validator: validatePass, trigger: 'blur' }],
                region: [{ required: true, message: `请选择地址`, trigger: 'change' }],
                returnShopAddr: [{ required: true, message: '退货详细地址不能为空', trigger: 'blur' }],
                returnConsignee: [{ required: true, message: '退货联系人姓名不能为空', trigger: 'blur' }],
                returnConsigneePhone: [
                    { required: true, message: '退货联系人手机号码不能为空', trigger: 'blur' },
                    {
                        pattern: /^1[0-9][0-9]{9}$/,
                        message: '请输入正确的手机号',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.getPageData()
    },
    methods: {
        // 请求数据
        getPageData() {
            orderSet.orderSetting().then((res) => {
                this.form = res.data
                this.$set(this.form, 'invoiceFlag', res.data.invoiceFlag)
                if (res.data.invoiceType) {
                    this.$set(this.form, 'invoiceType', JSON.parse(res.data.invoiceType) || [])
                } else {
                    this.$set(this.form, 'invoiceType', [])
                }
                this.$set(this.form, 'region', [
                    Number(res.data.returnProvinceId),
                    Number(res.data.returnCityId),
                    Number(res.data.returnAreaId),
                    Number(res.data.returnStreetId)
                ])
                this.regionKey++
                // console.log(this.regionKey)
            })
        },
        // 保存订单设置
        saveSet(form) {
            this.form.returnProvinceId = this.form.region[0]
            this.form.returnCityId = this.form.region[1]
            this.form.returnAreaId = this.form.region[2]
            this.form.returnStreetId = this.form.region[3]
            let formData = Object.assign({}, this.form)
            formData.invoiceType = JSON.stringify(formData.invoiceType) || []
            this.$refs[form].validate((valid) => {
                if (valid) {
                    orderSet
                        .orderUpdate(formData)
                        .then((res) => {
                            this.$message.success('保存成功')
                            this.getPageData()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.line {
    text-align: center;
}
</style>
