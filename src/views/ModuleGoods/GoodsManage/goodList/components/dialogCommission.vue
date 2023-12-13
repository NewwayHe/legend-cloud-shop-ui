<template>
    <div>
        <el-dialog title="编辑分佣比例" :visible.sync="isVisible" :before-close="handleClose" custom-class="dialog-form-small">
            <el-form ref="ruleForm" size="small" :model="ruleForm" :rules="rules" label-width="98px">
                <el-form-item label="分佣比例：" prop="ratio">
                    <lsInput v-model="ruleForm.ratio" :precision="2" :min="0" :max="100">
                        <template slot="append">%</template>
                    </lsInput>
                    <div class="font-12 line-h-md mt-10">分销员推广商品可获得的佣金金额 = （商品销售价 - 商品成本价） * 分佣比例；</div>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="isVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitForm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { GoodsManage } from '@/api/ModuleGoods'

export default {
    name: 'DialogCommission',
    data() {
        return {
            isVisible: false,
            rules: {
                ratio: [{ required: true, message: '请填写佣金比例', trigger: 'change' }]
            },
            ruleForm: {
                ratio: ''
            }
        }
    },
    methods: {
        showDialog(row) {
            let params = { ...row }
            this.ruleForm = { ratio: params.ratio, prodId: params.id }
            this.isVisible = true
        },
        // 点击模板时初始化数据
        handleClose() {
            this.$refs.ruleForm.resetFields()
            this.isVisible = false
        },
        submitForm() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    GoodsManage.updateRatio(this.ruleForm).then((res) => {
                        if (res.code) {
                            this.$message.success('操作成功')
                            this.isVisible = false
                            this.$emit('finish')
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style></style>
