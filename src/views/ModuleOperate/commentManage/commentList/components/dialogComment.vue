<template>
    <el-dialog :title="commentType == 1 ? '回复初评' : '回复追评'" :visible.sync="dialogVisible" custom-class="dialog-form-small">
        <el-form ref="form" :model="commentContent" label-width="98px" size="small" :rules="rule" @submit.native.prevent>
            <!-- 用户初评 -->
            <div class="form-title font-14 mb-10">用户初评</div>
            <el-form-item label="评分：">
                <span class="leftStyle">综合评分：{{ commentContent.averageScore }}</span>
                <br />
                <span>
                    商品评分：
                    <el-rate disabled :value="commentContent.score" style="display: inherit" />
                </span>
                <br />
                <span>
                    店铺服务：
                    <el-rate disabled :value="commentContent.shopScore" style="display: inherit" />
                </span>
                <br />
                <span>
                    物流服务：
                    <el-rate disabled :value="commentContent.logisticsScore" style="display: inherit" />
                </span>
            </el-form-item>
            <el-form-item label="评论内容：">
                <p class="line-clamp4">{{ commentContent.content || '-' }}</p>
            </el-form-item>
            <el-form-item label="评论图片：">
                <template v-if="commentContent.photos && commentContent.photos.length">
                    <ls-image
                        v-for="(item, index) in commentContent.photos"
                        :key="index"
                        class="mr-20"
                        :src="item"
                        :options="{ w: '100', h: '100' }"
                    />
                </template>
                <template v-else>-</template>
            </el-form-item>
            <el-form-item label="评论时间：">
                <p>{{ commentContent.addTime || '-' }}</p>
            </el-form-item>
            <!-- 用户追评 -->
            <div v-if="commentType == 2" style="margin-bottom: 18px">
                <div class="form-title font-14 mb-10">用户追评</div>
                <el-form-item label="评论内容：">
                    <p class="line-clamp4">{{ commentContent.addContent || '-' }}</p>
                </el-form-item>
                <el-form-item label="评论图片：">
                    <div v-if="commentContent.addPhotos && commentContent.addPhotos.length > 0">
                        <ls-image
                            v-for="(item, index) in commentContent.addPhotos"
                            :key="index"
                            class="mr-20"
                            :src="item"
                            :options="{ w: '100', h: '100' }"
                        />
                    </div>
                    <div v-else>-</div>
                </el-form-item>
                <el-form-item label="评论时间：">
                    <p>{{ commentContent.addAddTime || '-' }}</p>
                </el-form-item>
            </div>

            <el-form-item label="回复：" prop="replyContent">
                <el-input v-model="commentContent.replyContent" placeholder="请输入" />
            </el-form-item>
            <el-form-item class="text-centent">
                <el-button @click="dialogVisible = false">取消</el-button>
                <ls-button type="primary" :async-function="() => submint('form')">确定</ls-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import { commentApi } from '@/api/ModuleOrder.js'
export default {
    props: {
        commentId: {
            type: [Number, String],
            default: ''
        },
        commentAddId: {
            type: [Number, String],
            default: ''
        },
        commentType: {
            type: [Number, String],
            default: ''
        },
        commentContent: {
            type: Object,
            default() {
                return {
                    replyContent: '' // 回复
                }
            }
        }
    },
    data() {
        return {
            dialogVisible: false, // 对话框
            // 预验证
            rule: {
                replyContent: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            }
        }
    },
    created() {},
    methods: {
        // 显示弹框
        showDialog() {
            this.dialogVisible = true
        },
        // 回复
        submint(form) {
            return new Promise((resolve) => {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (this.commentType == 1) {
                            // 回复初评
                            let content = this.commentContent.replyContent
                            commentApi
                                .postFirstComment({ id: this.commentId, content })
                                .then((res) => {
                                    if (res.code == 1) {
                                        this.$message.success('回复成功')
                                        this.dialogVisible = false
                                        this.$emit('getData')
                                    }
                                })
                                .finally((_) => {
                                    resolve()
                                })
                        } else if (this.commentType == 2) {
                            // 回复追评
                            let content = this.commentContent.replyContent
                            commentApi
                                .postReplyComment({ addId: this.commentAddId, content })
                                .then((res) => {
                                    if (res.code == 1) {
                                        this.$message.success('回复成功')
                                        this.dialogVisible = false
                                        this.$emit('getData')
                                    }
                                })
                                .finally((_) => {
                                    resolve()
                                })
                        }
                    } else {
                        resolve()
                        console.log('err')
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .text-centent {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0;
}
::v-deep .el-form {
    color: #333;
    .el-form-item__label {
        font-size: 12px;
    }
    .el-form-item__content {
        color: #333;
        font-size: 12px;
    }
}
::v-deep .el-dialog {
    border-radius: 4px;
    .el-dialog__header {
        padding: 18px 12px;
    }
    .el-dialog__title {
        font-size: 18px;
        color: #333;
    }
    .el-dialog__body {
        padding: 0 20px 20px 20px;
    }
}
</style>
