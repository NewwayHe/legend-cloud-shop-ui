<template>
    <div>
        <Navbar :is-hidden-logo="true" />
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <el-radio-group v-model="radioCur" class="my-10" size="medium" @change="changeStatus">
                <el-radio-button label="0">系统通知</el-radio-button>
                <el-radio-button label="1">我的公告</el-radio-button>
            </el-radio-group>
            <!-- 内容 -->
            <el-row class="mt-20">
                <el-col>
                    <section v-for="(item, index) in list" :key="index" class="flex-between mb-15 p-20" style="border: 1px solid #eee">
                        <div class="d-flex" style="max-width: 80%">
                            <div class="flex-center flex-shrink" style="width: 40px; height: 40px">
                                <img :src="radioCur == '0' ? imgSrc1 : imgSrc2" class="w-100 h-100" alt="" />
                            </div>
                            <div class="ml-20 d-flex flex-column j-sb w-100" style="">
                                <div class="d-flex">
                                    <span v-if="item.status == 0" class="redDot"></span>
                                    <div class="line-clamp1 font-14">{{ item.title }}</div>
                                </div>
                                <div v-if="radioCur == '0'" class="line-clamp1 text-999 font-12">{{ item.recDate }}&emsp;{{ item.content }}</div>
                                <div v-if="radioCur == '1'" class="d-flex font-12">
                                    <div class="text-999">{{ item.updateTime || item.createTime }}&emsp;</div>
                                    <span v-if="$options.filters.imgFilter(item.content)" class="line-clamp1" v-html="item.content"></span>
                                </div>
                            </div>
                        </div>
                        <el-link type="primary" :underline="false" class="font-12" @click="goMessageDetail(item.id)">查看&nbsp;&gt;&gt;</el-link>
                    </section>
                </el-col>
            </el-row>
			<LsSticky :data="list">
				<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
					 <!-- 分页- 系统通知-->
					<pagination :current-page="pages1.curPage" :page-size="pages1.pageSize" :total="pages1.total" @size-change="pageSizeChange" @current-change="currentPageChange" v-if="radioCur == '0'"/>
					<!-- 分页- 我的公告 -->
					<pagination :current-page="pages2.curPage" :page-size="pages2.pageSize" :total="pages2.total" @size-change="pageSizeChange" @current-change="currentPageChange" v-else/>
				</el-row>
			</LsSticky>
            <dialogMessage ref="dialogMessage" :msg-id="msgId" @closeMsg="closeDialogMessage" />
        </el-card>
    </div>
</template>

<script>
import { messageApi } from '@/api/ModuleCommon'
import dialogMessage from './components/dialogMessage'
import Navbar from '@/layout/components/Navbar'

export default {
    name: 'Message',
    components: { dialogMessage, Navbar },
    filters: {
        // 过滤图片
        imgFilter(val) {
            if (/<img/gi) {
                return false
            } else {
                return true
            }
        }
    },
    data() {
        return {
            radioCur: '0', // 菜单选中
            pages1: {
                pageSize: 10, // 页容量
                curPage: 1, // 当前页
                total: 0 // 总条数
            },
            pages2: {
                pageSize: 10,
                curPage: 1,
                total: 0
            },
            list: [], // 数据
            imgSrc1: require('@/assets/images/download-icon.png'), // 系统通知图标
            imgSrc2: require('@/assets/images/message-icon.png'), // 我的公告图标
            msgId: ''
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 切换状态
        changeStatus() {
            this.getData()
        },
        // 获取数据
        getData() {
            if (this.radioCur == '0') {
                // 系统通知
                messageApi
                    .getMsgList({
                        curPage: this.pages1.curPage,
                        pageSize: this.pages1.pageSize
                    })
                    .then((res) => {
                        if (res.code) {
                            this.pages1.total = res?.data?.total || 0
                            this.pages1.curPage = res?.data?.curPageNO || 1
                            this.pages1.pageSize = res?.data?.pageSize || 10
                            this.list = res?.data?.resultList || []
                        }
                    })
            } else {
                // 我的公告
                messageApi
                    .getPubList({
                        curPage: this.pages2.curPage,
                        pageSize: this.pages2.pageSize
                    })
                    .then((res) => {
                        if (res.code) {
                            this.pages2.total = res?.data?.total || 0
                            this.pages2.curPage = res?.data?.curPageNO || 1
                            this.pages2.pageSize = res?.data?.pageSize || 10
                            this.list = res?.data?.resultList || []
                        }
                    })
            }
        },
        // 去详情
        goMessageDetail(id) {
            if (this.radioCur == '0') {
                this.msgId = id
                this.$refs.dialogMessage.showDialog()
            } else {
                this.$router.push({ name: 'messageDetail', query: { pubId: id } })
            }
        },
        // 关闭弹框的回调
        closeDialogMessage(e) {
            if (e) {
                this.getData()
            }
        },
        // 改变页容量
        pageSizeChange(e) {
            if (this.radioCur == '0') {
                this.pages1.pageSize = e
            } else {
                this.pages2.pageSize = e
            }
            this.getData()
        },
        // 改变当前页
        currentPageChange(e) {
            if (this.radioCur == '0') {
                this.pages1.curPage = e
            } else {
                this.pages2.curPage = e
            }
            this.getData()
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
    }
}
</script>
<style lang="scss" scoped>
.redDot {
    display: block;
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    margin-right: 10px;
    margin-top: 2px;
    background: #f56c6c;
    border-radius: 50%;
    box-shadow: 0 0 5px #f56c6c;
}
</style>
