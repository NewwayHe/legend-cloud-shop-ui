<template>
    <section class="formWarp pl-20 pr-20">
        <el-form ref="form" :model="value" label-width="132px" size="small">
            <div class="form-title">更多设置</div>
            <el-form-item label="商品限购：">
                <div class="d-flex text-nowrap">
                    <span class="mr-5">每人</span>
                    <el-select v-model="value.productQuotaDTO.quotaType" style="width: 150px" placeholder="不限购">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-form v-if="value.productQuotaDTO.quotaType" ref="quotaDTOFrom" class="flex-1" :model="value.productQuotaDTO" size="small">
                        <el-form-item class="d-inline-block" prop="quotaCount" :rules="rules.quotaCount">
                            <span class="ml-15 mr-5">最多购买：</span>
                            <el-input v-model="value.productQuotaDTO.quotaCount" style="width: 150px" :oninput="$inputInteger" maxlength="6">
                                <template slot="append">件</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="d-inline-block" prop="quotaTime" :rules="rules.quotaTime">
                            <span class="ml-15 mr-5">开始生效时间：</span>
                            <el-date-picker
                                v-model="value.productQuotaDTO.quotaTime"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </el-form-item>

            <div class="overflow-h" :style="{ height: isOpen ? '' : '0px' }">
                <el-form-item>
                    <span slot="label">
                        是否预售
                        <el-tooltip class="item" placement="right">
                            <div slot="content" class="line-h-lg">
                                可设置商品预售状态，分为非预售商品、预售商品。
                                <br />
                                预售商品分为全款预售、定金预售两种类型
                            </div>
                            <i class="el-icon-question font-16 text-000 opacity-3"></i>
                        </el-tooltip>
                        ：
                    </span>
                    <el-radio v-model="value.preSellFlag" :label="false">否</el-radio>
                    <el-radio v-model="value.preSellFlag" style="margin-right: 0" :label="true">是</el-radio>
                    <div v-if="value.preSellFlag" class="bg-fa pt-30 pb-30 mt-20">
                        <el-form ref="presellForm" :model="value.preSellProductDTO" label-width="120px" size="small">
                            <el-form-item label="预售方式:" prop="payPctType" :rules="rules.payPctType">
                                <el-radio v-model="value.preSellProductDTO.payPctType" :label="0">全款支付</el-radio>
                                <el-radio v-model="value.preSellProductDTO.payPctType" :label="1">定金支付</el-radio>
                            </el-form-item>
                            <el-form-item label="预售时间:" prop="preSaleStart" :rules="rules.preSaleStart">
                                <el-date-picker
                                    v-model="model.preSaleTime"
                                    style="width: 350px"
                                    type="datetimerange"
                                    value-format="yyyy/MM/dd HH:mm:ss"
                                    :default-time="[currentTime()]"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right"
                                    @change="preSaleTimeChange"
                                />
                            </el-form-item>
                            <el-form-item v-if="value.preSellProductDTO.payPctType == 1" label="定金百分比:" prop="payPct" :rules="rules.payPct">
                                <el-input
                                    v-model.number="value.preSellProductDTO.payPct"
                                    type="number"
                                    style="width: 350px"
                                    placeholder="请输入百分比"
                                >
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item
                                v-if="value.preSellProductDTO.payPctType == 1"
                                :label="(value.preSellProductDTO.payPctType == 0 ? '支付' : '定金支付') + '时间:'"
                                :rules="rules.depositStart"
                                prop="depositStart"
                            >
                                <el-date-picker
                                    v-model="model.depositTime"
                                    style="width: 350px"
                                    type="datetimerange"
                                    value-format="yyyy/MM/dd HH:mm:ss"
                                    range-separator="至"
                                    :default-time="[currentTime()]"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right"
                                    @change="depositTimeChange"
                                />
                            </el-form-item>
                            <template v-if="value.preSellProductDTO.payPctType == 1">
                                <el-form-item label="尾款支付时间:" prop="finalMStart" :rules="rules.finalMStart">
                                    <el-date-picker
                                        v-model="model.finalMTime"
                                        style="width: 350px"
                                        type="datetimerange"
                                        value-format="yyyy/MM/dd HH:mm:ss"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right"
                                        @change="finalMTimeChange"
                                    />
                                </el-form-item>
                            </template>
                            <el-form-item key="preDeliveryTime" label="发货时间:" prop="preDeliveryTime" :rules="rules.preDeliveryTime">
                                <el-date-picker
                                    v-model="model.preDeliveryTime"
                                    style="width: 350px"
                                    type="datetimerange"
                                    value-format="yyyy/MM/dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right"
                                    @change="preDeliveryTimeChange"
                                />
                            </el-form-item>
                        </el-form>
                    </div>
                </el-form-item>
                <el-form-item>
                    <span slot="label">
                        上架时间
                        <el-tooltip placement="right">
                            <div slot="content" class="line-h-lg">
                                可设置商品的上架类型，分为立即上架、预约上架。
                                <br />
                                立即上架，即发布后用户即可预览、购买。
                                <br />
                                预约上架，需要设置上架时间，到达设置的时间后用户即可预览、购买。
                            </div>
                            <i class="el-icon-question font-16 text-000 opacity-3"></i>
                        </el-tooltip>
                        ：
                    </span>
                    <el-radio v-model="value.onSaleWay" :label="1">立即上架</el-radio>
                    <el-radio v-model="value.onSaleWay" :label="-1">不上架</el-radio>
                    <el-radio v-model="value.onSaleWay" style="margin-right: 0" :label="0">预约上架</el-radio>
                    <div v-if="value.onSaleWay == 0" class="bg-fa pt-30 pb-30 mt-20">
                        <el-form-item label="上架时间:" prop="appointTime" :rules="rules.appointTime">
                            <el-date-picker
                                v-model="value.appointTime"
                                type="datetime"
                                :default-time="currentTime()"
                                value-format="yyyy/MM/dd HH:mm:ss"
                                placeholder="选择日期时间"
                            ></el-date-picker>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item>
                    <span slot="label">
                        库存计数
                        <el-tooltip placement="right">
                            <div slot="content" class="line-h-lg">
                                拍下减库存即用户提交订单未付款也减少库存，
                                <br />
                                付款减库存即用户提交订单并完成付款后才减少库存（付款减库存会有超卖风险）
                            </div>
                            <i class="el-icon-question font-16 text-000 opacity-3"></i>
                        </el-tooltip>
                        ：
                    </span>
                    <el-radio v-model="value.stockCounting" :label="false">拍下减库存</el-radio>
                    <el-radio v-model="value.stockCounting" style="margin-right: 0" :label="true">付款减库存</el-radio>
                </el-form-item>
                <el-form-item label="商品详情：">
                    <el-tabs v-model="activeHtmlName" type="border-card">
                        <el-tab-pane label="商品详情" name="mobile">
                            <el-row type="flex" class="mt-10 mb-10">
                                <div class="mobile__view">
                                    <el-scrollbar class="mobile__con"><div v-html="value.content" /></el-scrollbar>
                                </div>
                                <TinyMce :key="contentKey" v-model="value.content" :height="600" class="tinymceImg w-100" />
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
            </div>
        </el-form>

        <!-- 展开/收起 -->
        <div class="w-100 text-333" :class="isOpen ? '' : 'is-no-open'">
            <div class="m-0-auto text-center cursor-pointer main-hover" style="width: 80px; height: 25px; line-height: 25px" @click="openContent">
                {{ isOpen ? '收起' : '展开' }}
                <span class="iconfont ml-1" :class="isOpen ? 'icon-ArrowUp' : 'icon-ArrowDown'" style="font-size: 14px"></span>
            </div>
        </div>
    </section>
