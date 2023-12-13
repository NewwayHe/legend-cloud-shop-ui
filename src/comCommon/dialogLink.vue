<template>
    <el-dialog title="查看链接" custom-class="dialog-form" width="500px" :visible.sync="dialogVisible">
        <el-row class="mb-20">
            <div class="d-flex j-sb">
                <el-link style="color: #2d8cf0" class="mr-10" type="primary" target="_blank" :underline="false" :href="url">{{ url }}</el-link>
                <el-button size="small" type="primary" style="height: 32px" @click="handleCopy(url, $event)">复制链接</el-button>
            </div>
        </el-row>
        <el-row type="flex" :justify="!showQrImg ? 'start' : 'center'" align="middle">
            <div class="d-none"><vueQr :text="url" :size="400" :callback="callback"></vueQr></div>
            <img v-if="!showQrImg && qrImg" class="cursor-zoom-in" style="width: 100px; height: 100px" :src="qrImg" alt="" @click="clickQr" />
            <img v-if="showQrImg && qrImg" class="cursor-zoom-out zoom-out0005" :src="qrImg" alt="" @click="clickQr" />
            <span v-if="!showQrImg" class="text-999 ml-10 font-12">可扫码查看，可点击鼠标右键另存为二维码图片</span>
        </el-row>
        <span slot="footer" class="dialog-footer"><el-button size="small" @click="dialogVisible = false">取 消</el-button></span>
    </el-dialog>
</template>
<script>
import config from '@/config'
import clipboard from '@/utils/clipboard' // 复制功能
import vueQr from 'vue-qr'
export default {
    components: { vueQr },
    props: {},
    data() {
        return {
            dialogVisible: false,
            config: config,
            id: '',
            qrImg: '',
            showQrImg: false,
            url: ''
        }
    },

    computed: {},
    watch: {},

    created() {},
    methods: {
        showDialog(parmas) {
            this.dialogVisible = true
            this.url = this.$shareRedirectUrl + parmas
        },
        // 复制链接
        handleCopy(text, event) {
            clipboard(text, event)
        },
        callback(img, id) {
            this.qrImg = img
        },
        clickQr() {
            this.showQrImg = !this.showQrImg
        }
    }
}
</script>

<style lang="scss" scoped></style>
