<template>
    <div class="h-100" style="background: #eef2f6">
        <div class="bg-fff p-20 h-100 d-flex" style="min-height: calc(100vh - 150px)">
            <!-- 左边列表 -->
            <el-aside style="width: 150px">
                <el-menu class="h-100" background-color="#f5f7fa" :default-active="currendIndex">
                    <el-menu-item
                        v-for="(item, index) in menuList"
                        :key="item.id"
                        class="px-15 line-clamp1"
                        style="padding-left: 15px"
                        :index="index + ''"
                        @click="getMenuArticle(item.id, index)"
                    >
                        <span>{{ item.newsCategoryName }}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- 右边内容 -->
            <el-main>
                <div class="flex-between">
                    <div class="font-18 font-weight">{{ helpTitle }}</div>
                    <el-input v-model="searchWord" class="search-input" placeholder="请输入需要搜索的文章">
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-search rounded-50 bg-warning cursor-pointer text-fff font-20"
                            @click="SearchData"
                        ></i>
                    </el-input>
                </div>
                <section v-if="articleList.length" class="p-10">
                    <div
                        v-for="item2 in articleList"
                        v-show="isList"
                        :key="item2.id"
                        class="cursor-pointer p-20"
                        style="border-bottom: 1px solid #eee"
                        @click="getShopNewsDetail(item2.id)"
                    >
                        <div class="font-14 text-333">{{ item2.newsTitle }}</div>
                        <div class="mt-10 text-999 font-12" v-show="item2.newsBrief">{{ item2.newsBrief }}</div>
                        <div class="text-999 font-12 mt-10">{{ item2.updateTime || item2.createTime }}</div>
                    </div>
                    <div v-show="!isList" class="p-20">
                        <div class="font-24 text-333 font-weight">{{ ShopNews.newsTitle }}</div>
                        <div class="font-12 text-999 mt-15">{{ ShopNews.updateTime || ShopNews.createTime }}</div>
                        <div class="mt-40 mb-30 p-20 font-14 rounded-5 text-999" style="background: #f5f7fa">{{ ShopNews.newsBrief }}</div>
                        <div v-html="ShopNews.newsContent"></div>
                    </div>
                    <div class="mt-20 flex-end" v-show="isList">
                        <pagination
                            :current-page="pageParams.curPage"
                            :total="pageParams.total"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </div>
                </section>
                <section v-else class="w-100 flex-center flex-column" style="min-height: 600px">
                    <img src="@/assets/images/empty/pro__empty.png" alt="" />
                    <div class="text-999 font-20">暂无内容</div>
                </section>
            </el-main>
        </div>
    </div>
</template>

<script>
import { helpApi } from '@/api/ModuleHelp'

export default {
    // components: { Navbar },
    data() {
        return {
            menuList: [], // 帮助标题
            pageParams: {
                curPage: 1,
                pageSize: 10,
                total: 0,
            },
            articleList: [], // 帮助内容
            ShopNews: {}, // 帮助详情内容
            isList: true, // 列表显示
            searchWord: '', // 搜索关键字
            currendIndex: '0', // 当前激活的index
            helpTitle: '', // 标题
            helpId: null,   //帮助栏目ID
        }
    },

    created() {
        this.getMenuList()
    },
    methods: {
        // 获取所有的商家端帮助栏目
        getMenuList() {
            helpApi.getMenuList().then((res) => {
                if (res.code == 1) {
                    this.menuList = res.data
                    this.getMenuArticle(this.menuList[this.currendIndex].id)
                }
            })
        },
        // 获取栏目下所有文章
        getMenuArticle(id, index = 0) {
            this.pageParams.curPage = 1;
            this.pageParams.pageSize = 10;
            this.helpTitle = this.menuList[index].newsCategoryName // 标题
            this.helpId = id;
            this.getMenuArticleById()
        },
        // 抽离出请求方法
        getMenuArticleById() {
            helpApi.getMenuArticle({ id: this.helpId, word: this.searchWord, ...this.pageParams }).then((res) => {
                if (res.code) {
                    this.articleList = res?.data?.resultList || []
                    this.pageParams.curPage = res?.data?.curPageNO || 1
                    this.pageParams.total = res?.data?.total || 0
                    this.isList = true
                }
            })
        },
        // 搜索文章
        SearchData() {
            helpApi.searchArticle({
                    word: this.searchWord,
                    id: this.helpId,
                    ...this.pageParams,
                }).then((res) => {
                    if (res.code) {
                        this.articleList = res?.data?.resultList || []
                        this.pageParams.curPage = res?.data?.curPageNO || 1
                        this.pageParams.total = res?.data?.total || 0
                        this.isList = true
                    }
                })
            // this.currentPageChange(1);
        },
        // 文章详情
        getShopNewsDetail(id) {
            let item =this.articleList.find(v=>{return v.id===id})
            if(item.type===2){
                if(item.url.includes("http")){
                    window.open(item.url,"_blank")
                }else{
                     window.open("http://"+item.url,"_blank")
                }
                return 
            }
            helpApi.getShopNewsDetail({ id }).then((res) => {
                if (res.code == 1) {
                    this.ShopNews = res.data
                    this.isList = false
                }
            })
        },
        pageSizeChange(size) {
            this.pageParams.pageSize = size;
            this.getMenuArticleById()
        },
        currentPageChange(page) {
            this.pageParams.curPage = page;
            this.getMenuArticleById()
        }
    }
}
</script>

<style lang="scss" scoped>
.dot {
    transform: translateY(-25%);
    font-size: 30px;
    font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
    color: #007bff;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
::v-deep .el-input {
    /* width: 80vw;sss */
    max-width: 900px;
}
.main {
    /* padding: 2rem 1rem; */
    background: #fff;
    /* width: calc(100vw - 8rem); */
    min-height: calc(80vh);
}
::v-deep .el-aside {
    .el-menu {
        border: 0;
        padding: 20px 0;
        .el-menu-item {
            height: 44px;
            line-height: 44px;
            width: 100%;
            margin-left: 0;
            &:hover {
                background: #eee !important;
                color: black !important;
            }
        }
        .is-active {
            color: black !important;
            background: #fff !important;
        }
    }
}

::v-deep .el-main {
    .search-input {
        width: 760px;
        height: 44px;
        .el-input__inner {
            border-radius: 40px;
            height: 100%;
            background: #f5f7fa;
            border: 1px solid #f5f7fa;
            font-size: 15px;
        }
        .el-input__icon {
            border-radius: 40px;
            position: relative;
            left: 5px;
            display: block;
            width: 100px;
            line-height: 44px;
        }
    }
}
</style>
