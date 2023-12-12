<template>
    <div>
        <el-dialog :visible.sync="isVisible" :before-close="handleClose" :show-close="false" :title="title" custom-class="rounded-3 dialog-form">
            <el-container v-if="!isUpload" style="height: 550px">
                <el-aside width="150px" class="bg-bg">
                    <div class="category-container">
                        <div
                            v-for="(item, index) in attachmentTree"
                            :key="index"
                            class="category-item"
                            :class="{ active: index == activeIndex }"
                            @click="switchTreeNode(index, item.id)"
                        >
                            <span class="category-name">{{ item.name }}</span>
                        </div>
                    </div>
                </el-aside>

                <el-container class="main">
                    <el-main>
                        <el-button v-if="!isUpload" size="small" @click="switchTo">上传</el-button>

                        <el-row class="my-20" :gutter="15" type="flex" style="flex-wrap: wrap">
                            <template v-for="(item, index) in tableList">
                                <el-col :key="index" :span="6" class="mb-15 text-center cursor-pointer">
                                    <div
                                        class="d-flex flex-col-center py-10 pic-item"
                                        :class="{ active: filterImg.includes(item.filePath) }"
                                        @click="choose(item.filePath)"
                                    >
                                        <ls-image :src="item.filePath" :options="{ w: '130', h: '130' }" :isPreview="false" />
                                        <span class="mt-10 line-clamp1 px-10">{{ item.fileName }}</span>
                                    </div>
                                </el-col>
                            </template>
                        </el-row>

                        <el-row type="flex" justify="center">
                            <el-pagination
                                background
                                layout="total, prev, pager, next"
                                :total="tableTotal"
                                @size-change="pageSizeChange"
                                @current-change="currentPageChange"
                            ></el-pagination>
                        </el-row>
                    </el-main>
                </el-container>
            </el-container>
            <span slot="footer">
                <template v-if="!isUpload">
                    <el-button size="small" @click="handleClose">取 消</el-button>
                    <el-button v-ls-loading size="small" type="primary" @click="submitPic">确定</el-button>
                </template>

                <template v-else>
                    <el-button size="small" @click="isUpload = false">取 消</el-button>
                    <el-button v-ls-loading size="small" type="primary" :disabled="changeUploadShow == 2" @click="submitForm">确定</el-button>
                </template>
            </span>

            <picture-space
                v-show="isUpload"
                ref="pictureSpace"
                :attachment-tree="attachmentTree"
                :tree-value="searchFilters.treeId"
                @success="successF"
                @changeUpload="changeUpload"
            />
        </el-dialog>
    </div>
</template>
<script>
import pictureSpace from '@/comCommon/dialogFodder/components/picture-space.vue'
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { Alert } from 'element-ui'
export default {
    components: {
        pictureSpace
    },
    mixins: [common, cud],
    data() {
        return {
            isUpload: true,
            isVisible: false,
            attachmentTree: [{ id: 0, name: '默认分组' }],
            activeIndex: 0,
            changeUploadShow: 1,
            searchFilters: {
                treeId: 0,
                fileType: 'IMG' //文件类型，图片:IMG、视频:VIDEO、文本:TEXT、语音:VOICE、其它:OTHER
            },
            page: {
                // 表格页码
                pageSize: 8
            },
            url: {
                getData: '/s/attachment/page'
            },
            filterImg: [] //选中的图片
        }
    },
    computed: {
        title() {
            return this.isUpload == false ? '我的图片' : '上传图片'
        }
    },
    mounted() {
    },
    methods: {
        showDialog() {
            this.isVisible = true
        },
        // 点击模板时初始化数据
        handleClose() {
            this.resetFields()
            this.filterImg = []
            this.isVisible = false
        },
        //获取树
        loadAttachmentTree(flag = false) {
            // (this.attachmentTree = [{ id: 0, name: '默认分组' }]),
            //     fodder.attachmentTree(0).then((res) => {
            //         console.log('res1=========', res)
            //         res.data && (this.attachmentTree = [...this.attachmentTree, ...res.data])
            //     })
        },

        //切换树节点
        switchTreeNode(index, id) {
            if (this.activeIndex == index) {
                return
            }
            this.searchFilters.treeId = id
            this.activeIndex = index
            this.filterImg = []
            this.dbnSearch()
        },

        //切换模式
        switchTo() {
            this.isUpload = true
        },

        successF(event) {
            this.isVisible = false
            console.log('event==========', event)
            this.$emit('success', [...event.files])
            this.resetFields()
        },

        choose(img) {
            if (this.filterImg.includes(img)) {
                this.filterImg = this.filterImg.filter((v) => v != img)
            } else {
                this.filterImg.push(img)
            }
        },

        //确认
        submitForm() {
            this.$nextTick(() => {
                // this.$refs['pictureSpace'][0].check()
                this.$refs['pictureSpace'].check()
            })
        },

        //图片的确认
        submitPic() {
            this.$emit('submitPic', this.filterImg)
            console.log(this.filterImg)
        },

        //用来显示底部按钮  -- 这样的写法有点烂
        changeUpload(event) {
            this.changeUploadShow = event
        },

        resetFields() {
            this.isUpload = false
            this.searchFilters.treeId = 0
            this.searchFilters.fileType = 'IMG'
            this.activeIndex = 0
        }
    }
}
</script>

<style lang="scss" scoped>
$--color-primary: #ffa800;
.category-container {
    .category-item {
        height: 44px;
        line-height: 44px;
        padding: 0 20px;
        cursor: pointer;
        display: flex;
        transition: all 0.5s;
        font-size: 14px;
        &:hover {
            background: #fff6e6 !important;
            color: $--color-primary;
        }
        .category-name {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .category-num {
            margin-left: auto;
        }
        &.active {
            color: $--color-primary;
        }
    }
}
.pic-item {
    border: 1px solid #e4e4e4;
    transition: all 0.8s;
    position: relative;
    &:hover {
        border: 1px solid transparent;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    &.active {
        &:before {
            position: absolute;
            right: 0;
            bottom: -2px;
            color: $--color-primary;
            content: '\e623';
            font-family: 'iconfont' !important;
            font-size: 16px;
            vertical-align: middle;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    }
}
</style>

<style lang="scss" scoped>
::v-deep .main .el-main {
    padding: 0px 20px !important;
}
::v-deep .dialog-form .el-dialog__header {
    border-bottom: 1px solid #dcdee0;
    padding: 10px;
}
::v-deep .dialog-form .el-dialog__title {
    font-weight: 500;
    font-size: 14px;
}
</style>
