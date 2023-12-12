<template>
    <div v-if="!item.hidden">
        <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)" :id="setId(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </app-link>
        </template>
        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import path from 'path'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
export default {
    name: 'SidebarItem',
    components: { Item, AppLink },
    mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data() {
        this.onlyOneChild = null
        return {}
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter((item) => {
                if (item.hidden) {
                    return false
                } else {
                    this.onlyOneChild = item
                    return true
                }
            })

            if (showingChildren.length === 1) {
                return true
            }

            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
                return true
            }

            return false
        },
        resolvePath(routePath) {
			if (this.$checkInfo([{ type: 'isExternal', value: routePath }])) {
			    return routePath
			}
			if (this.$checkInfo([{ type: 'isExternal', value: this.basePath }])) {
			    return this.basePath
			}
            return path.resolve(this.basePath, routePath)
        },
        setId(routePath){
            if(this.resolvePath(routePath)=='/ModuleSystem/orderSystem/logistics'){
                return 'guide-step2'
            }
            if(this.resolvePath(routePath)=='/ModuleSystem/orderSystem/freightTemplate'){
                return 'guide-step3'
            }
            if(this.resolvePath(routePath)=='/ModuleSystem/shopManage/ortherSet'){
                return 'guide-step4'
            }
            if(this.resolvePath(routePath)=='/ModuleGoods/GoodsManage/goodList'){
                return 'guide-step5'
            }
            if(this.resolvePath(routePath)=='/ModuleOperate/businessManage/order'){
                return 'guide-step6'
            }
            if(this.resolvePath(routePath)=='/ModuleFinance/billList'){
                return 'guide-step7'
            }
        }
    }
}
</script>
