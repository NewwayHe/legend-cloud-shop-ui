<template>
    <div>
        <el-dialog :visible.sync="isVisible" width="500px" custom-class="dialog-form">
            <span slot="title" class="font-18 font-weight-600">查看</span>
            <el-form ref="myForm" :model="data" label-width="72px" label-position="right" size="small">
                <div class="font-14 mb-20">商品信息</div>
                <div class="d-flex a-center">
                    <ls-image style="flex: 0 0 50px" :src="data.pic" :options="{ w: '50', h: '50', br: '6' }" />
                    <el-popover placement="top-start" width="500" trigger="hover" :content="data.productName">
                        <div slot="reference" class="ml-10 line-clamp2 text-blue">{{ data.productName }}</div>
                    </el-popover>
                </div>
                <div class="font-14 my-10">咨询信息</div>
                <el-form-item label="咨询内容：">{{ data.content || '-' }}</el-form-item>
                <el-form-item label="咨询用户：">
                    <span>{{ data.askUserName || '-' }}</span>
                    <span class="ml-10">{{ data.askUserIphone || '-' }}</span>
                </el-form-item>
                <el-form-item label="咨询时间：">{{ data.recDate || '-' }}</el-form-item>
                <div class="font-14 my-10">回复信息</div>
                <el-form-item label="回复状态：">{{ data.replySts == 1 ? '已回复' : '未回复' }}</el-form-item>
                <el-form-item label="回复内容：">{{ data.replySts == 1 ? data.answer : '-' }}</el-form-item>
                <el-form-item label="回复时间：">{{ data.replySts == 1 ? data.answerTime : '-' }}</el-form-item>
                <el-form-item label="回复账号：">{{ data.replySts == 1 ? data.replyName : '-' }}</el-form-item>
                <div class="font-14 my-10">其他信息</div>
                <el-form-item label="状态：">
                    <span>{{ data.status == 1 ? '上线' : '下线' }}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="isVisible = false">取消</el-button>
                <ls-button v-if="data.replySts == 0" type="primary" size="small" :async-function="answer">回复</ls-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { askAnswerApi } from '@/api/ModuleOrder.js'
export default {
    props: {
        // 数据
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isVisible: false
        }
    },
    watch: {},
    methods: {
        showDialog() {
            this.isVisible = true
        },
        // 回复
        answer() {
            return new Promise((resolve) => {
                this.$emit('answer')
                this.$nextTick(() => {
                    this.isVisible = false
                })
                resolve()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep.el-form-item .el-form-item__label,
.el-form-item__content {
    // background: red;
    color: #999;
}
::v-deep.el-form-item {
    margin-bottom: 0px;
}
</style>
