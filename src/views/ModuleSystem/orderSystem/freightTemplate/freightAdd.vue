<!-- /*
 * @Descripttion:参数管理 - 新增/编辑
*/ -->
<template>
	<section class="formWarp sku-data">
		<el-card shadow v-loading="loading">
			<el-form ref="form" :model="form" :rules="rules" label-width="132px" size="small">
				<el-form-item label="模板名称：" prop="transName">
					<el-input v-model="form.transName" placeholder="请输入" maxlength="20" class="w-450p" />
				</el-form-item>
				<el-form-item label="配送方式：">
					<el-radio-group v-model="type" @change="change">
						<el-radio label="阶梯计价">阶梯计价</el-radio>
						<el-radio label="固定运费">固定运费</el-radio>
						<el-radio label="卖家包邮">卖家包邮</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- 包邮 -->
				<template v-if="form.freeFlag">
					<el-form-item label="区域限售：">
						<el-table
							tooltip-effect="dark"
							size="mini"
							border
							:data="form.locationSalesTemp"
							:header-cell-style="{ background: '#fafafa' }"
						>
							<el-table-column prop="area" label="地区(选择可支持销售的地区)" align="center">
								<template slot-scope="scope">
									<div class="d-flex a-center j-center">
										<span v-if="scope.row.area">{{ scope.row.area }}</span>
										<el-link
											v-else
											:underline="false"
											type="primary"
											class="text-blue"
											@click="editSelect('locationSalesTemp', scope.row, scope.$index)"
										>
											选择地区
										</el-link>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="操作" align="center" width="200">
								<template slot-scope="scope">
									<el-link
										class="text-blue"
										:underline="false"
										type="primary"
										@click="editSelect('locationSalesTemp', scope.row, scope.$index)"
									>
										修改城市
									</el-link>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
				</template>
				<!-- //没有包邮 -->
				<template v-else>
					<el-form-item label="计费方式：" prop="transType" v-if="type == '阶梯计价'">
						<el-radio-group v-model="form.transType">
							<el-radio label="1">按件数</el-radio>
							<el-radio label="2">按重量</el-radio>
							<el-radio label="3">按体积</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="运费计算：">
						<el-row>
							<el-button @click="form.transFeeDTOList = []" v-if="type != '固定运费' && form.transFeeDTOList.length">
								删除所有
							</el-button>
							<el-button @click="form.transConstFeeDTOList = []" v-if="type == '固定运费' && form.transConstFeeDTOList.length">
								删除所有
							</el-button>
							<el-button @click="type == '固定运费' ? addSelect('transConstFeeDTOList') : addSelect('transFeeDTOList')">
								添加地区
							</el-button>
						</el-row>
						<!-- 非固定运费 -->
						<el-table
							v-if="type != '固定运费' && form.transFeeDTOList.length"
							class="mt-20"
							:key="1"
							:span-method="transFeeSpanMethod"
							tooltip-effect="dark"
							size="mini"
							border
							:data="form.transFeeDTOList"
							:header-cell-style="{ background: '#fafafa' }"
						>
							<el-table-column prop="area" label="地区" align="center" width="500">
								<template slot-scope="scope">
									{{ scope.row.area }}
								</template>
							</el-table-column>
							<el-table-column label="首重/体积/件" align="center">
								<template slot="header">
									<el-row type="flex" align="middle" justify="center">
										<i class="text-danger font-18 v-middle">*</i>
										<div class="flex-shrink mr-3 ml-3">{{ labelTitle(form.transType) }}</div>
									</el-row>
								</template>
								<template slot-scope="scope">
									<el-form-item
										style="margin: 0"
										:prop="'transFeeDTOList.' + scope.$index + '.firstNum'"
										:rules="{ required: true, message: '不能为空', trigger: 'blur' }"
									>
										<lsInput v-model="scope.row.firstNum" :precision="form.transType == 1 ? 2 : 3" :min="0" :max="999999" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="运费(元)" align="center">
								<template slot="header">
									<el-row type="flex" align="middle" justify="center">
										<i class="text-danger font-18 v-middle">*</i>
										<div class="flex-shrink mr-3 ml-3">运费(元)</div>
									</el-row>
								</template>
								<template slot-scope="scope">
									<el-form-item
										style="margin: 0"
										:prop="'transFeeDTOList.' + scope.$index + '.firstPrice'"
										:rules="{ required: true, message: '不能为空', trigger: 'blur' }"
									>
										<lsInput v-model="scope.row.firstPrice" :precision="2" :min="0" :max="999999" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="续重/体积/件" align="center">
								<template slot="header">
									<el-row type="flex" align="middle" justify="center">
										<i class="text-danger font-18 v-middle">*</i>
										<div class="flex-shrink mr-3 ml-3">{{ labelTitle(form.transType, false) }}</div>
									</el-row>
								</template>
								<template slot-scope="scope">
									<el-form-item
										style="margin: 0"
										:prop="'transFeeDTOList.' + scope.$index + '.addNum'"
										:rules="{ required: true, message: '不能为空', trigger: 'blur' }"
									>
										<lsInput v-model="scope.row.addNum" :precision="form.transType == 1 ? 2 : 3" :min="0" :max="999999" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="运费(元)" align="center">
								<template slot="header">
									<el-row type="flex" align="middle" justify="center">
										<i class="text-danger font-18 v-middle">*</i>
										<div class="flex-shrink mr-3 ml-3">运费(元)</div>
									</el-row>
								</template>
								<template slot-scope="scope">
									<el-form-item
										style="margin: 0"
										:prop="'transFeeDTOList.' + scope.$index + '.addPrice'"
										:rules="{ required: true, message: '不能为空', trigger: 'blur' }"
									>
										<lsInput v-model="scope.row.addPrice" :precision="2" :min="0" :max="999999" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="操作" align="center" width="200">
								<template slot-scope="scope">
									<el-link
										class="text-blue"
										:underline="false"
										type="primary"
										@click="delTypeList('transFeeDTOList', scope.$index)"
									>
										删除
									</el-link>
									<el-link
										class="text-blue"
										:underline="false"
										type="primary"
										@click="editSelect('transFeeDTOList', scope.row, scope.$index)"
									>
										修改城市
									</el-link>
								</template>
							</el-table-column>
						</el-table>
						<!-- 固定运费 -->
						<el-table
							v-else-if="form.transConstFeeDTOList.length"
							class="mt-20"
							:key="2"
							tooltip-effect="dark"
							size="mini"
							border
							:span-method="transConstSpanMethod"
							:data="form.transConstFeeDTOList"
							:header-cell-style="{ background: '#fafafa' }"
						>
							<el-table-column prop="area" label="地区" align="center" width="500">
								<template slot-scope="scope">
									{{ scope.row.area }}
								</template>
							</el-table-column>
							<el-table-column prop="name" label="每张订单固定运费（元）" align="center">
								<template slot="header">
									<el-row type="flex" align="middle" justify="center">
										<i class="text-danger font-18 v-middle">*</i>
										<div class="flex-shrink mr-3 ml-3">每张订单固定运费（元）</div>
									</el-row>
								</template>
								<template slot-scope="scope">
									<el-form-item
										:prop="'transConstFeeDTOList.' + scope.$index + '.constantPrice'"
										:rules="{ required: true, message: '不能为空', trigger: 'blur' }"
									>
										<el-input
											v-model="scope.row.constantPrice"
											placeholder=">=0.00"
											@input="scope.row.constantPrice = scope.row.constantPrice.match(/^\d{0,8}(\.\d{0,2})?/g)[0] || null"
										/>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="操作" align="center" width="200">
								<template slot-scope="scope">
									<el-link :underline="false" type="primary" @click="delTypeList('transConstFeeDTOList', scope.$index)">
										删除
									</el-link>
									<el-link :underline="false" type="primary" @click="editSelect('transConstFeeDTOList', scope.row, scope.$index)">
										修改城市
									</el-link>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>

					<!-- /条件包邮 -->
					<el-form-item v-if="type != '固定运费'" label="条件包邮：" prop="conditionFreeFlag">
						<el-row class="mb-20">
							<el-switch v-model="form.conditionFreeFlag"></el-switch>
							<span class="ml-20" v-if="form.conditionFreeFlag">
								<el-button @click="form.transFreeDTOList = []" v-if="form.transFreeDTOList.length">删除所有</el-button>
								<el-button @click="addSelect('transFreeDTOList')">添加地区</el-button>
							</span>
						</el-row>
						<el-form-item v-if="form.conditionFreeFlag && form.transFreeDTOList.length">
							<el-table
								tooltip-effect="dark"
								size="mini"
								:span-method="transFreeSpanMethod"
								border
								:data="form.transFreeDTOList"
								:header-cell-style="{ background: '#fafafa' }"
							>
								<el-table-column prop="area" label="地区" align="center" />
								<el-table-column prop="name" label="操作" align="center">
									<template slot="header">
										<div class="d-flex a-center j-center">
											<i class="text-danger font-18 v-middle mr-10">*</i>
											<el-form-item prop="transFreeType" style="margin-bottom: 0">
												<el-radio-group v-model="form.transFreeType" @change="changeTransFreeType">
													<div>
														<el-radio :label="2">满额包邮（设置包邮金额）</el-radio>
													</div>
													<div>
														<el-radio :label="1">满件包邮（设置包邮件数）</el-radio>
													</div>
												</el-radio-group>
											</el-form-item>
										</div>
									</template>
									<template slot-scope="scope">
										<el-form-item
											:prop="'transFreeDTOList.' + scope.$index + '.number'"
											:rules="{ required: true, message: '不能为空', trigger: 'blur' }"
										>
											<div class="flex-start">
												<!-- 备注：这里如果用lsInput组件的话，会出现点击上面的【满额包邮】输入两位小数时，再点击【满件包邮】后，number变量还是两位小数的问题,所以要在changeTransFreeType方法里处理 -->
												<lsInput
													v-model="scope.row.number"
													:min="0"
													:max="999999"
													:precision="form.transFreeType == 2 ? 2 : 0"
													placeholder=">=0.00"
												>
													<template slot="append">{{ form.transFreeType == 2 ? '元' : '件' }}</template>
												</lsInput>
											</div>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column prop="name" label="操作" align="center" width="200">
									<template slot-scope="scope">
										<el-link :underline="false" type="primary" @click="delTypeList('transFreeDTOList', scope.$index)">
											删除
										</el-link>
										<el-link :underline="false" type="primary" @click="editSelect('transFreeDTOList', scope.row, scope.$index)">
											修改城市
										</el-link>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-form-item>
				</template>
			</el-form>
			<el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
				<el-button size="small" @click="onCancel">取消</el-button>
				<ls-button size="small" type="primary" :asyncFunction="onSubmit">确定</ls-button>
			</el-row>
		</el-card>
		<dialogAreaSelect
			ref="dialogAreaSelect"
			:currentAllList="currentAllList"
			:templateList="templateList"
			:listType="listType"
			:transFreeDTOList="freeDTOList"
			@dialogAreaSelect="dialogAreaChange"
		></dialogAreaSelect>
	</section>
