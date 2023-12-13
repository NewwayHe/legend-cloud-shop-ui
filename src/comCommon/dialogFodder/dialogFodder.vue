<template>
    <div>
        <el-dialog
            v-if="isVisible"
            :visible.sync="isVisible"
            :close-on-click-modal="false"
            append-to-body
            title="上传素材"
            width="500px"
            @close="handleClose"
        >
            <el-tabs v-model="activeName" type="card" :before-leave="beforeChangeTab">
                <template v-for="(item, index) in tabsArr">
                    <el-tab-pane :key="index" :label="item.label" :name="item.value" lazy>
                        <component
                            :is="item.component"
                            :ref="item.component"
                            :floder-id="floderId"
                            :tree-value="treeValue"
                            :limit="limit"
                            @checkSussess="checkSussess"
                            @changeUpload="changeUpload"
                            @uploadSussess="uploadSussess"
                        ></component>
                    </el-tab-pane>
                </template>
            </el-tabs>
            <span slot="footer">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <!-- 视频和图片共用一个上传按钮 -->
                <el-button v-if="changeUploadShow == 1" v-ls-loading size="small" type="primary" @click="submitForm">上 传</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import pictureSpace from './components/picture-space.vue'
import videoSpace from './components/video-space.vue'
import zipSpace from './components/zip-space.vue'

import { materialCenter } from '@/api/ModuleSystem'

const tabsArr = [
    { value: 'IMG', label: '上传图片', component: 'pictureSpace' },
    { value: 'VIDEO', label: '上传视频', component: 'videoSpace' },
    { value: 'ZIP', label: '上传图片压缩包', component: 'zipSpace' }
]

