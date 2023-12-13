<template>
    <div class="d-inline-block">
        <div class="lsUpload">
            <el-button v-if="isBtnShow && button" type="primary" size="small" class="a-self-start mb-5 mr-5" :disabled="disabled" @click="show">
                <span>{{ btnText }}</span>
                <i class="el-icon-upload el-icon--right"></i>
            </el-button>
            <div v-if="isBtnShow && !button" class="lsUpload__box mr-5" :class="disabled ? '' : 'cursor-pointer'" :style="uploadStyle" @click="show">
                <div :style="uploadStyle" class="position-relative">
                    <i class="el-icon-plus uploader-icon center-xy" />
                </div>
            </div>
            <!-- 单选图片时展示 -->
            <div
                v-if="!mult && tempUrl.length && isShowSelected"
                class="lsUpload__imgWarp flex-center"
                :class="[mult ? '' : 'mx-0', disabled ? '' : 'cursor-pointer']"
                :style="[uploadStyle, { margin: 0 }]"
                @click.stop="handleClickImg"
            >
                <ls-image
                    v-if="uploadType == 'PHOTO'"
                    :src="tempUrl"
                    :is-preview="isPreview"
                    :preview-src-list="[tempUrl]"
                    style="border-radius: 6px"
                    :class="['w-100', 'h-100', { 'cursor-pointer': !disabled }]"
                />
                <video
                    v-else
                    :src="tempUrl"
                    :class="['w-100', 'h-100', { 'cursor-pointer': !disabled }]"
                    style="border-radius: 6px; background-color: #000"
                />
                <i
                    v-if="!disabled && showClose"
                    class="lsUpload__imgClose el-icon-error bg-white rounded-circle"
                    :class="disabled ? '' : 'cursor-pointer'"
                    style="display: none"
                    @click.stop="tempUrl = ''"
                />
            </div>
            <!-- 多选图片时展示 -->
            <template v-if="mult && isShowSelected">
                <vuedraggable
                    v-model="tempUrl"
                    style="fontsize: 0; left: -5px"
                    class="draggable position-relative"
                    :options="{
                        animation: 150,
                        chosenClass: 'shadow-lg',
                        scroll: true,
                        scrollSensitivity: 200
                    }"
                >
                    <!-- transition-group 不要使用v-for数组的数组下标作为children的key值-->
                    <transition-group>
                        <div v-for="(item, index) in tempUrl" :key="index + 1" class="lsUpload__imgWarp flex-center" :style="uploadStyle">
                            <ls-image
                                :src="item"
                                :is-preview="isPreview"
                                :preview-src-list="tempUrl"
                                style="border-radius: 6px"
                                class="w-100 h-100"
                                :class="disabled ? '' : 'cursor-pointer'"
                            />
                            <i
                                v-if="!disabled && showClose"
                                class="lsUpload__imgClose el-icon-error bg-white rounded-circle"
                                :class="disabled ? '' : 'cursor-pointer'"
                                style="display: none"
                                @click="delImg(index)"
                            />
                        </div>
                    </transition-group>
                </vuedraggable>
            </template>
            <dialog-store
                ref="dialogStore"
                :multiple="mult"
                :temp-url.sync="tempUrl"
                :limit="limit - (typeof tempUrl == 'object' ? tempUrl.length : 0)"
                :upload-type="uploadType"
                :in-rich-text="inRichText"
                :is-echo="isEcho"
                @success="successHandle"
                @transfers3="transfers4"
            />
        </div>

        <!-- 视频放大预览 -->
        <div v-if="isPreviewVideo" class="el-image-viewer__wrapper" style="z-index: 3333">
            <div class="el-image-viewer__mask" style="opacity: 0.2"></div>
            <span class="el-image-viewer__btn el-image-viewer__close" @click.stop="isPreviewVideo = false">
                <i class="el-icon-circle-close"></i>
            </span>
            <div class="el-image-viewer__canvas">
                <video :src="tempUrl" controls autoplay style="width: 80vw; height: 80vh"></video>
            </div>
        </div>
    </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
