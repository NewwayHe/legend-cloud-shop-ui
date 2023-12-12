<template>
    <div>
        <el-form ref="form" :model="modelParams" size="small" label-width="90px" @submit.native.prevent>
            <el-form-item key="zip" label="本地压缩包" :rules="rules.zip" prop="zip">
                <upload ref="upload" key="modelParamsUpload" v-model="modelParams.zip" uploadType="zip" :floder-id="floderId" :limit="1" />
                <div style="color: #999; font-size: 12px">
					最多可上传
					<span style="color: #F56C6C; font-weight: 500;">&ensp;{{ 1 }}&ensp;</span>
					<!-- 个附件，支持zip、rar格式 -->
					个附件，支持zip格式<!-- 现在还不支持rar格式 -->
				</div>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import upload from './Upload'
import { materialCenter } from '@/api/ModuleSystem'
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
            default: 1
        }
    },
    data() {
        return {
            modelParams: {
                TreeValue: 0,
                upload: 1,
                zip: [],
            },
            rules: {
                zip: [{ required: true, message: `请上传压缩包`, trigger: 'blur' }],
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
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.updatedAttachment({
                        files: this.modelParams.zip,
                        treeId: this.modelParams.TreeValue,
                        uploadType: this.modelParams.upload
                    })
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
        resetFields() {
            this.$refs['form'].resetFields()
        },
        // resetFields会失效 使用这个resetData
        resetData() {
            if(this.$refs.upload){
                this.$refs.upload.clearFiles();
            }
            this.modelParams = {
                TreeValue: 0,
                upload: 1,
                zip: [],
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
