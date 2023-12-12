<template>
    <section class="">
        <el-container>
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
                        <el-popover v-if="item.id != 0" v-model="item.visibleEdit" :plain="true" placement="bottom" width="180">
                            <el-input v-model="inputConten" size="mini" placeholder="文件夹名称" maxlength="10" class="mb-5" />
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="item.visibleEdit = !item.visibleEdit">取消</el-button>
                                <el-button v-ls-loading size="mini" type="primary" @click="editCategory(item.id)">确定</el-button>
                            </div>
                            <div slot="reference" class="h-50" @click.stop="handleEdit(item.visibleEdit)">
                                <el-button icon="el-icon-edit" @click="inputConten = item.name"></el-button>
                            </div>
                        </el-popover>
                        <el-popconfirm
                            v-if="item.id != 0"
                            v-model="item.visibleDel"
                            placement="bottom"
                            title="数据删除后将无法恢复，确定删除分组？"
                            @confirm="handleDelete(item.id)"
                        >
                            <div slot="reference" class="h-50" @click.stop="handleEdit(item.visibleEdit)">
                                <el-button icon="el-icon-delete"></el-button>
                            </div>
                        </el-popconfirm>
                    </div>

                    <div class="d-flex j-center my-10">
                        <el-popover v-model="visible" placement="bottom" width="180">
                            <el-input v-model="treeName" size="mini" placeholder="不超过10个字" maxlength="10" class="mb-5" />
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                                <el-button size="mini" @click="addCategory">确定</el-button>
                            </div>
                            <el-button slot="reference" size="mini" icon="el-icon-circle-plus-outline" :plain="true">添加分组</el-button>
                        </el-popover>
                    </div>
                </div>
            </el-aside>
            <el-container style="min-height: 780px; overflow: auto">
                <el-header>
                    <el-row type="flex" justify="space-between">
                        <el-form :inline="true" :model="searchFilters" size="small">
                            <el-form-item prop="fileType">
                                <el-select v-model="searchFilters.fileType" filterable placeholder="请选择">
                                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>

                            <el-form-item prop="dateType">
                                <el-select v-model="searchFilters.dateType" filterable placeholder="请选择">
                                    <el-option v-for="item in filtersOptions" :key="item.value" :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>

                            <el-form-item><el-input v-model="searchFilters.fileName" clearable placeholder="请输入文件名" /></el-form-item>

                            <el-form-item>
                                <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                                <el-button type="primary" size="small" @click.stop="uploading">上传</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-alert title="双击图片可查看详情" type="info"></el-alert>
                    <el-row class="my-20" :gutter="15" type="flex" style="flex-wrap: wrap">
                        <template v-if="tableList.length > 0">
                            <template v-for="(item, index) in tableList">
                                <el-col :key="index" :xs="6" :sm="6" :md="6" :lg="4" :xl="4" :span="4" class="mb-15 text-center cursor-pointer">
                                    <div
                                        class="d-flex flex-col-center py-10 pic-item"
                                        :class="{
                                            active: filterIds.includes(item.id)
                                        }"
                                        @dblclick="imgView(item)"
                                        @click.stop="choose(item.id)"
                                    >
                                        <div :class="item.fileType == 0 ? 'pic-img' : ''">
                                            <el-image
                                                :src="$photoServer + item.filePath"
                                                style="width: 100%; height: 10vw"
                                                fit="contain"
                                                title="双击可打开详情"
                                            />
                                        </div>
                                        <div class="w-100 d-flex j-sb">
                                            <div style="flex: 1" class="line-clamp1 mt-10 pl-20 text-center font-12">
                                                <span class="">{{ item.fileName }}</span>
                                            </div>
                                            <div style="width: 20px">
                                                <el-popover v-model="item.visibleEdit" :plain="true" placement="bottom" width="180">
                                                    <el-input v-model="inputConten" size="mini" placeholder="素材名称" class="mb-5" />
                                                    <div style="text-align: right; margin-top: 5px">
                                                        <el-button size="mini" type="text" @click="item.visibleEdit = !item.visibleEdit">
                                                            取消
                                                        </el-button>
                                                        <el-button
                                                            v-ls-loading
                                                            size="mini"
                                                            type="primary"
                                                            @click="updataFileName(item.id, item.visibleEdit)"
                                                        >
                                                            确定
                                                        </el-button>
                                                    </div>
                                                    <div slot="reference" @click.stop="handleEdit(item.visibleEdit)">
                                                        <el-button
                                                            icon="el-icon-edit"
                                                            style="
                                                                border: none;
                                                                padding: 0;
                                                                width: 12px;
                                                                height: 12px;
                                                                background-color: transparent;
                                                                line-height: 40px;
                                                                color: #999;
                                                            "
                                                            @click="inputConten = item.fileName"
                                                        ></el-button>
                                                    </div>
                                                </el-popover>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </template>
                        </template>

                        <template v-else>
                            <div class="flex-center w-100"><empty empty-type="pro" text="暂无素材信息" /></div>
                        </template>
                    </el-row>

                    <el-row type="flex" justify="space-between" class="mt-20">
                        <el-col>
                            <el-button size="mini" class="allCheck">
                                <el-checkbox v-model="isAll" label="全选" size="small" @change="checkAllHandle" />
                            </el-button>

                            <el-button size="small" @click="handleDel">批量删除</el-button>

                            <el-popover v-model="visible1" placement="bottom" width="200" @show="showMove">
                                <el-select v-model="treeId" filterable placeholder="请选择" class="mb-20">
                                    <el-option v-for="item in attachmentTree" :key="item.id" :label="item.name" :value="item.id" />
                                </el-select>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
                                    <el-button v-ls-loading size="mini" @click="confirmMoveBatch">确定</el-button>
                                </div>
                                <el-button slot="reference" size="small">批量移动</el-button>
                            </el-popover>
                        </el-col>

                        <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :total="tableTotal"
                            :page-size="page.pageSize"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        ></el-pagination>
                    </el-row>
                </el-header>
            </el-container>
        </el-container>

        <dialog-fodder ref="dialogFodder" :tree-value="searchFilters.treeId" :attachment-tree="attachmentTree" />
        <!-- 图片预览 -->
        <template>
            <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="620px" custom-class="demo">
                <!-- 图片预览 -->
                <el-image-viewer v-if="showView" :on-close="closeViewer" :url-list="[imgUrl]" style="z-index: 3333;"/>
                <div class="d-flex j-center" style="max-height: 600px">
                    <el-tooltip content="单击可以预览" placement="right-end">
                        <ls-image :src="imgSrc" fit="contain" :isPreview="false" @handleImg="handleImg()"></ls-image>
                    </el-tooltip>
                </div>
                <el-row class="mt-20">
                    <el-col :span="3" style="display: block; height: 40px; line-height: 40px">素材链接：</el-col>
                    <el-col :span="21">
                        <el-input id="copy" v-model="copySrc" placeholder="请输入内容" class="input-with-select">
                            <el-button slot="append" @click="copyhandle">复制</el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </el-dialog>
        </template>
    </section>
