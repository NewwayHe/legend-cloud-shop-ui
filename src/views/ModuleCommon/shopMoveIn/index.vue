<template>
    <div class="shopMoveIn">
        <div class="navbar d-flex a-center j-sb">
           <div class="d-flex a-center ml-30">
				<img :src="$photoServer+systemConfigTemp.shopSmallLogo" style="max-width: 200px;height: 50px;object-fit: contain;" :onerror="$defaultImg" v-if="systemConfigTemp&&systemConfigTemp.shopSmallLogo">
				<img style="width: 150px;height: 50px;" src="@/assets/images/shopMoveIn_logo.png" alt="" v-else-if="systemConfigFinally"/>
				<div style="width: 150px;height: 50px;" v-else></div>
           </div>
            <div class="right-menu flex-center text-999">
                <div class="m-10">V 1.0.0</div>
                <div class="mx-10 font-14">
                    <router-link to="/userHelpCenter">
                        <i class="iconfont icon-Help font-20"></i>
                    </router-link>
                </div>
                <el-dropdown class="avatar-container ml-10 mr-30" trigger="click">
                    <div class="avatar-wrapper">
                        <ls-image
                            :src="userInfo.avatar"
                            :isPreview="false"
                            :options="{ w: '40', h: '40', br: '20' }"
                            class="mt-20"
                        ></ls-image>
                    </div>
                    <el-dropdown-menu slot="dropdown" class="user-dropdown">
                        <el-dropdown-item  @click.native="logout">
                            <span style="display: block">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="shopMoveIn__con position-relative">
            <!-- 头部类型 -->
            <el-steps :active="step" align-center style="margin: 100px 0">
                <el-step title="选择入驻类型" :icon="step > 1 ? 'el-icon-success' : ''">
                    <template slot="title">
                        <span class="font-14 text-333">选择入驻类型</span>
                    </template>
                    <template slot="description"></template>
                </el-step>
                <el-step title="提交联系人信息" description :icon="step > 2 ? 'el-icon-success' : ''">
                    <template slot="title">
                        <span class="font-14 text-333">提交联系人信息</span>
                    </template>
                </el-step>
                <el-step title="提交店铺信息" description :icon="step > 3 ? 'el-icon-success' : ''">
                    <template slot="title">
                        <span class="font-14 text-333">提交店铺信息</span>
                    </template>
                </el-step>
            </el-steps>
            <!-- 底下部分 -->
            <template v-if="status == 0">
                <el-form
                    v-show="step == 1"
                    class="formWarp m-auto mt-100"
                    style="width: 600px"
                    label-width="130px"
                    size="small"
                >
                    <div class="text-center">
                        <div class="d-inline-block mr-40 cursor-pointer">
                            <img
                                class="w-100p h-100p"
                                src="@/assets/images/defaultPerson.png"
                                @click="changeType(0)"
                            />
                            <div class="font-14 text-666 pt-30">个人入驻</div>
                        </div>
                        <div class="d-inline-block ml-40 cursor-pointer">
                            <img
                                class="w-100p h-100p"
                                src="@/assets/images/defaultStore.png"
                                @click="changeType(1)"
                            />
                            <div class="font-14 text-666 pt-30">企业入驻</div>
                        </div>
                    </div>
                </el-form>
                <!-- 第二步 -->
                <el-form
                    v-show="step == 2"
                    ref="formStep2"
                    class="formWarp m-auto mt-50"
                    style="width: 615px"
                    :model="params"
                    :rules="rules"
                    label-width="140px"
                    size="small"
                >
                    <template v-if="params.applyForType == 1">
                        <div class="form-title">公司信息</div>
                        <el-form-item label="公司名称：" prop="companyName">
                            <el-input
                                v-model="params.companyName"
                                class="mb-10"
                                style="width: 450px"
                                placeholder="请输入"
                                clearable
                                maxlength="100"
                            />
                        </el-form-item>
                        <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
                            <el-input
                                v-model="params.unifiedSocialCreditCode"
                                style="width: 450px"
                                placeholder="请输入"
                                maxlength="18"
                            />
                        </el-form-item>
                        <el-form-item label="营业执照：" prop="idCardPic">
                            <div class="d-flex a-start">
                                <Upload v-model="params.businessLicense" />
                                <span class="ml-10 text-999 v-top" style="line-height: 20px;">图片仅支持JPG、GIF、PNG、JPEG、BMP格式，大小不超过5Mb</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="营业执照开始时间：" prop="businessStartTime">
                            <el-date-picker
                                v-model="params.businessStartTime"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="营业执照到期时间：" prop="businessEndTime">
                            <el-date-picker
                                v-model="params.businessEndTime"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-tooltip class="item" placement="top" append-to-body>
                                <div slot="content">
                                    不填营业执照到期时间则设为永久有效
                                </div>
                                <i class="el-icon-question text-000 font-16 opacity-3 ml-5"></i>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="经营范围：" prop="businessScope">
                            <el-input
                                v-model="params.businessScope"
                                type="textarea"
                                style="width: 450px"
                                placeholder="请输入"
                                :maxlength="500"
                                :autosize="{ minRows: 4, maxRows: 6 }"
                                show-word-limit
                            />
                        </el-form-item>
                        <el-form-item label="注册资金：" prop="registeredCapital">
                            <el-input
                                v-model="params.registeredCapital"
                                style="width: 450px"
                                placeholder="请输入"
                                :maxlength="13"
                                :oninput="$inputInteger"
                            />
                        </el-form-item>
                        <div class="form-title">法人信息</div>
                        <el-form-item label="法人姓名：" prop="corporateName">
                            <el-input
                                v-model="params.corporateName"
                                class="mb-10"
                                style="width: 450px"
                                placeholder="请输入"
                                clearable
                                maxlength="10"
                            />
                        </el-form-item>
                        <el-form-item label="法人身份证正面：" prop="idCardPic">
                            <div class="d-flex a-start">
                                <Upload v-model="params.idCardPic" />
                                <span class="text-999 v-top ml-10" style="line-height: 20px;">图片仅支持JPG、GIF、PNG、JPEG、BMP格式，大小不超过5Mb</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="法人身份证反面：" prop="idCardBackPic">
                            <div class="d-flex a-start">
                                <Upload v-model="params.idCardBackPic" />
                                <span class="text-999 v-top ml-10" style="line-height: 20px;">图片仅支持JPG、GIF、PNG、JPEG、BMP格式，大小不超过5Mb</span>
                            </div>
                        </el-form-item>
                    </template>
                    <template>
                        <div class="form-title">联系人信息</div>
                        <el-form-item label="联系人姓名：" prop="contactName">
                            <el-input
                                v-model="params.contactName"
                                class="mb-10"
                                style="width: 450px"
                                placeholder="请输入"
                                clearable
                                maxlength="10"
                            />
                        </el-form-item>
                        <el-form-item label="联系人手机号码：" prop="contactPhone">
                            <el-input
                                v-model="params.contactPhone"
                                style="width: 450px"
                                placeholder="请输入"
                                clearable
                                :oninput="$inputInteger"
                                maxlength="11"
                            />
                        </el-form-item>
                    </template>

                    <template v-if="params.applyForType == 0">
                        <el-form-item label="身份证正面：" prop="idCardPic">
                            <div class="d-flex a-start">
                                <Upload v-model="params.idCardPic" />
                                <span class="text-999 v-top ml-10" style="line-height: 20px;">图片仅支持JPG、GIF、PNG、JPEG、BMP格式，大小不超过5Mb</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="身份证反面：" prop="idCardBackPic">
                            <div class="d-flex a-start">
                                <Upload v-model="params.idCardBackPic" />
                                <span class="text-999 v-top ml-10" style="line-height: 20px;">图片仅支持JPG、GIF、PNG、JPEG、BMP格式，大小不超过5Mb</span>
                            </div>
                        </el-form-item>
                    </template>

                    <el-row class="text-center mt-100">
                        <el-button v-if="!isEdit" plain @click="stepBack('formStep2')">上一步</el-button>
                        <el-button type="primary" @click="nextStep('formStep2')">下一步</el-button>
                    </el-row>
                </el-form>

                <el-form
                    v-show="step == 3"
                    ref="formStep3"
                    class="formWarp m-auto mt-50"
                    style="width: 600px"
                    :model="params"
                    :rules="rules"
                    label-width="130px"
                    size="small"
                >
                    <div class="form-title">店铺信息</div>
                    <el-form-item label="店铺名称：" prop="shopName">
                        <el-input
                            v-model="params.shopName"
                            class="mb-10"
                            style="width: 450px"
                            placeholder="请输入"
                            maxlength="20"
                            @change="changeShopName"
                        />
                    </el-form-item>
                    <el-form-item label="店铺头像：" prop="shopAvatar">
						<div class="d-flex a-start">
						    <Upload v-model="params.shopAvatar" />
						    <span class="text-999 v-top ml-10" style="line-height: 20px;">图片仅支持JPG、GIF、PNG、JPEG、BMP格式，建议尺寸：100*100px</span>
						</div>
                    </el-form-item>
                    <el-form-item label="店铺地址：" prop='region'>
						<input-cascader
							ref="region"
							v-model="params.region"
							style="width: 305px"
							@input="$refs.formStep3.validateField('region')"
						/>
                    </el-form-item>
                    <el-form-item label=' ' prop='shopAddress'>
                        <el-input
                            v-model="params.shopAddress"
                            type="textarea"
                            :rows="2"
                            style="width: 450px"
                            show-word-limit
                            placeholder="请输入"
                            maxlength="50"
                            clearable
                        />
                    </el-form-item>
                    <el-row class="text-center mt-100">
                        <el-button plain @click="stepBack('formStep3')">上一步</el-button>
                        <el-button type="primary" @click="nextStep('formStep3')" :loading='submitLoading' :disabled='submitDisabled'>提交</el-button>
                    </el-row>
                </el-form>
            </template>

            <template v-if="status == 1">
                <el-form
                    ref="form"
                    class="formWarp m-auto mt-100"
                    style="width: 600px"
                    label-width="130px"
                    size="small"
                >
                    <div class="text-center">
                        <i class="el-icon-success text-main" style="font-size: 120px"></i>
                        <div class="font-24 mt-50">审核通过</div>
                        <div class="font-14 text-999 mt-20 mb-60">立即使用商城商家端系统</div>
                        <el-button type="primary" @click="immediatelyUse">立即使用</el-button>
                    </div>
                </el-form>
            </template>
            <template v-if="status == 2">
                <el-form
                    ref="form"
                    class="formWarp m-auto mt-100"
                    style="width: 600px"
                    label-width="130px"
                    size="small"
                >
                    <div class="text-center">
                        <img style="width:132px;height:132px;" src="@/assets/images/wait-for.png" />
                        <div class="font-24 mt-50">等待审核</div>
                        <div class="font-14 text-999 mt-15 mb-60">信息提交成功，将在1-3个工作日内完成审核</div>
                    </div>
                </el-form>
            </template>
            <template v-if="status == -1">
                <el-form
                    ref="form"
                    class="formWarp m-auto mt-100"
                    style="width: 600px"
                    label-width="130px"
                    size="small"
                >
                    <div class="text-center">
                        <img style="width:132px;height:132px;" src="@/assets/images/warn.png" />
                        <div class="font-24 mt-50">很抱歉！您的入驻申请被拒绝</div>
                        <div class="font-14 text-999 mt-20 mb-60">审核意见：{{ openShopMsg }}</div>
                        <el-button type="primary" @click="goEdit">重新编辑</el-button>
                    </div>
                </el-form>
            </template>
            <div v-if="isCheck " class="flex-center mb-30 mt-30">
                <el-checkbox v-model="agreement" @change="isSelect">勾选即同意</el-checkbox>
                <span class="text-main cursor-pointer" @click="agreeMent()">《商家入驻协议》</span>
            </div>
            <!-- 如果点击了‘入驻协议’右上角的关闭按钮，则加一个按钮重新申请 -->
            <template v-if="openShopMsg && step == 0 && !showDialog">
                <el-button
                    class="center-x"
                    type="primary"
                    :disabled="isDisabled"
                    @click="settled"
                >申请入驻</el-button>
            </template>
        </div>

        <el-dialog
            title="入驻协议"
            custom-class="dialog-form"
            width="700px"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="showDialog"
        >
            <span>{{ agreementText }}</span>
            <span slot="footer">
                <div class="text-center">
                    <el-button type="primary" @click="step++, (showDialog = false)">同意协议</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Navbar from '@/layout/components/Navbar'
