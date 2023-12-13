<template>
    <div :class="{ 'has-logo': showLogo }">
        <logo v-if="showLogo" :collapse="isCollapse && !guide" />
        <storeInfo :collapse="isCollapse && !guide" />
        <el-scrollbar wrap-class="scrollbar-wrapper" class="pb-30">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse && !guide"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :unique-opened="true"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="false"
                mode="vertical"
                class="mb-30"
            >
                <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import storeInfo from './storeInfo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
    components: { SidebarItem, Logo, storeInfo },
    computed: {
        ...mapGetters(['permission_routes', 'sidebar', 'guide']),
        activeMenu() {
            const route = this.$route
            const { meta, path } = route
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    },
    updated() {
        console.log('sidebarIPDATE')
        this.$emit('updated')
    }
}
</script>
