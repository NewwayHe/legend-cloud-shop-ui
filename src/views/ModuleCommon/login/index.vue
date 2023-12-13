<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            size="small"
            :model="loginForm"
            :rules="loginRules"
            class="login-form rounded-10"
            auto-complete="on"
            label-position="left"
        >
            <div v-loading="!systemConfigFinally" class="w-100 flex-center mb-30">
                <img
                    v-if="systemConfigTemp && systemConfigTemp.shopBigLogo"
                    :src="$photoServer + systemConfigTemp.shopBigLogo"
                    style="max-width: 200px; height: 50px; object-fit: contain"
                    :onerror="$defaultImg"
                />
                <img v-else-if="systemConfigFinally" style="width: 150px; height: 50px" src="@/assets/images/login__logo.png" alt="" />
                <div v-else style="width: 150px; height: 50px"></div>
                <h3 class="ml-20 text-nowrap">商家端</h3>
            </div>
            <div class="d-flex text-center pb-40">
                <div
                    class="flex-1 pb-8 cursor-pointer"
                    :class="{ login__Active: loginMethod == 'passwordLogin' }"
                    @click="swithchLogin('passwordLogin')"
                >
                    账号密码登录
                </div>
                <div
                    class="flex-1 pb-8 cursor-pointer"
                    :class="{ login__Active: loginMethod == 'captchaLogin' }"
                    @click="swithchLogin('captchaLogin')"
                >
                    短信验证码登录
                </div>
            </div>
            <el-form-item prop="principal">
                <el-input
                    ref="username"
                    v-model="loginForm.principal"
                    placeholder="账号"
                    name="principal"
                    type="text"
                    tabindex="1"
                    :maxlength="11"
                    auto-complete="on"
                />
            </el-form-item>

            <el-form-item v-if="loginMethod == 'passwordLogin'" prop="credentials">
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.credentials"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    :maxlength="16"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>
            <div v-else class="d-flex">
                <el-form-item prop="credentials" class="flex-1">
                    <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.credentials"
                        placeholder="验证码"
                        name="password"
                        tabindex="2"
                        auto-complete="on"
                        maxlength="6"
                        @keyup.enter.native="handleLogin"
                    />
                </el-form-item>
                <codeVerify code-type="LOGIN" button-stype="width: 110px; height: 45px;" class="ml-10" :mobile="loginForm.principal"></codeVerify>
            </div>
            <el-button :loading="loading" type="primary" class="w-100 mb-20 mt-20" @click.native.prevent="handleLogin">登录</el-button>
            <div class="flex-between font-main mt-10">
                <div class="d-flex">
                    <div class="text-333 cursor-pointer pr-5" style="border-right: 1px solid #eee" @click="$router.replace('/forgetPwd')">
                        忘记密码
                    </div>
                    <div class="text-333 cursor-pointer pl-5" @click="$router.replace('/staffLogin')">员工子账号登录</div>
                </div>

                <div class="text-main cursor-pointer" @click="$router.replace('/register')">注册账号</div>
            </div>
        </el-form>
        <verifition ref="verify" mode="pop" captcha-type="blockPuzzle" :img-size="{ width: '330px', height: '155px' }" @success="verifySuccess" />
    </div>
</template>
<script>
import Verifition from '@/components/Verifition/Verify'
import codeVerify from '@/components/codeVerify'
import { shopMoveIn } from '@/api/ModuleCommon'
import encryption from '@/utils/encryption.js'
export default {
    name: 'Login',
    components: {
        Verifition,
        codeVerify
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            callback()
        }
        const validatePhone = (rule, value, callback) => {
            if (this.phoneRight) {
                callback()
            } else {
                callback(new Error('请输入正确的手机号码'))
            }
        }

        const validatePassword = (rule, value, callback) => {
            if (this.loginMethod == 'passwordLogin' && !this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            } else if (this.loginMethod == 'captchaLogin' && value.length < 4) {
                callback(new Error('请输入验证码'))
            } else {
                callback()
            }
        }

        return {
            loginMethod: 'passwordLogin', // 账号密码 passwordLogin  //验证码 captchaLogin
            loginForm: {
                auth_type: 'PASSWORD',
                principal: '',
                credentials: ''
            },
            loginRules: {
                principal: [{ required: true, trigger: 'blur', validator: validatePhone }],
                credentials: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            systemConfigTemp: '', // 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
            systemConfigFinally: false
        }
    },
    computed: {
        //检测手机号码是否正确
        phoneRight() {
            return this.$checkInfo([{ type: 'phone', value: this.loginForm.principal }])
        }
    },
    watch: {
        loginMethod: {
            handler: function (newVal) {
                this.loginForm.credentials = ''
                if (newVal == 'passwordLogin') {
                    this.loginForm.auth_type = 'PASSWORD'
                } else {
                    this.loginForm.auth_type = 'SMS'
                }
            }
        },
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    created() {
        let systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
        // 如果main.js里面执行了方法获取到系统设置
        if (systemConfig && systemConfig.id) {
            this.systemConfigTemp = systemConfig
            this.systemConfigFinally = true
            // 如果VUEX里没有设置systemConfig(系统设置)
        } else {
            this.$store
                .dispatch('user/getSystemConfig')
                .then((res) => {
                    this.systemConfigTemp = res
                    // console.log('systemConfig:',this.systemConfig);
                })
                .catch(() => {})
                .finally(() => {
                    this.systemConfigFinally = true
                })
        }
    },
    methods: {
        swithchLogin(name) {
            this.loginMethod = name
        },
        verifySuccess(params) {
            this.loading = true
            let sumbitForm = Object.assign(this.loginForm)
            if (this.loginMethod == 'passwordLogin') {
                sumbitForm = { ...sumbitForm, principal: encryption(sumbitForm.principal), credentials: encryption(sumbitForm.credentials) }
            }
            this.$store
                .dispatch('user/login', { userInfo: sumbitForm, code: params.captchaVerification })
                .then(() => {
                    // this.$router.push({ path: this.redirect || '/' })
                    shopMoveIn
                        .openShopStatus()
                        .then((res) => {
                            if (res.code == 1) {
                                this.status = res.data //审核通过=1，待审核=0，审核拒绝=-1，未提交入驻申请=2
                                if (res.data != 1) {
                                    this.$router.push({ name: 'shopMoveIn' })
                                } else {
                                    this.$router.push({ path: this.redirect || '/' })
                                }
                            }
                        })
                        .catch((e) => {})
                        .finally(() => {
                            this.loading = false
                        })
                })
                .catch((err) => {
                    this.loading = false
                })
        },
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
        useVerify() {
            this.$refs.verify.show()
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                console.log(valid)
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
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container {
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
    background: rgba(220, 223, 230, 1);
    border-radius: 2px;
    line-height: 45px;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
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
    min-height: 768px; //防止底部往上挪
    height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    background-image: url('~@/assets/images/login__bg.png');
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-form {
        background-color: #fff;
        width: 380px;
        height: 450px;
        display: block;
        max-width: 100%;
        padding: 40px;
        overflow: hidden;
        box-sizing: border-box;
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
