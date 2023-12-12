<!-- /*
 * @Descripttion:基本信息-个人
*/ -->
<template>
	<section class="formWarp">
		<el-card shadow :body-style="{ padding: `20px 20px 0 20px` }">
			<el-form ref="form" :model="fromInfo" label-width="135px" size="small" :rules="rules">
				<div class="form-title">店铺信息</div>
				<el-form-item v-show="!isEdit" label="入驻类型：">
					<p>{{ fromInfo.applyForType == 0 ? '个人入驻' : '企业入驻' || '-' }}</p>
				</el-form-item>
				<el-form-item label="店铺名称：" prop="shopName">
					<el-input v-show="isEdit" v-model="fromInfo.shopName" class="w-450p" maxlength="20" />
					<p v-show="!isEdit">{{ fromInfo.shopName }}</p>
				</el-form-item>
				<el-form-item v-show="!isEdit" label="店铺类型：">
					<p>{{ shopType(fromInfo.shopType) }}</p>
				</el-form-item>
				<el-form-item label="店铺地址：" prop="region">
					<InputCascader v-if="isEdit" v-model="fromInfo.region" class="w-450p" />
					<p v-if="!isEdit">
						{{
							(fromInfo.province || '') +
							(fromInfo.city === fromInfo.province ? '' : fromInfo.city || '') +
							(fromInfo.area || '') +
							(fromInfo.street || '') +
							(fromInfo.shopAddress || '')
						}}
					</p>
					<el-form-item v-show="isEdit" style="margin-top: 18px; margin-bottom: 0" prop="shopAddress">
						<el-input v-model="fromInfo.shopAddress" class="w-450p" maxlength="50" />
					</el-form-item>
				</el-form-item>
				<el-form-item v-show="!isEdit" label="创建时间：">
					<p>{{ fromInfo.createTime }}</p>
				</el-form-item>
				<el-form-item v-show="!isEdit" label="店铺链接：">
					<el-link :href="$shareRedirectUrl + `?detailsType=shop&shopId=${fromInfo.id}`" :underline="false" style="color: #007bff">
						{{ $shareRedirectUrl + `?detailsType=shop&shopId=${fromInfo.id}` }}
					</el-link>
				</el-form-item>
				<el-form-item v-if="!isEdit" label="店铺二维码："><div ref="qrCode"></div></el-form-item>
				<el-divider />
				<div v-show="!isEdit && fromInfo.applyForType === 1" class="form-title">公司信息</div>
				<el-form-item v-show="!isEdit && fromInfo.applyForType === 1" label="公司名称：">
					<p>{{ fromInfo.companyName }}</p>
				</el-form-item>
				<el-form-item v-show="!isEdit && fromInfo.applyForType === 1" label="社会统一信用代码：">
					<p>{{ fromInfo.unifiedSocialCreditCode ? fromInfo.unifiedSocialCreditCode : '-' }}</p>
				</el-form-item>
				<el-divider v-if="!isEdit && fromInfo.applyForType === 1" />
				<div v-if="!isEdit && fromInfo.applyForType === 1" class="form-title">法人信息</div>
				<el-form-item v-if="!isEdit && fromInfo.applyForType === 1" label="法人姓名：">
					<p>{{ fromInfo.corporateName }}</p>
				</el-form-item>
				<el-form-item v-if="!isEdit && fromInfo.applyForType === 1" label="身份证正面照：">
					<ls-image :src="fromInfo.idCardPic" :options="{ w: '100', h: '100' }" class="rounded-5" />
				</el-form-item>
				<el-form-item v-if="!isEdit && fromInfo.applyForType === 1" label="身份证反面照：">
					<ls-image :src="fromInfo.idCardBackPic" :options="{ w: '100', h: '100' }" class="rounded-5" />
				</el-form-item>
				<template v-if="fromInfo.applyForType === 1">
					<el-form-item label="营业执照：" prop="idCardPic">
						<div class="d-flex a-start">
							<ls-image v-show="!isEdit" :src="fromInfo.businessLicense" :options="{ w: '100', h: '100' }" class="rounded-5" />
							<imgCenter v-if="isEdit" v-model="fromInfo.businessLicense"></imgCenter>
							<span class="ml-10 text-999 v-top" style="line-height: 20px">图片仅支持JPG、GIF、PNG、JPEG、BMP格式，大小不超过5Mb</span>
						</div>
					</el-form-item>
					<el-form-item label="营业执照开始时间：" prop="businessStartTime">
						<el-date-picker
							v-model="fromInfo.businessStartTime"
							type="date"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期"
							v-if="isEdit"
						></el-date-picker>
						<p v-show="!isEdit">{{ fromInfo.businessStartTime || '永久有效' }}</p>
					</el-form-item>
					<el-form-item label="营业执照到期时间：" prop="businessEndTime">
						<el-date-picker
							v-model="fromInfo.businessEndTime"
							type="date"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期"
							v-if="isEdit"
						></el-date-picker>
						<el-tooltip class="item" placement="top" append-to-body v-if="isEdit">
							<div slot="content">不填营业执照到期时间则设为永久有效</div>
							<i class="el-icon-question text-000 font-16 opacity-3 ml-5"></i>
						</el-tooltip>
						<p v-show="!isEdit">{{ fromInfo.businessEndTime || '永久有效' }}</p>
					</el-form-item>
					<el-form-item label="经营范围：" prop="businessScope">
						<el-input
							v-model="fromInfo.businessScope"
							type="textarea"
							style="width: 450px"
							placeholder="请输入"
							:maxlength="500"
							:autosize="{ minRows: 4, maxRows: 6 }"
							show-word-limit
							v-if="isEdit"
						/>
						<p v-show="!isEdit">{{ fromInfo.businessScope || '' }}</p>
					</el-form-item>
				</template>
				<el-divider v-if="!isEdit && fromInfo.applyForType === 1" />
				<div class="form-title">联系人信息</div>
				<el-form-item label="姓名：">
					<el-input v-if="isEdit" v-model="fromInfo.contactName" class="w-450p" maxlength="20" />
					<p v-show="!isEdit">{{ fromInfo.contactName }}</p>
				</el-form-item>
				<el-form-item label="手机号码：">
					<el-input v-show="isEdit" v-model="fromInfo.contactPhone" class="w-450p" maxlength="11" />
					<p v-show="!isEdit">{{ fromInfo.contactPhone }}</p>
				</el-form-item>
				<el-form-item v-if="!isEdit && fromInfo.applyForType === 0" label="身份证正面照：">
					<ls-image :src="fromInfo.idCardPic" :options="{ w: '100', h: '100' }" class="rounded-5" />
				</el-form-item>
				<el-form-item v-if="!isEdit && fromInfo.applyForType === 0" label="身份证反面照：">
					<ls-image :src="fromInfo.idCardBackPic" :options="{ w: '100', h: '100' }" class="rounded-5" />
				</el-form-item>
				<el-divider />
				<div class="form-title">图片信息</div>
				<el-form-item label="用户头像：">
					<div class="d-flex">
						<ls-image v-show="!isEdit" :src="fromInfo.userAvatar" :options="{ w: '100', h: '100' }" class="rounded-5" />
						<imgCenter v-if="isEdit" v-model="fromInfo.userAvatar"></imgCenter>
						<span v-show="isEdit" style="margin-left: 15px; color: rgb(153, 153, 153)">建议尺寸：100*100px</span>
					</div>
				</el-form-item>
				<el-form-item label="店铺头像：">
					<div class="d-flex">
						<ls-image v-show="!isEdit" :src="fromInfo.shopAvatar" :options="{ w: '100', h: '100' }" class="rounded-5" />
						<imgCenter v-if="isEdit" v-model="fromInfo.shopAvatar"></imgCenter>
						<span v-show="isEdit" style="margin-left: 15px; color: rgb(153, 153, 153)">建议尺寸：100*100px</span>
					</div>
				</el-form-item>
			</el-form>
			<LsSticky :data="isEdit">
				<el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
					<el-button size="small" v-show="isEdit" @click="onCancel">取消</el-button>
					<ls-button size="small" type="primary" :asyncFunction="() => onSubmit('form')">
						{{ isEdit ? '保存' : '编辑' }}
					</ls-button>
				</el-row>
			</LsSticky>
		</el-card>
	</section>
