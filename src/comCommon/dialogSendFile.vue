<template>
    <div class="dialog-form">
        <el-dialog :title="`批量导入${title}`" width="520px" :visible.sync="isVisible">
            <el-form ref="ruleForm" :model="ruleForm" label-width="0">
                <div class="font-14 text-333 mb-20">导入已填写的表格，若数据量过大则导入处理时间较慢，可收起弹窗后台操作</div>
                <el-form-item label="">
                    <slot name="body"></slot>
                    <el-upload
                        v-show="uploadStatus == 'ready'"
                        ref="upload"
                        :action="$config.server + url"
                        :data="{ fileSource: 'S' }"
                        :headers="headers"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :on-progress="handleProgress"
                        :on-error="handleError"
                        :before-remove="beforeRemove"
                        :before-upload="beforeUpload"
                        :on-exceed="handleExceed"
                        :show-file-list="false"
                        :file-list="fileList"
                    >
                        <el-button class="w-100" type="primary" size="mini" plain>导入{{ title }}</el-button>
                    </el-upload>
                    <el-progress
                        v-show="uploadStatus != 'ready'"
                        text-inside
                        :stroke-width="24"
                        :percentage="Number(percentage)"
                        :format="format"
                    ></el-progress>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button v-if="uploadStatus == 'ready'" size="small" @click="isVisible = false">取消</el-button>
                <el-button v-if="uploadStatus == 'uploading'" size="small" @click="cancelUpload">取消上传</el-button>
                <el-button v-if="uploadStatus == 'uploading'" type="primary" size="small" @click="isVisible = false">后台上传</el-button>
                <el-button v-if="uploadStatus == 'success' || uploadStatus == 'error'" size="small" @click="cancelUpload">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
    props: {
        invoiceInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        title: String,
        url: String
    },
    data() {
        return {
            isVisible: false,
            ruleForm: {},
            fileList: [],
            headers: { Authorization: 'Bearer ' + getToken() },
            unUpload: true,
            uploadStatus: 'ready', //ready:未选择文件,uploading:上传中,success:上传成功,error:上传失败
            percentage: 0
        }
    },
    watch: {
        invoiceInfo(val) {
            this.ruleForm = val
        }
    },
    methods: {
        showDialog() {
            this.isVisible = true
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        handleChange(file, fileList) {
            if (file.status == 'success') {
                this.uploadStatus = 'success'
                this.$message.success('上传文件 ' + file.name + ' 成功')
                this.$emit('success')
            } else if (file.status == 'fail') {
                this.uploadStatus = 'error'
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        },

        handleError(err, file, fileList) {
            this.$message({
                showClose: true,
                message: JSON.parse(err.message).msg,
                type: 'error'
            })
            console.log(err.message, typeof err.message, JSON.parse(err.message).msg)
            console.log(Object.keys(JSON.parse(JSON.stringify(arguments[0].message))))
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        },

        beforeUpload(file) {
            this.uploadStatus = 'uploading'
            this.unUpload = false
        },
        handleProgress(event, file, fileList) {
            this.percentage = Number(event.percent).toFixed(2)
        },
        cancelUpload() {
            if (this.uploadStatus == 'uploading') {
                this.$refs.upload.abort()
                this.$message.warning('已终止上传文件')
                Object.assign(this.$data, this.$options.data())
            } else if (this.uploadStatus == 'ready') {
                this.$message.warning('没有文件上传中')
            } else if (this.uploadStatus == 'success') {
                this.uploadStatus = 'ready'
                Object.assign(this.$data, this.$options.data())
            } else {
                Object.assign(this.$data, this.$options.data())
            }
        },
        format(v) {
            return v == 100 ? (this.uploadStatus == 'error' ? '处理失败' : '处理完成') : v + '%'
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
    display: block;
}
::v-deep .el-progress-bar__inner {
    text-align: center;
}
</style>
