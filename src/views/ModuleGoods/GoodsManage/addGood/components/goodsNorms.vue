<template>
	<section class="formWarp pl-20 pr-20">
		<el-form ref="form" :model="value" label-width="132px" size="small">
			<div class="form-title">规格属性</div>
			<el-form-item>
				<span slot="label">
					规格数量
					<el-tooltip class="item" placement="right">
						<div slot="content">单规格则只有一个SKU，多规格则表示有多个SKU</div>
						<i class="el-icon-question font-16 text-000 opacity-3"></i>
					</el-tooltip>
					：
				</span>
				<el-radio-group v-model="value.multipleSpecificationFlag">
					<el-radio :label="0">单规格</el-radio>
					<el-radio :label="1">多规格</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="value.multipleSpecificationFlag" label=" 规格样式：">
				<el-radio v-model="value.specificationStyle" label="TXT">无图样式</el-radio>
				<el-radio v-model="value.specificationStyle" label="PIC">图片样式</el-radio>
				<el-radio v-model="value.specificationStyle" label="GRAPHIC">图文样式</el-radio>
				<template v-if="value.specificationStyle">
					<imgPreview
						class="ml-10"
						text="手机端示例"
						:src="require(`@/assets/images/exampleImgs/H5-specification-${value.specificationStyle}.jpg`)"
					/>
					<imgPreview
						class="ml-10"
						text="PC端示例"
						:src="require(`@/assets/images/exampleImgs/pc-specification-${value.specificationStyle}.jpg`)"
					/>
				</template>
			</el-form-item>
			<el-form-item
				v-if="!value.multipleSpecificationFlag || value.specificationStyle == 'TXT'"
				ref="img"
				label="商品主图："
				prop="img"
				:rules="rules.img"
			>
				<div class="d-flex flex-column font-sm text-ccc">
					<imgCenter v-model="value.img" mult :limit="6" v-if="!isLookInfo" />
					<ls-image
						:src="item"
						v-for="item in value.img"
						:key="item"
						:options="{ w: '100', h: '100' }"
						mode="cantain"
						:previewSrcList="value.img"
						v-else
					/>
					<div class="mt-10">
						<p>
							建议尺寸：800 x 800 像素，支持png/jpg/jpeg/gif格式，每张图片大小5M以内；最多可上传六张图片；你可以拖拽图片调整图片顺序。
						</p>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="商品视频：">
				<uploadVideo v-model="value.video" :isLookData="isLookInfo"></uploadVideo>
			</el-form-item>
			<goodsNorms
				v-show="value.multipleSpecificationFlag"
				ref="goodsNorms"
				v-model="value"
				:norms-style="value.specificationStyle"
				:category-id="value.globalCategoryId"
				@speckListChange="speckListChange"
				@skuChange="skuChange"
			/>
			<el-form-item v-if="errorMessage && $utils.test.isEmpty(skuForm.sku)">
				<div class="text-danger font-12 position-absolute" style="top: -50px; left: 130px">{{ errorMessage }}</div>
			</el-form-item>
			<el-form-item label="商品价格：" class="">
				<el-row type="flex" class="mb-15" v-if="skuForm.sku && skuForm.sku.length">
					<el-button type="primary" plain size="small" @click="isBatch = true" v-if="!isBatch">批量设置</el-button>
					<template v-if="isBatch">
						<el-button type="primary" plain size="small" @click="isBatch = false">取消</el-button>
						<el-button type="primary" plain size="small" @click="sureBatch">确定</el-button>
					</template>
				</el-row>

				<el-form key="formTable" ref="formTable" :model="skuForm" label-width="0" size="small">
					<el-table
						ref="multipleTable"
						class="table-form"
						tooltip-effect="dark"
						size="mini"
						row-key="id"
						border
						:cell-style="{ background: '#fff' }"
						:row-style="{ height: '65px' }"
						:key="tableKey"
						:data="skuForm.sku"
						:span-method="objectSpanMethod"
						id="elTableId"
					>
						<el-table-column fixed="left" type="index" align="center" width="45"></el-table-column>

						<template v-if="value.multipleSpecificationFlag == 1">
							<el-table-column
								v-for="(item, index) in skuData.specList"
								fixed="left"
								align="center"
								:label="item.propName"
								width="100"
								:key="index"
							>
								<template slot-scope="scope">
									<span class="line-clamp2" :title="getSpecAttr(index, scope.$index)['name']">
										{{ getSpecAttr(index, scope.$index)['name'] }}
									</span>
								</template>
							</el-table-column>
						</template>
						<el-table-column v-for="item in columnData" :key="item.field" align="center" :min-width="item.minWidth">
							<template slot="header" slot-scope="scope">
								<el-row type="flex" align="middle" justify="center">
									<template v-if="item.field == 'weight' || item.field == 'volume'">
										<i v-if="item.field == 'weight' ? requireWeight : requireVolume" class="text-danger font-18 v-middle">*</i>
									</template>
									<template v-else>
										<i v-if="item.required" class="text-danger font-18 v-middle">*</i>
									</template>
									<div class="flex-shrink mr-3 ml-3">{{ item.title }}</div>
								</el-row>
								<!-- 以下这个为新增功能(批量设置) -->
								<el-row class="" type="flex" align="middle" justify="center" v-if="isBatch">
									<lsInput
										v-model="batchData[item.field]"
										:min="0.001"
										:max="9999999"
										:precision="3"
										v-if="item.field == 'weight' || item.field == 'volume'"
									/>
									<lsInput
										v-model="batchData[item.field]"
										:min="0"
										:max="9999999"
										:precision="0"
										:disabled="value.status == '-10' || value.status == undefined ? false : true"
										v-else-if="item.field == 'actualStocks'"
									/>
									<el-input
										v-else
										v-model.trim="batchData[item.field]"
										:maxlength="item.maxLength"
										:show-word-limit="item.field == 'partyCode' || item.field == 'modelId' || item.field == 'name'"
										:type="item.type"
										:oninput="item.oninput"
									/>
								</el-row>
							</template>
							<template slot-scope="scope">
								<el-form-item
									:key="scope.row.id"
									:ref="'sku.' + scope.$index + '.' + item.field"
									:prop="'sku.' + scope.$index + '.' + item.field"
									:rules="
										item.field == 'originalPrice'
											? [
													{
														validator: (rule, value, callback) => {
															callback(
																selectValidate(
																	callback,
																	scope.row.costPrice,
																	scope.row.price,
																	scope.row.originalPrice
																)
															)
														},
														trigger: 'blur'
													}
											  ]
											: item.field == 'price'
											? [
													{
														validator: (rule, value, callback) => {
															callback(
																selectValidate2(callback, scope.row.costPrice, scope.row.costPrice, scope.row.price)
															)
														},
														trigger: 'blur'
													}
											  ]
											: rules[item.field]
									"
								>
									<el-row class="" type="flex" align="middle" justify="center">
										<lsInput
											v-model="scope.row[item.field]"
											:min="0"
											:max="999999"
											:precision="3"
											v-if="item.field == 'weight' || item.field == 'volume'"
										/>
										<lsInput
											v-model="scope.row[item.field]"
											:min="0"
											:max="9999999"
											:precision="0"
											:disabled="value.status == '-10' || value.status == undefined ? false : true"
											v-else-if="item.field == 'actualStocks'"
										/>
										<el-input
											v-else
											v-model.trim="scope.row[item.field]"
											:maxlength="item.maxLength"
											:show-word-limit="item.field == 'partyCode' || item.field == 'modelId' || item.field == 'name'"
											:type="item.type"
											:oninput="item.oninput"
										/>
									</el-row>
								</el-form-item>
							</template>
						</el-table-column>
					</el-table>
				</el-form>
			</el-form-item>
		</el-form>
	</section>
