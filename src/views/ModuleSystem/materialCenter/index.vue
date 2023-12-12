<template>
    <section class="">
        <el-card style="border:none; box-shadow:none;" v-loading = "loading">
            <div slot="header" class="clearfix">
                <template v-if="!isEditName">
                    <el-button type="text" size="medium" class="text-666 uploadBtn" icon="el-icon-upload" @click.stop="uploading" :disabled="inDialog && limit == 1 && filterKeys.length == 1">上传</el-button>
                    <el-button type="text" size="medium" class="text-666" icon="el-icon-folder" @click.stop="FloderDialogHandle">
                        新增文件夹
                    </el-button>
                    <el-button
                        v-if="!inDialog && hiddingActionBtn"
                        type="text"
                        size="medium"
                        class="text-666"
                        icon="el-icon-setting"
                        @click.stop="editSelectedFileName"
                    >
                        重命名
                    </el-button>
                    <el-button
                        v-if="!inDialog && hiddingActionBtn"
                        type="text"
                        size="medium"
                        class="text-666"
                        icon="el-icon-rank"
                        @click.stop="treeDialogVisible = true"
                    >
                        移动
                    </el-button>
                    <el-button
                        v-if="!inDialog && hiddingActionBtn"
                        type="text"
                        size="medium"
                        class="text-666"
                        icon="el-icon-delete-solid"
                        @click="handleDel"
                    >
                        删除
                    </el-button>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
							<template v-if="!inDialog">
								不允许删除含有图片的文件夹
							</template>
							<template v-if="inDialog">
								当【新增文件夹】后，如想要删除该文件夹，请到【设置】->【图片中心】里删除
							</template>
                        </div>
                        <i class="el-icon-question font-16 text-000 opacity-3 ml-5"></i>
                    </el-tooltip>
                </template>
                <template v-else>
                    <el-button size="medium" @click.stop="cancelEditName">取消</el-button>
                    <el-button type="primary" size="medium" @click.stop="updateAllFileName">确定</el-button>
                </template>
            </div>
            <el-container>
                <el-aside width="200px" :style="{ height: inDialog ? '560px' : '730px' }">
                    <div class="w-100 h-100 overflow-auto" style="background: #f5f6f8">
                        <el-tree
                            ref="pathTree"
                            style="background: #f5f6f8"
                            node-key="id"
                            lazy
                            icon-class="null"
                            :props="{ label: 'fileName', isLeaf: isLeaf }"
                            :load="loadNode"
                            :expand-on-click-node="false"
                            :default-expanded-keys="openNode"
                            :accordion="true"
                            @node-click="clickTreeNode"
                        >
                            <span
                                slot-scope="{ node, data }"
                                class="el-tree-node__label position-relative overflow-visible"
                                style="max-width: calc(100% - 24px)"
                            >
                                <span v-if="!node.isLeaf" class="position-absolute" style="left: -20px" @click="node.expanded = true">
                                    <template v-if="node.expanded">
                                        <svg class="icon" aria-hidden="true" :style="{ height: '12px', width: '12px' }">
                                            <use xlink:href="#icon-dakaiwenjianjia"></use>
                                        </svg>
                                    </template>
                                    <template v-else>
                                        <svg class="icon" aria-hidden="true" :style="{ height: '12px', width: '12px' }">
                                            <use xlink:href="#icon-wenjianjia"></use>
                                        </svg>
                                    </template>
                                </span>
                                <span class="el-tree-node__label line-clamp1 position-relative w-100" :title="node.label">
                                    {{ node.label }}
                                </span>
                            </span>
                        </el-tree>
                    </div>
                </el-aside>
                <el-container :style="{ height: inDialog ? '560px' : '730px' }">
                    <el-main class="d-flex flex-column j-sb" style="padding-top: 0">
                        <el-row type="flex" justify="space-between" v-if="!isEditName" style="overflow: hidden;">
                            <div style="flex-basis: 60%; overflow: hidden; margin-right: 10px;">
                                <el-breadcrumb separator-class="el-icon-arrow-right" class="viewList">
                                    <el-breadcrumb-item v-for="item in rotateFolderList[0]" :key="item.id" class="flex-center" :style="{ 'flex-basis': inDialog ? '33.33%' : '20%',}">
                                        <el-button
                                            type="text"
                                            :title="item.id != '-111' ? item.fileName : ''"
                                            @click="handleFloderClick(item.id)"
                                        >
											<div class="line-clamp1 text-left">
												<template v-if="item.id !== '-111'">{{ item.fileName }}</template>
												<el-popover v-else placement="top" trigger="hover" width="200">
												    <div class="d-flex flex-column flex-wrap">
												        <el-button class="line-clamp1" style="margin-left: 0;" type="text" v-for="btn in rotateFolderList[1]" :key="btn.id" :title="btn.fileName" @click="handleFloderClick(btn.id)">{{ btn.fileName }}</el-button>
												    </div>
												    <span slot="reference">{{ item.fileName }}</span>
												</el-popover>
											</div>
                                        </el-button>
                                    </el-breadcrumb-item>
                                </el-breadcrumb>
                            </div>
                            <div class="d-flex a-center" style="flex-basis: 40%;">
                                <el-input v-model="searchFilters.keyWord" class="mr-5 cancelFormItem" size="small" clearable placeholder="搜索图片名称" />
                                <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                            </div>
                        </el-row>

                        <el-row :id="'pictureBox-'+componentKey" class="my-20 flex-2 flex-wrap" :gutter="15" type="flex" justify="center">
                            <div v-if="tableList.length > 0" class="w-100 h-100">
                                <div
                                    class="w-100 overflow-y d-flex flex-wrap j-sa"
                                    :style="{ height: inDialog ? '420px' : '598px', alignContent: 'flex-start' }"
                                >
                                    <template v-for="(item, index) in tableList">
                                        <div
                                            id="picture-item"
                                            :key="index"
                                            class="mx-5 mb-10 text-center cursor-pointer"
                                            :style="[itemStyle, { marginBottom: '13px' }]"
                                        >
                                            <div
                                                v-if="item.type == 0"
                                                class="d-flex flex-col-between px-10 pb-10 h-100"
                                                :class="[
                                                    {
                                                        active: filterKeys.some((v) => {return item.key == v.key && !item.visibleEdit && !isEditName})||(typeof tempUrl == 'object' ? tempUrl.includes(item.url) : tempUrl==item.url),
                                                        'pic-item': !isEditName
                                                    },
                                                    isEditName ? 'pt-10' : 'pt-20'
                                                ]"
                                                @dblclick="imgView(item)"
                                                @click.stop="choose(item)"
                                            >
                                                <div
                                                    class="flex-center w-100 flex-2"
                                                    :class="item.type != 0 ? 'pic-img' : ''"
                                                    :style="{ fontSize: '100px', height: 'calc(100% - 29px)', width: '100%' }"
                                                >
													<!-- 下面这里加一个时间戳，是为了解决当上传两张名字一样的图片时，无论怎么也只显示第一张图片，不显示最后上传的图片的问题(实测用:key值不生效) -->
                                                    <el-image
                                                        v-if="!diffPicOrVideo(item)"
                                                        :ref="'elImage' + item.key"
														:src="`${$photoServer+item.url}?${new Date().getTime()}`"
                                                        :style="{ width: '100%', height: '100%' }"
                                                        :isPreview="false"
                                                        fit="contain"
                                                    ></el-image>
                                                    <div v-else class="position-relative w-100 h-100 d-flex">
                                                        <video :src="$photoServer + item.videoUrl" :poster="item.url ? ($photoServer + item.url) : ''" class="w-100 h-100"></video>
                                                        <div class="position-absolute left-0 top-0 right-0 bottom-0" style="background-color: rgba(0,0,0,.5)">
                                                            <div class="iconfont icon-bofang center-xy" style="font-size: 24px; color: #fff;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="w-100 d-flex j-sb a-end mt-8">
                                                    <div
                                                        v-if="!item.visibleEdit"
                                                        class="line-clamp1 text-center font-12 flex-1"
                                                        :class="inDialog ? 'px-10' : 'px-10'"
                                                    >
                                                        <span :title="item.name">{{ item.name }}</span>
                                                    </div>
                                                    <div
                                                        v-if="!inDialog && item.visibleEdit"
                                                        class="w-100 px-3 text-center font-12 flex-1"
                                                        style="z-index: 100"
                                                    >
                                                        <el-form :ref="item.key" :model="item" label-width="0px" :rules="formValidateRule">
                                                            <el-form-item
                                                                prop="tempName"
                                                                size="mini"
                                                                :inline-message="false"
                                                                :rules="{
                                                                    required: true,
                                                                    message: '文件名不能为空',
                                                                    trigger: 'blur'
                                                                }"
                                                                :error="item.errMsg"
                                                            >
                                                                <el-input v-model="item.tempName" placeholder="请输入内容" :title="item.tempName" maxlength="50">
                                                                    <el-button
                                                                        slot="append"
                                                                        style="padding: 7px"
                                                                        @click.prevent="updateFileName(item)"
                                                                    >
                                                                        确认
                                                                    </el-button>
                                                                </el-input>
                                                            </el-form-item>
                                                        </el-form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                v-else
                                                class="d-flex flex-col-between px-10 py-10 h-100"
                                                :class="[
                                                    {
                                                        active: filterKeys.some((v) => {return item.key == v.key && !item.visibleEdit}),
                                                        'pic-item': !isEditName
                                                    },
                                                    isEditName ? 'pt-10' : 'pt-20'
                                                ]"
                                                @click.stop="choose(item)"
                                            >
                                                <div
                                                    class="flex-center w-100 flex-2"
                                                    :style="{ fontSize: '100px', height: 'calc(100% - 29px)', width: '100%' }"
                                                    @dblclick="handleFloderClick(item.id, item.typeId)"
                                                >
                                                    <svg class="icon" aria-hidden="true" :style="{ height: '80%' }">
                                                        <use xlink:href="#icon-wenjianjia"></use>
                                                    </svg>
                                                </div>
                                                <div class="w-100 d-flex j-sb a-end mt-8">
                                                    <div
                                                        v-if="!item.visibleEdit"
                                                        class="line-clamp1 text-center font-12 flex-1"
                                                        :class="inDialog || (item.shopId && item.typeId == 1) ? 'px-10' : 'px-10'"
                                                    >
                                                        <span :title="item.name">{{ item.name }}</span>
                                                    </div>
                                                    <div
                                                        v-if="!inDialog && !(item.shopId && item.typeId == 1) && item.visibleEdit"
                                                        class="d-flex text-center font-12 flex-1"
                                                        style="z-index: 100"
                                                    >
                                                        <el-form :ref="item.key" :model="item" label-width="0px" :rules="formValidateRule">
                                                            <el-form-item prop="tempName" size="mini" :inline-message="false" :error="item.errMsg">
                                                                <el-input v-model="item.tempName" placeholder="请输入内容" :title="item.tempName" maxlength="50">
                                                                    <el-button
                                                                        slot="append"
                                                                        style="padding: 7px"
                                                                        @click.prevent="updateFileName(item)"
                                                                    >
                                                                        确认
                                                                    </el-button>
                                                                </el-input>
                                                            </el-form-item>
                                                        </el-form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <!-- 占位用，保持最后一行左对齐 -->
                                    <div
                                        v-for="(item, index) in pageSize / 4 - (tableList.length % (pageSize / 4))"
                                        :key="index + '.'"
                                        class="h-0 mx-5"
                                        :style="{ width: inDialog ? '90px' : '135px' }"
                                    ></div>
                                </div>
                            </div>
                            <empty v-else-if="!loading" empty-type="pro" text="暂无素材信息" />
                        </el-row>
                        <div class="d-flex j-sb a-center">
                            <el-checkbox v-if="!isEditName && !inDialog" :indeterminate="custerCheck"  v-model="isSelectAll" @change="switchSelectAll">全选</el-checkbox>
                            <i v-else />
                            <!-- 在dialog中占位保持页码靠右 -->
                            <el-pagination
                                v-if="!isEditName"
                                background
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="tableTotal"
                                :page-size="searchFilters.pageSize"
                                :page-sizes="[pageSize, pageSize * 2, pageSize * 3, pageSize * 4, pageSize * 5]"
                                :current-page="searchFilters.curPage"
                                @current-change="loadMore"
                                @size-change="sizeChange"
                            ></el-pagination>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </el-card>
        <!-- 上传图片 -->
        <dialog-fodder ref="dialogFodder" :tree-value="searchFilters.treeId" :floder-id="searchFilters.id" :upload-tab="uploadTab" :limit="fodderLimit" :isEcho="isEcho" @upload-success="handleUpSuccess"/>
        <!-- 图片预览 -->
        <el-image-viewer v-if="showView" :on-close="closeViewer" :url-list="[imgUrl]" style="z-index: 3333;"/>
        <!-- 视频放大预览 -->
        <div v-if="isPreviewVideo" class="el-image-viewer__wrapper" style="z-index: 3333;">
            <div class="el-image-viewer__mask" style="opacity: .2;"></div>
            <span class="el-image-viewer__btn el-image-viewer__close" @click.stop="isPreviewVideo = false">
                <i class="el-icon-circle-close"></i>
            </span>
            <div class="el-image-viewer__canvas">
                <video :src="imgUrl" :poster="videoPosterUrl" controls style="width: 80vw; height: 80vh;"></video>
            </div>
        </div>
        <!-- 新建文件夹 -->
        <el-dialog
            title="新建文件夹"
            custom-class="dialog-form-small newFolderDialog"
            :visible.sync="formDialogVisible"
            :append-to-body="true"
        >
            <el-form ref="myForm" :model="newFolderData" label-width="95px" size="small" label-position="right">
                <el-form-item label="文件夹名称：" prop="fileName" :rules="[{ required: true, message: '文件夹名不能为空', trigger: 'blur' }]">
                    <el-input v-model="newFolderData.fileName" placeholder="文件夹名称" maxlength="50" show-word-limit onkeypress="if(event.keyCode == 13) return false;" @keyup.enter.native="submitHandle()"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="formDialogVisible = false">取 消</el-button>
                <el-button v-ls-loading type="primary" size="small" @click.stop="submitHandle()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 移动 -->
        <el-dialog
            :title="'将' + filterKeys.length + '个文件移动到'"
            custom-class="dialog-form-small"
            :visible.sync="treeDialogVisible"
            :append-to-body="true"
        >
            <div class="overflow-y" style="height: 500px">
                <el-tree
                    ref="tree"
                    :data="floderTree"
                    :props="{ label: 'fileName', isLeaf: isLeaf }"
                    :show-checkbox="true"
                    :check-strictly="true"
                    node-key="id"
                    lazy
                    :load="loadNode"
                    @check="setNode"
                ></el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="treeDialogVisible = false">取 消</el-button>
                <el-button v-ls-loading type="primary" size="small" @click.stop="moveToFloder">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import dialogFodder from '@/comCommon/dialogFodder/dialogFodder'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { materialCenter } from '@/api/ModuleSystem'
