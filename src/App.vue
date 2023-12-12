<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
    name: 'App',
    created(){
        if(!!window.ActiveXObject || "ActiveXObject" in window){
            this.$confirm('检查到当前使用IE浏览器，可能会影响正常使用，是否下载Chrome浏览器?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.openChrome()
            }).catch(() => {
                return  
            });
        }
    },

    methods:{
        openChrome(){
            window.open('https://www.google.cn/intl/zh-CN/chrome/','_blank')

        }
    }
}
</script>
<style lang="scss">
@import './styles/index.scss';
</style>
