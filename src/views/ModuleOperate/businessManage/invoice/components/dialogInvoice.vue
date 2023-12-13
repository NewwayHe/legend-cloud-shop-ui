<template>
    <div class="dialog-form">
        <el-dialog title="增值税专票" width="500px" :visible.sync="isVisible">
            <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
                <el-form-item label="注册地址：">
                    <div>{{ ruleForm.registerAddr }}</div>
                </el-form-item>
                <el-form-item label="注册电话：">
                    <div>{{ ruleForm.registerPhone }}</div>
                </el-form-item>
                <el-form-item label="开户银行：">
                    <div>{{ ruleForm.depositBank }}</div>
                </el-form-item>
                <el-form-item label="银行账号：">
                    <div>{{ ruleForm.bankAccountNum }}</div>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="isVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { storeManage } from '@/api/ModuleUser.js'
export default {
    props: {
        invoiceInfo: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            isVisible: false,
            ruleForm: {}
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
        }
    }
}
</script>

<style></style>
