<template>
    <div class="d-inline-block">
        <div class="lsUpload">
            <template v-if="multiple">
                <div class="d-flex flex-wrap">
                    <div class="text-center mb-5" v-for="(item, index) in tempUrl" :key="index + 1">
                        <div class="lsUpload__imgWarp flex-center" :style="uploadStyle">
                            <ls-image
                                mode="contain"
                                :src="item.url"
                                :osOptions="{ w: '100', h: '100' }"
                                style="border-radius: 6px; width: 100%; height: 100%"
                            />
                            <i class="lsUpload__imgClose el-icon-error" @click="delImg(index)" />
                        </div>
                        <el-input size="small" class="mt-5" v-model="item.permissionImgName" :style="{ width: uploadStyle.width }"></el-input>
                    </div>
                    <el-upload
                        v-if="multiple ? tempUrl.length < limit : true"
                        :disabled="disabled"
                        :headers="headers"
                        name="file"
                        :multiple="multiple"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :action="$config.server + '/basic/file/upload'"
                        :data="{ fileSource: 'S', scope }"
                        :accept="accept"
                        :on-error="handleAvatarError"
                        class="position-relative hover-border ml-5"
                        :limit="limit"
                        :file-list="fileList"
                        :on-exceed="limitTip"
                    >
                        <div :class="{ lsUpload__box: !isHiddenImg && (!button || (!multiple && tempUrl)) }" :style="uploadStyle">
                            <ls-image
                                :isPreview="false"
                                class="lsUpload__img w-100 h-100"
                                v-if="!isHiddenImg && !multiple && tempUrl"
                                mode="contain"
                                :src="tempUrl"
                                :osOptions="{ w: '100', h: '100' }"
                                style="border-radius: 6px; width: 100%; height: 100%"
                            />
                            <el-button v-else-if="isHiddenImg && tempUrl" type="primary" size="small">
                                <div class="font-14">
                                    已选择
                                    <i class="el-icon-upload el-icon--right" />
                                </div>
                            </el-button>
                            <template v-else>
                                <el-button v-if="button" type="primary" size="small">
                                    <div class="font-14">
                                        上传
                                        <i class="el-icon-upload el-icon--right" />
                                    </div>
                                </el-button>
                                <i v-else class="el-icon-plus uploader-icon" />
                            </template>
                        </div>
                        <i
                            v-if="deleteAble && tempUrl"
                            class="d-none el-icon-error font-24 position-absolute cursor-pointer bg-white rounded-circle"
                            style="top: -12px; right: -12px"
                            @click.stop="del"
                        />
                    </el-upload>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import { getToken } from '@/utils/auth'
