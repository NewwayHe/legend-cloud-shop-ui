<template>
    <section class="formWarp pl-20 pr-20">
        <el-form ref="form" :model="value" :rules="rules" label-width="132px" size="small">
            <div class="form-title">其他信息</div>
            <el-form-item label="配送方式：" prop="deliveryType">
                <el-checkbox-group v-model="value.deliveryType">
                    <el-checkbox
                        v-for="deliveryType in deliveryTypes"
                        :key="deliveryType.value"
                        :label="deliveryType.value"
                        :disabled="deliveryType.disabled"
                    >
                        {{ deliveryType.label }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- 运费模板是不同表单 -->
            <el-form ref="transForm" :model="value" label-width="132px" size="small">
                <el-form-item label="运费方式：" prop="transId" :rules="transId">
                    <el-button v-if="!isLookInfo" type="primary" size="small" @click="selectTrans">选择模板</el-button>
                    <el-tag v-if="value.transName" class="ml-10">{{ value.transName }}</el-tag>
                </el-form-item>
            </el-form>
        </el-form>
        <dialogTransTemplate ref="dialogTransTemplate" :trans-id.sync="value.transId" @transChange="transChange" />
    </section>
</template>

<script>
import dialogTransTemplate from './components/dialogTransTemplate' //运费模板组件
export default {
    components: {
        dialogTransTemplate
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        // 检查参数列表
        let checkParamsList = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请选择运费模板'))
            }
            callback()
        }
        return {
            rules: {
                deliveryType: [{ type: 'array', required: true, message: '请至少勾选一种配送方式', min: 1 }]
            },
            deliveryTypes: [
                //配送方式复选框
                { label: '快递配送', value: 0, disabled: true }
                // { label: '到店自提', value: 10, disabled: false }
                // { label: '二者', value: 20 },
            ],
            transId: [
                { required: true, message: '运费模板不能为空', trigger: 'blur' },
                { validator: checkParamsList, trigger: 'blur' }
            ]
        }
    },
    computed: {
        isLookInfo() {
            return this.$route.query.isLookInfo ? true : false
        }
    },
    watch: {},
    created() {},
    methods: {
        //选择运费模板
        selectTrans() {
            this.$refs.dialogTransTemplate.showDialog()
        },
        //运费模板改变
        transChange(transId, transName, transTemplate) {
            this.value.transId = transTemplate.id
            this.value.transName = transTemplate.transName
            this.value.transType = transTemplate.transType
            this.value.freeFlag = transTemplate.freeFlag
            this.$refs['transForm'].validate() //防止点‘下一步’触发表单验证失败后，再次选好值后，还显示红色报错的字
        },
        onSubmit() {
            return new Promise((resolve) => {
                // 需要验证两个表单
                let valid1 = null
                this.$refs['form'].validate((valid) => {
                    valid1 = valid
                })
                let valid2 = null
                this.$refs['transForm'].validate((valid) => {
                    valid2 = valid
                })
                if (valid1 && valid2) {
                    resolve(true)
                } else {
                    this.$scrollIntoView(this.$refs.form)
                    resolve(false)
                }
            })
        }
    }
}
</script>
