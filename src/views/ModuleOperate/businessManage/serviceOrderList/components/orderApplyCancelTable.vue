<template>
    <div>
        <div ref="wrapTable" class="customTable__warp">
            <table class="customTable__header" :style="{ width: tableLayout.bodyWidth }">
                <thead>
                    <tr>
                        <th width="48">序号</th>
                        <th colspan="3" min-width="280" :width="tableLayout.m_280" style="text-align: left">商品</th>
                        <th width="140">订单金额</th>
                        <th :width="tableLayout.m_100">操作账号/时间</th>
                        <th :width="tableLayout.m_140">取消原因</th>
                        <th colspan="2" min-width="180" :width="tableLayout.m_180">备注说明</th>
                        <th width="80">状态</th>
                        <th width="140">备注</th>
                        <th min-width="140" :width="tableLayout.m_140">操作</th>
                    </tr>
                </thead>
            </table>
            <div class="customTable__con" :style="{ width: tableLayout.bodyWidth }">
                <template v-if="tableList.length">
                    <el-checkbox-group v-model="checkList">
                        <table v-for="(item, indexs) in tableList" :key="indexs" class="customTable__table">
                            <colgroup>
                                <col width="48" />
                                <col min-width="80" :width="tableLayout.m_80" />
                                <col min-width="100" :width="tableLayout.m_100" />
                                <col min-width="100" :width="tableLayout.m_100" />
                                <col width="140" />
                                <col :width="tableLayout.m_100" />
                                <col :width="tableLayout.m_140" />
                                <col min-width="80" :width="tableLayout.m_80" />
                                <col min-width="100" :width="tableLayout.m_100" />
                                <col width="80" />
                                <col width="140" />
                                <col min-width="140" :width="tableLayout.m_140" />
                            </colgroup>
                            <tbody>
                                <tr class="customTable__trHead">
                                    <td>
                                        <el-checkbox :label="item.id" :disabled="item.applyStatus != 2" />
                                    </td>
                                    <td colspan="11" style="text-align: left">
                                        <span class="customTable__trHead--action">申请时间：{{ item.createTime || '-' }}</span>
                                        <span class="customTable__trHead--action text-blue cursor-pointer" @click="toDetail(item, 'orderDetail')">
                                            订单号: {{ item.orderNumber || '-' }}
                                        </span>
                                        <span class="customTable__trHead--action">售后编号: {{ item.refundSn || '-' }}</span>
                                    </td>
                                </tr>
                                <tr v-for="(goodsInfo, index) in item.orderItemDTOList" :key="goodsInfo.id">
                                    <td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ indexs + 1 }}</td>
                                    <!-- 商品 -->
                                    <td colspan="3">
                                        <div class="d-flex a-center line-h-md">
                                            <ls-image style="flex: 0 0 60px" :src="goodsInfo.pic" :options="{ w: '60', h: '60', br: '4' }" />
                                            <div class="ml-10 flex-col-between">
                                                <!-- 这里外盒子与内盒子的高度不一 所以用font-size:0来清除 -->
                                                <el-link :underline="false" type="primary" style="font-size: 0" @click="proPreview(goodsInfo)">
                                                    <el-popover placement="top-start" width="500" trigger="hover" :title="goodsInfo.productName">
                                                        <div slot="reference" class="text-blue text-left line-clamp2 font-12">
                                                            {{ goodsInfo.productName || '-' }}
                                                        </div>
                                                        <el-link
                                                            class="text-blue"
                                                            :underline="false"
                                                            target="_blank"
                                                            :href="$shareRedirectUrl + '?detailsType=good&id=' + goodsInfo.productId"
                                                        >
                                                            {{ $shareRedirectUrl + '?detailsType=good&id=' + goodsInfo.productId }}
                                                        </el-link>
                                                    </el-popover>
                                                </el-link>
                                                <span v-if="goodsInfo.attribute" class="text-999 mt-10 text-left">{{ goodsInfo.attribute }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <!-- 订单金额 -->
                                    <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                        {{ item.orderMoney == 0 ? '0' : item.orderMoney || '-' }}
                                    </td>
                                    <!-- 操作账号/时间 -->
                                    <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                        <template v-if="item.shopOperator || item.shopOperatorTime">
                                            <div class="word-breakall">{{ item.shopOperator || '-' }}</div>
                                            <div>{{ item.shopOperatorTime || '-' }}</div>
                                        </template>
                                        <template v-else>-</template>
                                    </td>
                                    <!-- 取消原因 -->
                                    <td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ item.reason || '-' }}</td>

                                    <!-- 备注说明 -->
                                    <td v-if="!index" colspan="2" :rowspan="item.orderItemDTOList.length">
                                        <div class="line-clamp2">{{ item.sellerMessage || '-' }}</div>
                                    </td>
                                    <!-- 状态 -->
                                    <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                        <span :class="refundStatus(item).colorType">{{ refundStatus(item).status }}</span>
                                    </td>
                                    <!-- 备注 -->
                                    <td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ item.remark || '-' }}</td>
                                    <!-- 操作 -->
                                    <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                        <el-link
                                            :underline="false"
                                            class="d-block text-nowrap text-blue"
                                            type="primary"
                                            @click="toRefuseDetail(item)"
                                        >
                                            查看
                                        </el-link>
                                        <el-link
                                            v-if="item.applyStatus == 2"
                                            :underline="false"
                                            class="d-block text-nowrap text-blue"
                                            type="primary"
                                            @click="auditWithdrawGood(item, false)"
                                        >
                                            撤回
                                        </el-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-checkbox-group>
                </template>
                <empty v-else />
            </div>
        </div>
        <dialogPreview ref="dialogPreview" />
    </div>
