<template>
    <div class="box" @click.stop="go()">
        <el-container class="container">
            <el-aside class="aside"><slot></slot></el-aside>
            <el-main class="mainCon">
                <div class="title">{{ title }}</div>
                <div class="describe">
                    <p>{{ describe1 }}</p>
                    <p>{{ describe2 }}</p>
                    <p>{{ describe3 }}</p>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
export default {
    props: ['title', 'describe1', 'describe2', 'describe3', 'url'],
    data() {
        return {}
    },
    methods: {
        go() {
            this.$router.push({ name: this.url })
        }
    }
}
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    cursor: pointer;
    &::before {
        padding-top: 0;
    }
    .container {
        width: 100%;
        height: 100%;
        background-color: #f9f9f9;
        // margin-top: 15px;
        // margin-bottom: 6px;
        overflow: hidden;
        .aside {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px !important;
        }
        .mainCon {
            padding-left: 0;
            padding-right: 0;
            padding-bottom: 17px;
            .title {
                height: 18px;
                font-size: 14px;
                color: #333333;
                font-weight: bold;
            }
            .describe {
                font-size: 12px;
                color: #999999;
                font-weight: 400;
                padding-top: 9px;
                // p {
                //     padding-top: 9px;
                // }
            }
        }
    }
}
</style>