</template>

<script>
import { freightTemplate } from '@/api/ModuleSystem'
import dialogAreaSelect from './components/dialogAreaSelect.vue'

export default {
	components: {
		dialogAreaSelect
	},
	data() {
		return {
			freeDTOList: [], // 条件包邮能选择的地区数组
			id: '', //当前页面的id
			form: {
				id: '',
				status: 1,
				transName: '', //运费模板名称
				transType: '1', //运费类型
				freeFlag: false, //是否包邮
				regionalSalesFlag: '', // 是否区域限售0，不支持，1，支持
				chooseAreaFlag: '', // 指定地区设置运费，0：关闭 1：开启
				conditionFreeFlag: false, // 条件包邮 false：关闭 true：开启
				locationRestrictedSalesList: [{}], //包邮情况下的区域限售 选中的省市 provinceList
				locationSalesTemp: [
					// 固定运费
					{
						area: '',
						provinceList: []
					}
				],
				transConstFeeDTOList: [], // 固定运费
				transFeeDTOList: [], // 运费计算
				transFreeType: 1, // 1、满件包邮 2、满金额包邮
				transFreeDTOList: [] // 条件包邮
			},
			templateList: [], //当前选择运费模板
			currentIndex: 0, //当前选择运费模板index
			rules: {
				transName: [
					{
						required: true,
						message: '运费模板不能为空',
						trigger: 'blur'
					}
				]
			},
			dialogEdit: false, //是否修改地区
			isEdit: false,
			listType: 'transConstFeeDTOList',
			type: '阶梯计价',
			loading: false
		}
	},
	watch: {
		'form.transFeeDTOList'(newVal) {
			if (newVal) {
				if (newVal.length < 1) {
					this.freeDTOList = []
					this.form.conditionFreeFlag = false
				}
			}
		}
	},
	computed: {
		currentAllList() {
			let resultList = []
			if (this.form[this.listType]) {
				this.form[this.listType].forEach((item) => {
					if (item.provinceList) {
						resultList.push(...item.provinceList)
					}
				})
				if (this.listType == 'transFeeDTOList') {
					// 如果不是条件包邮，那么就把上一次所选择的运费计算地区的数组保存在freeDTOList，供条件包邮选择地区使用
					this.freeDTOList = JSON.parse(JSON.stringify(resultList))
				}
			}
			return resultList
		},
		labelTitle() {
			return function (state, flag = true) {
				const stateText = {
					1: flag ? '首件' : '续件',
					2: flag ? '首重/KG' : '续重/KG',
					3: flag ? '首体积/L' : '续体积/L'
					// 4: flag ? '首重/体积/件' : '续重/体积/件'
				}
				return stateText[state]
			}
		}
	},
	created() {
		if (this.$route.query.id) {
			this.id = this.$route.query.id
			this.isEdit = true
			this.getDetail(this.id)
		} else {
			this.isEdit = false
		}
	},
	mounted() {},
	methods: {
		getDetail(id) {
			this.loading = true
			freightTemplate
				.transportDet(id)
				.then((res) => {
					if (res.code) {
						this.form = res.data
						if (res.data.transFeeDTOList) {
							this.$set(this.form, 'transFeeDTOList', res.data.transFeeDTOList)
							// 针对编辑时直接点击条件包邮所作处理，因为条件包邮的数据模板是基于运费计算的内容。如果第一次直接点击条件包邮，那么没有数据模板给条件包邮
							setTimeout(() => {
								//这里加个setTimeout，是因为上面的watch监听form.transFeeDTOList时会将freeDTOList重置为[]，所以这个要走在watch()之后
								this.form.transFeeDTOList.forEach((item) => {
									if (item.provinceList) {
										this.freeDTOList.push(...item.provinceList)
									}
								})
							}, 500)
						} else {
							this.$set(this.form, 'transFeeDTOList', [])
						}

						if (res.data.transFeeDTOList) {
							this.$set(this.form, 'transFeeDTOList', res.data.transFeeDTOList)
						} else {
							this.$set(this.form, 'transFeeDTOList', [])
						}
						if (res.data.transFreeDTOList) {
							this.$set(this.form, 'transFreeDTOList', res.data.transFreeDTOList)
						} else {
							this.$set(this.form, 'transFreeDTOList', [])
						}

						if (res.data.transConstFeeDTOList) {
							this.$set(this.form, 'transConstFeeDTOList', res.data.transConstFeeDTOList)
						} else {
							this.$set(this.form, 'transConstFeeDTOList', [])
						}

						if (res.data.freeFlag) {
							this.type = '卖家包邮'
						} else if (res.data.transType == '4') {
							this.type = '固定运费'
						}

						this.$set(this.form, 'locationRestrictedSalesList', res.data.locationRestrictedSalesList || [])
						this.$set(this.form, 'locationSalesTemp', [
							{
								area: res.data.area,
								provinceList: res.data.locationRestrictedSalesList || []
							}
						])
					}
				})
				.finally(() => {
					setTimeout(() => {
						this.loading = false
					}, 500)
				})
		},
		//合并运费模板
		transFeeSpanMethod({ rowIndex, columnIndex }) {
			// if (rowIndex + 1 == this.form.transFeeDTOList.length) {
			//     if (columnIndex === 5) {
			//         return [1, 6]
			//     } else {
			//         return [0, 0]
			//     }
			// }
		},
		//合并运费模板
		transConstSpanMethod({ rowIndex, columnIndex }) {
			// if (rowIndex + 1 == this.form.transConstFeeDTOList.length) {
			//     if (columnIndex === 2) {
			//         return [1, 3]
			//     } else {
			//         return [0, 0]
			//     }
			// }
		},
		//合并运费模板
		transFreeSpanMethod({ rowIndex, columnIndex }) {
			// if (rowIndex + 1 == this.form.transFreeDTOList.length) {
			//     if (columnIndex === 2) {
			//         return [1, 3]
			//     } else {
			//         return [0, 0]
			//     }
			// }
		},
		//在选择地址前多加一行
		addLast(listType) {
			this.form[listType].splice(this.form[listType].length - 1, 0, {})
		},
		//获取省市地区名字
		getName(templateList) {
			let name = ''
			templateList.forEach((item) => {
				if (item.selectFlag) {
					name += item.name + '(全省)、'
				} else {
					name += item.name + '('
					item.children.forEach((childItem, index) => {
						if (item.children.length - 1 == index) {
							name += childItem.name + ')、'
							return
						}
						name += childItem.name + '、'
					})
				}
			})
			// 删除最后一个'、'
			name = name.substr(0, name.length - 1)
			return name
		},
		//运费模板弹窗地区改变
		dialogAreaChange(templateList) {
			//如果是修改弹窗确定
			if (this.dialogEdit) {
				this.$set(this.form[this.listType][this.currentIndex], 'area', this.getName(templateList))
				this.$set(this.form[this.listType][this.currentIndex], 'provinceList', templateList)
			} else {
				this.form[this.listType].splice(this.form[this.listType].length - 1, 0, {
					provinceList: templateList,
					area: this.getName(templateList)
				})
			}
		},
		//修改运费模板，打开弹窗
		editSelect(listType, item, index) {
			this.dialogEdit = true
			this.currentIndex = index
			this.templateList = item.provinceList
			this.listType = listType
			this.$nextTick(() => {
				this.$refs.dialogAreaSelect.showDialog()
			})
		},
		//添加运费模板
		addSelect(listType) {
			this.dialogEdit = false
			this.templateList = []
			this.listType = listType
			this.$nextTick(() => {
				this.$refs.dialogAreaSelect.showDialog()
			})
		},
		//删除类型
		delTypeList(listType, index) {
			this.form[listType].splice(index, 1)
			if (listType == 'transFeeDTOList') {
				this.freeDTOList.splice(index, 1)
				this.form.transFreeDTOList.splice(index, 1)
				// 运费计算新增了之后需要判断条件包邮是否为空，如果是就添加一个空对象，否则选择地区无法显示
				if (!this.form.transFreeDTOList.length) {
					this.form.transFreeDTOList.splice(this.form[this.listType].length - 1, 0, {})
				}
			}
		},
		// 提交
		onSubmit() {
			return new Promise((resolve) => {
				this.$refs.form.validate((valid) => {
					if (valid) {
						if (this.form.locationSalesTemp && this.form.locationSalesTemp.length) {
							this.form.locationRestrictedSalesList = this.form.locationSalesTemp[0].provinceList
							this.form.area = this.form.locationSalesTemp[0].area
						}
						if (this.type == '固定运费') {
							this.form.transType = '4'
						}
						freightTemplate[this.isEdit ? 'transportEdit' : 'transportAdd'](this.form)
							.then((res) => {
								if (res.code) {
									// 如果选择包邮或者固定运费
									// if (this.form.freeFlag || this.form.transType == '4') {
									//     let transQueryType = ''
									//     this.form.freeFlag ? (transQueryType = 3) : (transQueryType = 2)
									//     // 保存参数以便返回查询
									//     sessionStorage.setItem('type', transQueryType)
									// }
									this.$message.success('保存成功')
									setTimeout(() => {
										this.$router.push({
											name: 'freightTemplate'
										})
									}, 1500)
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

		// 取消返回上一个路由
		onCancel() {
			this.$router.push({
				name: 'freightTemplate'
			})
		},

		change(e) {
			if (e == '卖家包邮') {
				this.form.freeFlag = true
			} else {
				this.form.freeFlag = false
			}
		},

		changeTransFreeType(e) {
			if (e == 1 && this.form?.transFreeDTOList?.length) {
				this.form.transFreeDTOList = this.form.transFreeDTOList.map((item) => {
					return { ...item, number: Number(item.number).toFixed(0) }
				})
			}
		}
	}
}
</script>
