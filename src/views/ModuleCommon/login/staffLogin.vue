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
                <h3 class="ml-20 text-nowrap">员工端</h3>
            </div>
            <el-form-item prop="principal">
                <el-input
                    ref="principal"
                    v-model="loginForm.shopIdentifier"
                    placeholder="商家手机号"
                    name="principal"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                    maxlength="11"
                />
            </el-form-item>
            <el-form-item prop="principal">
                <el-input
                    ref="principal"
                    v-model="loginForm.principal"
                    placeholder="员工账号"
                    name="principal"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                    maxlength="30"
                />
            </el-form-item>
            <el-form-item prop="credentials">
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.credentials"
                    :type="passwordType"
                    placeholder="密码"
                    name="credentials"
                    tabindex="2"
                    auto-complete="on"
                    maxlength="16"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>
            <el-button :loading="loading" type="primary" class="w-100 mb-30 mt-10" @click.native.prevent="handleLogin">登录</el-button>

            <div class="text-333 cursor-pointer text-center font-main" @click="$router.replace('/login')">商家主账号登录</div>
        </el-form>
        <verifition ref="verify" mode="pop" captcha-type="blockPuzzle" :img-size="{ width: '330px', height: '155px' }" @success="verifySuccess" />
    </div>
</template>
<script>
import Verifition from '@/components/Verifition/Verify'
import encryption from '@/utils/encryption.js'

export default {
    name: 'Login',
    components: {
        Verifition
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            // if (!validUsername(value)) {
            //     callback(new Error('Please enter the correct user name'))
            // } else {
            //     callback()
            // }
            callback()
        }
        const validatePassword = (rule, value, callback) => {
            if (!this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            } else {
                callback()
            }
        }
        return {
            loginMethod: 'passwordLogin', // 账号密码 passwordLogin  //验证码 captchaLogin
            loginForm: {
                shopIdentifier: '',
                principal: '',
                credentials: '',
                user_type: 'SHOP_SUB_USER',
                auth_type: 'PASSWORD'
            },
            loginRules: {
                phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
                principal: [{ required: true, trigger: 'blur', validator: validateUsername }],
                credentials: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            systemConfigTemp: '', // 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
            systemConfigFinally: false
        }
    },
    computed: {},
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    created() {},
    mounted() {
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
            let tempParams = Object.assign({}, this.loginForm)
            tempParams.principal = encryption(tempParams.shopIdentifier + '_' + tempParams.principal)
            tempParams.credentials = encryption(tempParams.credentials)
            this.$store
                .dispatch('user/login', { userInfo: tempParams, code: params.captchaVerification })
                .then(() => {
                    this.$router.push({ path: this.redirect || '/' })
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
            console.log(params) // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
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

/* reset element-ui css */
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
        // background: rgba(0, 0, 0, 0.1);
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
        padding: 55px 40px;
        margin: 0 auto;
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

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
            font-size: 26px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 7px;
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