</template>
<script>
import dialogFodder from '@/comCommon/dialogFodder/dialogFodder'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import picIndex from '@/components/uploadFodder/pic-index'

import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { set } from 'nprogress'
import { debounce } from '@/utils/utils.js'
import { Footer } from 'element-ui'
export default {
    name: 'MaterialCenter',
    components: {
        dialogFodder,
        picIndex,
        ElImageViewer
    },
    mixins: [common, cud],

    data() {
        return {
            tableList: [
                {
                    id: 30947,
                    filePath: '1/2020/09/25/263a6391-4fd1-411d-8829-274c5fd5c4f3.jpeg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 127479,
                    fileName: '3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
                },
                {
                    id: 40504,
                    filePath: '1/2021/05/21/43c67f4a-6f59-47e9-ac30-d3a2ae992a67.png',
                    videoPath: '1/2021/05/21/9ac40bcc-e4c1-44b6-ae33-fb5f7c89ecc9.mp4',
                    fileType: 0,
                    fileSize: 6646348,
                    fileName: 'test'
                },
                {
                    id: 34558,
                    filePath: '1/2021/01/19/3de63e35-dbc7-4e2a-be03-3f0da9d78647.jpg',
                    videoPath: '1/2021/01/19/00bcdb14-0ff7-4014-90a3-2aa62e514077.mp4',
                    fileType: 0,
                    fileSize: 4435836,
                    fileName: 'video'
                },
                {
                    id: 30929,
                    filePath: '1/2020/09/25/81a6c3f1-29d8-4337-8356-cfd0ae3738a2.png',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 2283,
                    fileName: 'comment.png'
                },
                {
                    id: 30941,
                    filePath: '1/2020/09/25/d639bfcf-87fa-4eeb-979f-2489d2a247d9.png',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 3119,
                    fileName: 'avatar.png'
                },
                {
                    id: 30844,
                    filePath: '1/2020/09/25/df891c6a-3e0a-4987-8e2f-6d3ec3e8dab8.jpg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 38682,
                    fileName: '3.jpg'
                },
                {
                    id: 30843,
                    filePath: '1/2020/09/25/e458f30b-81e4-4e95-9446-a64abfce07fe.jpg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 36468,
                    fileName: '2.jpg'
                },
                {
                    id: 30960,
                    filePath: '1/2020/09/26/090165e8-cc23-4a2b-ae34-259bad9712d7.png',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 1442,
                    fileName: 'collapse.png'
                },
                {
                    id: 30957,
                    filePath: '1/2020/09/26/8084ec73-4492-4098-a09e-1013da61088d.png',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 4955,
                    fileName: 'colorSwitch.png'
                },
                {
                    id: 30958,
                    filePath: '1/2020/09/26/9879316c-917f-4ef6-8076-6920d347ba88.png',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 3074,
                    fileName: 'component.png'
                },
                {
                    id: 31078,
                    filePath: '1/2020/10/14/b7beae5e-e770-48ec-8c1a-d977bd16f467.png',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 244375,
                    fileName: '00287a985caef9e0b60204e6022412c6.png'
                },
                {
                    id: 31110,
                    filePath: '1/2020/10/20/4e3130c8-40f7-4f85-8ba1-5576cbfad5dc.jpg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 7745,
                    fileName: 'O1CN01Sx1HEX1POdoGq9XoV_!!2228361831.jpg_430x430q90.jpg'
                },
                {
                    id: 31107,
                    filePath: '1/2020/10/20/5467a15f-af69-4b78-8ca1-138aecb371c4.jpg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 1746619,
                    fileName: '微信图片_20201020183314.jpg'
                },
                {
                    id: 31503,
                    filePath: '1/2020/10/27/348cdbdd-63a8-49fb-958d-7d6e54240188.jpg',
                    videoPath: '1/2020/10/27/20a164bc-ef64-4e93-bad8-981094d49575.mp4',
                    fileType: 0,
                    fileSize: 6086045,
                    fileName: '陷阱'
                },
                {
                    id: 31502,
                    filePath: '1/2020/10/27/de4b6a62-0d6c-499c-9588-78a832b4d2dd.jpg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 195523,
                    fileName: '793aa88a-423c-4414-bfb8-0b4053094683.jpg'
                },
                {
                    id: 31674,
                    filePath: '1/2020/11/05/0bdf42b2-9b88-426c-9c1c-b00edcca337c.jpg',
                    videoPath: '1/2020/11/05/b363de0c-7c92-4ad3-bda4-6d5d6405220c.mp4',
                    fileType: 0,
                    fileSize: 6086045,
                    fileName: '213'
                },
                {
                    id: 31647,
                    filePath: '1/2020/11/05/2219b563-16b3-4e7c-ae64-9d441ec4aadb.jpg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 245190,
                    fileName: '3e1503429157f6b4.jpg'
                },
                {
                    id: 31686,
                    filePath: '1/2020/11/06/3426cc07-c3e1-4af1-af5f-75bd22dc9d70.jpg',
                    videoPath: null,
                    fileType: 1,
                    fileSize: 63086,
                    fileName: '51bdffa10d550794.jpg'
                }
            ],
            inputConten: '',
            viewSrc: [],
            copySrc: '', //复制栏图片链接
            imgSrc: '',
            imgDialogVisible: false,
            checkedGameId: [],
            activeIndex: 0,
            visible: false,
            visible1: false,
            visibleEdit: false,
            treeId: 0,
            searchFilters: {
                treeId: 0,
                fileName: '',
                fileType: '', //文件类型，图片:IMG、视频:VIDEO、文本:TEXT、语音:VOICE、其它:OTHER
                dateType: '' //时间类型，1、时间从早到晚，2、时间从晚到早
            },
            typeOptions: [
                { value: '', label: '素材类型' },
                { value: 'IMG', label: '图片' },
                { value: 'VIDEO', label: '视频' }
            ],
            filtersOptions: [
                { value: '', label: '默认排序' },
                { value: 1, label: '时间从早到晚' },
                { value: 2, label: '时间从晚到早' }
            ],

            //树分组
            attachmentTree: [
                { id: 0, name: '默认分组' },
                { id: 2499, name: '分组1', parentId: 0, childrenList: null },
                { id: 2511, name: '123', parentId: 0, childrenList: null }
            ],
            treeName: '',
            editTreeName: '',

            url: { getData: '/s/attachment/page' },
            page: { pageSize: 18 },
            filterIds: [], //选中的id
            showView: false,
            imgUrl: '',
            videoUrl: ''
        }
    },

    computed: {
        isAll: {
            get() {
                let tableIds = this.tableList.map((item) => item.id)
                return tableIds && tableIds.length && tableIds.every((item) => this.filterIds.includes(item))
            },
            set(val) {
                return val
            }
        }
    },
    mounted() {
        this.loadAttachmentTree()
    },
    methods: {
        //更新素材名称
        updataFileName(id, visibleEdit) {
            // fodder
            //     .updateAttachment({ fileName: this.inputConten, id: id })
            //     .then((res) => {
            //         this.$message.success('修改素材名称成功！')
            //         this.getData()
            //         visibleEdit = false
            //     })
            //     .catch((res) => {
            //         this.$message.error(res.message)
            //     })
        },
        //删除分组
        handleDelete(id) {
            // fodder
            //     .delAttachment(id)
            //     .then((res) => {
            //         this.$message.success('删除成功！')
            //         this.attachmentTree = [{ id: 0, name: '默认分组' }]
            //         this.loadAttachmentTree()
            //         if (this.activeIndex !== 0) {
            //             this.activeIndex = 0
            //             this.searchFilters.treeId = 0
            //             this.dbnSearch()
            //         }
            //     })
            //     .catch((res) => {
            //         this.$message.error(res.message)
            //     })
        },
        //编辑分组
        editCategory(id) {
            // fodder
            //     .updateAttachmentTree({ name: this.inputConten, id: id })
            //     .then((res) => {
            //         this.$message.success('修改成功！')
            //         this.attachmentTree = [{ id: 0, name: '默认分组' }]
            //         this.loadAttachmentTree()
            //     })
            //     .catch((res) => {
            //         this.$message.error(res.message)
            //     })
        },
        //双击预览
        imgView(item) {
            if (item.fileType == 1) {
                this.copySrc = this.$photoServer + item.filePath
                this.imgSrc = item.filePath //对话框显示图片
                this.imgDialogVisible = true
                this.imgUrl = this.$photoServer + item.filePath //预览图片
                this.viewSrc.push(this.$photoServer + item.filePath)
            } else {
                this.$refs.videoView.showDialog(this.$photoServer + item.videoPath)
                this.videoUrl = item.videoPath
            }
        },
        handleImg() {
            this.showView = true
        },

        //关闭图片预览
        closeViewer() {
            this.showView = false
        },
        uploading() {
            this.$refs.dialogFodder.showDialog()
        },
        //获取树
        loadAttachmentTree(flag = false) {
            // fodder.attachmentTree(0).then((res) => {
            //     res.data && (this.attachmentTree = [...this.attachmentTree, ...res.data])
            // })
        },
        //添加树
        addCategory() {
            const status = this.attachmentTree.some((item) => item.name == this.treeName)
            if (this.treeName.trim().length < 1) {
                this.$message.error('请输入分组名称')
                return false
            }
            if (status) {
                this.$message.error('已有该名称分组，请更换名称')
                return false
            }
        },

        //解决点击elemen图片会给body加overflow:hidden滚动条失效问题
        stopPropagation() {
            document.body.style = ''
        },
        choose(id) {
            this.stopPropagation()
            if (this.filterIds.includes(id)) {
                this.filterIds = this.filterIds.filter((v) => v != id)
            } else {
                this.filterIds.push(id)
            }
        },

        showMove() {
            !this.filterIds.length && (this.$message.warning('请选择至少一条数据'), (this.visible1 = false))
        },

        //删除
        handleDel() {
            if (!this.filterIds.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }

            this.$confirm('数据删除后将无法恢复，确定删除图片/视频?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    // fodder.deleteAttachment({ id: this.filterIds.toString() }).then((res) => {
                    //     if (!res.code) {
                    //         this.$message.error(res.message)
                    //         return
                    //     }
                    //     this.$message.success('删除成功')
                    //     this.dbnSearch()
                    //     this.filterIds = []
                    // })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },

        //移动分组

        confirmMoveBatch: debounce(function () {
            // fodder
            //     .moveAttachment({ treeId: this.treeId, fileId: this.filterIds })
            //     .then((res) => {
            //         if (!res.code) {
            //             this.$message.error(res.message)
            //             return
            //         }
            //         this.$message.success('移动成功')

            //         setTimeout(() => {
            //             this.dbnSearch()
            //         })
            //     })
            //     .finally(() => {
            //         this.visible1 = false
            //         this.filterIds = []
            //     })
        }),

        //切换树节点
        switchTreeNode(index, id) {
            if (this.activeIndex == index) {
                return
            }
            this.searchFilters.treeId = id
            this.activeIndex = index
            this.filterIds = []
            this.dbnSearch()
        },

        //全选
        checkAllHandle(val) {
            if (val) {
                this.filterIds = Array.from(new Set([...this.filterIds, ...this.tableList.map((v) => v.id)]))
            } else {
                let tableList = this.tableList.map((item) => item.id)
                this.filterIds = this.filterIds.filter((id) => !tableList.includes(id))
            }
        },
        handleEdit(visible) {
            visible = true
        },
        copyhandle() {
            const copyMeta = document.getElementById('copy')
            copyMeta.select()
            document.execCommand('copy')
            this.$message.success('复制成功')
        }
    }
}
</script>
<style lang="scss" scoped>
$--color-primary: #ffa800;
.category-container ::v-deep {
    .category-item {
        height: 44px;
        line-height: 44px;
        padding: 0 20px;
        cursor: pointer;
        display: flex;
        transition: all 0.5s;
        font-size: 14px;
        span:hover {
            text-decoration: underline !important;
        }
        &:hover .el-button {
            display: block;
        }
        .el-button {
            display: none;
            border: none;
            padding: 0;
            margin: 0 4px;
            width: 12px;
            height: 12px;
            background-color: transparent;
            line-height: 44px;
            color: #999;
        }
        .category-name {
            margin-right: 8px;
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
    overflow: hidden;
    border: 1px solid #e4e4e4;
    transition: all 0.8s;
    position: relative;
    .pic-img {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .pic-img:hover {
        transition: all 0.8s;
        transform: scale(1.2);
    }
    .pic-img::before {
        color: #fff;
        z-index: 1000;
        position: absolute;
        font-family: 'iconfont' !important;
        content: '\e67c';
        font-size: 30px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        vertical-align: middle;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    &:hover {
        // transform: scale(1.1);
        border: 1px solid transparent;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    &:hover {
        border: 1px solid $--color-primary;
        border-radius: 10px;
    }
    &.active {
        border: 1px solid $--color-primary;
        border-radius: 10px;
    }
}
</style>

<style></style>
