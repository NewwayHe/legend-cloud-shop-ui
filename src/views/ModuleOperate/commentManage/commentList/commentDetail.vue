<template>
    <section class="">
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 表格 -->
            <detailsTable :table-list="formData" />
            <el-form ref="form" :model="formData" label-width="132px" size="small" class="mt-40 formWarp">
                <div class="form-title">用户初评</div>
                <el-form-item label="评分：">
                    <span class="leftStyle">综合评分：{{ formData.averageScore }}</span>
                    <br />
                    <span>
                        商品评分：
                        <el-rate disabled :value="formData.score" style="display: inherit" />
                    </span>
                    <br />
                    <span>
                        店铺服务：
                        <el-rate disabled :value="formData.shopScore" style="display: inherit" />
                    </span>
                    <br />
                    <span>
                        物流服务：
                        <el-rate disabled :value="formData.logisticsScore" style="display: inherit" />
                    </span>
                </el-form-item>
                <el-form-item label="评论内容：">
                    <p>{{ formData.content || '-' }}</p>
                </el-form-item>
                <el-form-item label="评论图片：">
                    <div v-if="formData.photos && formData.photos.length > 0">
                        <ls-image v-for="(item, index) in formData.photos" :key="index" class="mr-20" :src="item" :options="{ w: '100', h: '100' }"/>
                    </div>
                    <div v-else>-</div>
                </el-form-item>
                <el-form-item label="评论时间：">
                    <p>{{ formData.addTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复状态：">
                    <p v-if="formData.status == 1 && formData.replyFlag">已回复</p>
                    <p v-if="!formData.status == 1">-</p>
                    <p v-if="formData.status == 1 && !formData.replyFlag" class="status-wait">待回复</p>
                </el-form-item>
                <el-form-item label="商家回复内容：">
                    <p>{{ formData.shopReplyContent || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复时间：">
                    <p>{{ formData.shopReplyTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="平台评论状态：">
                    <span class="status-wait" v-if="formData.status == 0">待审核</span>
                    <span class="status-pass" v-if="formData.status == 1">通过</span>
                    <span class="status-veto" v-if="formData.status == -1">拒绝</span>
                </el-form-item>
                <el-form-item label="平台审核时间：">
                    <p>{{ formData.auditTime || '-' }}</p>
                </el-form-item>

                <div class="form-title mt-60">用户追评</div>
                <el-form-item label="评论内容：">
                    <p>{{ formData.addContent || '-' }}</p>
                </el-form-item>
                <el-form-item label="评论图片：">
                    <div v-if="formData.addPhotos && formData.addPhotos.length > 0">
                        <ls-image v-for="(item, index) in formData.addPhotos" :key="index" class="mr-20" :src="item" :options="{ w: '100', h: '100' }" />
                    </div>
                    <div v-else>-</div>
                </el-form-item>
                <el-form-item label="评论时间：">
                    <p>{{ formData.addAddTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复状态：">
                    <p v-if="formData.addStatus == 1 && formData.addReplyFlag">已回复</p>
                    <p v-if="!formData.addStatus == 1 || !formData.status == 1">-</p>
                    <p v-if="formData.addStatus == 1 && !formData.addReplyFlag" class="status-wait">待回复</p>
                </el-form-item>
                <el-form-item label="商家回复内容：">
                    <p>{{ formData.addShopReplyContent || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复时间：">
                    <p>{{ formData.addShopReplyTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="平台评论状态：">
                    <div v-if="formData.addCommFlag">
                        <span v-if="formData.addStatus == 0" class="status-wait">待审核</span>
                        <span v-if="formData.addStatus == 1" class="status-pass">通过</span>
                        <span v-if="formData.addStatus == -1" class="status-veto">拒绝</span>
                    </div>
                    <div v-else>-</div>
                </el-form-item>
                <el-form-item label="平台审核时间：" class="btn_lastItem">
                    <p>{{ formData.addAuditTime || '-' }}</p>
                </el-form-item>
				<LsSticky :data="formData">
					<el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
						<el-button size="small" @click="$router.go(-1)">返回</el-button>
						<el-button size="small" v-if="formData.status == 1 && !formData.replyFlag" type="primary" @click="showDialog(formData, 1)">回复初评</el-button>
						<el-button size="small" v-if="formData.addStatus == 1 && !formData.addReplyFlag" type="primary" @click="showDialog(formData, 2)"> 回复追评</el-button>
					</el-row>
				</LsSticky>
            </el-form>
        </el-card>

        <dialogComment
            ref="dialogComment"
            :comment-id="commentId"
            :comment-add-id="commentAddId"
            :comment-content="commentContent"
            :comment-type="commentType"
            @getData="getData"
        />
    </section>
</template>
<script>
import detailsTable from './components/detailsTable'
import { commentApi } from '@/api/ModuleOrder.js'
import dialogComment from './components/dialogComment'
export default {
    components: {
        detailsTable,
        dialogComment
    },
    data() {
        return {
            formData: {},
            commentContent: {}, // 内容
            commentId: '', // 评论ID
            commentAddId: '', // 追评ID
            commentType: '' // 回复类型
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取数据
        getData() {
            commentApi
                .getCommentDetail({
                    id: this.$route.query.id
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.formData = res.data
                        this.formData.photos = res.data.photos == '' ? [] : JSON.parse(res.data.photos)
                        this.formData.addPhotos = res.data.addPhotos == '' ? [] : JSON.parse(res.data.addPhotos)
                    }
                })
        },
        // 回复评论
        showDialog(content, type) {
            // type 1=初评，2=追评
            this.commentType = type
            this.commentId = this.$route.query.id
            this.commentAddId = this.$route.query.addId
            this.commentContent = content
            this.$refs.dialogComment.showDialog()
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
