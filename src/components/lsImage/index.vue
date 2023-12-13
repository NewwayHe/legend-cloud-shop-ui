<template>
    <el-image
        :src="currentUrl"
        :class="className"
        :alt="alt"
        :style="optionstyle"
        :preview-src-list="previewSrcListTemp"
        :z-index="zIndex"
        :fit="mode"
        v-bind="$attrs"
        @click.self="stopPropagation"
        @dblclick="handleImg(currentUrl)"
        v-on="$listeners"
    >
        <div slot="error" class="w-100 h-100">
            <img class="w-100 h-100" :src="error" style="object-fit: contain; background-color: #f8f8f8" />
        </div>
    </el-image>
</template>
<script>
export default {
    props: {
        src: {
            // 图片路径
            type: String,
            default: ''
        },
        lazy: {
            // 是否开启懒加载
            type: Boolean,
            default: false
        },
        alt: {
            // 原生 alt
            type: String,
            default: ''
        },
        className: {
            // 图片路径
            type: String,
            default: ''
        }, // 类名
        options: {
            // 设置图片的长宽和波打线弧度，例如：:options="{w:'45',h:'45'，br:'20'}"，h:长，w：宽，br：弧度
            type: Object,
            default: () => {
                return {}
            }
        },
        osOptions: {
            // 设置阿里云的图片缩放(省流量)，当有这个时，options只负责调整图片大小，调整像索将是osOptions来负责
            // 当options的w是%比或auto时，就要用osOptions来限制最大像素以达到省流量的效果
            type: Object,
            default: () => {
                return {}
            }
        },
        zIndex: {
            // 图片路径
            type: Number,
            default: 9999
        },
        isPreview: {
            //是否可以预览图片
            type: Boolean,
            default: true
        },
        previewSrcList: {
            // 开启图片预览功能
            type: Array,
            default: () => {
                return []
            }
        },
        mode: {
            type: String,
            default: 'fill' // 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
            // default:'contain'//保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
            // default:'cover'//保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
            // default:'scale-down'//宽度不变，高度自动变化，保持原图宽高比不变
        },
        error: {
            type: String,
            default: require('@/assets/images/defalut-img/default-img.png')
        }
    },
    data() {
        return {
            currentUrl: '',
            photoServer: this.$photoServer,
            initialIndex: 0
        }
    },
    computed: {
        previewSrcListTemp() {
            let list = []
            if (this.isPreview || this.previewSrcList?.length) {
                // 如果只设了isPreview=true,但没传previewSrcList,则以预览当前图片
                if (!this.previewSrcList?.length) {
                    list = [this.currentUrl && this.currentUrl.split('?x-oss-process')[0]]
                    // 如果有传previewSrcList,则以传过来的图片为准
                } else {
                    list = this.previewSrcList.map((item, index) => {
                        if (item && item.indexOf('http') == -1 && item.indexOf('https') == -1 && item.indexOf('/assets/') == -1) {
                            if (this.currentUrl.indexOf(item) != -1) {
                                this.initialIndex = index
                            } //获取当前图片的index
                            item = this.$photoServer + item
                        }
                        return item
                    })
                }
            }
            // console.log(11,list);
            return list
        },
        // 由于:style只能绑定一个值(用官方写法,只有最后一个值会生效),所以要将所有值集中处理
        optionstyle() {
            const optionsArr = []
            // 处理高度
            let height1 = ''
            if (this.options && this.options.h) {
                if (this.options.h === 'auto') {
                    height1 = `height:auto`
                } else if (this.options.h.toString().indexOf('%') > -1) {
                    height1 = `height:${this.options.h}`
                } else {
                    height1 = `height:${this.options.h}px`
                }
                optionsArr.push(height1)
            }
            // 处理宽度
            let width1 = ''
            if (this.options && this.options.w) {
                if (this.options.w === 'auto') {
                    width1 = `width:auto`
                } else if (this.options.w.toString().indexOf('%') > -1) {
                    width1 = `width:${this.options.w}`
                } else {
                    width1 = `width:${this.options.w}px`
                }
                optionsArr.push(width1)
            }
            // 处理border线弧度
            let borderRadius1 = ''
            if (this.options && this.options.br) {
                if (this.options.br.toString().indexOf('%') > -1) {
                    borderRadius1 = `border-radius:${this.options.br}`
                } else {
                    borderRadius1 = `border-radius:${this.options.br}px`
                }
                optionsArr.push(borderRadius1)
            }

            return optionsArr.toString().replace(/,/g, ';')
        }
    },
    watch: {
        src: {
            handler(newVal) {
                let url = ''
                if (newVal && newVal.indexOf('http') == -1 && newVal.indexOf('https') == -1 && newVal.indexOf('/assets/') == -1) {
                    url = this.$photoServer + newVal
                } else {
                    url = newVal
                }
                if (Object.keys(this.osOptions) && Object.keys(this.osOptions).length != 0) {
                    // 如果设置了阿里云处理图片的缩放
                    this.currentUrl = this._handleResize(url, this.osOptions)
                } else if (this.options && this.options.w && this.options.w != 'auto' && this.options.w.toString().indexOf('%') == -1) {
                    // 如果设置了图片宽度，则用阿里云处理图片节省流量
                    const osHandle = {}
                    // osHandle.w = this.options.w
                    osHandle.w = `${this.options.w}`
                    if (this.options.h && this.options.h != 'auto' && this.options.h.toString().indexOf('%') == -1) {
                        // osHandle.h = this.options.h
                        osHandle.h = `${this.options.h}`
                    }
                    this.currentUrl = this._handleResize(url, osHandle)
                } else {
                    this.currentUrl = url
                }
            },
            immediate: true,
            deep: true // 可以深度检测到 person 对象的属性值的变化
        }
    },

    created() {},
    methods: {
        //解决点击elemen图片会给body加overflow:hidden滚动条失效问题
        stopPropagation() {
            document.body.style = ''
        },
        handleImg(currentUrl) {
            this.$emit('handleImg', currentUrl)
        },
        /**
         * 阿里云图片缩放
         * 缩放图限制：缩放图宽与高的乘积不能超过4096 px*4096 px，且单边长度不能超过4096 px。
         * @param {*} imageUrl
         * @param {*} options 处理阿里云图片的参数
         */
        _handleResize(imageUrl, options) {
            let params = `${imageUrl}?x-oss-process=image/resize,`
            if (!options.limit) {
                options.limit = 0
            }
            if (!options.m) {
                options.m = 'fixed'
            }
            for (const key in options) {
                switch (key) {
                    case 'm':
                        // 指定缩放的模式。
                        // lfit（默认值）：等比缩放，缩放图限制为指定w与h的矩形内的最大图片。
                        // mfit：等比缩放，缩放图为延伸出指定w与h的矩形框外的最小图片。
                        // fill：将原图等比缩放为延伸出指定w与h的矩形框外的最小图片，之后将超出的部分进行居中裁剪。
                        // pad：将原图缩放为指定w与h的矩形内的最大图片，之后使用指定颜色居中填充空白部分。注意，当给出的指定w和h大于原图片尺寸时，只有这个pad生效，其它模式只有当limit=0时才会生效
                        // fixed：固定宽高，强制缩放。
                        params = `${params}m_${options[key]},`
                        break
                    case 'w':
                        // 指定目标缩放图的宽度。
                        params = `${params}w_${options[key]},`
                        break
                    case 'h':
                        // 指定目标缩放图的高度
                        params = `${params}h_${options[key]},`
                        break
                    case 'l':
                        // 指定目标缩放图的最长边
                        // 说明 长边是指原尺寸与目标尺寸的比值大的那条边；短边是指原尺寸与目标尺寸的比值小的那条边。
                        // 例如原图为400 px*200 px，缩放为800 px*100 px。由于（400/800）<（200/100），所以在这个缩放操作中，200那条是长边，400那条是短边。
                        params = `${params}l_${options[key]},`
                        break
                    case 's':
                        // 指定目标缩放图的最短边。
                        params = `${params}s_${options[key]},`
                        break
                    case 'limit':
                        // 指定当目标缩放图大于原图时是否进行缩放。
                        // 1（默认值）：表示不按指定参数进行缩放，直接返回原图。
                        // 0：按指定参数进行缩放。
                        params = `${params}limit_${options[key]},`
                        break
                    case 'color':
                        // 当缩放模式选择为pad（缩放填充）时，可以设置填充的颜色
                        params = `${params}color_${options[key]},`
                        break
                    case 'p':
                        // 按百分比缩放图片。
                        // [1,1000] 小于100为缩小，大于100为放大。
                        // 其中GIF格式的图片支持指定宽高缩放，不支持等比缩放（等比缩放情况下，动态图会变成静态图）。
                        // 目标缩放图比原图尺寸大时，默认返回原图。您可以增加limit_0参数放大图片。
                        params = `${params}p_${options[key]},`
                        break
                    default:
                        break
                }
            }
            params = params.substr(0, params.length - 1)
            return params
        }
    }
}
</script>

<style lang="scss" scoped></style>
