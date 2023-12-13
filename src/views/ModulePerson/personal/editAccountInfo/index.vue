<template>
    <section class="formWarp">
        <el-card class="shopMoveIn__con" shadow>
            <!-- 头部类型 -->
            <el-steps :active="step" align-center class="mt-100">
                <el-step title="验证手机" :icon="step > 0 ? 'el-icon-success' : ''">
                    <template slot="title">
                        <span class="font-14">验证手机</span>
                    </template>
                    <template slot="description"></template>
                </el-step>
                <el-step title="修改密码" description="" :icon="step > 1 ? 'el-icon-success' : ''">
                    <template v-if="type == 1" slot="title">
                        <span class="font-14">修改密码</span>
                    </template>
                    <template v-if="type == 2" slot="title">
                        <span class="font-14">绑定新手机</span>
                    </template>
                </el-step>
                <el-step title="修改结果" description="" :icon="step > 2 ? 'el-icon-success' : ''">
                    <template slot="title">
                        <span class="font-14">修改结果</span>
                    </template>
                </el-step>
            </el-steps>
            <!-- 底下部分 -->
            <template>
                <!-- 第一步 -->
                <el-form
                    v-show="step == 0"
                    ref="formStep1"
                    :model="params"
                    class="formWarp m-auto mt-20"
                    style="width: 600px"
                    label-width="130px"
                    size="small"
                >
                    <el-form-item label="手机号码：">
                        <span>{{ params.mobile }}</span>
                    </el-form-item>
                    <div class="d-flex a-center">
                        <el-form-item v-if="type == 1" label="短信验证码：" prop="code" class="flex-1" style="margin: 0">
                            <el-input ref="password" v-model="params.code" name="password" tabindex="2" auto-complete="on" />
                        </el-form-item>
                        <el-form-item v-if="type == 2" label="短信验证码：" prop="code" class="flex-1" style="margin: 0">
                            <el-input ref="password" v-model="phoneNum.code" name="password" tabindex="2" auto-complete="on" />
                        </el-form-item>
                        <codeVerify
                            v-if="type == 1"
                            code-type="MODIFY_LOGIN_PASSWORD"
                            class="ml-10"
                            use-verifition
                            :mobile="params.mobile"
                        ></codeVerify>
                        <codeVerify
                            v-if="type == 2"
                            code-type="MODIFY_BINDING_MOBILE"
                            class="ml-10"
                            use-verifition
                            :mobile="phoneNum.mobile"
                        ></codeVerify>
                    </div>

                    <el-row v-if="type == 1" class="text-center mt-30">
                        <el-button plain size="small" @click="$router.push({ name: 'personal' })">返回</el-button>
                        <el-button type="primary" size="small" @click="nextStep('formStep1')">下一步</el-button>
                    </el-row>
                    <el-row v-if="type == 2" class="text-center mt-30">
                        <el-button plain size="small" @click="$router.push({ name: 'personal' })">返回</el-button>
                        <el-button type="primary" size="small" @click="nextStep2('formStep2')">下一步</el-button>
                    </el-row>
                </el-form>
                <!-- 第二步 -->
                <el-form
                    v-show="step == 1"
                    ref="formStep2"
                    class="formWarp m-auto mt-50"
                    style="width: 600px"
                    :model="params"
                    :rules="rules"
                    label-width="130px"
                    size="small"
                >
                    <!-- 在此处写是密码修改 -->
                    <template v-if="type == 1">
                        <el-form-item label="请输入密码：" prop="password">
                            <el-input
                                v-model="params.password"
                                class="mb-10"
                                style="width: 450px"
                                placeholder="5-16个字符长度，由数字、字母不含特殊字符组成"
                                clearable
                                maxlength="16"
                            />
                        </el-form-item>
                        <el-form-item label="" prop="contactName">
                            <span>密码安全度：</span>
                            <span v-if="checkPassword == 1">低</span>
                            <span v-if="checkPassword == 2">中</span>
                            <span v-if="checkPassword == 3">高</span>
                            <div class="sty_leaves">
                                <template v-if="checkPassword == 0">
                                    <div class="weak sty_leave"></div>
                                    <div class="weak sty_leave"></div>
                                    <div class="weak sty_leave"></div>
                                </template>
                                <template v-if="checkPassword == 1">
                                    <div class="weak sty_leave" :class="{ active: isTrue }"></div>
                                    <div class="weak sty_leave"></div>
                                    <div class="weak sty_leave"></div>
                                </template>
                                <template v-if="checkPassword == 2">
                                    <div class="weak sty_leave" :class="{ active: isTrue }"></div>
                                    <div class="weak sty_leave" :class="{ middle: isTrue }"></div>
                                    <div class="weak sty_leave"></div>
                                </template>
                                <template v-if="checkPassword == 3">
                                    <div class="weak sty_leave" :class="{ active: isTrue }"></div>
                                    <div class="weak sty_leave" :class="{ middle: isTrue }"></div>
                                    <div class="weak sty_leave" :class="{ strong: isTrue }"></div>
                                </template>
                            </div>
                        </el-form-item>
                    </template>
                    <!-- 在此处写是手机修改 -->
                    <template v-if="type == 2">
                        <el-form-item label="新手机号码：" prop="mobile">
                            <el-input
                                v-model="phoneNum.mobile"
                                style="width: 450px"
                                placeholder="请输入"
                                clearable
                                :oninput="$inputInteger"
                                maxlength="11"
                            />
                        </el-form-item>
                        <div class="d-flex" prop="code">
                            <el-form-item label="短信验证码：" class="flex-1">
                                <el-input ref="mobile" v-model="phoneNum.code" name="mobile" tabindex="2" auto-complete="on" />
                            </el-form-item>
                            <codeVerify code-type="CONFIRM_MOBILE_BIND" class="ml-10" use-verifition :mobile="phoneNum.mobile"></codeVerify>
                        </div>
                    </template>

                    <el-row v-if="type == 1" class="text-center mt-30">
                        <el-button plain @click="$router.push({ name: 'personal' })">返回</el-button>
                        <ls-button type="primary" :async-function="() => nextStep('formStep2')">完成</ls-button>
                    </el-row>
                    <el-row v-if="type == 2" class="text-center mt-30">
                        <el-button plain @click="$router.push({ name: 'personal' })">返回</el-button>
                        <ls-button type="primary" :async-function="() => nextStep2('formStep2')">完成</ls-button>
                    </el-row>
                </el-form>
            </template>
            <!-- 显示第三步区域 -->
            <template>
                <el-form
                    v-show="status == 1"
                    ref="formStep3"
                    class="formWarp m-auto mt-50"
                    style="width: 600px"
                    :model="params"
                    :rules="rules"
                    label-width="130px"
                    size="small"
                >
                    <div class="text-center">
                        <i class="el-icon-success text-main" style="font-size: 120px"></i>
                        <div class="font-24 mt-50">修改成功</div>
                        <div v-if="type == 1" class="font-14 text-999 mt-20 mb-60">登录密码设置成功，可以退出登陆后重新登陆</div>
                        <div v-if="type == 2" class="font-14 text-999 mt-20 mb-60">
                            手机号码设置成功，新绑定的手机号码为
                            <span>{{ phoneNum.mobile }}</span>
                        </div>
                        <el-button v-if="type == 1" type="primary" @click.native="logout">退出登录</el-button>
                        <el-button v-if="type == 2" type="primary" @click="$router.push({ name: 'personal' })">确定</el-button>
                    </div>
                </el-form>
            </template>
            <!-- 失败的验证 -->
            <template>
                <el-form v-show="status == -1" ref="form" class="formWarp m-auto mt-100" style="width: 600px" label-width="130px" size="small">
                    <div class="text-center">
                        <img class="w-100p h-100p" src="@/assets/images/warn.png" />
                        <div v-if="type == 1" class="font-24 mt-30 mb-30">登录密码设置失败，需要重新设置</div>
                        <div v-if="type == 2" class="font-24 mt-30 mb-30">手机号码设置失败，失败原因</div>
                        <el-button type="primary" @click="goEdit">重新设置</el-button>
                        <el-button type="primary" @click="$router.push({ name: 'personal' })">取消修改</el-button>
                    </div>
                </el-form>
            </template>
        </el-card>
    </section>
