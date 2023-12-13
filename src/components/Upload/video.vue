<template>
    <div class="d-inline-block">
        <div v-if="!isLookData" class="lsUpload">
            <el-upload
                :headers="headers"
                name="file"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="$config.server + '/basic/file/upload'"
                :data="{ fileSource: 'S', fileType: 1 }"
                :on-error="handleAvatarError"
                accept=".mp4"
            >
                <div>
                    <template v-if="!tempUrl">
                        <el-button type="primary">
                            上传视频
                            <i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </template>
                </div>
            </el-upload>
            <div v-show="tempUrl" id="newPlayer" ref="newPlayer"></div>
            <i v-if="tempUrl" class="lsUpload__vedioClose el-icon-error" @click="delVideo" />
        </div>
        <div v-else class="lsUpload">
            <el-upload
                :headers="headers"
                name="file"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="$config.server + '/basic/file/upload'"
                :data="{ fileSource: 'S', fileType: 1 }"
                :on-error="handleAvatarError"
                accept=".mp4"
            >
                <div>
                    <template v-if="!tempUrl">
                        <el-button type="primary" :disabled="true">
                            上传视频
                            <i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </template>
                </div>
            </el-upload>
            <div v-show="tempUrl" id="newPlayer" ref="newPlayer"></div>
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
        },
        isLookData: {
            type: Boolean,
            dafault: false
        }
    },
    data() {
        return {
            loadingFlag: null,
            tempUrl: typeof this.value == 'object' ? [] : '',
            headers: { Authorization: 'Bearer ' + getToken() }
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
        openFullScreen() {},
        // 播放器初始化
        playerInit(url) {
            if (this.player) {
                this.player.destroy()
            }
            this.player = null
            // this.playerOptions.sources[0].src=this.photoUrl + this.classInfo.videoId
            this.player = new Player({
                id: 'newPlayer',
                url: this.$photoServer + url,
                width: 500,
                height: 300,
                autoplay: true,
                playsinline: false,
                fullscreen: false
            })
        },
        // 导出
        handleAvatarSuccess(res, file, fileList) {
            if (res.code === 1) {
                this.tempUrl = res.data.url
                this.$message.success('上传成功')
                this.onSuccess(res, file, fileList)
            } else {
                this.$message.error('上传失败')
            }
            this.loadingFlag.close()
        },
        beforeAvatarUpload(file) {
            this.loadingFlag = this.$loading({ text: '正在上传' })
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                this.loadingFlag.close()
                this.$message.error('上传的视频大小不能超过5MB!')
            }
            return isLt5M
        },
        handleAvatarError(err, file, fileList) {
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
.lsUpload__vedioClose {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    color: #ccc;
    font-size: 26px;
}
.lsUpload {
    position: relative;
}
</style>
