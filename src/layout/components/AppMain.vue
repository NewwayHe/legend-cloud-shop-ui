<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive v-if="cachedViews && cachedViews.length" :include="cachedViews">
                <router-view :key="$route.fullPath"></router-view>
            </keep-alive>
            <router-view v-else :key="$route.fullPath"></router-view>
        </transition>
    </section>
</template>

<script>
export default {
    name: 'AppMain',
    data() {
        return {
            isFirst: false
        }
    },
    computed: {
        /*
        visitedViews && cachedViews
        目前 tags-view 维护了两个数组。
        visitedViews : 用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
        cachedViews : 实际 keep-alive 的路由。可以在配置路由的时候通过 meta.noCache 来设置是否需要缓存这个路由 默认都缓存。
    */
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        },
        cachedViews() {
            // let cachedViews=['addGood','addFight','addCoupon','addSeckill','addGroup','addMoneyOff','addPromotion','pointsProdAdd']//强行让该页面缓存
            // return [...cachedViews,...this.$store.state.tagsView.cachedViews]
            // 之所以要加一个if 因为Keep-alive第一次不生效 导致页面会走Mounted 执行了一次页面请求
            // 随后cachedView检测到 从而导致keep-alive生效 又导致页面重渲染 走了Activited 又执行了一次页面请求
            if (this.isFirst) {
                let initViews = []
                // 取出最后一个
                let lastView = this.$store.state.tagsView.cachedViews[0]
                let firstFont = lastView[0]
                // 如果首字母是大写，则转换为小写
                if (lastView[0].match(/^.*[A-Z]+.*$/)) {
                    firstFont = lastView[0].toLowerCase()
                }
                // 如果首字母是小写，则转换为大写
                if (lastView[0].match(/^.*[a-z]+.*$/)) {
                    firstFont = lastView[0].toUpperCase()
                }
                initViews.push(lastView, firstFont + lastView.substring(1))
                this.isFirst = false
                return initViews
            } else {
                // 以下这段代码是解决当页面上的name的首字母是大写,但后台配置[平台菜单]时首字母是小写,然后页面就没有keep-alive而不走active()导致getData()方法不走而页面数据为空的问题
                const cachedViewsTemp = this.$store.state.tagsView.cachedViews.map((item) => {
                    let firstFont = item[0]
                    // 如果首字母是大写，则转换为小写
                    if (item[0].match(/^.*[A-Z]+.*$/)) {
                        firstFont = item[0].toLowerCase()
                    }
                    // 如果首字母是小写，则转换为大写
                    if (item[0].match(/^.*[a-z]+.*$/)) {
                        firstFont = item[0].toUpperCase()
                    }
                    const itemTemp = firstFont + item.substring(1)

                    return itemTemp
                })
                const cachedViewsCash = this.$store.state.tagsView.cachedViews.concat(cachedViewsTemp)
                // console.log('cachedViews:', cachedViewsCash);
                return cachedViewsCash
            }
        }
    },
    created() {
        this.initCacheView()
    },
    methods: {
        // 初始化cacheView 避免刷新后不请求数据
        initCacheView() {
            let initBefore = [this.$route.name]
            this.isFirst = true
            this.$store.dispatch('tagsView/initCachedViews', initBefore)
        }
    }
}
</script>

<style scoped>
.app-main {
    min-height: calc(100vh - 20px);
    position: relative;
    overflow: hidden;
    margin: 0 20px 0px 20px;
}
.fixed-header + .app-main {
    padding-top: 114px;
}
</style>