</template>
<script>
import { infoGetAndEdit } from '@/api/ModuleSystem'
import InputCascader from '@/components/InputCascader'
import QRCode from 'qrcodejs2'
import { mapGetters } from 'vuex'

export default {
	components: {
		InputCascader,
		QRCode
	},
	data() {
		return {
			copyForm: {}, // 取消时用于重置
			fromInfo: {
				contactName: '', // 联系人姓名/负责人
				contactPhone: '', // 联系人手机
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
				credit: '',
				userAvatar: '', //用户头像
				shopAvatar: '' //店铺头像
			},
			isEdit: false,
			rules: {
				contactPhone: [
					{
						required: true,
						message: `请输入正确的手机号码`,
						trigger: 'blur'
					},
					{
						min: 11,
						max: 11,
						message: '请输入11位数字的手机号码',
						trigger: 'blur'
					}
				],
				idCardPic: [
					{
						required: true,
						message: `请上传负责人身份证正面`,
						trigger: 'blur'
					}
				],
				idCardBackPic: [
					{
						required: true,
						message: `请上传负责人身份证反面`,
						trigger: 'blur'
					}
				],
				contactName: [
					{
						required: true,
						message: `请输入姓名`,
						trigger: 'blur'
					}
				],
				shopName: [
					{
						required: true,
						message: `请输入店铺名称`,
						trigger: 'blur'
					}
				]
			}
		}
	},
	computed: {
		...mapGetters(['userInfo']),
		shopType() {
			return function (state) {
				const stateText = {
					0: '专营店',
					1: '旗舰店',
					2: '自营店'
				}
				return stateText[state]
			}
		}
	},
	mounted() {
		this.getfronInfo()
	},
	methods: {
		//将链接变成二维码图片
		creatQrCode() {
			new QRCode(this.$refs.qrCode, {
				text: this.$shareRedirectUrl + `?detailsType=shop&shopId=${this.fromInfo.id}`, // 需要转换为二维码的内容
				width: 100,
				height: 100,
				colorDark: '#000000', //二维码颜色
				colorLight: '#ffffff', //二维码背景色
				correctLevel: QRCode.CorrectLevel.H //容错率，L/M/H
			})
		},
		//获取信息
		getfronInfo() {
			infoGetAndEdit
				.getInfo()
				.then((res) => {
					if (res.code == '0') {
						return
					}
					this.fromInfo = res.data
					this.copyForm = res.data // 取消时用于重置
					this.$set(this.fromInfo, 'region', [
						Number(res.data.provinceId),
						Number(res.data.cityId),
						Number(res.data.areaId),
						Number(res.data.streetId)
					])
					this.$set(this.copyForm, 'region', [
						Number(res.data.provinceId),
						Number(res.data.cityId),
						Number(res.data.areaId),
						Number(res.data.streetId)
					])
					this.creatQrCode()
				})
				.catch((err) => {
					console.log(err)
				})
		},

		//保存编辑
		onSubmit(form) {
			return new Promise((resolve) => {
				if (this.isEdit) {
					this.$refs[form].validate((valid) => {
						if (valid) {
							this.fromInfo.provinceId = this.fromInfo.region[0]
							this.fromInfo.cityId = this.fromInfo.region[1]
							this.fromInfo.areaId = this.fromInfo.region[2]
							this.fromInfo.streetId = this.fromInfo.region[3]
							infoGetAndEdit
								.editInfo(this.fromInfo)
								.then((res) => {
									if (res.code == 1) {
										this.$message.success('保存成功')
										this.isEdit = false
										this.$router.go(0)
									}
								})
								.finally((_) => {
									resolve()
								})
						} else {
							resolve()
						}
					})
				} else {
					this.isEdit = true
					resolve()
				}
			})
		},
		// 取消
		onCancel() {
			this.$refs.form.clearValidate()
			this.isEdit = false
			this.fromInfo = { ...this.copyForm }
		}
	}
}
</script>
<style scoped>
.form-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
}
</style>
