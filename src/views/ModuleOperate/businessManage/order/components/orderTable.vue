<template>
    <div ref="wrapTable" class="customTable__warp">
        <table class="customTable__header" :style="{ width: tableLayout.bodyWidth }">
            <thead>
                <tr>
                    <th width="48">序号</th>
                    <th colspan="3" min-width="280" :width="tableLayout.m_280" style="text-align: left">商品</th>
                    <th width="140">单价</th>
                    <th :width="tableLayout.d_80">数量</th>
                    <th :width="tableLayout.d_80">订单类型</th>
                    <th min-width="100" :width="tableLayout.m_100">收货人信息</th>
                    <th min-width="140" :width="tableLayout.m_140">实付款</th>
                    <th :width="tableLayout.d_80">交易状态</th>
                    <th width="120">售后状态</th>
                    <th min-width="140" :width="tableLayout.m_140">交易操作</th>
                </tr>
            </thead>
        </table>
        <div class="customTable__con" :style="{ width: tableLayout.bodyWidth }">
            <template v-if="tableList.length">
                <el-checkbox-group v-model="checkList">
                    <table v-for="(item, indexs) in tableList" :key="item.id" class="customTable__table">
                        <colgroup>
                            <col width="48" />
                            <col min-width="80" :width="tableLayout.m_80" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col width="140" />
                            <col :width="tableLayout.d_80" />
                            <col :width="tableLayout.d_80" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col min-width="140" :width="tableLayout.m_140" />
                            <col :width="tableLayout.d_80" />
                            <col width="120" />
                            <col min-width="140" :width="tableLayout.m_140" />
                        </colgroup>
                        <tbody>
                            <tr class="customTable__trHead">
                                <td>
                                    <el-checkbox
                                        :label="item.orderNumber"
                                        :disabled="!(item.status == 1 || (item.status == '3' && item.refundStatus == 0))"
                                    />
                                </td>
                                <td colspan="11" style="text-align: left">
                                    <span class="customTable__trHead--action">下单时间：{{ item.createTime }}</span>
                                    <span class="customTable__trHead--action">订单号: {{ item.orderNumber }}</span>
                                    <span class="customTable__trHead--action customTable__primary">
                                        <span class="icon iconfont icon-index mr-5 font-12"></span>
                                        {{ item.shopName }}
                                    </span>
                                    <span v-if="item.payedFlag" class="customTable__trHead--action">支付方式：{{ item.payTypeName }}</span>
                                </td>
                            </tr>
                            <tr v-for="(goodsInfo, index) in item.orderItemDTOList" :key="goodsInfo.id">
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ indexs + 1 }}</td>
                                <td colspan="3">
                                    <div class="d-flex a-center line-h-md">
                                        <ls-image
                                            style="flex: 0 0 60px"
                                            :src="goodsInfo.pic"
                                            :is-preview="false"
                                            :options="{ w: '60', h: '60', br: '4' }"
                                        />
                                        <div class="ml-10 flex-col-between">
                                            <!-- 这里外盒子与内盒子的高度不一 所以用font-size:0来清除 -->
                                            <el-link :underline="false" type="primary" style="font-size: 0" @click="proPreview(goodsInfo)">
                                                <el-popover placement="top-start" width="500" trigger="hover" :title="goodsInfo.productName">
                                                    <div slot="reference" class="text-blue line-clamp2 text-left font-12">
                                                        {{ goodsInfo.productName }}
                                                    </div>
                                                    <el-link
                                                        class="text-blue"
                                                        :underline="false"
                                                        target="_blank"
                                                        :href="$shareRedirectUrl + '?detailsType=good&id=' + goodsInfo.productId"
                                                    >
                                                        {{ $shareRedirectUrl + '?detailsType=good&id=' + goodsInfo.id }}
                                                    </el-link>
                                                </el-popover>
                                            </el-link>
                                            <span v-if="goodsInfo.attribute" class="text-999 mt-10 text-left">{{ goodsInfo.attribute }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {{ goodsInfo.price | priceFilter }}
                                </td>
                                <td>{{ goodsInfo.basketCount }}</td>
                                <!-- 订单类型 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ orderType[item.orderType] }}</td>
                                <!-- 用户信息 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <div class="word-breakall">{{ item.nickName }}</div>
                                    <div>{{ item.receiver }}</div>
                                    <div>{{ item.mobile }}</div>
                                </td>

                                <!-- 实付款 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <div>
                                        <p>{{ item.actualTotalPrice | priceFilter }}</p>
                                        <p>(含运费：{{ item.freightPrice | priceFilter }}</p>
                                    </div>
                                </td>
                                <!-- 交易状态 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <span :class="'1,5,10,15'.includes(item.status) ? 'status-wait' : 'status-done'">
                                        {{ item.status | getOrderStatus(item.orderType) }}
                                    </span>
                                </td>

                                <!-- 售后状态 -->
                                <td v-if="item.orderRefundType == 2">
                                    <div>
                                        <div v-if="goodsInfo.refundStatus == 1" class="status-veto">{{ refundStatus[goodsInfo.refundStatus] }}</div>
                                        <div v-else-if="goodsInfo.refundStatus == 2">
                                            {{ refundStatus[goodsInfo.refundStatus || item.refundStatus] }}
                                        </div>
                                        <div v-else class="text-blue">{{ refundStatus[goodsInfo.refundStatus] }}</div>
                                    </div>
                                    <el-link
                                        v-if="goodsInfo.refundStatus !== 0"
                                        :underline="false"
                                        class="d-block text-blue"
                                        @click="toRefuseDetail(goodsInfo, item.applyType)"
                                    >
                                        查看售后
                                    </el-link>
                                </td>
                                <td v-else-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <div>
                                        <div v-if="item.refundStatus == 1" class="status-veto">{{ refundStatus[item.refundStatus] }}</div>
                                        <div v-else-if="item.refundStatus == 2">{{ refundStatus[item.refundStatus] }}</div>
                                        <div v-else class="text-blue">{{ refundStatus[item.refundStatus] }}</div>
                                    </div>
                                    <span v-if="item.refundStatus != '0'" class="el-link text-blue" @click="toRefuseDetail(item, item.applyType)">
                                        查看售后
                                    </span>
                                </td>

                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <div class="flex-col-center">
                                        <router-link target="_blank" :to="{ name: 'orderPrint', query: { id: item.id } }">
                                            <el-link class="text-blue" :underline="false">打印订单</el-link>
                                        </router-link>
                                        <el-link
                                            v-if="item.status == '1'"
                                            :underline="false"
                                            class="d-block text-blue"
                                            @click="showDialog(item, item.status == '1' ? 'cancel' : 'cancelPreSell')"
                                        >
                                            取消订单
                                        </el-link>
                                        <template v-if="item.status == '5' && (!item.refundStatus || item.refundStatus === 3)">
                                            <el-link
                                                v-if="item.orderType != 'SM'"
                                                :underline="false"
                                                class="d-block text-blue"
                                                @click="showDialog(item, 'deliver')"
                                            >
                                                确认发货
                                            </el-link>
                                            <el-link v-else :underline="false" class="d-block text-blue" @click="sureStockUp(item)">备货完毕</el-link>
                                        </template>
                                        <el-link
                                            v-if="item.status == '1' || '5'"
                                            :underline="false"
                                            class="d-block text-blue"
                                            @click="toDetail(item.id)"
                                        >
                                            查看详情
                                        </el-link>
                                        <el-link
                                            v-if="!item.remarkedFlag"
                                            :underline="false"
                                            class="d-block text-blue"
                                            @click="showDialog(item, 'remark')"
                                        >
                                            添加备注
                                        </el-link>
                                        <!-- 这个取消订单取消的是买家已付款，商家待发货的订单(只有待成团、待发货、已付定金才可以) -->
                                        <el-link
                                            v-if="
                                                (item.status == '5' || item.status == '2' || item.status == '3') &&
                                                (item.refundStatus === 0 || item.refundStatus === 3)
                                            "
                                            :underline="false"
                                            class="d-block text-blue"
                                            @click="showDialog(item, 'applyCancel')"
                                        >
                                            申请取消订单
                                        </el-link>
                                        <el-link
                                            v-if="item.status == '1'"
                                            :underline="false"
                                            class="d-block text-blue"
                                            @click="showDialog(item, 'adjustOrder')"
                                        >
                                            调整订单
                                        </el-link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-checkbox-group>
            </template>
            <empty v-else />
        </div>

        <el-dialog :title="actionMap[currentAction].title" :visible.sync="orderDialog" custom-class="dialog-form-small">
            <div v-if="currentAction == 'applyCancel'" slot="title">
                <span>申请取消订单</span>
                <el-popover placement="right" width="500" trigger="hover">
                    <div class="font-12">
                        取消订单需商家与消费者达成一致后，提交系统审核通过后才能取消；平台审核通过前，用户无法在用户端查看申请取消订单进度和任何信息，若用户申请退款，退款优先于高于申请取消订单，申请取消订单数据系统自动关闭并且只保留退款数据商家端默认同意退款并提交平台审核；
                    </div>
                    <i slot="reference" class="el-icon-question text-light-muted"></i>
                </el-popover>
            </div>
            <div>
                <el-form ref="form" :model="form" label-width="98px" label-position="right" size="small">
                    <!-- //取消订单(已付款待发货) -->
                    <template v-if="currentAction == 'applyCancel'">
                        <el-form-item label="取消原因：" prop="reason" :rules="[{ required: true, message: '请选择取消原因' }]">
                            <el-select v-model="form.reason" placeholder="请选择">
                                <el-option v-for="item in reasonList_paid" :key="item.id" :label="item.value" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注说明：" prop="sellerMessage" :rules="[{ required: true, message: '请输入内容' }]">
                            <el-input v-model="form.sellerMessage" placeholder="请输入内容" clearable :maxlength="50" />
                        </el-form-item>
                    </template>
                    <!-- //调整订单 -->
                    <template v-if="currentAction == 'adjustOrder'">
                        <el-form-item label="原订单金额：" prop="reason">
                            <span class="font" style="color: #f56b6b">￥{{ currentOrder.actualTotalPrice }}</span>
                        </el-form-item>

                        <el-form-item label="应付金额：" prop="orderAmount" :rules="[{ required: true, message: '请输入应付金额' }]">
                            <lsInput v-model="form.orderAmount" :precision="2" :min="0" :max="9999999" text-align="left" placeholder="请输入应付金额">
                                <template>元</template>
                            </lsInput>
                        </el-form-item>
                        <el-form-item
                            v-if="currentOrder.orderType != 'SM'"
                            label="运费金额："
                            prop="freight"
                            :rules="[{ required: true, message: '请输入运费金额' }]"
                        >
                            <lsInput v-model="form.freight" :precision="2" :min="0" :max="9999999" text-align="left" placeholder="请输入运费金额">
                                <template>元</template>
                            </lsInput>
                        </el-form-item>
                        <el-form-item label="订单总额：" prop="reason">
                            <span class="font" style="color: #f56b6b">{{ (form.freight * 1 + form.orderAmount * 1) | priceFilter }}</span>
                            <br />
                            <span class="font text-nowrap" style="color: #f56b6b; margin-left: -50px">
                                （
                                <span></span>
                                应付金额增加了￥ {{ (form.orderAmount - form.oldOrderAmount).toFixed(2) }}
                                <span v-if="currentOrder.orderType != 'SM'">
                                    ，运费金额增加了￥{{ (form.freight - currentOrder.freightPrice).toFixed(2) }}
                                </span>
                                ）
                            </span>
                        </el-form-item>
                    </template>

                    <!-- //确认发货 -->
                    <template v-if="currentAction == 'deliver'">
                        <el-form-item label="快递公司：" prop="logisticsCompanyId" :rules="[{ required: true, message: '请选择快递公司' }]">
                            <el-select v-model="form.logisticsCompanyId" placeholder="请选择">
                                <el-option v-for="item in logisticsList" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快递单号：" prop="logisticsNumber" :rules="[{ required: true, message: '请填写快递单号' }]">
                            <el-input v-model="form.logisticsNumber" placeholder="请输入内容" :maxlength="30" clearable />
                        </el-form-item>
                    </template>

                    <!-- //取消订单(未付款) -->
                    <template v-if="currentAction == 'cancel' || currentAction == 'cancelBat' || currentAction == 'cancelPreSell'">
                        <el-form-item label="取消原因：" prop="reason" :rules="[{ required: true, message: '请选择取消原因' }]">
                            <el-select v-model="form.reason" placeholder="请选择">
                                <el-option
                                    v-for="(item, index) in reasonList_unpaid"
                                    :id="item.id"
                                    :key="index"
                                    :label="item.value"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </template>

                    <!-- //添加备注 -->
                    <template v-if="currentAction == 'remark'">
                        <el-form-item label="添加备注：" prop="remark" :rules="[{ required: true, message: '请添加备注' }]">
                            <el-input v-model="form.remark" maxlength="200" placeholder="请添加备注" clearable></el-input>
                        </el-form-item>
                    </template>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="orderDialog = false">取 消</el-button>
                <ls-button v-if="currentAction != 'cancelBat'" size="small" type="primary" :async-function="orderSumbit">确 定</ls-button>
                <ls-button v-else size="small" type="primary" :async-function="() => batCancelSumbit(checkList)">确 定</ls-button>
            </span>
        </el-dialog>
        <dialogPreview ref="dialogPreview" />
    </div>
</template>
<script>
import { orderApi, serviceOrderApi } from '@/api/ModuleOrder.js'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
import cud from '@/mixins/pages/cud'
import { debounce } from '@/utils/utils.js'
const defalutForm = {
    orderNumber: '', //订单号
    freight: 0, //运费金额
    orderAmount: 0, // 应付金额
    oldOrderAmount: 0, // 旧应付金额

    remark: '', // 备注

    reason: '', //取消原因
    sellerMessage: '',
    logisticsCompanyId: '', //快递公司
    logisticsNumber: '' //快递单号
}

export default {
    components: {
        dialogPreview
    },
    filters: {
        getOrderStatus(status, orderType) {
            const orderStatusDict = {
                1: '待付款',
                2: '待成团',
                3: '已付定金',
                5: '待发货',
                10: '待签收',
                15: '待收货',
                20: '已完成',
                [-5]: '已取消'
            }
            return orderStatusDict[status] || '-'
        }
    },
    mixins: [cud],
    props: {
        value: {
            type: Array,
            default: () => []
        },
        tableList: {
            type: [Array, Object],
            required: true
        },
        isShop: {
            type: false,
            default: true
        },
        selectableArr: {
            //可供选择的数据
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            checkList: [], // 选中的item
            orderDialog: false, // 调整订单
            form: Object.assign({}, defalutForm),
            currentOrder: {}, // 当前订单
            refundStatus: {
                0: '未申请',
                // 1: '处理中',
                // 0: '未退款',
                1: '退货退款处理中',
                2: '已完成',
                3: '已结束'
            },
            orderType: {
                O: '普通订单',
                P: '预售订单',
                G: '团购订单',
                S: '秒杀订单',
                MG: '拼团订单',
                SM: '门店自提订单'
            },

            orderTypeList: [
                //订单状态
                {
                    label: '待付款',
                    value: 1
                },
                {
                    label: '待发货',
                    value: 5
                },
                {
                    label: '待签收',
                    value: 10
                },
                {
                    label: '待收货',
                    value: 15
                },
                {
                    label: '已完成',
                    value: 20
                },
                {
                    label: '已取消',
                    value: -5
                }
            ],
            reasonList_unpaid: [], // 原因列表(买家未付款时取消订单原因)
            reasonList_paid: [], // 原因列表(买家已付款未发货时取消订单原因)
            logisticsList: [], // 物流列表
            actionMap: {
                // 操作对应map操作
                deliver: {
                    title: '确认发货',
                    method: 'insertLogistic',
                    message: '发货成功'
                },
                cancel: {
                    title: '取消订单',
                    method: 'cancelOrder',
                    message: '取消订单成功'
                },
                cancelBat: {
                    title: '取消订单',
                    method: 'cancelOrder',
                    message: '取消订单成功'
                },
                cancelPreSell: {
                    title: '取消订单',
                    method: 'cancelPreSellOrder',
                    message: '取消预售订单成功'
                },
                remark: {
                    title: '添加备注',
                    method: 'subRemake',
                    message: '添加备注成功'
                },
                adjustOrder: {
                    title: '调整订单',
                    method: 'orderFee',
                    message: '调整订单成功'
                },
                applyCancel: {
                    title: '申请取消订单',
                    method: 'applyCancel',
                    message: '申请取消订单成功'
                }
            },
            currentAction: 'deliver',
            tableLayout: {
                // 单元格大小分配
                colTotalWidth: 48 + 80 + 100 + 100 + 140 + 100 + 120 + 80 * 3 + 140 + 140
            },
            isBatch: true //是否是批量取消
        }
    },
    watch: {
        value: {
            handler(newVal) {
                this.checkList = newVal
            },
            deep: true,
            immediate: true
        },
        // 监听选中的数组，如果选中的数组长度等于当前分页的数量，则会全选
        checkList(newVal) {
            this.$emit('input', newVal)
        },
        orderDialog(newVal) {
            if (!newVal) {
                Object.assign(this.form, defalutForm)
            }
        }
    },
    mounted() {
        this.getBaseInfo()
    },
    methods: {
        // 去售后订单详情
        toRefuseDetail(row, applyType) {
            // applyType为1、2是退货、退款，为3是商家申请取消订单
            if (applyType == 3) {
                this.$router.push({ name: 'shopApplicationDetail', query: { orderNumber: row.orderNumber } })
            } else {
                this.$router.push({ name: 'refuseDetail', query: { id: row.refundId } })
            }
        },
        proPreview(row) {
            let url = this.$shareRedirectUrl + `?detailsType=snapshot&device=mobile&id=${row.id}&snapshotId=${row.snapshotId}`
            this.$refs.dialogPreview.showDialog({ url: url })
        },
        //提交订单
        orderSumbit() {
            return new Promise(async (resolve) => {
                if (this.currentAction == 'cancel') {
                    this.isBatch = false
                    await this.batCancelSumbit([this.form.orderNumber])
                    resolve()
                    return
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        orderApi[this.actionMap[this.currentAction].method](this.form)
                            .then((res) => {
                                if (res.code == 1) {
                                    this.orderDialog = false
                                    Object.assign(this.form, defalutForm)
                                    this.$message.success(this.actionMap[this.currentAction].message)
                                    this.$emit('refreshData')
                                }
                            })
                            .finally((_) => {
                                resolve()
                            })
                    } else {
                        resolve()
                    }
                })
            })
        },
        // 批量取消订单
        batCancelSumbit(checkList) {
            return new Promise((resolve) => {
                console.log('batch---', checkList)
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let params = {
                            reason: this.form.reason,
                            orderNumbers: checkList
                        }
                        orderApi
                            .cancelOrder(params)
                            .then((res) => {
                                if (res.code == 1) {
                                    this.orderDialog = false
                                    if (!this.isBatch) {
                                        //如果单删
                                        let index = this.checkList.indexOf(checkList[0])
                                        if (index > -1) {
                                            this.checkList.splice(index, 1)
                                        }
                                    } else {
                                        this.checkList = []
                                    }
                                    Object.assign(this.form, defalutForm)
                                    this.$message.success(this.actionMap[this.currentAction].message)
                                    this.$emit('refreshData')
                                }
                            })
                            .finally(() => {
                                this.isBatch = true
                                resolve()
                            })
                    } else {
                        resolve()
                    }
                })
            })
        },
        //获取基础信息 原因列表 物流列表
        getBaseInfo() {
            orderApi.reasonList().then((res) => {
                if (res.code == 1) {
                    this.reasonList_unpaid = res.data
                }
            })
            orderApi.getLogisticsCompany().then((res) => {
                if (res.code == 1) {
                    this.logisticsList = res.data
                }
            })
            serviceOrderApi.refundReason().then((res) => {
                if (res.code) {
                    this.reasonList_paid = res.data
                }
            })
        },
        // 父组件点击全选
        selectedAllOrNot(flag) {
            if (!flag) {
                //反选
                // 将当前页的可选项从已选中的数组中去除
                this.checkList = this.checkList.filter((item) => !this.selectableArr.includes(item))
            } else {
                //勾选
                this.checkList = [...new Set([...this.checkList, ...this.selectableArr])]
            }
        },

        // 打开弹窗
        showDialog(item, dialogType) {
            this.currentAction = dialogType
            this.currentOrder = item
            this.orderDialog = true
            this.form.orderNumber = item.orderNumber
            this.form.orderId = item.id
            //如果是调整订单需要赋值然后计算
            if (dialogType == 'adjustOrder') {
                this.form.freight = item.freightPrice
                this.form.orderAmount = item.actualTotalPrice * 1 - item.freightPrice * 1
                this.form.oldOrderAmount = item.actualTotalPrice * 1 - item.freightPrice * 1
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        // 关闭弹窗
        hiddenDialog() {
            this[dialogType] = false
            Object.assign(this.form, defalutForm)
        },

        // 跳转详情页
        toDetail(id) {
            this.$emit('toDetail', id)
        },

        // 父组件批量取消订单
        batchShowDialog(type) {
            if (this.checkList.length < 1) {
                this.$message.warning('至少选择一条数据')
                return
            }
            this.currentAction = 'cancelBat'
            this.orderDialog = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        //打印订单
        goOrderPrint(id) {
            // 获取商品详情
            orderApi
                .getOrderDetails({
                    orderId: id
                })
                .then((res) => {
                    if (res.code == 1) {
                        const { href } = this.$router.resolve({
                            name: 'orderPrint',
                            query: {
                                data: JSON.stringify(res.data)
                            }
                        })
                        window.open(href, '_blank')
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        getOrderPrintUrl(id) {
            return (
                window.location.origin +
                '/' +
                this.$router.resolve({
                    name: 'orderPrint',
                    query: {
                        id: id
                    }
                }).href
            )
        },
        // 备货完毕
        sureStockUp(item) {
            this.$confirm('是否确认备货完毕？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                orderApi
                    .insertStockup({
                        orderNumber: item.orderNumber
                    })
                    .then((res) => {
                        if (res.code) {
                            this.$message.success('操作成功')
                            this.$emit('refreshData')
                        }
                    })
            })
        }
    }
}
</script>
<style lang="scss" scoped></style>
