<template>
	<!-- 
		这个是根据el-input改过来的，el-input所有的参数和方法它都继承了，这个是专门为了处理输入数字的问题的，
		修改内容：
			1、如果有传精度precision值，则input的type强制转为number(可以把type为text然后用正则匹配，这时可以解决输入+-号的问题，但解决不了输￥#&符号的问题)
		用法：
			1、如果要输入金钱：<lsInput :precision="2" :min="0"/>
			2、如果要输入正整数：<lsInput :precision="0" :min="0"/>
			3、如果要输入[0.1~9.9]的折扣数：<lsInput :precision="1" :min="0.1" :max="9.9"/> 
			4、如果要输入体积(L)和重量(Kg)：<lsInput :precision="3" :min="0.001" :max="999999999"/>    
		注意：
			1、不设置:min="0"的话，是能输入负数的，如果要不想输入负数的，就要设为<ls-input :min="0">，
			2、min的值是在@blur时才会触发
			3、shop端和admin端的本组件是完全一样的，更新一端，另一端请直接copy代码覆盖另一端
		它与el-input对比的优点：
			1、加入了el-input-number才有的precision、max、min三个参数；
			2、解决了用输入数字时<el-input :oninput="$inputInteger" />这种写法时输入+-号或者输入--的问题；
			3、type为number时去除右侧那个很丑的箭头
		它与el-input-number对比的优点：
			1、它能够用el-input才有的slot插槽
			2、当设置了:max时，el-input-number是@blur才触发的，这里是@input时就触发，更为直观(:min不能在@input里触发，这样就永远也输不了东西了)
			3、el-input-number只能输入数字，这里是可以输入text文字的
			4、删掉了el-input-number的步长step和控制按钮controls
		解决不了的问题：
			1、HTML里的input的type为number时，连续输入两个-后再输入数字，如：--123，这时页面显示是--123，但事实上这时的value为''，并且输入--后，它是不走@input和@change的，value值是没变化过的(值为：'')，导致不能通过监听value值来改变它
	-->
	<el-input
		ref="input"
		class=""
		:class="[className]"
		:style="[cssStyle,{ '--textalign': textAlign }]"
		:type="(precision||precision===0)?'number':type"
		:value="innerValue"
		@blur="onBlur"
		@focus="onFocus"
		@input="onInput"
		v-bind="$attrs"
		v-on="$listeners">
		<!-- 输入框头部内容，只对 type="text" 有效 -->
		<template slot="prefix" v-if="$slots.prefix">
			<slot name="prefix"></slot>
		</template>
		<!-- 输入框尾部内容，只对 type="text" 有效 -->
		<template slot="suffix" v-if="$slots.suffix">
			<slot name="suffix"></slot>
		</template>
		<!-- 输入框前置内容，只对 type="text" 有效 -->
		<template slot="prepend" v-if="$slots.prepend">
			<slot name="prepend"></slot>
		</template>
		<!-- 输入框后置内容，只对 type="text" 有效 -->
		<template slot="append" v-if="$slots.append">
			<slot name="append"></slot>
		</template>
	</el-input>
</template>

<script>
	/**
	 * Input 输入框
	 * @description  此组件为一个输入框，默认没有边框和样式。
	 * @property {String | Number}	value 输入的值
	 *
	 * @example <u-input v-model="value"/>
	 */
	export default {
		name: "ls-input",
		props: {
			className: String,
			cssStyle: [String, Array, Object],
			type: String,
			value: {
				type: [Number, String],
				default: undefined
			},
			//文字方法：center - 居中，left - 居左，right - 居右
			textAlign: {
				type: String,
				default: 'center'
			},
			// 最小值(只有当type=number||precision||precision===0时才会生效时才会生效)
			min: {
				type: [String, Number],
				default: ''
			},
			// 最大值(只有当type=number||precision||precision===0时才会生效)
			max: {
				type: [String, Number],
				default: Number.MAX_SAFE_INTEGER
			},
			// 保留小数点几位，当有传precision值时，input的type强制变为number，当precision=0时，是只能输入整数
			precision: {
				type: [Number, String]
			},

		},
		data() {
			return {
				// 输入框的值
				innerValue: undefined, //只有在值为undefined时，el-input才会显示默认 placeholder的内容
				// value是否第一次变化，在watch中，由于加入immediate属性，会在第一次触发，此时不应该认为value发生了变化
				firstChange: true,
				// value绑定值的变化是由内部还是外部引起的
				changeFromInner: false,
			};
		},
		watch: {
			value: {
				immediate: true,
				handler(newVal, oldVal) {
					this.innerValue = newVal;
					/* #ifdef H5 */
					// 在H5中，外部value变化后，修改input中的值，不会触发@input事件，此时手动调用值变化方法
					if (
						this.firstChange === false &&
						this.changeFromInner === false
					) {
						this.valueChange();
					}
					/* #endif */
					this.firstChange = false;
					// 重置changeFromInner的值为false，标识下一次引起默认为外部引起的
					this.changeFromInner = false;
				},
			},
		},
		computed: {

		},
		mounted() {

		},
		updated() {

		},
		methods: {
			// 当键盘输入时，触发input事件
			onInput(e) {
				// console.log(111,e);
				// 为了避免props的单向数据流特性，需要先将innerValue值设置为当前值，再在$nextTick中重新赋予设置后的值才有效
				this.innerValue = e || undefined
				this.$nextTick(() => {
					this.valueChange();
				})
			},
			// 输入框失去焦点时触发
			onBlur(event) {
				// start 以下这段为新增
				if (this.type == 'number' || this.precision || this.precision === 0) {
					// 如果不传min值,由于type = 'number'，input是可以输入‘+-123’的，此时页面上能显示‘+-123’，但事实上innerValue的值为：''，此时要将innerValue设为undefined
					if (this.min === '' && !this.innerValue) {
						this.innerValue = 0 //此之前innerValue的值为'',要先将innerValue设一个非空值(设为undefined不行，还是为空，页面渲染不会有变化)，让它有变化，页面上的渲染才会发生变化
						this.$nextTick(() => {
							this.innerValue = undefined
							this.$emit("input", this.innerValue);
						})
					} else {
						// 当type=number类型时,键盘是可以输入+-的,这时页面上看到+-4,但其实innerValue值是为''
						if (((this.min === 0 || this.min) && !this.innerValue && this.innerValue!==this.min) || this.min > Number(this.innerValue)) {
							// if ((this.min == 0 || this.min) && this.min > this.innerValue) {
							this.innerValue = this.min //如果this.min === 0，就要加上这句话让它下面的innerValue = undefined有变化从而使页面更新渲染
							this.$nextTick(() => {
								// 以下三种情况,看用户体验来切换
								// this.innerValue = this.min === 0?undefined:this.min	//当this.min === 0时，如：输入'+-123'(这时value打印出来值为''),让value值置空而不是显示0，但这种会有一个缺点，当我输入+-123时，插件会强行变为min值直接给后台保存
								this.innerValue = undefined	//只要value值少于min，则将输入框置空
								// this.innerValue = this.min	//只要value值少于min，则将输入框value值变为min值(但这种会有一个缺点，当我输入+-123时，插件会强行变为min值直接给后台保存)
								this.$emit("input", this.innerValue);
							})
						}
					}
				}
				// end 以下这段为新增
				this.$emit("blur", event);
			},
			// 输入框聚焦时触发
			onFocus(event) {
				this.$emit('focus', event)
			},
			// 点击完成按钮时触发
			// onConfirm(event) {
			//     this.$emit("confirm", this.innerValue);
			// },
			// 内容发生变化，进行处理
			valueChange() {
				// start 以下这段为新增
				if (this.innerValue) {
					if (this.precision || this.precision === 0) {
						this.innerValue = this.$utils.string.inputDigits(this.innerValue, this.precision,this.min)
					}
					if (this.max && this.max < Number(this.innerValue)) {
						this.innerValue = this.max
					}
					// 如果设置了:min="0.1",这样输入0的话,下面这段代码会将value强转为0.1,然后点击删除0.1里的1时,又强变为0.1,如此循环导致0.1这个值永远也改变不了,所以这个给min赋值的过程要放在onBlur()里
					// if ((this.min==0||this.min)&&this.min>this.innerValue) {
					// 	this.innerValue = this.min
					// }
				}
				// end 以下这段为新增

				let value = this.innerValue;
				this.$nextTick(() => {
					this.$emit("input", value);
					// 标识value值的变化是由内部引起的
					this.changeFromInner = true;
					this.$emit("change", value);
					// 尝试调用u-form的验证方法
					// uni.$u.formValidate(this, "change");
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	// vue input 或 el-input type=“number” 输入数字，去除右侧箭头
	::v-deep input::-webkit-outer-spin-button,
	::v-deep input::-webkit-inner-spin-button {
		-webkit-appearance: none !important;
	}

	::v-deep input[type="number"] {
		-moz-appearance: textfield;
	}

	// slot里的suffix垂直居中
	::v-deep .el-input__suffix {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	// slot里的prefix垂直居中
	::v-deep .el-input__prefix {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	::v-deep .el-input__inner {
		text-align: var(--textalign);
	}
</style>
