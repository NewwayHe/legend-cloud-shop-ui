<template>
    <div>
        <el-form ref="pictureForm" :model="modelParams" size="small" label-width="80px" @submit.native.prevent>
            <el-form-item label="上传方式" prop="transType">
                <el-radio-group v-model="modelParams.upload" @change="changeUpload">
                    <el-radio :label="1">本地上传</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="modelParams.upload == 1" key="pic" label="本地图片" :rules="rules.pic" prop="pic">
                <upload ref="upload" key="modelParamsUpload" v-model="modelParams.pic" :floder-id="floderId" :limit="limit" />
                <div style="color: #999; font-size: 12px">当次最多可上传&ensp;{{ limit }}&ensp;张，仍可上传<span style="color: #F56C6C; font-weight: 500;">&ensp;{{ limit - modelParams.pic.length }}&ensp;</span>张，支持jpg、png、gif等格式</div>
            </el-form-item>

            <el-form-item v-if="modelParams.upload == 2" key="networkPic" label="网络图片" :rules="rules.networkPic" prop="networkPic">
                <div class="d-flex">
                    <el-input v-model="modelParams.networkPic" placeholder="请输入文件名" style="width: 50%" />
                </div>
                <ls-image :src="modelParams.pic + ''" class="rounded-15 w-100p h-100p mt-10"></ls-image>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import upload from './Upload'
import { materialCenter } from '@/api/ModuleSystem'

var checkNetworkPic = (rule, value, callback) => {
    var reg = /^(http|https):\/\/.*?\/.*?\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/

    if (!reg.test(value)) {
        callback(new Error('要抓取的网络地址不合法'))
    }
    if (value == '') {
        callback(new Error('请输入网络地址'))
    }
    callback()
}
export default {
    components: {
        upload
    },
    props: {
        floderId: {
            type: [Number, String],
            required: true
        },
        treeValue: {        //这个也不知道有什么用
            type: [String, Number],
            default: ''
        },
        // 当前次可上传张数
        limit: {
            type: Number,
            default: 15
        }
    },
    data() {
        return {
            modelParams: {
                TreeValue: 0,
                upload: 1,
                pic: [],
                networkPic: ''
            },
            rules: {
                pic: [{ required: true, message: `请上传图片`, trigger: 'blur' }],
                networkPic: [{ required: true, trigger: 'blur', validator: checkNetworkPic }]
            }
        }
    },
    watch: {
        TreeValue(val) {
            console.log('图片', val)
            this.modelParams.TreeValue = val
        }
    },
    created() {},
    mounted() {
        this.modelParams.TreeValue = this.TreeValue
    },
    methods: {
        check() {   //这个暂时用不上了
            console.log(this.modelParams.upload, '123')
            this.$refs['pictureForm'].validate((valid) => {
                if (valid) {
                    if (this.modelParams.upload == 1) {
                        this.updatedAttachment({
                            files: this.modelParams.pic,
                            treeId: this.modelParams.TreeValue,
                            uploadType: this.modelParams.upload
                        })
                    } else {
                        // 网络图片提取
                        this.extract1()
                    }
                } else {
                    this.$emit('error')
                    return false
                }
            })
        },
        updatedAttachment(params) {
            let filePath = params.files
            materialCenter
                .confirmUpload({ filePath: filePath })
                .then((res) => {
                    if (!res.code) {
                        this.$message.error(res.message)
                        return
                    }
                    this.resetFields()
                    this.$emit('uploadSussess') //上传成功
                })
                .catch((res) => {
                    this.$message.error(res.message)
                })
        },
        changeUpload(val) {
            this.resetFields()
            this.$emit('changeUpload', val)
        },

        //提取
        extract() {
            this.check()
        },
        // 网络图片提取
        extract1() {
            this.modelParams.networkPic &&
                common.uploadNetwork({ fileUrl: this.modelParams.networkPic }).then((res) => {
                    if (!res.code) {
                        this.$message.error(res.message)
                        return
                    }
                    this.modelParams.pic = res.result
                    this.$emit('checkSussess', {
                        files: [res.result],
                        treeId: this.modelParams.TreeValue,
                        uploadType: this.modelParams.upload
                    })
                })
        },
        resetFields() {
            this.$refs['pictureForm'].resetFields()
        },
        // resetFields会失效 使用这个resetData
        resetData() {
            if(this.$refs.upload){
                this.$refs.upload.clearFiles();
            }
            this.modelParams = {
                TreeValue: 0,
                upload: 1,
                pic: [],
                networkPic: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.extract {
    border-color: #dcdfe6 !important;
    color: #222 !important;
    margin-left: 5px;
}
</style>