import dialogStore from './component/dialogStore'
export default {
    components: {
        vuedraggable,
        dialogStore
    },
    props: {
        value: {
            type: [String, Array]
        },
        mult: {
            //是否支持多选
            type: Boolean,
            default: false
        },
        button: {
            //是否按钮显示
            type: Boolean,
            default: false
        },
        limit: {
            //限制多少张
            type: [Number, String],
            default: 6
        },
        uploadStyle: {
            type: [String, Object],
            default: ''
        },
        sortable: {
            //
            type: Boolean,
            default: false
        },
        uploadType: {
            //多媒体类型 PHOTO:图片;VIDEO:视频[选择的格式要求]
            type: String,
            default: 'PHOTO'
        },
        disabled: {
            //是否可用
            type: Boolean,
            default: false
        },
        btnText: {
            //按钮上的文字
            type: String,
            default: '选择'
        },
        isBtnHide: {
            //单选选择多媒体及多选超出数量限制后是否隐藏上传按钮
            type: Boolean,
            default: true
        },
        showClose: {
            //上存后的图片是否显示删除按钮(默认：显示)
            type: Boolean,
            default: true
        },
        isPreview: {
            //点击图片是否能够预览图片，如果设置了:isPreview="false"，点击已经上存图片时，是打开选择框重新选图,mult为false时此项为false:点击图片无法预览图片而是打开图片中心重新选择图片，且右上角删除图标消失
            type: Boolean,
            default: true
        },
        isShowSelected: {
            //选择图片后是否展示该图片，如果设置了:isShowSelected="false"，选择图片后不会展示图片，只会通过this.$emit('input')传递给父组件。适用于选择图片后需要将图片在其他地方展示或不展示的情况（例Tinymce富文本插件）
            type: Boolean,
            default: true
        },
        inRichText: {
            //如果是在富文本里 则可以选择图片和视频 否则其余页面 应该只选择单一类型
            type: Boolean,
            default: false
        },
        // true：为了防止客户上传完图片后在列表里找不到刚才上传的图片，上传完图片并点击【上传】后，立即选中上传的数据并且关闭弹窗(这时不用点击【确定】)[例子：商品发布上传图片]
        isEcho: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            tempUrl: typeof this.value == 'object' || this.mult ? [] : '',
            isPreviewVideo: false //视频预览
        }
    },
    computed: {
        isBtnShow() {
            if (this.isBtnHide) {
                if (this.mult && this.tempUrl.length >= this.limit)
                    //多选情况下选择图片超过数量限制隐藏按钮
                    return false
                if (!this.mult && this.tempUrl != '')
                    //单选选择图片后隐藏按钮
                    return false
            }
            return true //其余情况均显示按钮
        }
    },
    watch: {
        tempUrl(newVal) {
            if (this.mult && newVal && newVal.length > this.limit) {
                newVal.length = this.limit
            }
            if (this.uploadType == 'VIDEO' && !this.mult) {
                //如果是上传视频
                if (newVal && newVal.indexOf('http') == -1 && newVal.indexOf('https') == -1 && newVal.indexOf('/assets/') == -1) {
                    this.$emit('input', this.$photoServer + newVal)
                } else {
                    this.$emit('input', newVal)
                }
            } else {
                this.$emit('input', newVal)
            }
        },
        value: {
            immediate: true,
            handler(newVal) {
                if (!this.$utils.test.isEmpty(newVal)) {
                    this.tempUrl = newVal
                } else {
                    if (!this.mult) {
                        this.tempUrl = ''
                    }
                }
            }
        }
    },
    created() {},
    mounted() {},
    methods: {
        //打开素材弹层
        show() {
            if (!this.disabled) {
                this.$nextTick(() => {
                    this.$refs.dialogStore.showDialog(this.uploadType == 'PHOTO' ? 'IMG' : 'VIDEO')
                })
            }
        },
        //传递事件
        transfers4(urlArr) {
            console.log(urlArr)
            if (!this.mult) {
                this.tempUrl = urlArr[0]
            } else {
                if (this.tempUrl.length > '0') {
                    this.tempUrl.unshift(urlArr[0])
                } else {
                    this.tempUrl = urlArr
                }
            }
        },
        // 完成选中图片后显示图片
        successHandle(imgList, selectItem) {
            // 传递过来是数组 如果是单选 拿第一个
            if (!this.mult) {
                this.tempUrl = imgList[0]
                this.$emit('afterChoose', imgList[0])
                if (selectItem) {
                    this.$emit('videoItem', selectItem)
                }
            } else {
                this.tempUrl = this.tempUrl.concat(imgList)
                if (this.tempUrl.length > this.limit) {
                    this.tempUrl.length = this.limit
                    this.$message.error('您最多可以上传' + this.limit + '张图片')
                }
            }
            this.$emit('selectItem', selectItem)
            if (!this.isShowSelected) {
                //如果不展示回显图片 则将tempUrl做清除[富文本]
                this.$nextTick(() => {
                    this.tempUrl = []
                })
            }
        },
        delImg(index) {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.tempUrl.splice(index, 1)
            })
        },
        setPreViewSrc() {
            if (this.isPreview) {
                return [this.$photoServer + this.tempUrl]
            } else {
                return []
            }
        },
        handleClickImg() {
            if (!this.isPreview) {
                this.show()
            } else {
                if (this.uploadType == 'VIDEO') {
                    this.isPreviewVideo = true
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
        margin: 0 6px;
        position: relative;
        background-color: #f8f8f8; // 防止传透明的PNG图片时看不到该图片
        &:hover {
            .lsUpload__imgClose {
                display: block !important;
            }
        }
    }
    &__imgClose {
        position: absolute;
        top: 0;
        right: 0px;
        transform: translate(50%, -50%);
        color: #999999;
        font-size: 21px;
        display: none;
        &:hover {
            color: #666666;
        }
    }
    //上传外框
    .lsUpload__box {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        position: relative;
        overflow: hidden;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f8f8; // 防止传透明的PNG图片时看不到该图片
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
