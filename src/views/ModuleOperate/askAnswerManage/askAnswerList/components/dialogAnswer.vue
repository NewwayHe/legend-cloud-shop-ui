<template>
    <div>
        <el-dialog :visible.sync="isVisible" width="700px" custom-class="dialog-form" @close="handleClose">
            <span slot="title" class="font-weight-600 font-18">回复</span>
            <el-form ref="myForm" :model="data" :rules="rules" label-width="95px" label-position="right" size="small" @submit.native.prevent>
                <div class="font-14 my-10">商品信息：</div>
                <div class="d-flex a-center">
                    <ls-image style="flex: 0 0 50px" :src="data.pic" :options="{ w: '50', h: '50', br: '6' }" />
                    <el-popover placement="top-start" width="500" trigger="hover" :content="data.productName">
                        <div slot="reference" class="ml-10 line-clamp2 text-blue">{{ data.productName }}</div>
                    </el-popover>
                </div>
                <div class="font-14 my-10">咨询信息：</div>
                <el-form-item label="咨询内容：">{{ data.content || '-' }}</el-form-item>
                <el-form-item label="咨询用户：">
                    <div>{{ data.askUserName || '-' }}</div>
                    <div>{{ data.askUserIphone || '-' }}</div>
                </el-form-item>
                <el-form-item label="咨询时间：">{{ data.recDate || '-' }}</el-form-item>
                <div class="font-14 my-10">回复信息：</div>
                <el-form-item label="回复：" prop="answerContent" :rules="rules.answerContent">
                    <el-input
                        v-model="answerContent"
                        show-word-limit
                        :rows="3"
                        type="textarea"
                        clearable
                        placeholder="支持数字、中英文、空格、括号字符，最多50个字符长度"
                        maxlength="50"
                    />
                </el-form-item>
                <div class="font-14 my-10">其他信息：</div>
                <el-form-item label="状态：">
                    <span>{{ data.status == 1 ? '上线' : '下线' }}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="isVisible = false">取消</el-button>
                <ls-button type="primary" size="small" :async-function="answer">确定</ls-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { askAnswerApi } from '@/api/ModuleOrder.js'
import { debounce } from '@/utils/utils.js'
export default {
    props: {
        // 数据
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        let contentValidate = (rule, value, callback) => {
            if (!this.answerContent) {
                callback(new Error('请输入回复内容'))
            }
            callback()
        }
        return {
            isVisible: false,
            answerContent: '',
            rules: {
                answerContent: [
                    {
                        validator: contentValidate,
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    watch: {},
    methods: {
        showDialog() {
            this.isVisible = true
        },
        handleClose() {
            this.$set(this, 'answerContent', '')
        },
        // 回复
        answer() {
            return new Promise((resolve) => {
                this.$refs.myForm.validate((valid) => {
                    if (valid) {
                        askAnswerApi
                            .consultReply({ id: this.data.id, content: this.answerContent })
                            .then((res) => {
                                if (res.code == 1) {
                                    this.$message.success('回复成功')
                                    this.isVisible = false
                                    this.$emit('finish')
                                }
                            })
                            .finally((_) => {
                                resolve()
                            })
                    } else {
                        resolve()
                    }
                })
            })
        }
    }
}
</script>

<style></style>
