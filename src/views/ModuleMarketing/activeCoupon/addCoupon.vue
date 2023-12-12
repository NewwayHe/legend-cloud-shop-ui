<!-- /*
 * @Descripttion:新增优惠券
*/ -->
<template>
    <section class="formWarp">
        <el-card class="sumbit__warp" shadow>
            <el-form ref="form" :model="couponForm" :rules="rules" label-width="135px" size="small">
                <div class="form-title">基本信息</div>
                <el-form-item label="优惠券名称：" prop="title">
                    <el-input
                        v-model="couponForm.title"
                        v-if="pageType != 'lookInfo'"
                        placeholder="只支持中文或数字，最长25个字符"
                        style="width: 450px"
                        maxlength="25"
                        show-word-limit
                    />
                    <span v-else>{{couponForm.title}}</span>
                </el-form-item>
                <el-form-item label="发放数量：" prop="count">
                    <el-input
                        v-model="couponForm.count"
                        v-if="pageType != 'lookInfo'"
                        placeholder="支持正整数，大于等于1且小于等于100万"
                        style="width: 450px"
                        :oninput="$inputInteger"
                    >
                        <template slot="append"><span class="font-12">张</span></template>
                    </el-input>
                    <span v-else>{{couponForm.count}}张</span>
                </el-form-item>
                <el-form-item key="receiveStartTime" label="领取时间：" prop="receiveStartTime">
                    <el-date-picker
                        v-model="tempForm.receiveTime"
                        :picker-options="pickerOptions"
                        v-if="pageType != 'lookInfo'"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="领取开始时间"
                        end-placeholder="领取结束时间"
                        @change="receiveTimeChange"
                    ></el-date-picker>
                    <span v-else>{{couponForm.receiveStartTime + ' 至 ' + couponForm.receiveEndTime}}</span>
                </el-form-item>
                <el-form-item label="使用时间：">
                    <el-radio-group v-model="tempForm.useTimeType" v-if="pageType != 'lookInfo'" @change="clearInput($event ,'userTimeType')">
                        <el-form-item key="useStartTime" prop="useStartTime" label-width="0">
                            <div class="d-flex a-center font-14">
                                <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                                <div class="font-12">按照时间段设置</div>
                                <el-date-picker
                                    v-model="tempForm.useTime"
                                    :disabled="pageType == 'lookInfo'"
                                    :picker-options="pickerOptions"
                                    class="mx-10"
                                    type="datetimerange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="使用开始时间"
                                    end-placeholder="使用结束时间"
                                    @change="useTimeChange"
                                ></el-date-picker>
                            </div>
                        </el-form-item>
                        <div class="mt-10 d-flex a-center font-12">
                            <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                            <div class="font-12">按照领取</div>
							<lsInput class="mx-10 w-100p" v-model="couponForm.useDayLater" :disabled="pageType == 'lookInfo'" :precision="0" :min="0"  :max="999"/>
                            天后
							<lsInput class="mx-10 w-100p" v-model="couponForm.withinDay" :disabled="pageType == 'lookInfo'" :precision="0" :min="0"  :max="999"/>
							内可用
                        </div>
                    </el-radio-group>
                    <div v-else>
                        <span v-if="tempForm.useTimeType==0">{{couponForm.useStartTime + ' 至 ' + couponForm.useEndTime}}</span>
                        <span v-else>领取{{couponForm.useDayLater || '-'}}天后{{couponForm.withinDay || '-'}}天内可用</span>
                    </div>
                </el-form-item>

                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">优惠券信息</div>
                <el-form-item label="设置优惠门槛 ：">
                    <el-radio-group v-model="tempForm.pointType" v-if="pageType != 'lookInfo'" @change="changePointType(tempForm.pointType)">
                        <el-form-item key="minPoint" label-width="0" prop="minPoint">
                            <div class="d-flex a-center font-12">
                                <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                                <div>满</div>
                                <el-input
                                    v-model="couponForm.minPoint"
                                    :disabled="pageType == 'lookInfo'"
                                    class="ml-10"
                                    placeholder="请输入金额"
                                    style="width: 150px"
                                    :oninput="$inputInteger"
									maxlength="9"
                                >
                                    <template slot="append"><span class="font-12">元</span></template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <div class="mt-10 d-flex a-center font-12">
                            <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                            <div>无使用门槛<!--（可与其他优惠券叠加使用）--></div>
                        </div>
                    </el-radio-group>
                    <div v-else>
                        <span v-if="tempForm.pointType==0">满{{couponForm.minPoint || '-'}}元</span>
                        <span v-else>无使用门槛<!--（可与其他优惠券叠加使用）--></span>
                    </div>
                </el-form-item>
                <el-form-item key="amount" label="设置优惠金额 ：" prop="amount">
                    <div class="d-flex a-center font-12">
                        <div>减</div>
						<template v-if="pageType != 'lookInfo'">
							<lsInput
								v-model="couponForm.amount"
								:min="0"
								:max="999999"
								:precision="2"
								:disabled="pageType == 'lookInfo'"
								class="mx-10 w-150p"
							>
								<template slot="append">元</template>
							</lsInput>
						</template>
                        <span v-else>{{couponForm.amount || '-'}}元</span>
                    </div>
                </el-form-item>
                <el-form-item v-if="pageType==='lookInfo'" label="优惠券链接 ：">
                    <el-link class="text-blue" type="primary" :underline="false">{{couponUrl}}</el-link>
                    <el-button type="primary" @click="handleCopy(couponUrl,$event)">复制链接</el-button>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">其它设置</div>
                <el-form-item label="每人限领：">
                    <el-radio-group v-model="tempForm.LimitType" v-if="pageType != 'lookInfo'" @change="clearInput($event ,'LimitType')">
                        <div class="mt-10 mb-20 d-flex a-center font-12">
                            <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                            <div>不限领</div>
                        </div>
                        <el-form-item key="perDayLimit" label-width="0" prop="perDayLimit">
                            <div class="d-flex a-center font-12">
                                <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                                <div>限制每天每人领取</div>
								<lsInput
									v-model="couponForm.perDayLimit"
									:min="1"
									:max="999"
									:precision="0"
									:disabled="pageType == 'lookInfo'"
									class="mx-10 w-150p"
								>
									<template slot="append">张</template>
								</lsInput>
                            </div>
                        </el-form-item>
                        <el-form-item key="perTotalLimit" label-width="0" prop="perTotalLimit">
                            <div class="d-flex a-center font-12">
                                <el-radio class="mr-0" :label="2">{{ '' }}</el-radio>
                                <div>限制活动期间每人领取</div>
								<lsInput
								    v-model="couponForm.perTotalLimit"
									:min="1"
								    :max="999"
									:precision="0"
								    :disabled="pageType == 'lookInfo'"
								    class="mx-10 w-150p"
								>
								    <template slot="append">张</template>
								</lsInput>
                            </div>
                        </el-form-item>
                    </el-radio-group>
                    <div v-else>
                        <span v-if="tempForm.LimitType==0">不限领</span>
                        <span v-else-if="tempForm.LimitType==1">每天每人领取{{couponForm.perDayLimit}}张</span>
                        <span v-else>活动期间每人领取{{couponForm.perTotalLimit}}张</span>
                    </div>
                </el-form-item>
                <el-form-item label="领取方式：">
                    <el-radio-group v-model="couponForm.receiveType" v-if="pageType != 'lookInfo'">
                        <div class="d-flex a-center font-12">
                            <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                            <div>免费领取（不需要任何条件即可领取优惠券）</div>
                        </div>
                    </el-radio-group>
                    <div v-else>
                        <span v-if="couponForm.receiveType==0">免费领取</span>
                    </div>
                </el-form-item>
                <el-form-item v-if="couponForm.receiveType == 0" label="指定发放：">
                    <el-radio-group v-model="tempForm.userType" v-if="pageType != 'lookInfo'">
                        <el-radio :label="0">不指定用户发放</el-radio>
                        <el-radio :label="1">指定用户发放</el-radio>
                    </el-radio-group>
                    <el-form-item v-if="tempForm.userType == 1" key="designatedUser" prop="designatedUser" :class="{'mt-10':pageType != 'lookInfo'}">
                        <el-select v-model="couponForm.designatedUser" v-if="pageType != 'lookInfo'" clearable placeholder="请选择">
                            <el-option v-for="item in platformType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <span v-else>{{platformType.find(item=>item.value==couponForm.designatedUser).label}}</span>
                        <el-tooltip placement="right">
                            <div slot="content">
                                店铺新用户=在店铺内没有购买过商品的用户（包括申请售后成功的用户）
                                <br />
                                店铺老用户=在店铺内已购买过商品的用户（剔除申请售后的用户）
                            </div>
                            <i class="el-icon-question font-16 text-000 opacity-3 ml-5"></i>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item v-if="couponForm.designatedUser == 1" key="designatedUserText" :class="{'mt-10':pageType != 'lookInfo'}">
                        <el-input
                            key="mobileList"
                            v-model="couponForm.mobileList"
                            v-if="pageType != 'lookInfo'"
                            type="textarea"
                            :rows="3"
                            show-word-limit
                            maxlength="300"
                            style="width: 500px"
                            placeholder='输入手机号码,使用英文符号逗号","隔开'
                        ></el-input>
                        <span v-else>{{couponForm.mobileList}}</span>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="优惠券封面图：" prop="pic">
                    <imgCenter v-model="couponForm.pic" :disabled="pageType == 'lookInfo'" @input="$refs.form.validateField('pic')"></imgCenter>
					<span v-show="pageType != 'lookInfo'" class="pl-20 v-top text-999">建议尺寸：160 x 160 像素</span>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">活动商品</div>
                <el-form-item label="选择商品：" v-if="pageType != 'lookInfo'">
                    <el-radio-group v-model="couponForm.useType" >
                        <el-radio :label="0">全场通用</el-radio>
                        <el-radio :label="1">部分商品参与</el-radio>
                        <el-radio :label="-1">部分商品不参与</el-radio>
                    </el-radio-group>

                    <template v-if="couponForm.useType != 0" >
                        <el-form-item label-width="0">
                            <el-button v-if="pageType != 'lookInfo'" type="primary" class="my-10" size="small" @click="choseGoods">
                                选择商品
                            </el-button>
                            <tableGoods
                                :coupon-form="couponForm"
                                :page-type="pageType"
                                :table-list="couponTableList"
                                :coupon-type="tempForm.pointType"
                                @delCouponPro="getcounPage"
                            ></tableGoods>
                            <el-pagination
                                class="mt-30 flex-end"
                                :page-sizes="[5, 10, 15]"
                                :page-size="couponPage.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="couponPage.total"
                                @size-change="couponPageSizeChange"
                                @current-change="couponPageChange"
                            />
                        </el-form-item>
                    </template>
                </el-form-item>
				<template v-if="pageType == 'lookInfo'">
					<div class="font-12 ml-60">
						<span v-if="couponForm.useType===0">全场通用</span>
						<span v-if="couponForm.useType===1">部分商品参与</span>
						<span v-if="couponForm.useType===-1">部分商品不参与</span>
					</div>
				</template>
                <template v-if="couponForm.id && pageType == 'lookInfo'">
                    <el-divider />
                    <!-- 这是分割线 -->
                    <div class="form-title">活动状态</div>
                    <el-form-item label="状态：">{{ couponForm.status | getLabelText(couponStatus) }}</el-form-item>

                    <el-divider />
                    <!-- 这是分割线 -->
                    <div class="form-title">领取信息</div>
                    <el-form-item label-width="0"><receiveInfo :coupon-id="couponForm.id" @statusChange="getcounPage"></receiveInfo></el-form-item>
                </template>
                <submitBottom>
					<el-button size="small" @click="back">返回</el-button>
					<ls-button v-if="pageType != 'lookInfo'" type="primary" size="small" :asyncFunction="onSubmit">新增</ls-button>
                </submitBottom>
            </el-form>
        </el-card>
        <dialogSpuGoods :id.sync="couponForm.id" ref="dialogSpuGoods" activity-type="couponId" @sumbitTable="getcounPage"></dialogSpuGoods>
    </section>
