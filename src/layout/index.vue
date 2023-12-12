<template>
    <div :class="classObj" class="app-wrapper">
        <noobGuide ref="noobGuide" v-if="guide && userInfo.userType=='SHOP'" :key="refresh" @refresh="test" />
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" @updated="test" />
        <div class="main-container">
            <div v-if="show" :class="{ 'fixed-header': fixedHeader }">
                <navbar />
                <tags-view />
            </div>
            <app-main />
        </div>
    </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, noobGuide } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'

export default {
    name: 'Layout',
    components: {
        Navbar,
        Sidebar,
        AppMain,
        TagsView,
        noobGuide
    },
    mixins: [ResizeMixin],
    provide() {
        return {
            showHeader: this.showHeader
        }
    },
    data() {
        return {
            show: true,
            refresh:0,
            showw:true
        }
    },
    created(){ },
    computed: {
        ...mapGetters(['userInfo','shopInfo']),

        sidebar() {
            return this.$store.state.app.sidebar
        },
        device() {
            return this.$store.state.app.device
        },
        fixedHeader() {
            return this.$store.state.settings.fixedHeader
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened && !this.guide,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        },
        guide() {
            return this.$store.state.app.guide
        }
    },
    methods: {
        showHeader() {
            this.show = !this.show
        },
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
        },
        test(){
            this.$nextTick(()=>{
                this.refresh++
            })
            
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
    @include clearfix;
    position: relative;
    // height: 100%;//这个写在了全局的index.scss的app-wrapper里
    // width: 100%;//这个写在了全局的index.scss的app-wrapper里
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 99;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