import Upload from '@/components/Upload'
import upload from '../components/Upload'
import { shopMoveIn } from '@/api/ModuleCommon'
import InputCascader from '@/components/InputCascader/index.vue'
import { mapGetters } from 'vuex'
import { debounce } from '@/utils/utils.js'
export default {
    name: 'ApplyResidence',
    components: { Navbar, Upload, InputCascader,upload },
    data() {
        return {
            isCheck: true, //是否展示注册协议
            isDisabled: false, //申请入驻按钮是否禁用
            agreement: true, //是否勾选同意协议
            form: {},
            openShopMsg: '', // 接收openShopStatus接口的res.msg
            status: '', //审核通过=1，未提交入驻申请=0，审核拒绝=-1，待审核=2
            // status: '', //审核通过=1，待审核=0，审核拒绝=-1，未提交入驻申请=2
            // 接收openShop接口的res.result.status。入驻状态：[-10：未申请 -1：等待审核 -2：拒绝 -3：关闭店铺 -4：联系人信息失败 -5:公司信息失败 -6:店铺信息失败 0:店铺下线 1：正常营业]
            step: 0, // 步骤，status==0时用
            errMsg: false,
            isEdit: false, // 记录是不是请求了getOpenShopInfo接口(这时是修改状态)
            agreementText: `本协议是您与LegendShop商城网站（简称“本站”，网址：www.legendshop.cn）所有者（以下简称为“LegendShop商城”）之间就LegendShop商城网站服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您点击“同意以下协议，提交”按钮后，本协议即构成对双方有约束力的法律文件。
第1条 本站服务条款的确认和接纳
1.1本站的各项电子服务的所有权和运作权归LegendShop商城所有。用户同意所有注册协议条款并完成注册程序，才能成为本站的正式用户。用户确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。
1.2用户点击同意本协议的，即视为用户确认自己具有享受本站服务、下单购物等相应的权利能力和行为能力，能够独立承担法律责任。
1.3如果您在18周岁以下，您只能在父母或监护人的监护参与下才能使用本站。
1.4LegendShop商城保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。
第2条 本站服务
2.1LegendShop商城通过互联网依法为用户提供互联网信息等服务，用户在完全同意本协议及本站规定的情况下，方有权使用本站的相关服务。
2.2用户必须自行准备如下设备和承担如下开支：（1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；（2）上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。
第3条 用户信息
3.1用户应自行诚信向本站提供注册资料，用户同意其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且LegendShop商城保留终止用户使用LegendShop商城各项服务的权利。
3.2用户在本站进行浏览、下单购物等活动时，涉及用户真实姓名/名称、通信地址、联系电话、电子邮箱等隐私信息的，本站将予以严格保密，除非得到用户的授权或法律另有规定，本站不会向外界披露用户隐私信息。
3.3用户注册成功后，将产生用户名和密码等账户信息，您可以根据本站规定改变您的密码。用户应谨慎合理的保存、使用其用户名和密码。用户若发现任何非法使用用户账号或存在安全漏洞的情况，请立即通知本站并向公安机关报案。
3.4用户同意，LegendShop商城拥有通过邮件、短信电话等形式，向在本站注册、购物用户、收货人发送订单信息、促销活动等告知信息的权利。
3.5用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。
3.6用户同意，LegendShop商城有权使用用户的注册信息、用户名、密码等信息，登陆进入用户的注册账户，进行证据保全，包括但不限于公证、见证等。orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.`,
            // 企业入驻专用变量:
            params: {
                applyForType: '', // 商城类型0：个人入驻，1：企业入驻
                companyName: '', // 公司名称
                contactName: '', // 联系人姓名/负责人
                contactPhone: '', // 联系人手机
                unifiedSocialCreditCode: '', // 统一社会信用代码
                licensePicFilePath: '', // 公司营业执照副本
                shopName: '', //店铺名称
                provinceId: '', //省份
                cityId: '', //城市
                areaId: '', //地级市
                streetId: '', //街道
                shopAddress: '', //店铺地址
                // 以下是个人入驻专用
                idCardPic: '', // 负责人身份证正面
                idCardBackPic: '', // 负责人身份证反面
                region: [],
                enterprisePermissionDTOList:[]
            },
            showDialog: false,
            rules: {
                contactName: [{ required: true, message: `请输入${this.applyForType == 0 ? '联系人姓名' : '负责人'}`, trigger: 'blur' }],
                contactPhone: [
                    { required: true, message: `请输入正确的手机号码`, trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入11位数字的手机号码', trigger: 'blur' }
                ],
                idCardPic: [{ required: true, message: `请上传负责人身份证正面`, trigger: 'blur' }],
                idCardBackPic: [{ required: true, message: `请上传负责人身份证反面`, trigger: 'blur' }],
                companyName: [{ required: true, message: `请输入公司名称`, trigger: 'blur' }],
                corporateName: [{ required: true, message: `请输入法人姓名`, trigger: 'blur' }],
                unifiedSocialCreditCode: [{ required: true, message: `请输入统一社会信用代码`, trigger: 'blur' }],
                shopName: [{ required: true, message: `请输入店铺名称`, trigger: 'blur' }],
                shopAvatar: [{ required: true, message: `请输入店铺头像`, trigger: 'blur' }],
                region: [{ required: true, message: `请选择地址`, trigger: 'change' }],
                businessStartTime:[{ required: true, message: `请选择开始日期`, trigger: 'change' }]
            },
            submitLoading: false,   //提交时的按钮加载状态
            submitDisabled: false,  //提交时的按钮禁止状态
			systemConfigTemp:'',// 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
			systemConfigFinally:false
        }
    },
    watch: {},
    created() {
		let systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
		// 如果main.js里面执行了方法获取到系统设置
		if (systemConfig&&systemConfig.id) {
			this.systemConfigTemp = systemConfig
			this.systemConfigFinally = true
		// 如果VUEX里没有设置systemConfig(系统设置)
		}else{
			this.$store
			    .dispatch('user/getSystemConfig')
			    .then((res) => {
					this.systemConfigTemp = res
					// console.log('systemConfig:',this.systemConfig);
			    })
			    .catch(() => {
			    }).finally(()=>{
					this.systemConfigFinally = true
				})
		}
	},
    mounted() {
        // this.status = 0
        // this.step = 1
        this.getOpenShopStatus()
    },
    computed: {
        ...mapGetters(['shopInfo', 'userInfo'])
    },
    methods: {
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login`)
        },
        settled() {
            this.step++
            this.isCheck = false
        },
        //申请入驻按钮是否禁用
        isSelect() {
            if (this.agreement == false) {
                this.isDisabled = true
            } else {
                this.isDisabled = false
            }
            console.log(this.agreement)
        },
        //商家入驻协议
        agreeMent() {
            let routeData = this.$router.resolve({ path: '/agreeMent', query: { code: 'OPEN_SHOP' } })
            window.open(routeData.href, '_blank')
        },
        immediatelyUse() {
            //如果获取到店铺id跳转首页，没有就跳转到登录页
            if (this.shopInfo && this.shopInfo.id) {
                this.$router.push(`/`)
                return
            }
            this.$confirm('需要重新登陆才能正常使用', '提示', { type: 'warning' }).then(async () => {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login`)
            })
        },
        changeShopName(e) {
            shopMoveIn.isShopNameExist({ shopName: e }).then((res) => {
                if (!res.code) {
                    this.params.shopName = ''
                }
            })
        },

        getOpenShopStatus() {
            shopMoveIn.openShopStatus().then((res) => {
                this.errMsg = false
                if (res.code == 1) {
                    this.openShopMsg = res.msg
                    this.status = res.data //审核通过=1，待审核=0，审核拒绝=-1，未提交入驻申请=2
                    if (this.status == -1 || this.status == 2) {
                        this.isCheck = false
                    }
                    if (this.status == 0) {
                        // 如果是用户还未申请商家，那先请求shopAgreement接口把数据拿了，防止点击下一步时有个加载过程
                        // shopAgreement().then(resAgreement => {
                        //     if (resAgreement.status == 1) {
                        //         this.agreementText = resAgreement.result
                        //     }
                        // })
                        if (this.step == 0) {
                            //this.showDialog = true
                        }
                    }
                    if (this.status == 1 || this.status == 2 || this.status == -1) {
                        this.step = 4
                    }
                    // this.step = 2
                } else {
                    this.errMsg = res.msg
                }
            })
        },
        goEdit() {
            shopMoveIn.editShop().then((res) => {
                if (res.code == 1) {
                    this.openShopMsg = '' // 要清空openShop拿到的结果，不然修改提交审核后，页面上显示的还是openShopMsg的结果
                    this.params = res.data
                    this.$set(this.params, 'region', [
                        Number(res.data.provinceId),
                        Number(res.data.cityId),
                        Number(res.data.areaId),
                        Number(res.data.streetId)
                    ])
                    this.status = 0
                    this.step = 2
                    this.isEdit = true
                }
            })
        },
        nextStep(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.step == 2) {
                        if (this.params.applyForType == 0) {
                            // 企业入驻
                        }
                        if (this.params.applyForType == 1) {
                            // 个人入驻
                        }
                    }
                    if (this.step == 3) {
                        // 提交审核页面
                        this.params.provinceId = this.params.region[0];
                        this.params.cityId = this.params.region[1];
                        this.params.areaId = this.params.region[2];
                        this.params.streetId = this.params.region[3];
                        this.submitSave()
                        return
                    }

                    this.step++
                    if (this.step == 4) {
                        this.status = 2
                    }
                } else {
                    return false
                }
            })
        },
        stepBack(formName) {
            if (this.step == 2) {
                this.$refs[formName].resetFields()
            }
            this.step--
        },
        changeType(type) {
            this.step++
            this.params.applyForType = type
        },
        submitSave: debounce(function() {
            this.submitLoading = true;
            this.submitDisabled = true;
            shopMoveIn.saveShopInfo(this.params).then((res) => {
                if (res.code == 1) {
                    this.step++
                    this.status = 2
                    this.$message.success('提交成功！')
                }
            }).catch((err) => {
                console.error('提交失败--',err)
                // this.$message.error('提交失败！')
            }).finally(()=> {
                this.submitLoading = false;
                this.submitDisabled = false;
            })
        }),
    }
}
</script>
<style>
body {
    background-color: #fff !important;
}
</style>
<style lang="scss" scoped>
.shopMoveIn {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 60px;
}
.shopMoveIn__con {
    margin: 0 auto;
    width: 720px;
    ::v-deep.el-step.is-horizontal {
        .el-step__line {
            height: 1px;
            overflow: hidden;
        }
    }
    ::v-deep.el-step__title.is-wait {
        font-size: 12px;
    }

    ::v-deep.el-step__line {
        border-color: #e8eaec;
    }
    ::v-deep .el-step__head.is-success {
        border-color: #e8eaec;
    }
    ::v-deep.el-step__title.is-finish {
        color: #67c23a;
    }
    ::v-deep.el-step__description.is-finish {
        color: #67c23a;
    }
    ::v-deep.el-step__head.is-finish {
        color: #67c23a;
    }
    ::v-deep.el-step__head.is-finish {
        border-color: #67c23a;
    }
}
.navbar {
    height: 63px;
    overflow: hidden;
    position: relative;
    background: #191a23;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    align-items: center;

    .hamburger-container {
        line-height: 60px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {

            .avatar-wrapper {
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                ::v-deep .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