export default {
    components: {
        pictureSpace,
        videoSpace,
        zipSpace
    },
    props: {
        treeValue: {
            type: [String, Number],
            default: ''
        },
        floderId: {
            type: [Number, String],
            required: true
        },
        // 是否展示 上传图片和视频面板 BOTH代表两个 IMG代表只展示图片面板 VIDEO只展示视频面板
        uploadTab: {
            type: String,
            default: 'BOTH'
        },
        // 当前次可上传张数[现暂时只用于图片面板]
        limit: {
            type: Number,
            default: 15
        },
        // true：为了防止客户上传完图片后在列表里找不到刚才上传的图片，上传完图片并点击【上传】后，立即选中上传的数据并且关闭弹窗(这时不用点击【确定】)[例子：商品发布上传图片]
        isEcho: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            pramas: {}, //缓存图片数据
            //树分组
            // attachmentTree: [{ id: 0, name: '默认分组' }],
            changeUploadShow: 1, //用来显示确认按钮是否显示

            isVisible: false,

            activeName: 'IMG'
        }
    },
    computed: {
        tabsArr() {
            if (this.uploadTab == 'BOTH') {
                return tabsArr
            } else if (this.uploadTab == 'IMG') {
                return [tabsArr[0]]
            } else if (this.uploadTab == 'VIDEO') {
                return [tabsArr[1]]
            }
        }
    },
    watch: {},
    created() {},
    methods: {
        //显示事件
        showDialog() {
            this.isVisible = true
        },
        // 弹窗关闭时刷新父级table数据
        handleClose() {
            this.$nextTick(() => {
                const refs = ['pictureSpace', 'videoSpace', 'zipSpace']
                for (let each of refs) {
                    if (this.$refs[each] && this.$refs[each].length) {
                        this.$refs[each][0].resetData()
                    }
                }
            })
            this.activeName = 'IMG'
            this.isVisible = false
            this.pramas = {}
        },

        //上传成功
        uploadSussess() {
            // this.isVisible = false
            if (this.activeName == 'IMG') {
                //第一个Tab
                if (this.$refs['pictureSpace']) {
                    this.$refs['pictureSpace'][0].resetData()
                }
            } else if (this.activeName == 'VIDEO') {
                if (this.$refs['videoSpace']) {
                    this.$refs['videoSpace'][0].resetData()
                }
            } else if (this.activeName == 'ZIP') {
                if (this.$refs['zipSpace']) {
                    this.$refs['zipSpace'][0].resetData()
                }
            }
            this.$message.success('上传成功！')
            if (!this.isEcho) {
                this.$parent.dbnSearch()
            }
            this.$nextTick(() => {
                //关闭弹窗
                this.isVisible = false
            })
        },

        // 网络图片提取成功[暂时不用]
        checkSussess(pramas) {
            this.pramas = pramas
        },

        //网络图片抓取成功后确认上传到分组
        updatedAttachment() {
            // fodder.attachmentUpload(this.pramas).then((res) => {
            //     if (!res.code) {
            //         this.$message.error(res.message)
            //         return
            //     }
            //     this.uploadSussess()
            // })
        },
        //用来显示底部按钮
        changeUpload(event) {
            this.activeName == 'IMG' && (this.changeUploadShow = event)
        },

        //确认
        submitForm() {
            let uploadFiles = [] //是否有上传数据
            if (this.activeName == 'IMG') {
                //第一个Tab
                if (this.$refs['pictureSpace']) {
                    let pics = this.$refs['pictureSpace'][0]['modelParams']['pic']
                    if (pics.length) {
                        //有图片
                        uploadFiles = pics
                    }
                }
            } else if (this.activeName == 'VIDEO') {
                if (this.$refs['videoSpace']) {
                    let videos = this.$refs['videoSpace'][0]['modelVideo']['video']
                    if (videos.length) {
                        //有视频
                        uploadFiles = videos
                    }
                }
            } else if (this.activeName == 'ZIP') {
                if (this.$refs['zipSpace']) {
                    let zips = this.$refs['zipSpace'][0]['modelParams']['zip']
                    if (zips.length) {
                        //有图片
                        // 使用form表单的数据格式
                        const paramsData = new FormData()
                        // 将上传文件数组依次添加到参数paramsData中
                        zips.forEach((it, index) => {
                            paramsData.append('fileFolderId', this.floderId)
                            paramsData.append(`file`, it.file) //只能上传一个文件
                        })
                        this.loadingFlag = this.$loading({ text: '正在上传' })
                        materialCenter
                            .tempUpload(paramsData)
                            .then((res) => {
                                if (res.code) {
                                    this.$emit('upload-success', uploadFiles) //上传成功后 将这次的图片返回给上层 方便直接回显
                                    this.uploadSussess() //上传成功
                                }
                            })
                            .catch((res) => {
                                // 如果10秒钟后还未上传完成,后台会上传超时
                                this.isVisible = false
                                this.loadingFlag.close()
                                this.$message.warning('上传超时，请一会后再查看上传结果！')
                            })
                            .finally(() => {
                                this.loadingFlag.close()
                            })
                    } else {
                        return this.$message.warning('请选择要上传的图片压缩包！')
                    }
                }
                return
            }

            if (!uploadFiles.length) {
                return this.$message.warning('请选择要上传的图片或者视频！')
            }
            materialCenter
                .confirmUpload({ filePath: uploadFiles, tabType: this.activeName == 'IMG' ? 1 : 2 })
                .then((res) => {
                    if (!res.code) {
                        return this.$message.error(res.message)
                    }
                    this.$emit('upload-success', uploadFiles) //上传成功后 将这次的图片返回给上层 方便直接回显
                    this.uploadSussess() //上传成功
                })
                .catch((res) => {
                    this.$message.error(res.message)
                })
        },

        // 切换tab之前 判断当前页内容是否有上传
        beforeChangeTab(nTab, oTab) {
            let uploadFiles = []
            if (oTab == 'IMG') {
                //第一个Tab
                if (this.$refs['pictureSpace']) {
                    let pics = this.$refs['pictureSpace'][0]['modelParams']['pic']
                    if (pics.length) {
                        //有图片
                        uploadFiles = pics
                    }
                }
            } else if (oTab == 'VIDEO') {
                if (this.$refs['videoSpace']) {
                    let videos = this.$refs['videoSpace'][0]['modelVideo']['video']
                    if (videos.length) {
                        //有视频
                        uploadFiles = videos
                    }
                }
            } else if (oTab == 'ZIP') {
                if (this.$refs['zipSpace']) {
                    let zips = this.$refs['zipSpace'][0]['modelParams']['zip']
                    if (zips.length) {
                        uploadFiles = zips
                    }
                }
            }
            if (uploadFiles.length) {
                return new Promise((resolve, reject) => {
                    this.$confirm('请先上传当前Tab的内容！', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning'
                    })
                        .then(() => {})
                        .catch(() => {})
                        .finally(() => {
                            reject(false)
                        })
                })
            } else {
                return true
            }
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
    }
}
.pic-item {
    border: 1px solid #e4e4e4;
    transition: all 0.8s;
    &:hover {
        border: 1px solid transparent;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
}
</style>

<style lang="scss" scoped>
::v-deep .el-dialog {
    min-width: 830px;
}
::v-deep .el-dialog__header {
    padding: 20px;
    padding-bottom: 0px;
}
</style>
