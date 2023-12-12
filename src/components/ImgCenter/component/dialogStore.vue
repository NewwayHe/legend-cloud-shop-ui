<template>
    <div>
        <el-dialog
            :title="isImg ? '我的图片' : '我的视频'"
            :style="{ minWidth: '530px' }"
            width="65%"
            :close-on-click-modal="false"
            :visible.sync="isVisible"
            custom-class="imgCenterDialog"
            append-to-body
            @close="closeDialog"
        >
            <materialCenter
                ref="materialCenter"
                :in-dialog="true"
                :mult="multiple"
                :limit="limit"
                :upload-tab="uploadTab"
				:tempUrl.sync="tempUrlTemp"
                :isEcho="isEcho"
                @transfers-select="transfersSelect"
                @echo-success="echoSuccess"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-ls-loading type="primary" @click="success">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import materialCenter from '@/views/ModuleSystem/materialCenter'
export default {
    components: {
        materialCenter
    },
    props: {
        // 是否多选
        multiple: {
            type: Boolean,
            default: true
        },
        // 图片src数组
        tempUrl: {
            type: [Array, String]
        },
        limit: {
            type: [Number, String]
        },
        uploadType: {
            //多媒体类型 PHOTO:图片;VIDEO:视频[当前选择的格式要求]
            type: String,
            default: 'PHOTO'
        },
        inRichText: {   //如果是在富文本里 则可以选择图片和视频 否则其余页面 应该只选择单一类型
            type: Boolean,
            default: false,
        },
        // true：为了防止客户上传完图片后在列表里找不到刚才上传的图片，上传完图片并点击【上传】后，立即选中上传的数据并且关闭弹窗(这时不用点击【确定】)[例子：商品发布上传图片]
        isEcho: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            fileType: '', //传递过来的类型
            isImg: true, //请求类型 IMG  video
            activeIndex: 0,
            //树分组
            // filterIds: [], //选中的id
            filterSrc: [], //选中的图片src
            showViewer: false,
            imgUrl: '',
            videoUrl: '',
            isVisible: false,

            selectItem: [], // 选中的item
			
			tempUrlTemp:''
        }
    },

    computed: {
        // 是否展示 上传图片和视频面板 BOTH代表两个 IMG代表只展示图片面板 VIDEO只展示视频面板 [上传要求]
        uploadTab() {
            return this.inRichText ? 'BOTH' : this.uploadType == 'PHOTO' ? 'IMG' : 'VIDEO'
        }
    },
	watch:{
		tempUrl: {
		    handler(newValue) {
		       this.tempUrlTemp = newValue
		    },
			immediate: true,
		},
	    tempUrlTemp(newValue){
	        this.$emit('update:tempUrl', newValue)
	    },
	},
    created() {
    },
    mounted() {
    },
    methods: {
        //选中图片点击确定
        success() {
            this.$refs['materialCenter'].handleEmit()
            if(!this.filterSrc.length&&!this.tempUrl.length) {
                return this.$message.warning('请先进行选择~')
            }
            const checkType = (src, showMsg = true) => {
                let picExt = src.split('.').slice(-1)
                if(this.diffPicOrVideo(`.${picExt}`)) {     //视频
                    if(this.uploadType == "PHOTO") {
                        showMsg && this.$message.warning('请选择正确格式的图片');
                        return false;
                    }
                }else {     //图片
                    if(this.uploadType == "VIDEO") {
                        showMsg && this.$message.warning('请选择正确格式的视频');
                        return false;
                    }
                }
                return true;
            }
            if(!this.inRichText) {
                if(this.multiple) {     //多选
                    // let count = 0        //这是循环剔除遇到视频后的每一项 第一种做法
                    for(let each of this.filterSrc) {
                        if(!checkType(each, false)) {
                            // this.filterSrc.length = count;  //在此截断 否则filterSrc会一直堆积
                            // 第二种做法 是剔除选择中含有的视频
                            const rawLen = this.filterSrc.length;
                            this.filterSrc = this.filterSrc.filter(item => checkType(item, false)); //截断
                            if(this.filterSrc.length) {
                                this.$message.warning(`当前选择${rawLen}个文件，已自动过滤不符合正确格式的${this.filterSrc.length}个${this.uploadType == "PHOTO" ? '视频' : '图片'}`)
                                this.isVisible = false
                                this.$emit('success', this.filterSrc, this.selectItem)
                            }
                            return;      //如果有一个不符合 直接跳出函数
                        }
                        // ++count;
                    }
                }else {     //单选
                    if(!checkType(this.filterSrc[0])) return;
                }
            }
            this.isVisible = false
            this.$emit('success', this.filterSrc, this.selectItem)
        },
        transfersSelect(arr) {
			arr = this.$utils.array.delRepeat(arr,'key')//去重
			// console.log('arr~~~~',this.filterSrc)
            if (this.multiple) {
                this.filterSrc = arr.map((v) => {
					if(this.diffPicOrVideo(`.${v.ext}`)) {
						return v.videoUrl
					}else {
						return v.url
					}
				})
            } else {
                this.filterSrc = arr.map((v) => {
                    if(this.diffPicOrVideo(`.${v.ext}`)) {
                        return v.videoUrl
                    }else {
                        return v.url
                    }
                })
            }
            this.selectItem = arr
			this.filterSrc = this.$utils.array.delRepeat(this.filterSrc)//去重
            console.log('filterSrc~~~~~~',this.filterSrc)
        },
        //显示对话框事件，判断请求类型，执行不同getdata()
        showDialog(fileType) {
            this.isVisible = true
            this.fileType = fileType
            this.$nextTick(()=> {
                this.$refs['materialCenter'].getSaveHistory(); //在弹窗中的imgCenter打开时要刷新历史数据
            })
        },
        //传递事件  第三步
        transfers3(url) {
            this.getData()
            this.$emit('transfers3', url)
            this.isVisible = false
        },
        // 子组件上传视频成功
        updateVideoSuccess() {
            this.getData()
        },
        //上传
        uploading() {
            this.$refs.dialogFodder.showDialog(this.fileType)
        },
        handleImg(item, event) {
            if (item.fileType == 1) {
                this.showViewer = true
                this.imgUrl = event
            } else {
                this.$refs.videoView.showDialog()
                this.videoUrl = item.videoPath
            }
        },
        // 关闭前动作
        closeDialog() {
            const materialCenter = this.$refs.materialCenter;   //要清空所选内容
            this.$nextTick(() => {
                materialCenter.filterKeys = [];
            })
        },
        //关闭对话框清空
        handleClose() {
            this.isVisible = false
        },
        //关闭图片预览
        closeViewer() {
            this.showViewer = false
        },
        //获取树
        loadAttachmentTree(flag = false) {
            fodder.attachmentTree(0).then((res) => {
                res.data && (this.attachmentTree = [...this.attachmentTree, ...res.data])
            })
        },

        //切换树节点
        switchTreeNode(index, id) {
            if (this.activeIndex == index) {
                return
            }
            this.searchFilters.treeId = id
            this.activeIndex = index
            this.dbnSearch()
        },

        // 区分 视频Or图片 true为视频 false为图片
        diffPicOrVideo(ext) {
            const videoExt = ['.wmv', '.asf', '.asx', '.rm', '.rmvb', '.MPEG', '.mp4', '.3gp', '.mov', '.m4v', '.avi', '.dat', '.mkv', '.flv', '.vob', '.webm', '.ogg'];
            return videoExt.includes(ext.toLowerCase())
        },

        // 立即回显
        echoSuccess(files) {
            this.filterSrc = files;
            this.$emit('success', this.filterSrc, [])
            this.isVisible = false
        },
    }
}
</script>
<style lang="scss" scoped>
$--color-primary: #ffa800;
::v-deep .imgCenterDialog > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    .el-card__header {
        padding-bottom: 0;
    }
    .el-card__body {
        padding-bottom: 0;
    }
}
</style>

<style></style>
