<template>
    <div class="navbar">
        <template v-if="isHiddenLogo">
            <Logo class="d-inline ml-30" :collapse="false" />
        </template>
        <template v-else>
            <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
            <breadcrumb class="breadcrumb-container" />
        </template>
        <div class="right-menu flex-center text-fff">
            <div class="m-10">V1.0.0</div>
            <div class="w-50p h-100 flex-center" @click.stop="$router.push({name:'excelCenter'})">
                <i class="iconfont icon-backtop1 font-20 cursor-pointer" style="transform:rotate(180deg)"></i>
            </div>
            <div class="m-10 font-14 flex-center">
                <!-- <router-link  to="/userHelpCenter">帮助中心</router-link> -->
                <router-link :to="isHiddenLogo ? '/userHelpCenter' : '/help/helpCenter'">
                    <img class="v-bottom" style="width: 18px; height: 18px" src="@/assets/icons/index/Help.png" alt="" />
                </router-link>
            </div>
            <div class="m-10 font-14">
                <router-link :to="isHiddenLogo ? '/userMessage' : '/messageManage/message'">
                <div class="position-relative">
                    <img class="v-bottom" style="width:20px;height:20px" src="@/assets/icons/index/message.png" alt="">
                    <span v-if="messegeNum" class="position-absolute _message font" style="right: -8px; top: -12px;">
                        {{ messegeNum > 99 ? '99+' : messegeNum }}
                    </span>
                </div>
                </router-link>
            </div>
            <el-dropdown class="avatar-container ml-10" trigger="click" >
                <div class="avatar-wrapper flex-center">
                    <ls-image :src="userInfo.avatar" :key="userInfo.avatar" :isPreview="false" :options="{ w: '40', h: '40', br: '20' }"></ls-image>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                    <router-link to="/ModulePerson/personal">
                        <el-dropdown-item>修改密码</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided @click.native="logout">
                        <span style="display: block">退出登录</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="startGuide" v-if="userInfo.userType=='SHOP'">
                        <span style="display: block">新手指引</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Logo from './Sidebar/Logo'

import { request } from '@/utils/request'
export default {
    components: {
        Breadcrumb,
        Hamburger,
        Logo,
    },
    props: {
        isHiddenLogo: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            systemConfigTemp: null,
            systemConfigFinally: false,
        }
    },
    computed: {
        ...mapGetters(['sidebar', 'userInfo', 'messegeNum']),
    },
    created() {
        let systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
		// 如果main.js里面执行了方法获取到系统设置
		if (systemConfig&&systemConfig.id) {
			this.systemConfigTemp = systemConfig
			this.systemConfigFinally = true
		// 如果VUEX里没有设置systemConfig(系统设置)
		}else{
			this.$store
			    .dispatch('user/getSystemConfig')
			    .then((res) => {
					this.systemConfigTemp = res
					// console.log('systemConfig:',this.systemConfigTemp);
			    })
			    .catch(() => {
			    }).finally(()=>{
					this.systemConfigFinally = true
				})
		}
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login`)
			this.$store.dispatch('tagsView/delAllVisitedViews')//不把标签视图清空的话，切换另一个没权限的角色，他仍然能通过标签进入他没权限的页面
        },
        startGuide(){ //开启新手指引
            window.localStorage.setItem('guide',true)
            this.$store.dispatch('app/setGuide', true)
        },
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 63px;
    overflow: hidden;
    position: relative;
    background: #191a23;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 60px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }
    ._message{
        display: block;
        padding: 2px 4px;
        line-height: 1.2;
        background:#F56C6C;
        border-radius: 100px;
        text-align: center;
    }

    .right-menu {
        float: right;
        height: 100%;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 36px;
            .avatar-wrapper {
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                ::v-deep .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
