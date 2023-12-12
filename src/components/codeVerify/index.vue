<template>
    <div>
        <div class="d-inline-block">
            <el-button :style="buttonStype" type="primary" size="small" :disabled="!codeStatus" @click="useVerifitionMed">
                {{ show ? '获取验证码' : `等待${count}秒` }}
            </el-button>
        </div>
        <verifition ref="verify" mode="pop" captcha-type="blockPuzzle" :img-size="{ width: '330px', height: '155px' }" @success="getCode" />
    </div>
</template>

<script>
import { loginPage } from '@/api/ModuleCommon'
import Verifition from '@/components/Verifition/Verify'

export default {
    components: { Verifition },
    props: {
        codeType: {
            //验证码类型
            type: String,
            default: 'REGISTER'
        },
        mobile: {
            //手机号
            type: String,
            default: ''
        },
        buttonStype: {
            type: [String, Object],
            default: ''
        },
        // 是否使用滑块验证,默认为false
        useVerifition: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            codeStatus: true,
            count: 0,
            show: true
        }
    },
    computed: {
        //检测手机号码是否正确
        phoneRight() {
            return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(this.mobile)
        }
    },
    watch: {},
    mounted() {},
    methods: {
        // 判断是否使用滑块验证码发送信息
        useVerifitionMed() {
            if (!this.useVerifition) {
                this.getCode()
            } else {
                this.$refs.verify.show()
            }
        },

        getCode() {
            if (this.phoneRight) {
                loginPage.smsVerifyCode({ codeType: this.codeType, mobile: this.mobile, userType: 'SHOP' }).then((res) => {
                    if (res.code == 1) {
                        this.codeStatus = false
                        const TIME_COUNT = 60
                        let TIMER = null
                        if (!TIMER) {
                            this.count = TIME_COUNT
                            this.show = false
                            TIMER = setInterval(() => {
                                if (this.count > 0 && this.count <= TIME_COUNT) {
                                    this.count--
                                } else {
                                    this.show = true
                                    this.codeStatus = true
                                    clearInterval(TIMER)
                                }
                            }, 1000)
                        }
                    }
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请输入正确的手机号码'
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    width: 100px;
    position: relative;
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
<style lang="scss" scoped>
.lsUpload {
    span {
        font-size: 0;
        display: flex;
    }
}
</style>
