<template>
    <div>
        <el-dialog title="审核" width="420px" :visible.sync="isVisible" :before-close="handleClose">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" @submit.native.prevent>
                <el-form-item label="审核结果" prop="status">
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio label="1">通过</el-radio>
                        <el-radio label="-1">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="审核意见"
                    prop="content"
                    :rules="{
                        required: ruleForm.status == '1' ? false : true,
                        message: '请填写审核意见(50字条以内)',
                        trigger: 'blur'
                    }"
                >
                    <el-input v-model="ruleForm.content" show-word-limit type="textarea" maxlength="50" />
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
import { request } from '@/utils/request.js'

export default {
    name: 'DialogAudit',
    props: {
        url: {
            type: String,
            required: true
        },
        id: {
            type: [String, Array],
            required: true
        },
        userParams: {
            type: Object,
            default() {
                return {
                    ids: 'ids',
                    status: 'status',
                    content: 'auditOpinion'
                }
            }
        }
    },
    data() {
        return {
            isVisible: false,
            rules: {
                status: [{ required: true, message: '请选择审核结果', trigger: 'change' }]
            },
            ruleForm: {
                status: '1',
                content: ''
            }
        }
    },
    methods: {
        showDialog() {
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
                    request
                        .put(this.url, {
                            [this.userParams['ids']]: this.id,
                            [this.userParams['status']]: Number(this.ruleForm.status),
                            [this.userParams['content']]: this.ruleForm.content
                        })
                        .then((res) => {
                            if (res.code) {
                                this.$message.success('操作成功')
                                this.isVisible = false
                                this.$emit('finish')
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                            this.$message.error(err.msg)
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
