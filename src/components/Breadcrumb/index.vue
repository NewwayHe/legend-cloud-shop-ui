<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
            <span
                class="no-redirect"
                v-html="item.meta.title.includes('/') ? item.meta.title.split('/').join('&nbsp;  / &nbsp;') : item.meta.title"
            ></span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            levelList: null
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    created() {
        this.getBreadcrumb()
    },
    computed: {
        ...mapGetters(['accessedRoutes'])
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
            this.levelList = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
        },
        isDashboard(route) {
            const name = route && route.name
            if (!name) {
                return false
            }
            return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
        },
        pathCompile(path) {
            const { params } = this.$route
            var toPath = pathToRegexp.compile(path)
            return toPath(params)
        },
        handleLink(item) {
            // const { redirect, path } = item
            // if (redirect) {
            //     this.$router.push(redirect)
            //     return
            // }
            // this.$router.push(this.pathCompile(path))
        }
    }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb ::v-deep {
    display: inline-block;
    font-size: 14px;
    line-height: 63px;
    margin-left: 8px;
    .el-breadcrumb__inner.is-link,
    .el-breadcrumb__inner a {
        color: #fff;
    }

    .no-redirect {
        color: #fff;
        cursor: text;
    }
}
</style>
