<template>
    <el-dialog
        title="设置权重"
        custom-class="dialog-form"
        width="420px"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="text-main font-12">
            <p class="line-h-lg">权重越大越靠前显示，权重区间 [1 , 100000]；</p>
            <p class="line-h-lg">若设置的权重相同，则按照活动的发布时间由近至远显示；</p>
        </div>
        <el-form ref="myForm" class="mt-30" :model="formData" :rules="formRule" label-width="80px" size="small">
            <el-form-item label="权重：" prop="seq">
				<lsInput class="w-200p" v-model="formData.seq" :precision="0" :min="1" :max="100000"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click.stop="cancel">取 消</el-button>
            <ls-button type="primary" size="small" :asyncFunction="sumbit">确 定</ls-button>
        </div>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request.js'
export default {
    name: 'DialogWeight',
    props: {
        url: {
            type: String,
            required: true
        },
        weight: {
            type: [String, Number],
            default: ''
        },
        id: {
            type: [String, Number],
            default: ''
        },
    },
    data() {
        var weightValidate = (rule, value, callback) => {
            if (value === undefined) {
                callback(new Error('请填写权重值'))
            } else {
                if (value < 1 || value > 100000) {
                    callback(new Error('请输入正确的权重值'))
                }
                callback()
            }
        }
        return {
            dialogVisible: false,
            formData: {
                seq: 1 // 权重
            },
            // 预验证
            formRule: {
                seq: [
                    {
                        validator: weightValidate,
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    watch: {
        // 监听权重
        weight(newVal) {
            this.formData.seq = newVal
        }
    },
    methods: {
        // 打开
        showDialog() {
            this.dialogVisible = true
        },
        // 关闭
        handleClose() {
            this.$refs.myForm.resetFields()
        },
        // 提交
        sumbit() {
            return new Promise(resolve=>{
                this.$refs['myForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确定覆盖原有数据？', '消息确认', {
                            confirmButtonText: '确认覆盖',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                            .then(async () => {
                                await request
                                    .put(this.url + '/' + this.id + `?seq=${this.formData.seq}`)
                                    .then((res) => {
                                        if (res.code) {
                                            this.$message.success('操作成功')
                                            this.dialogVisible = false
                                            this.$emit('finish')
                                        }
                                    })
                                    .catch((err) => {
                                        this.$message.error(err.msg)
                                    })
                                    .finally(_=>{
                                        resolve()
                                    })
                            })
                            .catch(() => {})
                            .finally(_=>{
                                resolve()
                            })
                            
                    }else{
                        resolve()
                    }
                })
            })
            
        },
        // 取消
        cancel() {
            this.$confirm('确定不保存已编辑内容？', '消息确认', {
                confirmButtonText: '继续编辑',
                cancelButtonText: '直接返回',
                type: 'warning'
            })
                .then(() => {})
                .catch(() => {
                    this.dialogVisible = false
                    this.$refs.myForm.resetFields()
                })
        }
    }
}
</script>

<style lang="scss" scoped>
// 当input框启用show-word-limit时,防止.el-form-item__content元素的 line-height: 40px;对.el-input__count元素的line-height进行样式污染
::v-deep .el-textarea {
    .el-input__count {
        line-height: normal !important;
    }
}
</style>
