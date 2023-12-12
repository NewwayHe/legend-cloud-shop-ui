<template>
    <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}" v-loading="tableListLoading">
        <el-radio-group v-model="radioCur" class="my-10" size="medium" @change="changeStatus">
            <el-radio-button label="0">系统通知</el-radio-button>
            <el-radio-button label="1">我的公告</el-radio-button>
        </el-radio-group>
        <!-- 内容 -->
        <el-row class="mt-20">
            <el-col v-if="list.length">
                <section v-for="(item, index) in list" :key="index" class="flex-between mb-15 p-20" style="border: 1px solid #eee">
                    <div class="d-flex" style="max-width: 90%">
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
                    <el-link type="primary" :underline="false" class="font-12" @click="goMessageDetail(item)">查看&nbsp;&gt;&gt;</el-link>
                </section>
            </el-col>
            <el-col v-else class="w-100 flex-center flex-column">
                <empty empty-type="pro" text="暂无内容" />
            </el-col>
        </el-row>
		<LsSticky :data="list">
			<el-row type="flex" :justify="radioCur == '0'?'space-between':'end'" class="w-100 overflow-h py-10 mt-10 bg-white">
				<el-button size="small" type="primary" @click="cleanUnread" v-if="radioCur == '0'">清除未读</el-button>
				 <!-- 分页- 系统通知-->
				<pagination :current-page="pages1.curPage" :page-size="pages1.pageSize" :total="pages1.total" @size-change="pageSizeChange" @current-change="currentPageChange" v-if="radioCur == '0'"/>
				<!-- 分页- 我的公告 -->
				<pagination :current-page="pages2.curPage" :page-size="pages2.pageSize" :total="pages2.total" @size-change="pageSizeChange" @current-change="currentPageChange" v-else/>
			</el-row>
		</LsSticky>
        <dialogMessage ref="dialogMessage" :msg-id="msgId" @closeMsg="closeMsg" />
    </el-card>
</template>

<script>
import { messageApi } from '@/api/ModuleCommon'
import dialogMessage from './components/dialogMessage'

export default {
    name: 'Message',
    components: { dialogMessage },
    filters: {
        // 过滤图片
        imgFilter(val) {
            if (/<img/gi.test(val)) {
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
            msgId: '',
            curCheckItem: null, //当前查看项
			tableListLoading: false, // 表格请求loading
        }
    },
    created() {
        if (this.$route.query.radioCur) {
            this.radioCur = this.$route.query.radioCur + ''
        }
        this.getData()
    },
    methods: {
        // 切换状态
        changeStatus() {
			this.list = []
            this.getData()
        },
        // 获取数据
        getData() {
			this.tableListLoading = true
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
                    }).finally(() => {
						this.tableListLoading = false
					})
            } else {
                // 我的公告
                messageApi
                    .getPubList({
                        curPage: this.pages2.curPage,
                        pageSize: this.pages2.pageSize
                    })
                    .then((res) => {
                        if (res.code == 1) {
                            this.pages2.total = res?.data?.total || 0
                            this.pages2.curPage = res?.data?.curPageNO || 1
                            this.pages2.pageSize = res?.data?.pageSize || 10
                            this.list = res?.data?.resultList || []
                        }
                    }).finally(() => {
						this.tableListLoading = false
					})
            }
        },
        // 去详情
        goMessageDetail(item) {
            if (this.radioCur == '0') {
                this.msgId = item.id;
                this.curCheckItem = item;
                this.$refs.dialogMessage.showDialog();
            } else {
                this.$router.push({ name: 'messageDetail', query: { pubId: item.id } })
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
        closeMsg() {
            if(this.curCheckItem.status == 0) {
                this.curCheckItem.status = 1;
                this.$nextTick(() => {  //刷新未读消息数
                    this.$store.dispatch('user/getMsgInfo')
                })
            }
        },
		cleanUnread(){
			this.$confirm('是否清除所有未读消息?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
				messageApi.cleanUnread().then(res => {
					if(res.code) {
						this.$message({type: 'success',message: '操作成功!'})
						this.getData()
						this.$nextTick(() => {  //刷新未读消息数
						    this.$store.dispatch('user/getMsgInfo')
						})
					}
				})
			})
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
