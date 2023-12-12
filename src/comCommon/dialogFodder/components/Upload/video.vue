<template>
    <div class="d-inline-block">
        <div class="lsUpload">
            <el-upload
                :headers="headers"
                name="files"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-progress="onProgress"
                :data="{ uploadType: 0 }"
                :action="$config.server + '/v1/common/uploadFile'"
                :on-error="handleError"
                style="margin-left: 5px"
                accept=".mp4, .mov, .m4v, .flv, .x-flv, .mkv, .wmv, .avi, .rmvb, .3gp"
            >
                <div>
                    <template v-if="!tempUrl">
                        <el-button type="primary" :loading="loading" style="position: relative">
                            上传视频
                            <i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </template>
                </div>
            </el-upload>
            <div v-show="tempUrl" id="newPlayer" ref="newPlayer"></div>
            <i v-if="tempUrl" class="lsUpload__vedioClose el-icon-error" @click="delVideo" />
        </div>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Player from 'xgplayer'
export default {
    components: {},
    props: {
        value: {
            type: [String, Array]
        },
        onSuccess: {
            type: Function,
            default: function () {}
        },
        onError: {
            type: Function,
            default: function () {}
        },
        uploadStyle: {
            type: [String, Object],
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            tempUrl: typeof this.value == 'object' ? [] : '',
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        }
    },
    computed: {
        imageUrl() {
            return this.value
        }
    },
    watch: {
        tempUrl(newVal) {
            this.playerInit(newVal)
            this.$emit('input', newVal)
        },
        value: {
            immediate: true,
            handler(newVal) {
                this.tempUrl = newVal
            }
        }
    },
    mounted() {},
    methods: {
        //上传时
        onProgress() {
            this.loading = true
        },
        // 播放器初始化
        playerInit(url) {
            if (this.player) {
                this.player.destroy()
            }
            this.player = new Player({
                id: 'newPlayer',
                url: this.$photoServer + url,
                width: 500,
                height: 300,
                autoplay: false, //自动播放
                playsinline: false,
                fullscreen: false
            })
        },
        // 导出
        handleSuccess(res, file, fileList) {
            if (res.status === 1) {
                this.loading = false
                this.tempUrl = res.result[0]
                this.$message.success('加载成功')
                this.onSuccess(res, file, fileList)
            } else {
                this.loading = false
                this.$message.error('加载失败')
            }
        },
        beforeUpload() {},
        handleError(err, file, fileList) {
            this.tempUrl = ''
            this.loading = false
            this.onError(err, file, fileList)
        },
        delVideo(index) {
            this.$confirm('确认删除该视频吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.player.destroy()
                this.player = null
                this.tempUrl = ''
                this.$forceUpdate()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-icon-loading {
    position: absolute;
    right: 2px;
}
.lsUpload__vedioClose {
    position: absolute;
    top: 8px;
    right: 8px;
    transform: translate(50%, -50%);
    color: #ccc;
    font-size: 26px;
}
.lsUpload {
    position: relative;
}
</style>