</template>
<script>
import Upload from '@/components/Upload'
import { mapGetters } from 'vuex'
import codeVerify from '@/components/codeVerify'
import Verifition from '@/components/Verifition/Verify'
import { editPersonInfo } from '@/api/ModuleSystem'
export default {
    name: 'EditPersonInfo',
    components: { Upload, Verifition, codeVerify },

    data() {
        const validateCode = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('请输入验证码'))
            } else {
                callback()
            }
        }

        const validatePassword = (rule, value, callback) => {
            if (!value || !this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            } else {
                callback()
            }
        }
        return {
            form: {},
            status: '', //审核通过=1，，审核拒绝=-1，
            step: 0, // 步骤step=1为修改密码,step=2修改手机号码
            errMsg: false,
            //验证密码参数
            params: {
                code: '', //验证码
                codeType: 'MODIFY_LOGIN_PASSWORD', // 验证码类型
                shopName: '', //店铺名称
                userType: 'SHOP', //用户类型
                mobile: '', //手机号码
                password: '' //密码
            },
            //验证手机号码参数
            phoneNum: {
                code: '', //验证码
                codeType: 'MODIFY_BINDING_MOBILE', //验证码类型
                mobile: '',
                password: '', //密码
                userType: 'SHOP',
                oldCode: '' //
            },
            rules: {
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                shopName: [{ required: true, message: `请输入店铺名称`, trigger: 'blur' }],
                codeType: [{ validator: validateCode, required: true }]
            },
            type: 0, //1.登录密码 2.手机号码
            mobile: '', //手机号码
            isTrue: true
        }
    },
    computed: {
        checkPassword() {
            let value = this.params.password
            var modes = 0
            //正则表达式验证符合要求的
            if (/\d/.test(value)) modes++ //数字
            if (/[a-z]/.test(value)) modes++ //小写
            if (/[A-Z]/.test(value)) modes++ //大写
            if (/\W/.test(value)) modes++ //特殊字符

            return modes
            // 做页面样式显示
            // modes == 1 密码强度低  modes == 2或3  密码强度中  modes == 4 密码强度高
        }
    },
    watch: {
        checkPassword(newVal) {
            console.log(newVal)
        }
    },
    created() {
        this.type = this.$route.query.type
        this.params.mobile = this.$route.query.mobile
        this.phoneNum.mobile = this.$route.query.mobile
    },
    mounted() {},
    methods: {
        //退出登录:
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login`)
        },
        verifySuccess() {},
        goEdit() {
            this.step = 1
            this.status = 0
            this.params.password = ''
        },
        //修改密码
        nextStep(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //修改密码
                    if (this.step == 0 && this.type == 1) {
                        //修改密码验证码请求
                        editPersonInfo
                            .codeUpdate(this.params)
                            .then((res) => {
                                if (res.code == 1) {
                                    this.step++
                                }
                            })
                            .catch((err) => {
                                return
                            })
                    } else if (this.step == 1 && this.type == 1) {
                        //重置密码
                        editPersonInfo
                            .resetPassword(this.params)
                            .then((res) => {
                                this.step = 3
                                if (res.code == 1) {
                                    // this.step++
                                    this.status = 1
                                } else {
                                    this.status = -1
                                }
                            })
                            .catch((err) => {
                                this.step++
                                this.status = -1
                            })
                    }
                    // this.step++
                } else {
                    return false
                }
            })
        },
        //修改新手机号码
        nextStep2(formName) {
            return new Promise((resolve) => {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //修改手机号码
                        if (this.step == 0 && this.type == 2) {
                            //修改手机号码验证码请求
                            editPersonInfo
                                .codeUpdate(this.phoneNum)
                                .then((res) => {
                                    if (res.code == 1) {
                                        this.step++
                                        this.phoneNum.oldCode = res.data
                                    }
                                    this.phoneNum.code = ''
                                    this.phoneNum.mobile = ''
                                })
                                .finally((_) => {
                                    resolve()
                                })
                        } else if (this.step == 1 && this.type == 2) {
                            //更改新手机号码
                            editPersonInfo
                                .phoneUpdate(this.phoneNum)
                                .then((res) => {
                                    this.step = 3
                                    if (res.code == 1) {
                                        this.status = 1
                                    } else {
                                        this.status = -1
                                    }
                                })
                                .catch((err) => {
                                    this.step++
                                    this.status = -1
                                })
                                .finally((_) => {
                                    resolve()
                                })
                        }
                    } else {
                        resolve()
                        return false
                    }
                })
            })
        },

        stepBack(formName) {
            if (this.step == 2) {
                this.$refs[formName].resetFields()
                this.status = ''
            }

            this.step--
        }
    }
}
</script>
<style scoped>
.sty_leaves {
    margin-left: 70px;
}
.sty_leave {
    display: inline-block;
}
.strong {
    background-color: #66cc00;
}
.middle {
    background-color: #ffcc33;
}
.active {
    background-color: red;
}
.weak {
    width: 30px;
    height: 17px;
    float: righ;
    margin-left: 5px;
}
.sty_size {
    width: 80px;
    height: 30px;
}
.sty_code {
    width: 100px;
    height: 30px;
    background: #dcdfe6;
    border-radius: 1px;
    font-size: 6px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    line-height: 3px;
}
body {
    background-color: #fff !important;
}
</style>
<style lang="scss" scoped>
.formWarp {
    background-color: #ffffff;

    .shopMoveIn__con {
        margin: 0 auto;
        height: 600px;
        background-color: #ffffff;
        ::v-deep.el-step.is-horizontal {
            .el-step__line {
                height: 1px;
                overflow: hidden;
            }
        }
        ::v-deep.el-step__title.is-wait {
            font-size: 12px;
        }

        ::v-deep.el-step__line {
            background-color: #ebf1f7;
        }
        ::v-deep.el-step__head.is-success {
            border-color: #e8eaec;
        }
        ::v-deep.el-step__title.is-finish {
            color: #67c23a;
        }
        ::v-deep.el-step__description.is-finish {
            color: #67c23a;
        }
        ::v-deep.el-step__head.is-finish {
            color: #67c23a;
        }
        ::v-deep.el-step__head.is-finish {
            border-color: #67c23a;
        }
    }
}
</style>
