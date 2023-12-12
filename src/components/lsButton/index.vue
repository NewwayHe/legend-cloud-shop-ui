<!--
 * @Description: 对el-button的二次封装，它与el-button最大的区别是，它引入一个asyncFunction方法，当这个异步方法执行后，才放开点击事件
 * @FilePath: \admin\src\components\lsButton\index.vue
-->
<template>
	<el-button
		class="position-relative"
		:class="className"
		:style="[cssStyle]"
		@click="clickButton"
		:disabled="disabledData"
		:loading="loadingData"
		v-bind="$attrs"
		v-on="listeners"
		:type="type"
	>
		<slot>
			<span :class="[`v-${mode}`]" v-if="text">{{ text }}</span>
		</slot>
	</el-button>
</template>
<script>
import { throttle  } from '@/utils/utils.js';
export default {
	props: {
		className: String, // 类名
		options: {
			// 设置按钮的文字颜色、背景颜色、文字大小、弧度
			/*  例如：
				:options="{cl:'#666',bc:'#fff',fs:'28',lh:'2.2',bd:'var(--mainColor)',br:'10',pl:'10',pr:'10'}"，
				cl:color 文字颜色(默认值#333333),
				bc:background-color 背景颜色(默认值#ffffff),
				fs:font-size 文字大小(单位rpx,默认值28),
				ls:letter-spacing 文距(单位rpx,默认值0),
				lh:line-height:X倍行距，例如lh:'2.2'就是2.2倍行距(默认值normal),可以传px，如:lh:'44px',lh:'44rpx'
				bd:border线颜色，例如：bd:'var(--mainColor)'(border颜色为主题色),当不传bd值时，默认值border=0。当传bd值时，border默认是1px，
				bdSet:自定义border线(当有bdSet值时，bd值会失效)，例如：bdSet:2px solid var(--mainColor)
				br:border-radius 弧度(默认值0),
				pl:padding-left,默认值0，单位：rpx
				pr:padding-right,默认值0，单位：rpx
			*/
			type: Object,
			default: () => {
				return {};
			}
		},

		// 自定义样式，对象形式
		cssStyle: {
			type: Object,
			default() {
				return {};
			}
		},

		text: {
			// 按钮里的文字
			type: String,
			default: ''
		},
		time: {
			// 防二次点击的默认时间，默认单位是毫秒。传:time="0"则没有防二次点击功能
			type: Number,
			default: 1500
		},
		asyncFunction: {
			/*  接收外面的方法，方法需返回异步函数。执行完传入的异步函数后才可再次点击按钮
				例子：
					return new Promise((resolve) => {
						接口.then(()=>{}).finally(()=>{ return resolve() })
					})
				注意:一、方法里有检测参数不存在return的话，要return resolve()结束该方法，
					二、传入该值时将不会运行@click绑定的函数,
					三、如果不是Promise方法的话，就直接用原生的@click.native
					四、如果小程序端页面的this指向不正确，很有可能是因为页面没有设置：name
                    五、async/await 执行流程:https://www.jianshu.com/p/b4fd76c61dc9
					六、不能与v-ls-loading指令一起使用，否则会导致异步任务未完成时可重复点击
			*/
			type: Function
		},
		mode: {
			// button里text文字的vertical-align(垂直对齐方式)形式，具体参数请在ls-main.css里搜索v-middle
			// 可接收值：baseline，sub，top，middle，baseline-middle，bottom，text-bottom等。注意：如果默认是写middle的话，小程序上有些文字水会垂直居中
			type: String,
			default: ''
		},
		disabled: {
			// 是否禁用
			type: Boolean,
			default: false
		},
		loading: {
			// 点击按钮后，名称前是否带 loading 图标
			type: Boolean,
			default: false
		},
		
		/* 新增
		备注: 增加的这个属性，是为了解决当v-bind="$attrs"时，外面写了type="primary"并且当该ls-button是写在el-form里面的时候，type属性会强行被改成primary(增加了这个属性后，type会变回正常的button)
			这时当走time=0时，马上给disabledData和loadingData赋值时，会导致页面强行刷新的bug(也可以加setTimeout来解决)
		*/
		type: {
			// 按钮里的文字
			type: String,
			default: ''
		},
	},
	data() {
		return {
			disabledData: false, // 点击后,异步请求完后，才允许点击
			loadingData: false, //
			dbClickBtnFn: null
		};
	},
	computed: {
		// 自定义样式，对象形式
		optionstyle() {
			const style = {
				color: `${(this.options && this.options.cl) || '#333333'}`, // 处理按钮里的文字颜色
				backgroundColor: !this.plain ? `${(this.options && this.options.bc) || '#ffffff'}` : '', // 处理按钮背景颜色, 如果没有设置透明，才显示背景
				fontSize: this.$utils.string.addUnit((this.options && this.options.fs) || 14), // 处理按钮文字大小
				letterSpacing: this.$utils.string.addUnit((this.options && this.options.ls) || ''), // 处理字距
				lineHeight: `${(this.options && this.options.lh) || 'normal'}`, // 处理行距
				border: this.options && this.options.bdSet ? `${this.options.bdSet}` : this.options && this.options.bd ? `1px solid ${this.options.bd}` : '', // 处理border线
				borderRadius: this.$utils.string.addUnit((this.options && this.options.br) || ''), // 处理border线弧度，最后的''不能改为0，这样className="rounded-100"里改变borderRadius就不会生效
				paddingLeft: this.$utils.string.addUnit((this.options && this.options.pl) || ''), // 处理padding-left
				paddingRight: this.$utils.string.addUnit((this.options && this.options.pr) || '') // 处理padding-right
			};
			Object.assign(style, this.cssStyle);
			return style;
		},
		
		listeners() {
			// 将上面v-on="listeners"里的click方法抽出来：为了解决在<ls-button>上写@click方法时，导致click方法连续运行两次的bug(实测无论本组件还是引用页面上@click上写.stop方法，都不行)，
			const { click, ...arg } = this.$listeners;
			// console.log('fff--', this.$listeners)
			return arg;
		}
	},
    watch: {
        disabled: {
            handler(newValue, oldValue) {
                setTimeout(() => {
                    this.disabledData = this.disabled;
                }, 0);
            },
            deep: true // 数组须要深度监听
        },
		disabledData(newVal,oldValue){
			if(oldValue){
				// console.log('disabledData',newVal)
			}
		},
    },

	created() {},
	mounted() {
		this.dbClickBtnFn = throttle(this.clickBtnFn,this.time)
	},
	methods: {
		async clickButton(e) {
			this.disabledData = true;
			if (this.loading) {
				this.loadingData = true;
			}
			if (this.time) {
				if (this.asyncFunction) {
					// await this.asyncFunction.apply(this.$parent.call(this))//这个是手机端的写法，小心this传不进来
					await this.asyncFunction()
                   /*  await function(){
                        console.log("this Is start running template asyncFunction")
                        return new Promise(reslove=>{
                            setTimeout(()=>{console.log('running api');reslove('running api done')},5000)
                        })
                    }()
                     */
				} else {
					this.dbClickBtnFn(e);
				}
				setTimeout(() => {
					this.disabledData = false;
					this.loadingData = false;
				}, this.time);
			} else {
				if (this.asyncFunction) {
					await this.asyncFunction()
					
					//如果当前的lsButton是写在el-form里，不加setTimeout的话(实测用$nextTick无效)，则会出现页面强行刷新的bug。虽然上面的props里加入type属性来替代$attrs后能解决此问题，但这里还是加个setTimeout做双重保险
					setTimeout(() => {
						this.disabledData = false;
						this.loadingData = false;
					},10)
				} else {
					this.dbClickBtnFn(e);
				}
			}
		},
		clickBtnFn(e) {
			this.$emit('click', e);
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