</template>

<script>
import Upload from '@/components/Upload'
import TinyMce from '@/components/TinyMceNew'
import moment from 'moment'
export default {
    components: {
        TinyMce,
        Upload
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
        function parseTime(time) {
            return moment(time).valueOf()
        }
        //预售时间
        var preSaleTimeValidate = (rule, value, callback) => {
            if (parseTime(this.value.preSellProductDTO.preSaleStart) < parseTime()) {
                callback(new Error('预售时间不能小于当前时间'))
            }
            callback()
        }
        //定金时间
        var depositTimeValidate = (rule, value, callback) => {
            if (
                parseTime(this.value.preSellProductDTO.preSaleStart) > parseTime(this.value.preSellProductDTO.depositStart) ||
                parseTime(this.value.preSellProductDTO.preSaleEnd) < parseTime(this.value.preSellProductDTO.depositEnd)
            ) {
                callback(new Error('预售定金时间要在预售时间之内'))
            }
            callback()
        }

        //尾款时间

        var finalMTimeValidate = (rule, value, callback) => {
            if (parseTime(this.value.preSellProductDTO.depositStart) > parseTime(this.value.preSellProductDTO.finalMStart)) {
                callback(new Error('尾款开始时间要大于定金开始时间'))
            }
            callback()
        }

        //发货时间校验
        var preDeliveryValidate = (rule, value, callback) => {
            if (parseTime(this.value.preSellProductDTO.finalMStart) > parseTime(this.value.preSellProductDTO.preDeliveryTime)) {
                callback(new Error('发货开始时间要大于尾款开始时间'))
            }
            callback()
        }

        var appointTimeValidate = (rule, value, callback) => {
            if (parseTime(this.value.preSellProductDTO.preSaleStart) < parseTime(this.value.appointTime)) {
                callback(new Error('预约上架时间要早于预售开始时间'))
            }
            callback()
        }
        //百分比
        var validatePayPct = (rule, value, callback) => {
            if (value > 100) {
                callback(new Error('请输入100以内的数字'))
            } else {
                callback()
            }
        }

        // 检查参数列表
        let checkParamsList = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请选择运费模板'))
            }
            callback()
        }
        return {
            activeHtmlName: 'mobile',
            contentKey: 0,
            // rules:{},
            rules: {
                payPctType: { required: true, message: '预售方式不能为空', trigger: 'blur' },
                payPct: [
                    { required: true, message: '定金百分比不能为空', trigger: 'blur' },
                    { validator: validatePayPct, trigger: 'blur' }
                ],
                preSaleStart: [{ required: true, message: '预售时间不能为空', trigger: 'blur' }],
                depositStart: [
                    { required: true, message: '预售定金时间不能为空', trigger: 'blur' },
                    { validator: depositTimeValidate, trigger: 'blur' }
                ],
                finalMStart: [
                    { required: true, message: '预售尾款时间不能为空', trigger: 'blur' },
                    { validator: finalMTimeValidate, trigger: 'blur' }
                ],
                preDeliveryTime: [
                    { required: true, message: '发货时间不能为空', trigger: 'blur' },
                    { validator: preDeliveryValidate, trigger: 'blur' }
                ],
                appointTime: [
                    { required: true, message: '预约上架不能为空', trigger: 'blur' },
                    { validator: appointTimeValidate, trigger: 'blur' }
                ],
                quotaCount: { required: true, message: '最多购买件数不能为空', trigger: 'blur' },
                quotaTime: { required: true, message: '开始生效时间不能为空', trigger: 'blur' }
            },
            model: {
                preSaleTime: [], //预售时间
                depositTime: [], //定金时间
                finalMTime: [], //尾款时间
                preDeliveryTime: [] //发货时间
            },
            options: [
                {
                    value: '',
                    label: '不限购'
                },
                {
                    value: 'O',
                    label: '每单'
                },
                {
                    value: 'D',
                    label: '每天'
                },
                {
                    value: 'W',
                    label: '每周'
                },
                {
                    value: 'M',
                    label: '每月'
                },
                {
                    value: 'Y',
                    label: '每年'
                },
                {
                    value: 'A',
                    label: '终身'
                }
            ],
            isOpen: this.$route.query.isLookInfo ? true : false // 展开/收起
        }
    },
    computed: {},
    computed: {
        isLookInfo() {
            return this.$route.query.isLookInfo ? true : false
        }
    },
    watch: {
        activeHtmlName(newValue, oldValue) {
            this.contentKey++
        }
    },
    methods: {
        //预售时间
        preSaleTimeChange(value) {
            if (!value) {
                value = []
            }
            this.value.preSellProductDTO.preSaleStart = value[0] || ''
            this.value.preSellProductDTO.preSaleEnd = value[1] || ''
        },
        //获取当前时间
        currentTime() {
            return moment().format('HH:mm:ss')
        },
        //尾款支付时间
        finalMTimeChange(value) {
            if (!value) {
                value = []
            }
            this.value.preSellProductDTO.finalMStart = value[0] || ''
            this.value.preSellProductDTO.finalMEnd = value[1] || ''
        },
        //发货时间
        preDeliveryTimeChange(value) {
            if (!value) {
                value = []
            }
            this.value.preSellProductDTO.preDeliveryTime = value[0] || ''
            this.value.preSellProductDTO.preDeliveryEndTime = value[1] || ''
        },
        //定金支付开始
        depositTimeChange(value) {
            if (!value) {
                value = []
            }
            this.value.preSellProductDTO.depositStart = value[0] || ''
            this.value.preSellProductDTO.depositEnd = value[1] || ''
        },
        synchroMobile() {
            this.value.contentM = JSON.parse(JSON.stringify(this.value.content))
        },

        // 展开/收起
        openContent() {
            this.isOpen = !this.isOpen
        },

        onSubmit() {
            return new Promise((resolve) => {
                this.$refs['form'].validate(async (valid, model) => {
                    if (valid) {
                        let validate = true
                        if (this.$refs['presellForm']) {
                            this.$refs['presellForm'].validate((valid, valobj) => {
                                if (!valid) validate = false
                                this.isOpen = true
                                this.$scrollIntoView(this.$refs.presellForm)
                            })
                        }
                        if (this.$refs['quotaDTOFrom']) {
                            this.$refs['quotaDTOFrom'].validate((valid, valobj) => {
                                if (!valid) validate = false
                                this.isOpen = true
                                this.$scrollIntoView(this.$refs.quotaDTOFrom)
                            })
                        }
                        if (validate) {
                            resolve(true)
                        } else {
                            this.$message({ message: '页面上有必填项为空，请先去完善信息！', type: 'warning' })
                            resolve(false)
                        }
                    } else {
                        this.isOpen = true
                        this.$scrollIntoView(this.$refs.form)
                        resolve(false)
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep.el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
}
.mobile__view {
    flex-shrink: 0;
    width: 264px;
    height: 547px;
    background: url('~@/assets/images/mobile.png') no-repeat center;
    margin-right: 52px;
    margin-left: 42px;
    padding: 100px 7px 60px 15px;
}
.bg-fa {
    background-color: #fafafa;
}
.mobile__con {
    height: 100%;
}
.tinymceImg {
    img {
        display: block;
        width: 100% !important;
    }
}
.mobile__con {
    img {
        display: block;
        width: 100% !important;
    }
}
.is-no-open {
    position: relative;
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 80%);
    padding-top: 100px;
    margin-top: -100px;
}
</style>
