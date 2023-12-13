<template>
    <el-dialog title="通知" width="420px" style="border-radius: 6px" :visible.sync="isVisible" @close="msgClose">
        <el-row style="padding: 20px 46px">
            <el-col class="position-relative">
                <i class="el-icon-warning"></i>
                <div class="font-12 text-333">{{ list.title }}</div>
            </el-col>
            <el-col>
                <div class="font-12 text-999 mt-15">{{ list.recDate }}</div>
            </el-col>
            <el-col>
                <div class="font-12 text-666 mt-20 line-clamp2">{{ list.content }}</div>
            </el-col>
            <el-col class="mt-10">
                <!-- 1:商品 2：订单 3:售后 0：其他 -->
                <div v-if="list.type == 1" class="d-flex mt-20">
                    <ls-image :key="list.pic" class="flex-shrink" :src="list.pic" :options="{ w: '80', h: '80' }" />
                    <div style="margin-left: 18px">
                        <div>
                            <p class="line-clamp2 font-12 text-333" style="line-height: 22px">
                                {{ list.productName }}
                            </p>
                        </div>
                        <el-link style="color: #006dc7" :underline="false" class="font-12 mt-10" @click="goPage(list.detailId, list.type)">
                            去查看&nbsp;&gt;&gt;
                        </el-link>
                    </div>
                </div>
                <el-link v-if="list.type == 2" style="color: #006dc7" :underline="false" class="font-12" @click="goPage(list.detailId, list.type)">
                    去查看&nbsp;&gt;&gt;
                </el-link>
                <el-link v-if="list.type == 3" style="color: #006dc7" :underline="false" class="font-12" @click="goPage(list.detailId, list.type)">
                    去查看&nbsp;&gt;&gt;
                </el-link>
            </el-col>
        </el-row>
        <span slot="footer">
            <el-button size="small" @click="isVisible = false">关闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { messageApi } from '@/api/ModuleCommon.js'
export default {
    name: 'DialogMessage',
    props: {
        msgId: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            isVisible: false,
            list: {}
        }
    },
    methods: {
        // 弹框开关
        showDialog() {
            this.isVisible = true
            this.$nextTick(() => {
                this.getData()
            })
        },
        // 关闭弹框时的回调
        msgClose() {
            this.$emit('closeMsg')
        },
        // 跳转页面
        goPage(id, MsgType) {
            //1:商品 2：订单 3:售后 0：其他
            if (MsgType === 0) {
                this.$router.push({ name: 'marketing' })
            }
            if (MsgType == 1) {
                this.isVisible = false
                this.$router.push({ name: 'goodList' })
            }
            if (MsgType == 2) {
                this.isVisible = false
                this.$router.push({ name: 'orderDetail', query: { DetailId: id } })
            }
            if (MsgType == 3) {
                this.isVisible = false
                this.$router.push({ name: 'refuseDetail', query: { id: id } })
            }
            console.log(id, MsgType)
        },
        // 获取数据
        getData() {
            messageApi.getMsgDetail({ msgId: this.msgId }).then((res) => {
                if (res.code == 1) {
                    this.list = res.data
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
    border-radius: 6px;
    .el-dialog__body {
        padding: 0;
    }
}
.el-icon-warning {
    position: absolute;
    color: orange;
    top: -5px;
    left: -25px;
    font-size: 20px;
}
</style>