</template>
<script>
import { serviceOrderApi } from '@/api/ModuleOrder'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'
import cud from '@/mixins/pages/cud'
export default {
    components: {
        dialogPreview
    },
    filters: {
        getOrderStatus(status) {
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
        tableList: {
            type: Array,
            required: true
        },
        selectableArr: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            checkList: [], // 选中的item
            customCheck: false, // 全选状态
            currentOrder: {}, // 激活的售后订单
            form: {
                abandonedGoodFlag: false, // 是否弃货
                auditFlag: 1, // 	是否通过售后
                refundId: '', // 	退款编号
                sellerMessage: '' // 	卖家备注
            },
            rules: {
                abandonedGoodFlag: [{ required: true, message: '是否弃货', trigger: 'blur' }],
                auditFlag: [{ required: true, message: '是否同意', trigger: 'blur' }]
            },
            tableLayout: {
                // 单元格大小分配
                colTotalWidth: 48 + 80 + 100 + 100 + 140 + 100 + 140 + 80 + 100 + 80 + 140 + 140
            }
        }
    },
    watch: {
        // 监听选中的数组，如果选中的数组长度等于当前分页的数量，则会全选
        checkList: {
            handler(val) {
                // 如果当前页有一项 不在当前选中的数组里 则一定不全选
                if (this.selectableArr.some((item) => !val.includes(item.id))) {
                    this.customCheck = false
                } else {
                    this.customCheck = true
                }
                this.$emit('selecteItem', this.customCheck, val)
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        refundStatus(data) {
            // applyStatus：1为待发货,3为待签收,5为待收货,7为已收货,默认为0
            // sellerStatus：卖家处理状态:0为待审核,1为同意,-1为不同意
            let typeobj = {}
            if (data.applyStatus == -1 || data.applyStatus == -2) {
                typeobj.status = '已取消'
                typeobj.colorType = 'status-done'
                // return '已取消'
                return typeobj
            }
            if (data.applyStatus == -4) {
                typeobj.status = '已拒绝'
                typeobj.colorType = 'status-veto'
                // return '已拒绝'
                return typeobj
            }
            if (data.applyStatus == 3) {
                typeobj.status = '已完成'
                typeobj.colorType = 'status-done'
                // return '已完成'
                return typeobj
            }
            if (data.applyStatus == 2) {
                typeobj.status = '待审核'
                typeobj.colorType = 'status-wait'
                // return '待审核'
                return typeobj
            }
            return '-'
        },
        proPreview(row) {
            let url = this.$shareRedirectUrl + `?detailsType=snapshot&device=mobile&id=${row.id}&snapshotId=${row.snapshotId}`
            this.$refs.dialogPreview.showDialog({ url: url })
        },
        auditWithdrawGood(row, isMult) {
            if (isMult) {
                //是批量撤回
                console.log(this.checkList)
                if (!this?.checkList?.length) {
                    this.$message.warning('请至少选择一条数据')
                    return
                }
                this.$confirm('确定撤销申请？', '消息确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    serviceOrderApi.auditWithdrawGood(this.checkList).then((res) => {
                        if (res.code) {
                            this.$emit('operate', res)
                        }
                    })
                })
            } else {
                this.$confirm('确定撤销申请？', '消息确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    serviceOrderApi.auditWithdrawGood([row.id]).then((res) => {
                        if (res.code) {
                            this.$emit('operate', res)
                        }
                    })
                })
            }
        },
        // 父组件点击全选
        selectedAllOrNot() {
            if (this.checkList.length === this.tableList.length) {
                this.checkList = []
            } else {
                this.checkList = this.tableList.map((item) => {
                    if (item.applyStatus == 2) return item.id
                })
            }
        },
        // 确认提交
        sureSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let api = ''
                    if (this.currentOrder.applyType == 1) {
                        api = 'auditRefund'
                    } else {
                        api = 'auditRefundGood'
                    }
                    serviceOrderApi[api](this.form)
                        .then((res) => {
                            this.orderDialogVisible = false
                            this.$emit('operate', res)
                        })
                        .catch((err) => {
                            console.log('sumit err', err)
                        })
                }
            })
        },
        // 去订单详情
        toDetail(order, name) {
            this.$router.push({ name: name, query: { DetailId: order.orderId } })
        },
        // 去订单详情
        toRefuseDetail(order) {
            this.$router.push({ name: 'shopApplicationDetail', query: { id: order.id, orderNumber: order.orderNumber } })
        }
    }
}
</script>

<style lang="scss" scoped>
/* 由于使用了字数提示 但是ELEMENT并未做好处理 当输入过长时 输入的字符会被字数提示(position:absolute)给遮挡 */
.el-textarea {
    ::v-deep .el-textarea__inner {
        padding-right: 46px;
    }
}
</style>