import { debounce } from '@/utils/utils.js'
export default {
    name: 'MaterialCentre',
    components: {
        dialogFodder,
        ElImageViewer
    },
    props: {
        inDialog: {
            // false:素材中心页面，true:选择图片时弹出dialog页面 在Dialog中不能改名、删除、选中文件夹
            type: Boolean,
            default: false
        },
        mult: {
            // false:素材中心页面，true:选择图片时弹出dialog页面 在Dialog中不能改名、删除、选中文件夹
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 5
        },
        // 上传组件的 面板展示
        uploadTab: {
            type: String,
            default: 'BOTH'
        },
        // true：为了防止客户上传完图片后在列表里找不到刚才上传的图片，上传完图片并点击【上传】后，立即选中上传的数据并且关闭弹窗(这时不用点击【确定】)[例子：商品发布上传图片]
        isEcho: {
            type: Boolean,
            default: false,//这个默认值要为false，不然在【图片中心】里上传图片列表不更新
        },
		
		// 已经选中的图片，用于回选
		tempUrl: {
		    type: [Array, String]
		},
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('文件名不能为空'))
            } else {
                callback()
            }
        }
        return {
			loading:false,
            formValidateRule: {
                tempName: [{ validator: validatePass, trigger: 'blur' }]
            },
            searchFilters: {
                curPage: 1,
                pageSize: 30,
                id: '',
                breakPageSize: ''
            },
            isEditName: false,
            isSelectAll: false,
            shopId: 1,
            inputConten: '',
            newFolderData: {}, //新建文件夹的参数
            tableTotal: null,
            tableList: [],
            formDialogVisible: false,
            treeDialogVisible: false,
            imgDialogVisible: false,
            parentFloderList: [],
            grade: 1,
            floderTree: [],

            viewSrc: [], //图片预览数组
            copySrc: '', //复制栏图片链接
            imgSrc: '',

            visible: false,
            visibleEdit: false, //改名popover
            treeId: 0,
            openNode: [],   //这个用数组 方便增删

            filterKeys: [], //选中的资源。
            showView: false,    //图片预览
            isPreviewVideo: false, //视频预览
            videoPosterUrl: '', //视频预览封面图
            imgUrl: '',
            videoUrl: '',
            pageSize: null,
            isMounted: false,
            componentKey:0,
            custerCheck:false, //半选状态

            echoFiles: [],  //回显
        }
    },

    computed: {
        itemStyle() {
            if (this.inDialog) {
                return {
                    height: '90px',
                    width: '90px'
                }
            } else {
                return {
                    height: '135px',
                    width: '135px'
                }
            }
        },
        hiddingActionBtn() {
            if (
                this.filterKeys.some((v) => {
                    return !v.shopId || v.typeId != 1
                })
            ) {
                return true
            } else {
                return false
            }
        },
        // 循环显示的历史记录
        rotateFolderList() {
            let viewList = this.parentFloderList;
            let len = viewList.length;
            let surList = [];       //省略时的数组
            if(this.inDialog && len > 3) {  //弹窗内显示三条
                surList = viewList.slice(1, -1)
                viewList = [viewList[0], { fileName: '...', id: '-111' },  viewList[len - 1]]
            }else if(!this.inDialog && len > 5){ //弹窗外显示5条
                surList = viewList.slice(3, -1)
                viewList = [...viewList.slice(0, 3), { fileName: '...', id: '-111' },  viewList[len - 1]]
            }
            return [viewList, surList];
        },
        // 回显时的上传数量
        fodderLimit() {
			// 如果上传完图片后马上关闭窗口并回选,并且是非多选(mult为false，即为单选)，则限制上传图片数为1.
            return (this.isEcho&&!this.mult)? 1 : ( (this.inDialog && this.isEcho) ? (this.limit - this.filterKeys.length) : this.limit)
        }
    },
    watch:{
        filterKeys(newValue){
			// console.log(11,newValue)
            this.custerCheck = newValue.length > 0 && newValue.length < this.tableList.length
        },
        parentFloderList(newVal,oldVal){
            // 加上判断是防止页面加载调用接口，此监听为面包屑发生变化后提交路径记录
            // if(oldVal.length != 0){
            //     this.getSaveHistory(newVal.map(item=>item.id))
            // }else {     //这里是因为系统是全新的话 一开始是没有数据的 因此点击一层文件夹后将openNode传至后端
            //     this.getSaveHistory(this.openNode)
            // }
            this.getSaveHistory(newVal.map(item=>item.id))
        },
    },
    created() {
        this.componentKey = new Date().getTime()+''+parseInt(Math.random()*10)
    },
    mounted() {
		this.loading = true;setTimeout(()=> {this.loading = false;}, 5000);//由于下面的getResourceList()方法是写在debounce里，所以要一开始设置loading为true
		
        //计算铺满容器所需的文件数量
        // let boxWidth = document.getElementById("pictureBox").clientWidth
        let itemWidth = this.inDialog ? 90 + 10 : 135 + 10
        this.pageSize = Math.floor(document.getElementById('pictureBox-'+this.componentKey).clientWidth / itemWidth) * 4
        if(this.pageSize==0){ //防止屏幕过小pageSize为0的情况
            this.pageSize = 8
        }
        this.searchFilters.pageSize = this.pageSize
        !this.inDialog && this.getSaveHistory();//调用历史记录接口
    },
    methods: {
        getResourceList() {
            //查询素材中心列表,
            if (this.searchFilters.curPage == 1) {
                this.searchFilters.breakPageSize = this.searchFilters.pageSize
            }
			this.loading = true;
            materialCenter.getResourceList(this.searchFilters).then((res) => {
                this.isSelectAll = false
                this.tableTotal = res?.data?.total || 0
				if (res.data && res.data.resultList) {
					res.data.resultList.map((v) => {
					    //因文件夹和图片的id有可能相同所以给每条数据增加一个key属性
					    v.key = v.id + '-' + v.type;
					    return v
					})
				}
                this.searchFilters.breakPageSize = res?.data?.pageSize || ''
                this.tableList = res?.data?.resultList || []
            }).finally(() => {
				this.loading = false;
			});
        },
        dbnSearch: debounce(function () {
            this.searchFilters.curPage = 1
            this.getResourceList()
        }),
        loadMore(curPage) {
            this.searchFilters.curPage = curPage
            this.getResourceList()
            // this.filterKeys.splice(0) //争议
        },
        sizeChange(pageSize) {
            this.searchFilters.pageSize = pageSize
            this.dbnSearch()
        },
        async handleFloderClick(FloderId, grade) {
            //进入文件夹
            if (this.isEditName) {
                this.$message.warning('请取消或修改完文件名后才进入其他文件夹')
                return
            }
            if(FloderId == '-111') return;  // 处理...点击事件
            // 减少请求
            if(FloderId === this.searchFilters.id && this.searchFilters.curPage === 1) return;
            await this.getParentFloderList(FloderId)
            this.$nextTick(()=>{
                if(!this.$refs.pathTree.getNode(FloderId).isLeaf){
                    if(!this.openNode.includes(FloderId)) {
                        this.openNode.push(FloderId)
                    }
                }
            })
            this.searchFilters.id = FloderId
            this.searchFilters.curPage = 1
            this.grade = this.parentFloderList.length
            this.getResourceList()
        },

        FloderDialogHandle() {
            //新建文件夹Dialog初始化
            this.newFolderData = {}
            this.formDialogVisible = true
        },

        submitHandle() {
            //提交新增文件夹的数据
            this.$refs['myForm'].validate((valid) => {
                if (valid) {
                    this.newFolderData.parentId = this.searchFilters.id
                    if (this.parentFloderList.length <= 0) {
                        this.newFolderData.parentId = null
                    }

                    this.newFolderData.typeId = this.searchFilters.typeId
                    this.newFolderData.userType = 1
                    materialCenter.createFloder(this.newFolderData).then((res) => {
                        if (res.code) {
                            this.$message.success('新增文件夹成功')
                            this.formDialogVisible = false
                            if(!this.openNode.includes(this.newFolderData.parentId)) {  //通过openNode来自动更新左侧数据
                                this.openNode.push(this.newFolderData.parentId)
                            }else {
                                materialCenter.getFloderTree({ id: this.newFolderData.parentId }).then((res) => { //更新左侧树型控件数据
                                    if (res.code) {
                                        // this.openNode = this.newFolderData.parentId
                                        this.$refs.pathTree.updateKeyChildren(this.newFolderData.parentId, res.data)
                                    }
                                })
                            }
                            this.dbnSearch()//更新右侧数据
                        } else {
                            return false
                        }
                    })
                } else {
                    return false
                }
            })
        },

        //双击预览
        imgView(item) {
            if (item.type == 0) {
                if(this.diffPicOrVideo(item)) {       //视频预览
                    this.imgUrl = this.$photoServer + item.videoUrl
                    this.videoPosterUrl = item.url ? (this.$photoServer + item.url) : '';  //预览封面图
                    this.isPreviewVideo = true;
                }else {     //图片预览
                    this.imgUrl = this.$photoServer + item.url //预览图片
                    this.handleImg()
                }
                // this.$refs.elImage.clickHandler()
            } else if (item.fileType == 2) {
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
            // 将当前选中赋值给回显列表
            if(this.inDialog && this.isEcho) {
                this.echoFiles = this.filterKeys.map((item) => {
                    if(this.uploadTab == 'IMG') {
                        return item.url
                    }else if(this.uploadTab == 'VIDEO') {
                        return item.videoUrl
                    }else {
                        if(this.diffPicOrVideo(v)) {
                            return item.videoUrl
                        }else {
                            return item.url
                        }
                    }
                })
            }
            this.$refs.dialogFodder.showDialog()
        },
        getParentFloderList(id) {
            //获取文件夹到根目录的文件夹路径数组
            return materialCenter.getParentFloderList({ id: id }).then((res) => {
                if (res.code) {
                    this.parentFloderList = res.data
                }
            })
        },
        getSaveHistory: debounce(function(arr = []){
            let params = {
                userType: 'SHOP_PIC',   //商家端始终要传
            }
            arr.length && (params.folderIdList = arr);
            // arr为空时是获取路径历史记录，不为空时提交路径记录，提交记录成功不需要有任何操作
            materialCenter.getSaveHistory(params).then(res=>{
                if(res.code && !arr.length){
                    if(res.data && res.data.length > 0){
                       this.searchFilters.id = res.data[0][res.data[0].length-1].id;
                       this.parentFloderList = res.data[0];
                        //    这里要获取展开节点
                       let firstView = res.data[0];
                       let openNode = [];
                       firstView.forEach(item => {
                           item.isNext != false && openNode.push(item.id)
                       })
                       this.openNode = openNode
                       console.log('openNode--', this.openNode)
                       this.getResourceList()
                    }else{
                        this.getResourceList()
                        this.getParentFloderList()
                    }
                }
            })
        }),
        setNode(data, node) {
            //树形控件单选
            this.$refs.tree.setCheckedKeys([data.id])
            this.$forceUpdate()
        },

        moveToFloder() {
            //将文件移动到目标文件夹
            this.filterKeys = this.filterKeys.filter((v) => {
                return !(v.shopId && v.typeId == 1)
            })
            let movingList = []
            let targetFolderId = this.$refs.tree.getCheckedKeys()[0]
            for (let i = 0; i < this.filterKeys.length; i++) {
                movingList.push(this.filterKeys[i])
            }
            materialCenter
                .moveResource({
                    attachmentFileFolderDTOList: movingList,
                    fileFolderId: targetFolderId
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.success('文件移动成功')
                        let hasFolder = false
                        movingList.forEach(v=>{ //左侧树型控件被移动文件夹的节点移动到目标文件夹
                            if(v.type==1){
                                hasFolder = true
                                this.$refs.pathTree.remove(this.$refs.pathTree.getNode(v.id))
                            }
                        })
                        if(hasFolder) {
                            materialCenter.getFloderTree({ id: targetFolderId }).then((res) => { //更新右侧树型控件数据
                                if (res.code) {
                                    this.$refs.pathTree.updateKeyChildren(targetFolderId, res.data)
                                }
                            })
                        }
                        this.getResourceList()
                        this.filterKeys.splice(0)
                        this.treeDialogVisible = false
                        this.$refs.tree.setCheckedKeys([])
                    }
                })
        },

        loadNode(node, resolve) {
            this.resolve_head = resolve
            //树形控件懒加载
            if (!this.floderTree.length && node.level === 0) {
                let data
                materialCenter.getFloderTree().then((res) => {
                    if (res.code) {
                        data = res.data
                        resolve(data)
                        this.openNode = [res.data[0].id]
                        this.resolve_head = resolve
                    }
                })
            }
            if (node.level >= 1) {
                let data
                materialCenter.getFloderTree({ id: node.data.id }).then((res) => {
                    if (res.code) {
                        data = res.data
                        resolve(data)
                    }
                })
            }
        },
        isLeaf(data, node) {
            return !data.isNext
        },
        clickTreeNode(a, b, c) {
            //左侧树形控件点击节点进入文件夹
            if (this.isEditName) {
                return
            }
            this.handleFloderClick(a.id)
        },

        //解决点击elemen图片会给body加overflow:hidden滚动条失效问题
        stopPropagation() {
            document.body.style = ''
        },
        choose(item) {
			// item.type == 0：图片，item.type == 1：文件夹
			if(item.type == 0){
				// 如果是多选
				if(typeof this.tempUrl == 'object') {
					// 如果选中已经选中的
					if(this.tempUrl.includes(item.url)){
						this.$emit('update:tempUrl',this.tempUrl.filter(v => v != item.url))
						return
					}
				// 如果是单选
				}else{
					// 如果是单选，并且点击了回选的图片，则删掉选中的图片
					if(this.tempUrl==item.url){
						this.$emit('update:tempUrl','')
						return
					// 如果是单选，但点击了另一个图片(点击的并不是回选的图片，这时回选的图片就要清空，重新选择新选中的图片)
					}else{
						this.$emit('update:tempUrl','')
					}
				}
			}
			
            if ((this.inDialog && item.type == 1) || this.isEditName) {
                //在Dialog不能选择文件夹，修改名字时不能选择或取消选择
                // this.$message.warning("不能选择文件夹上传")
                return
            }
            this.stopPropagation()
            if (
                this.filterKeys.some((v) => {
                    return v.key == item.key
                })
            ) {
                //判断点击的元素是否已被选择
                this.filterKeys = this.filterKeys.filter((v) => v.key != item.key)
                this.isSelectAll = false
            } else {
                if (this.inDialog && item.type != 1) {
                    //在Dialog中并且被选择的是图片
                    if (this.mult) {
                        //多选
                        if (this.filterKeys.length >= this.limit) {
                            this.$message.warning('最多选择' + this.limit + '个图片')
                            return
                        }
                    } else {
                        //单选
                        if (this.filterKeys.length != 0) {
                            this.filterKeys.splice(0, 1, item)
                            // this.$message.warning('只能选择一张图片')
                            return
                        }
                    }
                    this.filterKeys.push(item)
                } else {
                    //在素材中心页面
                    this.filterKeys.push(item)
                    if (this.filterKeys.length === this.tableList.length) {
                        this.isSelectAll = true
                    }
                }
            }
        },
        switchSelectAll(val) {
            if (val) {
                this.filterKeys.splice(0)
                this.filterKeys.push(...this.tableList)
            } else {
                this.filterKeys.splice(0)
            }
        },
        handleEmit() {
            let selectItem = []
            for (let i = 0; i < this.filterKeys.length; i++) {
                let index = this.filterKeys[i]
                selectItem.push(index)
            }
            this.$emit('transfers-select', selectItem)
            this.filterKeys.splice(0)
        },
        //删除所选
        handleDel() {
            this.filterKeys = this.filterKeys.filter((v) => {
                return !(v.shopId && v.typeId == 1)
            })
            console.log('Running HandleDelete')
            if (!this.filterKeys.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            this.$confirm('数据删除后将无法恢复，确定删除图片/文件夹?(含有内容的文件夹无法删除)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let deleteItem = []
                    for (let i = 0; i < this.filterKeys.length; i++) {
                        let index = this.filterKeys[i]
                        deleteItem.push(index)
                    }
                    materialCenter.deleteResource(deleteItem).then((res) => {
                        if (!res.code) {
                            this.$message.error(res.message)
                            return
                        }else{
                            this.$message.success('删除成功')
                        deleteItem.forEach(v=>{ //删除左侧树型控件节点
                            if(v.type==1){
                                this.$refs.pathTree.remove(this.$refs.pathTree.getNode(v.id))
                            }
                        })
                        this.getResourceList()
                        this.filterKeys = []
                        }
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        handleEdit(visible) {
            visible = true
        },
        copyhandle() {
            const copyMeta = document.getElementById('copy')
            copyMeta.select()
            document.execCommand('copy')
            this.$message.success('复制成功')
        },
        goBack() {
            if (this.parentFloderList.length >= 2) {
                this.handleFloderClick(this.parentFloderList[this.parentFloderList.length - 2].id)
            } else {
                this.$message.warning('已到达最外层文件夹，无法再返回')
            }
        },
        editSelectedFileName() {
            this.isEditName = true
            this.filterKeys = this.filterKeys.filter((v) => {
                return !(v.shopId && v.typeId == 1)
            }) //将选中的商家根目录文件夹去掉
            this.filterKeys.forEach((element) => {
                this.$set(
                    this.tableList[
                        this.tableList.findIndex((v) => {
                            return v.key == element.key
                        })
                    ],
                    'visibleEdit',
                    true
                )
                this.$set(
                    this.tableList[
                        this.tableList.findIndex((v) => {
                            return v.key == element.key
                        })
                    ],
                    'tempName',
                    element.name
                )
            })
        },
        cancelEditName() {
            //取消批量更改名字
            this.filterKeys.forEach((element) => {
                this.$set(
                    this.tableList[
                        this.tableList.findIndex((v) => {
                            return v.key == element.key
                        })
                    ],
                    'visibleEdit',
                    false
                )
            })
            this.isEditName = false
        },
        //更新单个素材名称
        updateFileName(item) {
            this.$refs[item.key][0].validate((valid) => {
                if (valid) {
                    let input = {
                        fileName: item.tempName,
                        id: item.id,
                        ext: item.ext
                    }
                    this.$delete(
                        this.filterKeys[
                            this.filterKeys.findIndex((v) => {
                                return v.key == item.key
                            })
                        ],
                        'errMsg'
                    )
                    materialCenter.changeResourceName(input).then((res) => {
                        if (res.code) {
                            this.tableList[
                                this.tableList.findIndex((v) => {
                                    return v.key == item.key
                                })
                            ].name = item.tempName //修改文件名字成功后本地修改文件名
                            this.$message.success('修改素材名称成功！')
                            if(item.type == 1){ //如果修改名字的是文件夹则修改左侧树型控件中的文件夹名字
                                this.$set(this.$refs.pathTree.getNode(item.id).data, 'fileName', item.tempName)
                            }
                            item.visibleEdit = false
                        } else {
                            this.$set(
                                this.filterKeys[
                                    this.filterKeys.findIndex((v) => {
                                        return v.key == item.key
                                    })
                                ],
                                'errMsg',
                                res.msg
                            )
                        }
                    })
                } else {
                    return false
                }
            })
        },
        updateAllFileName() {
            //更新所有选中的素材名称
            var PromiseList = []
            for (let i = 0; i < this.filterKeys.length; i++) {
                let item = this.filterKeys[i]
                if (item.tempName == item.name) {
                    item.visibleEdit = false
                    continue
                }
                this.$refs[item.key][0].validate((valid) => {
                    if (valid) {
                        let input = {
                            fileName: item.tempName,
                            id: item.id,
                            ext: item.ext
                        }
                        PromiseList.push(
                            materialCenter.changeResourceName(input).then((res) => {
                                if (res.code) {
                                    this.tableList[
                                        this.tableList.findIndex((v) => {
                                            return v.key == item.key
                                        })
                                    ].name = item.tempName //修改文件名字成功后本地修改文件名
                                    if(item.type == 1){ //如果修改名字的是文件夹则修改左侧树型控件中的文件夹名字
                                        this.$set(this.$refs.pathTree.getNode(item.id).data, 'fileName', item.tempName)
                                    }
                                    item.visibleEdit = false
                                    return res
                                } else {
                                    return {
                                        item: item,
                                        msg: res.msg
                                    }
                                }
                            })
                        )
                        this.$delete(
                            this.filterKeys[
                                this.filterKeys.findIndex((v) => {
                                    return v.key == item.key
                                })
                            ],
                            'errMsg'
                        )
                    } else {
                        throw new Error('修改文件名称出错')
                        // return false
                    }
                })
            }
            Promise.all(PromiseList)
                .then((res) => {
                    res.forEach((e) => {
                        if (!e.code) {
                            this.$set(
                                this.filterKeys[
                                    this.filterKeys.findIndex((v) => {
                                        return v.key == e.item.key
                                    })
                                ],
                                'errMsg',
                                e.msg
                            )
                            throw new Error('修改文件名称出错')
                        }
                    })
                    this.isEditName = false
                    console.log('success', res)
                })
                .catch((err) => {
                    console.log('error:', err)
                })
        },

        // 区分 视频Or图片 true为视频 false为图片
        diffPicOrVideo(item) {
            const videoExt = ['.wmv', '.asf', '.asx', '.rm', '.rmvb', '.MPEG', '.mp4', '.3gp', '.mov', '.m4v', '.avi', '.dat', '.mkv', '.flv', '.vob', '.webm', '.ogg'];
            return videoExt.includes(`.${item.ext}`.toLowerCase())
        },
        
        // 处理上传成功 用于回显选中
        handleUpSuccess(files) {
            console.log('回显--', files)
            this.echoFiles = this.echoFiles.concat(files);
            if(this.inDialog && this.isEcho) {
                this.$nextTick(() => {
                    this.$emit('echo-success', this.echoFiles)
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
$--color-primary: #007bff;
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
::v-deep  .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block;
}
::v-deep  .el-aside .el-tree-node__content {
    border-left: 10px solid #f5f7fa;
    height: 40px;
    padding-right: 10px;
    position: relative;
    .el-tree-node__expand-icon {
        width: 24px;
        height: 24px;
        z-index: 20;
    }
    &:hover {
        border-left: 10px solid #fff;
        background: #fff;
    }
}
::v-deep  .is-expanded {
    > .el-tree-node__content {
        position: relative;
        border-left: 10px solid #fff;
        background: #fff;
    }
}
.pic-item {
    border: 0 solid $--color-primary;
    position: relative;
    .pic-img {
        width: 100%;
        height: 100%;
    }
    &:hover {
        border: 1px solid #e5e5e5;
        background: #f3f3f3;
        border-radius: 10px;
    }
    &.active {
        &:before {
            z-index: 100;
            position: absolute;
            left: 2px;
            top: 2px;
            color: $--color-primary;
            content: '\e678';
            font-family: 'iconfont' !important;
            font-size: 15px;
            vertical-align: middle;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        border: 1px solid $--color-primary;
        border-radius: 10px;
    }
}
* {
    &::-webkit-scrollbar {
        height: 6px;
        width: 6px;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(144, 147, 153, 0.3);
        border-radius: 4px;
        &:hover {
            background: rgba(144, 147, 153, 0.5);
        }
    }
}

/* 历史记录导航条 */
::v-deep .viewList {
    display: flex;
    >.el-breadcrumb__item {
        // flex: 0 0 25%;
        flex: 0;
        overflow: hidden;
        >.el-breadcrumb__inner {
            display: inline-block;
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}

// 商品发布是在el-form-item内潜入了该组件 导致该输入框会出现两个清除按钮
.cancelFormItem {
    ::v-deep .el-input__validateIcon {
        display: none;
    }
}

// 上传按钮
.uploadBtn {
    transform: opcacity .2s ease;
    &.is-disabled {
        opacity: .4;
    }
}

// 新增文件夹
.newFolderDialog {
    /* 由于使用了字数提示 但是ELEMENT并未做好处理 当输入过长时 输入的字符会被字数提示(position:absolute)给遮挡 */
    .el-input {
        ::v-deep .el-input__inner {
            padding-right: 46px;
        }
    }
}
</style>