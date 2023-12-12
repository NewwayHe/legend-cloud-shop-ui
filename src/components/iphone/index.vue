<template>
    <div
        ref="iphoneScreen"
        class="iphone position-relative"
        :class="[{ 'box-shadow': boxShadow }, className]"
        :style="{ transform: `scale(${scale})`, width: `${width + 48}px`, height: `${height + 200}px` }"
    >
        <slot name="head"></slot>
        <div class="iphone-top">
            <span class="camera" />
            <span class="sensor" />
            <span class="speaker" />
        </div>
        <div class="top-bar" :style="{ width: `${width + 48}px` }" />
        <div
            class="iphone-screen position-relative"
            :style="{ backgroundColor: backgroundColor, width: `${width}px`, height: `${height}px` }"
            @scroll="onScroll"
        >
            <slot name="screen"></slot>
        </div>
        <div class="buttons">
            <span class="on-off" />
            <span class="sleep" />
            <span class="up" />
            <span class="down" />
        </div>
        <div class="bottom-bar" :style="{ width: `${width + 48}px` }" />
        <div class="iphone-bottom"><span /></div>
    </div>
</template>

<script>
// import domtoimage from '@/utils/dom-to-image.js'
import domtoimage from 'dom-to-image'
import { uploadApi } from '@/api/ModuleCommon.js'
export default {
    components: {},
    filters: {},
    props: {
        className: String,
        scale: {
            //iphone图片的大小
            type: [String, Number],
            default: '1.0'
        },
        width: {
            //iphone屏幕的宽
            type: [String, Number],
            default: 384 //备注：375+滚动条+边框 = 384
        },
        height: {
            //iphone屏幕的高
            type: [String, Number],
            default: 677
        },
        backgroundColor: {
            //iphone屏幕的背景
            type: String,
            default: '#ffffff'
        },
        boxShadow: {
            //iphone外框是否带阴影
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
        onScroll(event) {
            const scrollTop = event.target.scrollTop
            this.$emit('scroll', scrollTop)
        },

        async domToImg() {
            const that = this
            const ctrlClass = document.querySelector('.iphone-screen')
            ctrlClass.style['overflow-y'] = 'hidden'
            ctrlClass.style.border = 'unset'

            return new Promise(function (resolve, reject) {
                domtoimage.toBlob(that.$refs.iphoneScreen).then(function (blob) {
                    var form = new FormData()
                    form.append('file', blob, 'image.png')
                    form.append('fileSource', 'S')
                    form.append('fileType', 0)
                    uploadApi(form)
                        .then((res) => {
                            if (res.code == 1) {
                                resolve(res)
                            } else {
                                reject(res)
                            }
                        })
                        .finally((res) => {
                            ctrlClass.style['overflow-y'] = 'scroll'
                            ctrlClass.style.border = '2px solid rgba(0,0,0,0.9)'
                        })
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
/* iphone6样式1 */
.iphone {
    border: 5px solid #d9dbdc;
    background: #f8f8f8;
    padding: 15px;
    border-radius: 50px;
    position: relative;
}
.box-shadow {
    box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px #999, 0 0 30px 0px rgba(0, 0, 0, 0.7);
}
.iphone-top {
    padding: 5px 110px 40px;
    position: relative;
}
.iphone-top .speaker {
    display: block;
    width: 70px;
    height: 6px;
    margin: 0 auto;
    border-radius: 6px;
    background: #292728;
}
.iphone-top .camera {
    display: block;
    margin: 0 auto;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-bottom: 13px;
    background: #333;
}
.iphone-top .sensor {
    display: block;
    width: 15px;
    height: 15px;
    float: left;
    background: #333;
    margin-top: -5px;
    border-radius: 50%;
}
.iphone .top-bar,
.iphone .bottom-bar {
    display: block;
    height: 15px;
    border-left: 5px solid #bbb;
    border-right: 5px solid #bbb;
    position: absolute;
    left: -5px;
}
.iphone .top-bar {
    top: 65px;
}
.iphone .bottom-bar {
    bottom: 65px;
}
.iphone-screen {
    background: #eee;
    border: 1px solid #fff;
    margin: 0 auto;
    border: 2px solid rgba(0, 0, 0, 0.9);
    border-radius: 3px;
    overflow-y: scroll;
    overflow-x: hidden; /* 加这个是为了解决低版IOS由于-webkit-overflow-scrolling:touch;造成各种闪跳卡顿的bug */
    -webkit-overflow-scrolling: touch;
}
.iphone-screen::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
.iphone-screen::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
}
.iphone-screen::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
}
.iphone-screen::-webkit-scrollbar-thumb:hover {
    background: #333;
}
.iphone-screen::-webkit-scrollbar-corner {
    background: #179a16;
}
.iphone-screen img {
    width: 100%;
}
.iphone .buttons .on-off,
.iphone .buttons .up,
.iphone .buttons .down,
.iphone .buttons .sleep {
    display: block;
    background: #ccc;
    position: absolute;
    border-radius: 2px 0px 0px 2px;
}
.iphone .buttons .on-off {
    height: 40px;
    width: 3px;
    top: 100px;
    left: -8px;
}
.iphone .buttons .up,
.iphone .buttons .down,
.iphone .buttons .sleep {
    height: 60px;
    width: 5px;
    left: -10px;
}
.iphone .buttons .up {
    top: 170px;
}
.iphone .buttons .down {
    top: 250px;
}
.iphone .buttons .sleep {
    left: auto;
    right: -10px;
    top: 170px;
    border-radius: 0px 2px 2px 0px;
}
.iphone-bottom {
    padding: 10px 0 0;
}
.iphone-bottom span {
    display: block;
    margin: 0 auto;
    width: 68px;
    height: 68px;
    background: #ccc;
    border-radius: 50%;
    background: -webkit-linear-gradient(315deg, #303233 0%, #b5b7b9 50%, #f0f2f2 69%, #303233 100%);
    background: linear-gradient(135deg, #303233 0%, #b5b7b9 50%, #f0f2f2 69%, #303233 100%);
    position: relative;
    transition: all 0.5s;
}
.iphone-bottom span:after {
    content: '';
    display: block;
    width: 60px;
    height: 60px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    left: 4px;
    top: 4px;
    cursor: pointer;
}
.iphone-bottom span:hover {
    transform: scale(1.1);
}
</style>