</template>

<script>
import tableGoods from './components/couponGoodsTable'
import dialogSpuGoods from '.././components/dialogSpuGoods'
import receiveInfo from './components/receiveInfo'
import Upload from '@/components/Upload'
import { debounce } from '@/utils/utils.js'
import { couponApi } from '@/api/ModuleMarketing.js'
import moment from 'moment'
import clipboard from '@/utils/clipboard' // 复制功能
export default {
    name: 'AddCoupon',
    components: {
        Upload,
        dialogSpuGoods,
        tableGoods,
        receiveInfo,
    },
    data() {
        function parseTime(time) {
            return moment(time).valueOf()
        }
        //使用优惠券校验
        var useTimeValidate = (rule, value, callback) => {
            if (this.tempForm.useTimeType == 0 && !this.couponForm.useStartTime) {
                callback(new Error('使用时间不能为空'))
            }
            if (this.tempForm.useTimeType == 0 && parseTime(this.couponForm.receiveEndTime) > parseTime(this.couponForm.useEndTime)) {
                callback(new Error('领取结束时间不能晚于使用结束时间'))
            }
            callback()
        }

        //领取时间校验
        var receiveStartTimeValidate = (rule, value, callback) => {
            if (!this.tempForm.receiveTime || !this.tempForm.receiveTime.length) {
                callback(new Error('领取时间不能为空'))
            }
            callback()
        }

        //发放数量校验
        var validatePayPct = (rule, value, callback) => {
            if (!value || value < 1 || value > 1000000) {
                callback(new Error('支持正整数，大于等于1且小于等于100万'))
            }
            callback()
        }

        //门槛优惠券校验
        var minPointValidate = (rule, value, callback) => {
            if (this.tempForm.pointType == 0 && !this.couponForm.minPoint) {
                callback(new Error('优惠券门槛不能为空'))
            }
            callback()
        }

        // 限制活动期间每人领取 校验
        var perTotalLimitValidate = (rule, value, callback) => {
            if (this.tempForm.LimitType == 2 && !this.couponForm.perTotalLimit) {
                callback(new Error('每人总限领张数不能为空或者大于0'))
            }
            callback()
        }

        //每人每天领张数 校验
        var perDayLimitValidate = (rule, value, callback) => {
            if (this.tempForm.LimitType == 1 && !this.couponForm.perDayLimit) {
                callback(new Error('每人每天领张数不能为空或者大于0'))
            }
            callback()
        }

        // 指定用户发放
        var designatedUserValidate = (rule, value, callback) => {
            if (this.tempForm.userType == 1 && !value) {
                callback(new Error('指定用户发放不能为空'))
            }
            callback()
        }

        //每人每天领张数 校验
        var amountValidate = (rule, value, callback) => {
			if (!this.couponForm.amount) {
				callback(new Error('优惠金额不能为0'))
			}
            if (this.tempForm.pointType == 0 && Number(this.couponForm.amount) > Number(this.couponForm.minPoint)) {
                callback(new Error('优惠金额不能大于门槛金额'))
            }
            callback()
        }

        return {
            pickerMinDate: '',
            pickerOptions: {
                onPick: (obj) => {
                    this.pickerMinDate = new Date(obj.minDate).getTime()
                },
				disabledDate: time => {
				    if (this.pickerMinDate) {
				        const day1 = 30 * 24 * 3600 * 1000 - 1000; // 最后一天只能到23:59:59
				        let maxTime = this.pickerMinDate + day1;
				        let minTime = this.pickerMinDate - day1;
				        return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;
				    } else {
				        return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;
				    }
				}
            },
            couponStatus: [
                {
                    label: '所有活动',
                    value: ''
                },
                {
                    label: '未开始',
                    value: 0
                },
                {
                    label: '进行中',
                    value: 1
                },
                {
                    label: '已暂停',
                    value: 2
                },
                {
                    label: '已结束',
                    value: 3
                },
                {
                    label: '已失效',
                    value: -1
                },
                {
                    label: '已删除',
                    value: -2
                }
            ],
            couponTableList: [], //选中优惠券列表
            couponForm: {
                id: '',
                status: 0,
                title: '', //优惠券标题
                count: '', //发放数量
				amount: undefined, // 优惠券面额(备注：要用undefined才能一开始显示placeholder内容)
                receiveStartTime: '', //领取开始时间
                receiveEndTime: '', //领取结束时间
                useStartTime: '', //使用开始时间
                useEndTime: '', //使用结束时间
                useDayLater: 0, //多少天后可以使用
                withinDay: 0, // 几天之内可用
                pic: '', //优惠券图片
                receiveType: 0, // 领取方式，0，免费领取，1，卡密领取
                useType: 0, // 优惠券使用类型：0全场通用，1指定商品使用，-1排除商品使用
                skuIdList: [], //sku商品列表
                mobileList: '', //指定的用户手机号码
                designatedUser: '', //指定用户
				minPoint: undefined, // 使用门槛，0.00为无门槛(备注：要用undefined才能一开始显示placeholder内容)
                description: '', // 优惠券描述
                perTotalLimit: '', //每人总限领张数
                perDayLimit: '' //每人每天领张数
            },
            tempForm: {
                // 辅助表单显示
                receiveTime: [], //领取时间
                useTime: [], //使用时间
                userType: 0, // 指定用户类型 0 不指定 1 指定
                useTimeType: 0, //使用时间类型  0 按照时间段设置 1 按照领取几天后几天内使用
                LimitType: 0, //限领类型 0 不限领 1 限制每天每人领取 2 限制活动期间每人领取
                pointType: 0 //门槛类型 0 满多少元使用 1 无使用门槛（可与其他优惠券叠加使用）
            },
            count: 1,
            pageType: 'normal', //页面类型，查看 :lookInfo  正常 :normal 复制 copy
            couponId: '', // 优惠券id
            platformType: [
                // {
                //     value: 1,
                //     label: '手机号码'
                // },
                // {
                //     value: 2,
                //     label: '平台新注册用户'
                // },
                // {
                //     value: 3,
                //     label: '平台旧注册用户'
                // },
                // {
                //     value: 4,
                //     label: '平台新用户'
                // },
                // {
                //     value: 5,
                //     label: '平台老用户'
                // },
                {
                    value: 6,
                    label: '店铺新用户'
                },
                {
                    value: 7,
                    label: '店铺老用户'
                }
            ],
            value: '',
            rules: {
                title: {
                    required: true,
                    message: '优惠券不能为空',
                    trigger: 'blur'
                },
                count: [
                    {
                        required: true,
                        message: '发送数量不能为空',
                        trigger: 'blur'
                    },
                    { validator: validatePayPct, trigger: 'blur' }
                ],
                pic: [
                    {
                        required: true,
                        message: '优惠券封面图不能为空',
                        trigger: 'change'
                    }
                ],
                receiveStartTime: [
                    {
                        required: true,
                        message: '领取时间不能为空',
                        trigger: 'change'
                    },
                    {
                        validator: receiveStartTimeValidate,
                        trigger: 'change'
                    }
                ],
                useStartTime: [
                    {
                        validator: useTimeValidate,
                        trigger: 'blur'
                    }
                ],
                minPoint: [
                    {
                        validator: minPointValidate,
                        trigger: 'blur'
                    }
                ],
                perTotalLimit: [
                    {
                        validator: perTotalLimitValidate,
                        trigger: 'blur'
                    }
                ],
                perDayLimit: [
                    {
                        validator: perDayLimitValidate,
                        trigger: 'blur'
                    }
                ],
                designatedUser: [
                    {
                        validator: designatedUserValidate,
                        trigger: 'change'
                    }
                ],
                amount: [
                    {
                        required: true,
                        message: '优惠金额不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: amountValidate,
                        trigger: 'blur'
                    }
                ]
            },
            couponPage: {
                curPage: 1,
                pageSize: 10,
                total: 0
            },
            imageUrl: '',
            couponUrl:''
        }
    },
    created() {
        if (this.$route.query.couponType) {
            this.pageType = this.$route.query.couponType
        }
        if (this.$route.query.couponId) {
            this.couponId = this.$route.query.couponId
            this.getCouponDetail(this.couponId)
        }
        if(this.pageType==='lookInfo'){
            this.couponUrl = `${this.$config.shareUrl}/pages/webview/shareUrlRedirect?detailsType=coupon&id=${this.couponId}`
        }
    },
    methods: {
        handleCopy(text, event) {
            clipboard(text, event)
        },
        // 获取优惠券关联商品
        getcounPage() {
            couponApi
                .couponProduct({
                    useType: 1,
                    couponId: this.couponForm.id,
                    ...this.couponPage
                })
                .then((res) => {
                    if (res.code) {
                        this.couponTableList = res?.data?.resultList || []
                        this.couponPage.total = res?.data?.total || 0
                    }
                })
        },

        couponPageSizeChange(size) {
            this.couponPage.pageSize = size
            this.getcounPage()
        },
        couponPageChange(p) {
            this.couponPage.curPage = p
            this.getcounPage()
        },

        copyCouponProduct() {
            return couponApi.copyCouponProduct(this.couponForm.id).then((res) => {
                if (res.code) {
                    this.couponForm.id = res.data
                }
                return res
            })
        },

        // 获取优惠券信息
        getCouponDetail(couponId) {
            couponApi.couponDetail(couponId).then(async (res) => {
                if (res.code == 1) {
                    this.couponForm = res.data
                    if (this.pageType == 'copy') {
                        await this.copyCouponProduct()
                    }
                    if (res.data.useType != 0) {
                        this.getcounPage()
                    }
                    // 接收时间
                    if (res.data.receiveEndTime && this.pageType == 'lookInfo') {
                        this.tempForm.receiveTime = [res.data.receiveStartTime, res.data.receiveEndTime]
                    }

                    //使用时间
                    if (res.data.useStartTime) {
                        if (this.pageType == 'lookInfo') this.tempForm.useTime = [res.data.useStartTime, res.data.useEndTime]
                    } else {
                        this.tempForm.useTimeType = 1
                    }

                    //门槛
                    if (!res.data.minPoint) {
                        this.tempForm.pointType = 1
                    }

                    //指定用户类型
                    if (res.data.designatedUser) {
                        this.tempForm.userType = 1
                    } else {
                        this.couponForm.designatedUser = ''
                    }
					
					// 限领
					if (res.data.perDayLimit) {
						this.tempForm.LimitType = 1;
					} else if (res.data.perTotalLimit) {
						this.tempForm.LimitType = 2;
					} else {
						this.tempForm.LimitType = 0;
					}
                }
            })
        },

        choseGoods() {
            this.$refs.dialogSpuGoods.showDialog()
        },

        // 使用时间
        useTimeChange(value) {
            if (!value) {
                value = []
            }
            this.couponForm.useStartTime = value[0] || ''
            this.couponForm.useEndTime = value[1] || ''
            this.pickerMinDate = ''
        },

        //领取时间
        receiveTimeChange(value) {
            console.log(value)
            if (!value) {
                value = []
            }
            this.couponForm.receiveStartTime = value[0] || ''
            this.couponForm.receiveEndTime = value[1] || ''
            this.pickerMinDate = ''
        },

        onSubmit() {
            return new Promise(resolve=>{
                this.$refs['form'].validate((val) => {
                    if (val) {
                        let formParam = Object.assign({}, this.couponForm)
                        //使用优惠券情况
                        if (this.tempForm.useTimeType == 1) {
                            formParam.useStartTime = ''
                            formParam.useEndTime = ''
                        } else {
                            formParam.useDayLater = 0
                            formParam.withinDay = 0
                        }
                        // 指定用户类型
                        if (!this.tempForm.userType) {
                            formParam.designatedUser = 0
                        }

                        //门槛优惠券
                        if (this.tempForm.pointType == 1) {
                            formParam.minPoint = 0
                        }

                        //限领类型
                        if (this.tempForm.LimitType == 0) {
                            formParam.perTotalLimit = 0
                            formParam.perDayLimit = 0
                        } else if (this.tempForm.LimitType == 1) {
                            formParam.perTotalLimit = 0
                        } else {
                            formParam.perDayLimit = 0
                        }
                        if(this.couponForm.useType != 0 && this.$utils.test.isEmpty(this.couponTableList)){
                            this.$message.error(this.couponForm.useType==1 ? '请选择参加活动的商品':'请选择不参加活动的商品')
                            resolve()
                            return
                        }
                        couponApi.saveCoupon(formParam).then((res) => {
                            if (res.code == 1) {
                                this.$router.back()
                            }
                            console.log(res)
                        }).finally(_=>{
                            resolve()
                        })
                    }else{
                        resolve()
                    }
                })
            })   
        },

        // 返回
        back() {
            this.$router.back()
        },
        changePointType(index) {
            let _field = this.$refs['form'].fields //获取form表单的所有item项
            _field.map((i) => {
                if (i.prop === 'minPoint') {
                    //通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'minPoint'
                    i.resetField()
                    return false
                }
            })
        },

        clearInput(event,val){
            if(val=='LimitType'){
                if (event == 0) {
                    this.couponForm.perDayLimit = 1
                    this.couponForm.perTotalLimit = 1
                    this.$refs.form.validateField('perTotalLimit')
                    this.$refs.form.validateField('perDayLimit')
                }
                if (event == 1) {
                    this.couponForm.perTotalLimit = 1
                    this.$refs.form.validateField('perTotalLimit')
                }
                if (event == 2) {
                    this.couponForm.perDayLimit = 1
                    this.$refs.form.validateField('perDayLimit')
                }
            }
            if(val=='userTimeType') {
                if(event == 0){
                    this.couponForm.withinDay = 1
                    this.couponForm.useDayLater = 0
                }else{
                    this.tempForm.useTime = []
                    this.couponForm.useStartTime = ''
                    this.couponForm.useEndTime = ''
                    this.$refs.form.validateField('useStartTime')
                }
            }
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>
