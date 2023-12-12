<!-- /*
 * @Descripttion:商品添加
*/ -->
<template>
	<!-- 查询 -->
	<section class="bg-fff pt-20 pb-20 sumbit__warp mb-50 position-relative" v-loading = "loading">
		<!-- 发布商品步骤 -->
		<goodsBase ref="goodsBase" v-model="goodsParams"/>
		<goodsNorms ref="goodsNorms" v-model="goodsParams"/>
		<goodsParam ref="goodsParam" v-model="goodsParams"/>
		<goodsOther ref="goodsOther" v-model="goodsParams"/>
		<goodDistribution ref="goodDistribution" v-model="goodsParams"/>

		<!-- 遮罩层 -->
		<div class="position-absolute w-100 h-100 top-0" style="background: rgba(0,0,0,0);z-index: 1998;" v-if="isLookInfo"></div>
		<Sticky style="z-index: 1999;">
			<el-button size="small" @click="$router.back()">取消</el-button>
			<ls-button size="small" type="primary" :asyncFunction="() => onSubmit(false)" v-if="!isLookInfo">保存草稿</ls-button>
			<ls-button size="small" type="primary" :asyncFunction="() => onSubmit(true)" v-if="!isLookInfo">提交审核</ls-button>
		</Sticky>
	</section>
</template>
<script>
import goodsBase from './components/goodsBase';
import goodsOther from './components/goodsOther';
import goodDistribution from './components/goodDistribution';
import goodsParam from './components/goodsParam';
import goodsNorms from './components/goodsNorms';
import { addGood } from '@/api/ModuleGoods';

