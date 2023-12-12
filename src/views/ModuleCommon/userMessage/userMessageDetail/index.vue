<template>
    <el-card shadow>
        <div class="mt-20" style="min-height: 700px">
            <h3 class="font-24 text-333">{{ msgData.title }}</h3>
            <div class="mt-20 font-12 text-999">{{ msgData.updateTime || msgData.createTime }}</div>
            <p class="mt-50 font-14 text-666" v-html="msgData.content"></p>
        </div>
    </el-card>
</template>

<script>
import { messageApi } from '@/api/ModuleCommon'
export default {
    name: 'UserMessageDetail',
    data() {
        return {
            msgData: [] //数据
        }
    },
    created() {
        this.getMessageDetail()
    },
    methods: {
        // 获取数据
        getMessageDetail() {
            messageApi
                .getPubDetail({ pubId: this.$route.query.pubId })
                .then((res) => {
                    if (res.code == 1) {
                        console.log(res)
                        this.msgData = res.data
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
    padding: 30px;
}
</style>