export default {
    components: {
        vuedraggable
    },
    props: {
        value: {
            type: [String, Array]
        },
        button: {
            // 是否按钮显示
            type: Boolean,
            default: false
        },
        isHiddenImg: {
            // 是否显示图片
            type: Boolean,
            default: false
        },
        deleteAble: {
            // 是否支持删除(当该值为true时，鼠标；移动到图片上时，会出现删除按钮)
            type: Boolean,
            default: false
        },
        limit: {
            // 限制多少张
            type: Number,
            default: 5
        },
        sortable: {
            //
            type: Boolean,
            default: false
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
        disabled: {
            type: [Boolean, Object],
            default: false
        },
        isWatchTempUrl: {
            //
            type: Boolean,
            default: true
        },
        uploadSize: {
            type: Number,
            default: 5
        },
        scope: {
            type: String,
            default: '' // private
        },
        showExpiresUrl: {
            type: Boolean,
            default: false
        },
        // 接受的类型
        accept: {
            type: String,
            default: '.jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP'
        }
    },
    data() {
        return {
            loadingFlag: null,
            tempUrl: typeof this.value === 'object' ? [] : '',
            tempUrlPrivate: typeof this.value === 'object' ? [] : '',
            sortList: Object,
            headers: { Authorization: 'Bearer ' + getToken() },
            fileList: []
        }
    },
    computed: {
        multiple() {
            if (this.value) {
                return typeof this.value === 'object'
            } else {
                false
            }
        }
    },
    watch: {
        tempUrl(newVal) {
            if (this.isWatchTempUrl && this.multiple) {
                if (newVal && newVal.length > this.limit) {
                    newVal.length = this.limit
                }
            }
            this.$emit('input', newVal)
        },
        tempUrlPrivate(newVal) {
            this.$emit('update:pic', this.tempUrlPrivate) //获取固定url
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
        handleAvatarSuccess(res, file, fileList) {
            if (res.code === 1) {
                let url = this.showExpiresUrl ? res.data.expiresUrl : res.data.url
                if (this.multiple) {
                    this.tempUrl.push({ permissionImg: res.data.url, permissionImgName: '', url: res.data.expiresUrl })
                    if (this.showExpiresUrl) {
                        this.tempUrlPrivate.push(res.data.url)
                    }
                } else {
                    this.tempUrl = url
                    if (this.showExpiresUrl) {
                        this.tempUrlPrivate = res.data.url
                    }
                }
                this.fileList = fileList
                this.$message.success('上传成功')
                this.onSuccess(res, file, fileList)
                this.$emit('success', res, file, fileList)
            } else {
                this.$message.error('上传失败')
            }
            this.loadingFlag.close()
        },
        async beforeAvatarUpload(file) {
            this.loadingFlag = this.$loading({ text: '正在上传' })
            // const isLt5M = file.size / 1024 / 1024 < 5;
            const isLt5M = file.size / 1024 / 1024 < this.uploadSize
            if (!isLt5M) {
                this.loadingFlag.close()
                if (this.uploadSize == 2) {
                    this.$message.error('上传图片大小不能超过 2MB!')
                } else {
                    this.$message.error('上传头像图片大小不能超过 '+this.uploadSize+'MB!')
                }
            }
            return isLt5M
        },
        handleAvatarError(err, file, fileList) {
            this.loadingFlag.close()
            this.onError(err, file, fileList)
        },
        delImg(index) {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.tempUrl.splice(index, 1)
                this.fileList.splice(index, 1)
            })
        },

        del() {
            this.fileList = []
            this.$emit('input', '')
        },

        // 限制选择上传图片数量
        limitTip(files, fileList) {
            if (fileList.length + files.length > this.tempUrl.length) {
                this.$message.warning(
                    `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
                )
                return
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    width: 100px;
    position: relative;
    background-color: red;
    &::before {
        content: '';
        padding-top: 100%;
        box-sizing: border-box;
        display: block;
        width: 0;
    }
}
.pox {
    position: absolute;

    height: 100%;

    width: 100%;

    left: 0;

    top: 0;

    border: 1px solid red;

    box-sizing: border-box;
}
@import '~@/styles/mixin.scss';
@keyframes shake {
    /* 水平抖动，核心代码 */
    10%,
    90% {
        transform: translate3d(calc(50% + 0.4px), calc(-50% + 0.4px), 0) rotate(4deg);
    }
    20%,
    80% {
        transform: translate3d(calc(50% - 0.4px), calc(-50% - 0.4px), 0) rotate(-4deg);
    }
    30%,
    70% {
        transform: translate3d(calc(50%), calc(-50% - 0.6px), 0) rotate(0deg);
    }
    40%,
    60% {
        transform: translate3d(calc(50% + 0.4px), calc(-50% + 0.4px), 0) rotate(4deg);
    }
    50% {
        transform: translate3d(calc(50% - 0.4px), calc(-50% - 0.1px), 0) rotate(-4deg);
    }
}
.lsUpload {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    line-height: 1 !important;
    .draggable {
        span {
            display: flex;
            flex-wrap: wrap;
        }
    }
    &__imgWarp {
        display: flex;
        flex-wrap: wrap;
        width: 100px;
        height: 100px;
        margin: 0 5px;
        position: relative;
        .lsUpload__imgClose {
            display: block;
        }
    }
    &__imgClose {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        color: rgba($color: #000000, $alpha: 0.4);
        font-size: 22px;
        display: none;
    }
    //上传外框
    .lsUpload__box {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100px;
        // height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 37px;
        &:hover {
            border-color: #409eff;
        }
        &::before {
            content: '';
            padding-top: 100%;
            box-sizing: border-box;
            display: block;
            width: 0;
        }
    }
    //上传组件内图片
    .uploader-img {
        width: 100%;
        height: 100%;
        display: block;
    }
    //上传组件内 +
    .uploader-icon {
        color: #c0c4d6;
        font-size: 18px;
    }
}
</style>
<style lang="scss">
.d-none {
    color: #999999;
    &:hover {
        color: #666666;
    }
}
</style>