export default {
	name: 'AddGood',
	components: {
		goodsBase, // 商品分类
		goodsNorms, // 商品规格
		goodsParam, // 商品参数
		goodsOther, // 其它信息
		goodDistribution // 商品描述
	},
	data() {
		return {
			loading:false,
			tempRoute: {},
			step: 0,
			isEdit: false,
			resData: {},
			goodsParams: {
				//goodsBase组件
				name: '', // 商品名称
				video: '', //商品视频
				stocksArm: '', //	库存警告
				globalCategoryId: [], //全局商城分类
				deliveryType: [0], //配送方式 0快递 10自提 20两者
				shopCategoryId: [],
				brandId: '', //品牌id
				brief: '', //简要描述,卖点

				//goodsNorms组件
				sku: [
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
				multipleSpecificationFlag: 0,
				mainSpecificationId: '',
				img: [], //商品主图
				imageList: [],
				specificationStyle: 'TXT',
				parameter: '', //用户参数
				userParameter: '', //用户自定义参数
				customPropertyValueList: [],
				specificationList: [],
				paramGroupList: [],

				//goodDistribution组件
				prodType: 'E', //商品类型 （前端写死）
				preSellFlag: false, //是否预售
				appointFlag: false, //是否预约上架
				onSaleWay: 1, //-1：不上架，0：预约上架，1：审核通过后马上上架
				stockCounting: false, //库存计数方式，0：拍下减库存，1：付款减库存
				supportTransportFree: false, //是否承担运费[1:商家承担运费;0: 买家承担运费]
				appointTime: '', //上架时间
				openDistribution: false, //是否开启分销
				commissionRatio: '', //分销比例
				// supportInvoiceFlag:false, //是否支持开发票
				preSellProductDTO: {
					//预售信息
					payPctType: 0, //支付方式,0:全额,1:定金
					preSaleStart: '', // 预售开始时间
					preSaleEnd: '', //	预售结束时间
					preDeliveryTime: '', //预售发货时间
					payPct: '', //	预售支付百分比
					depositStart: '', //定金支付开始时间
					depositEnd: '', //定金支付开始时间
					finalMStart: '', //尾款支付开始时间
					finalMEnd: '' //尾款支付结束时间
				},
				content: '',
				contentM: '', //移动端数据
				transId: '', //运费模板ID
				transName: '', //运费模板名称
				productQuotaDTO: {
					// 新增:商品限购
					quotaType: '', //限购类型('':无限购，O:每单限购，D:每日限购，W:每周限购，M:每月限购，Y:每年限购，A:终身限购)
					quotaCount: '', //限购数量
					quotaTime: '' //限购时间
				},
				
				transType:'',
				freeFlag:'',
			}
		};
	},
	computed: {
		isLookInfo(){
			return this.$route.query.isLookInfo ? true : false
		}
	},
	watch: { },
	created() {
		if (this.$route.query.productId) {
			if (this.$route.query.type != 'copy') {
				this.isEdit = true;
			}
			this.getProductDetail();
		}
		this.tempRoute = Object.assign({}, this.$route);
	},
	mounted() { },
	activated() { },
	
	beforeRouteEnter(to, from, next) {
		if (to.query.productId) {
			to.meta.text = '编辑商品';
		} else {
			to.meta.text = '商品发布';
		}
		next();
	},
	methods: {
		setTagsViewTitle() {
			const route = Object.assign({}, this.tempRoute, { title: '编辑商品' });
			this.$store.dispatch('tagsView/updateVisitedView', route);
		},
		setPageTitle() {
			document.title = `编辑商品`;
		},
		preStep() {
			this.step--;
		},
		getProductDetail() {
			this.setTagsViewTitle();
			this.setPageTitle();
			let api = this.$route.query.isDraft + '' == 'true' ? 'productDraftId' : 'productId';
			this.loading = true;
			addGood[api](this.$route.query.productId).then(res => {
				if (res.code == 1) {
					this.resData = res.data;
					this.goodsParams = {
						// goodsBase组件
						id: res.data.id,
						name: res.data.name,
						// globalCategoryId: res.data.globalCategoryId,
						stocksArm: res.data.stocksArm,
						video: res.data.video,
						paramGroupBOList: res.data.paramGroupBOList,
						paramBOList: res.data.paramBOList,
						deliveryType: res.data.deliveryType == 20 ? [0, 10] : [res.data.deliveryType],
						// shopCategoryId: res.data.shopCategoryId,
						brandId: res.data.brandId, //品牌id
						brief: res.data.brief, //简要描述,卖点
						// contentM: res.data.contentM //移动端数据

						//goodsNorms组件
						status: res.data.status, //商品发布状态，只有!=-10才可以修改草稿
						sku: res.data.sku || [],
						img: res.data.img || [], //商品主图
						imageList: res.data.imageList || [],
						specificationStyle: res.data.specificationStyle,
						parameter: res.data.parameter, //用户参数
						userParameter: res.data.userParameter, //用户自定义参数
						customPropertyValueList: res.data.customPropertyValueList || [],
						mainSpecificationId: res.data.mainSpecificationId,
						specificationList: res.data.specificationList || [],
						paramGroupList: res.data.paramGroupList || [],
						multipleSpecificationFlag: 0,

						// goodDistribution组件
						prodType: res.data.prodType, //商品类型 （前端写死）
						preSellFlag: res.data.preSellFlag, //是否预售
						// appointFlag: res.data.appointFlag, //是否预约上架
						onSaleWay: res.data.onSaleWay, //-1：不上架，0：预约上架，1：审核通过后马上上架
						stockCounting: res.data.stockCounting, //库存计数方式，0：拍下减库存，1：付款减库存
						supportTransportFree: res.data.supportTransportFree, //是否承担运费[1:商家承担运费;0: 买家承担运费]
						appointTime: res.data.appointTime, //上架时间
						transId: res.data.transId, //运费模板ID
						transName: res.data.transName, //运费模板名称
						content: res.data.content, //pc端
						contentM: res.data.contentM, //移动端
						// supportInvoiceFlag:res.data.supportInvoiceFlag, //是否支持发票
						preSellProductDTO: res.data.preSellProductDTO || {},
						openDistribution: res.data.openDistribution, //是否开启分销
						commissionRatio: res.data.commissionRatio, //分销比例
						productQuotaDTO: res.data.productQuotaDTO || {}
					};
					this.$set(this.goodsParams, 'globalCategoryId', res.data.globalCategoryId);
					this.$set(this.goodsParams, 'shopCategoryId', res.data.shopCategoryId);

					//默认赋值一次，在对比的时候才会把默认数据保留
					this.$nextTick(() => {
						//如果多规格赋值skuTable否则赋值到singleSkuTable
						if (res.data.sku && res.data.sku.length) {
							if (res.data.sku[0]['properties']) {
								this.goodsParams.multipleSpecificationFlag = 1;
								this.$refs.goodsNorms.skuData.skuTable = res.data.sku;
							} else {
								this.goodsParams.multipleSpecificationFlag = 0;
								this.$refs.goodsNorms.skuTableData.singleSkuTable = res.data.sku;
							}
						}
					});

					let preSellProductDTO = res.data.preSellProductDTO || {};
					this.$refs.goodDistribution.model = {
						preSaleTime: [preSellProductDTO.preSaleStart || '', preSellProductDTO.preSaleEnd || ''], //预售时间
						depositTime: [preSellProductDTO.depositStart || '', preSellProductDTO.depositEnd || ''], //定金时间
						finalMTime: [preSellProductDTO.finalMStart || '', preSellProductDTO.finalMEnd || ''], //尾款时间
						preDeliveryTime: [preSellProductDTO.preDeliveryTime || '', preSellProductDTO.preDeliveryEndTime || ''] //发货时间
					};
					this.$refs.goodDistribution.contentKey++;
					this.$forceUpdate();
				}
			}).finally(() => {
				this.loading = false;
			});
		},

		async onSubmit(arraignment) {
			console.log('goodsParams~~~~',this.goodsParams);
			if (!(await this.$refs.goodsBase.onSubmit())) return;
			if (!(await this.$refs.goodsNorms.onSubmit())) return;
			this.$refs.goodsParam.onSubmit();
			if (!(await this.$refs.goodsOther.onSubmit())) return;
			if (!(await this.$refs.goodDistribution.onSubmit())) return;
			
			// 如果是复制,则不带id
			if (this.$route.query.type== 'copy') this.goodsParams.id = ''
			
			return new Promise(resolve => {
				this.loading = true;
				addGood[this.isEdit ? 'productEdit' : 'productAdd']({
					...this.goodsParams,
					deliveryType: this.goodsParams.deliveryType.length > 1 ? 20 : this.goodsParams.deliveryType[0],//这个一定要写在...this.goodsParams后面
					arraignment: arraignment // arraignment:true：保存草稿并提审，false:只保存草稿
				})
					.then(res => {
						if (res.code == 1) {
							this.$message.success(arraignment ? (this.isEdit ? '编辑成功' : '添加成功') : '保存草稿成功');
							this.$router.go(-1);
						}
					})
					.finally(complete => {
						resolve();
						this.loading = false;
					});
			});
		}
	}
};
</script>
