<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            key="1"
            size="small"
            :model="loginForm"
            :rules="loginRules"
            class="login-form rounded-10"
            auto-complete="on"
            label-position="left"
        >
            <div class="title-container">
                <h3 v-if="stepType == 'first'" class="title">忘记密码</h3>
                <h3 v-else class="title">重置密码</h3>
            </div>
            <template v-if="stepType == 'first'">
                <div class="text-center font-16 text-666 mb-40">请输入您账号绑定的手机号及验证码</div>
                <el-form-item key="2" prop="mobile">
                    <el-input ref="mobile" v-model="loginForm.mobile" placeholder="账号" name="mobile" type="text" tabindex="1" auto-complete="on" />
                </el-form-item>
                <div class="d-flex">
                    <el-form-item key="3" prop="code" class="flex-1">
                        <el-input
                            ref="password"
                            v-model="loginForm.code"
                            type="text"
                            placeholder="验证码"
                            name="password"
                            tabindex="2"
                            auto-complete="on"
                            @keyup.enter.native="handleLogin"
                        />
                    </el-form-item>
                    <codeVerify
                        code-type="FORGET_PASSWORD"
                        button-stype="width: 110px; height: 45px;"
                        class="ml-10"
                        :mobile="loginForm.mobile"
                    ></codeVerify>
                </div>
            </template>

            <el-form-item v-else key="4" prop="password">
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    maxlength="16"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>
            <el-button v-if="stepType == 'first'" :loading="loading" type="primary" class="w-100 mb-30" @click.native.prevent="nextStep">
                下一步
            </el-button>
            <el-button v-else :loading="loading" type="primary" class="w-100 mb-30" @click.native.prevent="handleLogin">提交</el-button>
            <div class="flex-center font-main mt-10">
                <div>
                    已有账号？
                    <span class="text-main cursor-pointer" @click="goLogin">登录</span>
                </div>
            </div>
        </el-form>
        <verifition ref="verify" mode="pop" captcha-type="blockPuzzle" :img-size="{ width: '330px', height: '155px' }" @success="verifySuccess" />
    </div>
</template>
<script>
import Verifition from '@/components/Verifition/Verify'
import codeVerify from '@/components/codeVerify'
import { loginPage } from '@/api/ModuleCommon'
export default {
    name: 'forgetPwd',
    components: {
        Verifition,
        codeVerify
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            if (this.phoneRight) {
                callback()
            } else {
                callback(new Error('请输入正确的手机号码'))
            }
        }

        const validatePassword = (rule, value, callback) => {
            if (!this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            } else {
                callback()
            }
        }
        return {
            agreement: true,
            stepType: 'first',
            loginMethod: 'passwordLogin', // 账号密码 passwordLogin  //验证码 captchaLogin
            loginForm: {
                mobile: '',
                password: '',
                code: ''
            },
            loginRules: {
                mobile: [{ required: true, trigger: 'blur', validator: validateUsername }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
            },
            secretKey: '',
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            codeStatus: true,
            count: 0,
            show: true
        }
    },
    computed: {
        //检测手机号码是否正确
        phoneRight() {
            return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(this.loginForm.mobile)
        }
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    created() {},
    methods: {
        nextStep() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 校验验证码是否正确
                    loginPage.verifyCode({ userType: 'SHOP', codeType: 'FORGET_PASSWORD', ...this.loginForm }).then((res) => {
                        if (res.code == 1) {
                            this.secretKey = res.data
                            this.stepType = 'finish'
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        verifyCodeHandler() {},
        // 获取验证码
        getCode() {
            console.log('获取验证码接口没好')
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
        },

        // 跳转登录页
        goLogin() {
            this.$router.replace('/login')
        },

        // 显示密码
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },

        // 显示图形验证码
        useVerify() {
            this.$refs.verify.show()
        },

        // 图形验证码验证
        verifySuccess(params) {
            this.loading = true
            let loginForm = Object.assign(this.loginForm, { code: this.secretKey })
            loginPage
                .resetPassword(loginForm)
                .then((res) => {
                    this.loading = false
                    this.$message({
                        type: 'success',
                        message: '修改成功',
                        onClose: () => {
                            this.$router.push({ path: '/' })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            console.log(params) // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
        },
        // 提交
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.useVerify()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container{
		::v-deep .el-input input {
		    color: $cursor;
		}
	} 
}
.login__Active {
    position: relative;
    &::before {
        content: '';
        position: absolute;
        width: 115px;
        height: 3px;
        background: rgba(255, 168, 0, 1);
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
}
.captcha {
    width: 110px;
    height: 45px;
    border-radius: 2px;
}

.login-container {
    ::v-deep .el-input {
        display: inline-block;
        height: 45px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #000;
            height: 45px;
            caret-color: #000;
            cursor: pointer;
            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(0, 0, 0, 0.1);
        background-color: #fff;
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #eef2f6;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    position: relative;
    .login-form {
        width: 380px;
        display: block;
        max-width: 100%;
        padding: 0 40px;
        margin: 0 auto;
        overflow: hidden;
        box-sizing: border-box;
        margin-top: 160px;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: #dcdce4;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 30px auto;
            text-align: center;
            font-weight: bold;
            font-size: 26px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
