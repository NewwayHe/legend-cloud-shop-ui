<template>
    <section class="formWarp">
        <el-card shadow class="px-20 sty_head">
            <div class="sty_loading d-flex a-center">
                <div>
                    <i class="el-icon-success sty-icon" />
                    <span class="sty_font">登录密码</span>
                </div>
                <div>
                    <span class="sty_fontmodel">完成手机验证后，可编辑修改登录密码</span>
                </div>
                <div>
                    <router-link :to="{ name: 'editAccountInfo', query: { type: 1, mobile: userList.mobile } }">
                        <span class="sty-fonteidt">编辑</span>
                    </router-link>
                </div>
                <div>
                    <div style="width: 1px; height: 16px; background: #ebedf5"></div>
                </div>
                <div>
                    <span class="sty_fontsit">已设置</span>
                </div>
            </div>
            <div class="sty_loading d-flex a-center">
                <div>
                    <i class="el-icon-success sty-icon" />
                    <span class="sty_font">手机号码</span>
                </div>
                <div>
                    <span class="sty_fontmodel">完成手机验证后，可编辑修改手机密码</span>
                </div>
                <div>
                    <router-link :to="{ name: 'editAccountInfo', query: { type: 2, mobile: userList.mobile } }">
                        <span class="sty-fonteidt">编辑</span>
                    </router-link>
                </div>
                <div>
                    <div style="width: 1px; height: 16px; background: #ebedf5"></div>
                </div>
                <div>
                    <span class="sty_fontsit">{{ userList.mobile }}</span>
                </div>
            </div>
        </el-card>
    </section>
</template>

<script>
import { getInfo } from '@/api/user'
export default {
    components: {},
    data() {
        return {
            userList: '',
            type: '',
            mobile: ''
        }
    },
    mounted() {
        this.getUserList()
    },
    methods: {
        //获取用户数据
        getUserList() {
            getInfo().then((res) => {
                this.userList = res.data
                this.mobile = res.data.mobile
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-text {
        font-size: 30px;
        line-height: 46px;
        line-height: 46px;
    }
}
.sty_head {
    height: 460px;
    background: #ffffff;
    border-radius: 2px;
}
.sty_loading {
    height: 80px;
    border-bottom: solid 1px #ebedf5;
}
.sty_font {
    width: 55px;
    height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    line-height: 14px;
    margin-right: 20px;
}
.sty_fontmodel {
    width: 203px;
    height: 13px;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
}
.sty-fonteidt {
    width: 24px;
    height: 12px;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #006dc7;
    line-height: 14px;
    margin: 0 20px;
}
.sty_fontsit {
    width: 20px;
    height: 6px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    line-height: 7px;
    margin-left: 20px;
}
.sty-icon {
    color: #67c23a;
    font-size: 24px;
    margin-right: 10px;
    vertical-align: middle;
}
</style>