</template>
<script>
import uploadVideo from '@/components/Upload/video'
import goodsNorms from './components/goodsNorms'
import { diffArary } from '@/utils/sku'

export default {
	components: {
		uploadVideo,
		goodsNorms //商品规格
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
		var weightValidate = (rule, value, callback) => {
			if (this.value.transType == 2 && !this.value.freeFlag && !value) {
				callback(new Error('请输入重量'))
				return
			}
			callback()
		}
		var volumeValidate = (rule, value, callback) => {
			if (this.value.transType == 3 && !this.value.freeFlag && !value) {
				callback(new Error('请输入体积'))
				return
			}
			callback()
		}
		// 验证输入的是否符合金钱(只能保留两位小数)
		const moneyValidate = (rule, value, callback) => {
			const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
			if (value && !reg.test(value)) {
				callback(new Error('请输入正确价格格式'))
				return
			}
			callback()
		}
		// 验证实际库存不能为空
		const actualStocksValidate = (rule, value, callback) => {
			// 编辑的时候不能修改库存,所以不效验库存
			if (this.requireActualStocks) {
				if (value === '') {
					callback(new Error('实际库存不能为空'))
				} else if (this.value.sku[0] && value < this.value.sku[0].stocks && this.flag === 0) {
					this.$message.warning('实际库存小于销售库存，请注意！')
					this.flag++
				}
			}
			callback()
		}
		// 选择多规格时 规格名称不能为空
		const nameValidate = (rule, value, callback) => {
			if (value.trim().length < 1) {
				callback(new Error('名称不能为空'))
			} else {
				callback()
			}
		}
		const picValidate = (rule, value, callback) => {
			if (value.length < 1 || value == false) {
				// 选择多规格时 规格名称不能为空
				callback(new Error('图片不能为空'))
			}
			callback()
		}

		return {
			// 批量数据
			batchData: {
				name: '',
				price: '', // 销售价
				costPrice: '', // 成本价
				originalPrice: null, // 原价
				actualStocks: '',
				partyCode: '',
				modelId: '',
				volume: '',
				pic: '',
				weight: ''
			},
			//sku内部数据
			skuData: {
				//sku数据
				skuTable: [
					{
						name: '',
						costPrice: '',
						price: '',
						originalPrice: '',
						actualStocks: '',
						partyCode: '',
						modelId: '',
						volume: '',
						pic: '',
						weight: ''
					}
				],
				specList: []
			},
			skuTableData: {
				manySkuTable: [],
				singleSkuTable: [
					{
						name: '',
						costPrice: '',
						price: '',
						originalPrice: '',
						actualStocks: '',
						partyCode: '',
						modelId: '',
						volume: '',
						pic: '',
						weight: ''
					}
				]
			},
			model: {
				norms: 0
			},
			rules: {
				name: [
					{
						validator: nameValidate,
						trigger: 'blur'
					}
				],
				price: [
					{
						required: true,
						message: '销售价不能为空',
						trigger: 'blur'
					},
					{
						validator: moneyValidate,
						trigger: 'blur'
					}
				],
				costPrice: [
					{
						required: true,
						message: '成本价不能为空',
						trigger: 'blur'
					},
					{
						validator: moneyValidate,
						trigger: 'blur'
					}
				],
				originalPrice: [
					{
						validator: moneyValidate,
						trigger: 'blur'
					}
				],
				img: [
					{
						type: 'array',
						required: true,
						message: '图片不能为空',
						trigger: 'change'
					}
				],
				volume: [
					{
						validator: volumeValidate,
						required: this.value.transType == 3 ? true : false,
						trigger: 'blur'
					}
				],
				weight: [
					{
						validator: weightValidate,
						required: this.value.transType == 2 ? true : false,
						trigger: 'blur'
					}
				],
				actualStocks: [
					{
						validator: actualStocksValidate,
						required: this.requireActualStocks,
						message: '实际库存不能为空',
						trigger: 'blur'
					}
				]
			},
			tableKey: 0,
			inputKey: 0, // 1 佣金高于50%  2 佣金低于1元
			flag: 0,
			errorMessage: '',
			isBatch: false
		}
	},
	computed: {
		//固定列数据
		columnData() {
			this.tableKey++
			return [
				{
					field: 'name', //字段
					title: '名称', //列名称
					type: 'text', //输入框类型，
					required: true,
					minWidth: 200,
					maxLength: 50
				},
				{
					field: 'costPrice',
					title: '成本价(￥)',
					required: true,
					// type:'number', //输入框类型
					oninput: this.$inputMoney,
					minWidth: 90,
					maxLength: 9
				},
				{
					field: 'price',
					title: '销售价(￥)',
					required: true,
					oninput: this.$inputMoney,
					minWidth: 90,
					maxLength: 9
				},
				{
					field: 'originalPrice',
					title: '原价(￥)',
					oninput: this.$inputMoney,
					minWidth: 80,
					maxLength: 9
				},
				{
					field: 'actualStocks',
					title: '实际库存',
					required: this.requireActualStocks ? true : false, //编辑的时候不能修改库存
					oninput: this.$inputInteger,
					minWidth: 80,
					maxLength: 9
				},
				{
					field: 'partyCode',
					title: '商品编码',
					type: 'text', //输入框类型
					oninput: this.$inputBanChinese,
					minWidth: 120,
					maxLength: 20
				},
				{
					field: 'modelId',
					title: '条形码',
					type: 'text', //输入框类型
					oninput: this.$inputBanChinese,
					minWidth: 120,
					maxLength: 20
				},
				{
					field: 'volume',
					title: '体积/L',
					//选择不包邮且按体积计算运费时必填
					// required: this.requireVolume,
					type: 'text', //输入框类型activeCoupon
					minWidth: 80,
					maxLength: 6
				},
				{
					field: 'weight',
					title: '重量/KG',
					// 选择不包邮且按重量计算运费时必填
					// required: this.value.transType == 2 ? true : false && !this.value.freeFlag,
					type: 'text', //输入框类型activeCoupon
					minWidth: 80,
					maxLength: 6
				}
			]
		},
		requireVolume() {
			return this.value.transType == 3 && this.value.freeFlag == false
		},
		requireWeight() {
			return this.value.transType == 2 && this.value.freeFlag == false
		},
		// 编辑的时候不能修改库存
		requireActualStocks() {
			return !this.$route.query.productId && this.value.status == '-10'
		},
		skuTableList() {
			if (this.value.multipleSpecificationFlag) {
				return this.skuTableData.manySkuTable
			} else {
				return this.skuTableData.singleSkuTable
			}
		},
		skuForm: function () {
			return {
				sku: this.skuTableList
			}
		},
		isLookInfo() {
			return this.$route.query.isLookInfo ? true : false
		}
	},
	watch: {
		//点击单规格数据清空
		'skuData.skuTable'(newSkus, oldSkus) {
			if (!newSkus.length) return (this.skuTableData.manySkuTable = [])
			if (!oldSkus || !oldSkus.length) return (this.skuTableData.manySkuTable = newSkus)
			if (newSkus.length === oldSkus.length) {
				// 当规格名和规格值数量未发生变化，更新 skus 即可
				this.skuTableData.manySkuTable = newSkus.map((item, index) => {
					return {
						...this.skuTableData.manySkuTable[index],
						...item, //解构item解决有主规格时商品价格不会回显
						properties: item.properties,
						cnProperties: item.cnProperties
					}
				})
				return
			}
			// 当规格名的数量发生了变化
			const diffIds = this.diffIds(newSkus, oldSkus)
			if (newSkus.length > oldSkus.length) {
				// 当添加了规格值
				let data = []
				newSkus.forEach((item) => {
					const sku = this.skuTableData.manySkuTable.find((_item) => _item.properties === item.properties)
					if (sku) {
						data.push(sku)
					} else {
						data.push({
							...item
						})
					}
				})
				this.skuTableData.manySkuTable = data
			} else {
				// 当删除了规格值
				this.skuTableData.manySkuTable = this.skuTableData.manySkuTable.filter((_item) => !diffIds.includes(_item.properties))
			}
		},
		'value.img'(newVal) {
			if (newVal.length) {
				this.$nextTick(() => {
					this.$refs.form.validateField('img')
				})
			}
		}
	},
	mounted() {
		this.tableLayout()
	},
	methods: {
		selectValidate(callback, enabled, par1, par2) {
			if (!par2 || par2.length === 0) {
				return
			}
			if (Number(par1) >= Number(par2) && par2 != null) {
				callback(new Error('原价需大于销售价'))
			}
		},
		selectValidate2(callback, enabled, par1, par2) {
			if (!par2 || par2.length === 0) {
				this.inputKey = 0
				callback(new Error('销售价不能为空'))
				return
			}
			if (Number(par1) >= Number(par2)) {
				this.inputKey = 0
				callback(new Error('销售价需大于成本价'))
				return
			}
			if (par1 != '' && Number(par2) / Number(par1) > 2) {
				this.inputKey = 1
			} else if (par1 != '' && Number(par2) - Number(par1) < 1) {
				this.inputKey = 2
			} else {
				this.inputKey = 0
			}
		},
		speckListChange(newVal) {
			this.skuData.specList = newVal
		},
		tableLayout() {
			this.$nextTick(() => {
				this.$refs.multipleTable.doLayout()
			})
		},

		diffIds(skusList1, skusList2) {
			// 两个数据的 ids 进行相差
			skusList1 = skusList1.map((item) => item.properties)
			skusList2 = skusList2.map((item) => item.properties)
			return diffArary(skusList1, skusList2)
		},

		//批量添加
		batchAdd(field, rowIndex, value) {
			let valiFieldArr = []
			this.skuForm.sku.forEach((item, index) => {
				if (index > rowIndex) {
					item[field] = value
					valiFieldArr.push('sku.' + index + '.' + field)
				}
			})
			this.$refs.formTable.validateField(valiFieldArr, function (errorMsg) {})
		},

		/*
		根据传入的属性值，拿到相应规格的属性
		@params
		  specIndex 规格项目在 advancedSpecification 中的序号
		  index 所有属性在遍历时的序号
		*/
		getSpecAttr(specIndex, index) {
			// 获取当前规格项目下的属性值
			const currentValues = this.skuData.specList[specIndex].prodPropList
			let indexCopy
			// 判断是否是最后一个规格项目
			if (this.skuData.specList[specIndex + 1] && this.skuData.specList[specIndex + 1].prodPropList.length) {
				indexCopy = index / this.countSum(specIndex + 1)
			} else {
				indexCopy = index
			}
			const i = Math.floor(indexCopy % currentValues.length)
			if (i.toString() !== 'NaN') {
				return currentValues[i]
			} else {
				return {
					id: '',
					name: ''
				}
			}
		},
		// 判断是否显示
		objectSpanMethod({ rowIndex, columnIndex }) {
			if (columnIndex >= this.skuData.specList.length || columnIndex === 0) return [1, 1]
			return [rowIndex % this.countSum(columnIndex) === 0 ? this.countSum(columnIndex) : 0, 1]
		},

		// 计算属性的乘积
		countSum(index) {
			let num = 1
			this.skuData.specList.forEach((item, j) => {
				if (j >= index && item.prodPropList.length) {
					num *= item.prodPropList.length
				}
			})
			return num
		},

		//sku改变父级数据
		skuChange(sku, spc, normsCustom) {
			this.skuData.skuTable = sku
			this.value.customPropertyValueList = normsCustom
		},

		sureBatch() {
			this.isBatch = false
			for (let key in this.batchData) {
				this.skuForm.sku.forEach((item, index) => {
					if (this.batchData[key]) {
						item[key] = this.batchData[key]
					}
				})
			}
			this.$refs['formTable'].validate()
		},

		//提交
		onSubmit() {
			return new Promise((resolve) => {
				if (!this.skuForm.sku.length) {
					this.errorMessage = '至少选择一个规格'
					this.$message.error(this.errorMessage)
					this.$scrollIntoView(this.$refs.formTable)
					resolve(false)
				}

				// 让el-table里的元素垂直方向滚动到屏幕中间,并且table的滚动条水平方向滚动到相应的元素
				const ScrollMiddle = (model) => {
					if (Object.keys(model) && Object.keys(model)[0]) {
						// 如果是商品主图效验不通过
						if (Object.keys(model)[0] == 'img') {
							this.$scrollIntoView(this.$refs['img'])
							// 如果是el-table里的元素效验不通过
						} else {
							let refModel = this.$refs[Object.keys(model)[0]]
							let refCon = Object.prototype.toString.call(refModel) == '[object Array]' ? refModel[0] : refModel //如果是数组类型，取第一个值
							this.$scrollIntoView(refCon)

							// 注意,这里一定要加setTimeout,不然上面的$scrollIntoView不会生效
							setTimeout(() => {
								// 选择<el-table>里的body,以便操控它的滚动条
								let target = document.getElementById('elTableId').querySelector('.el-table__body-wrapper')
								if (target) {
									target.scrollTo({
										//1.scrollTo(x,y)指定滚动到x轴和y轴的位置。2.scrollTo(options) options有三个参数，(left,top,behavior),top等同于y-coord，left等同于x-coord。
										left: refCon.$el.offsetParent.offsetLeft, //需要父元素设置postion(relative、absolute、fixed)
										behavior: 'smooth' //behavior  类型String,表示滚动行为,支持参数 smooth(平滑滚动),instant(瞬间滚动),默认值auto,实测效果等同于instant
									})
								}
							}, 500)
						}
					} else {
						this.$scrollIntoView(this.$refs.multipleTable)
					}
				}

				this.$refs['formTable'].validate((valid, model) => {
					if (valid) {
						if (this.value.multipleSpecificationFlag && this.value.specificationStyle != 'TXT') {
							this.$refs['goodsNorms'].confirm((val, imgList) => {
								if (val) {
									this.$refs['form'].validate((valid, model) => {
										if (valid) {
											this.value.sku = this.skuForm.sku
											this.value.specificationList = this.$refs.goodsNorms.resultList
											this.value.imageList = imgList
											resolve(true)
										} else {
											ScrollMiddle(model)
											resolve(false)
										}
									})
								} else {
									this.$scrollIntoView(this.$refs.goodsNorms)
									resolve(false)
								}
							})
						} else {
							this.$refs['form'].validate((valid, object) => {
								if (valid) {
									//获取sku表格值
									this.value.specificationList = this.$refs.goodsNorms.resultList
									this.value.sku = this.skuForm.sku
									//获取用户自定义参数
									resolve(true)
								} else {
									ScrollMiddle(object)
									resolve(false)
								}
							})
						}
					} else {
						this.$scrollIntoView(this.$refs.formTable)
						resolve(false)
					}
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
/* 这段是解决输入【名称】，点【应用】，再把【名称】删掉，点【应用】，弹出的错误提示会导致表格错位的bug */
::v-deep .table-form {
	.el-form-item {
		margin-bottom: 18px !important;
		&.is-error {
			margin-bottom: 18px !important;
		}
	}
	.el-input__inner {
		padding: 0 5px !important;
	}
	.el-form-item__error {
		white-space: nowrap !important;
		word-wrap: normal !important;
		transform: scale(0.8) !important;
		transform-origin: left top !important;
	}
}
</style>
