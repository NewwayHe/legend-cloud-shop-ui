<template>
    <div class="sidebar-logo-container" :class="{ collapse: collapse }">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" v-loading="!systemConfigFinally" class="w-100 h-100 flex-center" to="/">
                <ls-image
                    v-if="systemConfigTemp && systemConfigTemp.logo"
                    class="v-middle"
                    :src="systemConfigTemp.logo"
                    :options="{ w: '30', h: '30' }"
                    :is-preview="false"
                />
                <img v-else-if="systemConfigFinally" class="h-30p v-middle" style="width: 30px" src="@/assets/images/logo.png" />
                <div v-else style="width: 30px; height: 30px"></div>
            </router-link>
            <router-link v-else key="expand" v-loading="!systemConfigFinally" class="w-100 h-100 flex-center" to="/">
                <ls-image
                    v-if="systemConfigTemp && systemConfigTemp.shopSmallLogo"
                    class="v-middle"
                    :src="systemConfigTemp.shopSmallLogo"
                    :options="{ w: '120', h: '40' }"
                    :is-preview="false"
                />
                <img v-else-if="systemConfigFinally" class="w-120p v-middle" style="height: 40px" src="@/assets/images/logo-small.png" />
                <div v-else style="width: 150px; height: 50px"></div>
            </router-link>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'SidebarLogo',
    props: {
        collapse: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            systemConfigTemp: '', // 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
            systemConfigFinally: false
        }
    },
    computed: {},
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
                    // console.log('systemConfig:',this.systemConfigTemp);
                })
                .catch(() => {})
                .finally(() => {
                    this.systemConfigFinally = true
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 63px;
    line-height: 63px;
    background: rgb(25, 26, 35);
    text-align: center;
    margin-bottom: 1px;

    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style>
