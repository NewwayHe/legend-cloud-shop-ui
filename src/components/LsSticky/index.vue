<!--用position:fixed来代替position:sticky的功能
	这个是<submitBottom>组件和<Sticky>组件的升级版，它比这两个的优势是：
		一、它不受layout布局里sidebar的宽度影响，
		二：它可以根据slot内容的位置，决定它采不采用Fixed定位
	用法：
		//下面这个body-style是为了去掉el-card默认的padding:20px
		<el-card :body-style="{padding:`20px 20px 10px 20px`}">
		<LsSticky :data="tableList">
			<el-row type="flex" justify="space-between" class="overflow-h py-10 px-20 bg-white" style="margin: 10px -20px 0 -20px;width:calc(100% + 40px)">
				<el-col class="text-nowrap flex-start">
					<el-button size="mini" class="allCheck">
						<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
					</el-button>
					<el-button v-if="searchFilters.status != 0" size="small" @click="batchUpdate(0)">批量下架</el-button>
				</el-col>
				<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
			</el-row>
		</LsSticky>
		
		如果只有分页：
		下面的style里的margin和width，是解决当元素在el-card里并且由于切换分页后页面马上滚动导致bottom值算不准而底部fixed时两边各空出20px的问题。
		<LsSticky :data="tableList">
			<el-row type="flex" justify="end" class="overflow-h py-10 px-20 bg-white" style="margin: 10px -20px 0 -20px;width:calc(100% + 40px)">
				<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
			</el-row>
		</LsSticky>
-->
	
<template>
	<div class="ls-sticky-class" ref="ls-sticky-class" :style="{ '--zindex': zindex }">
		<!--sticky 容器-->
		<div :style="{ height: `${height}px`, width: `${width}px`, background: bgColor }" v-if="isFixed"></div>
		<div
			ref="sticky-content"
			:class="{ 'ls-sticky-fixed': isFixed }"
			:style="{
				top: isFixed && position == 'top' ? sticky + 'px' : 'auto',
				bottom: isFixed && position == 'bottom' ? sticky + 'px' : 'auto',
				width: isFixed ? `${width}px` : '100%',
				visibility: visible ? 'visible' : 'hidden'
			}"
		>
			<slot></slot>
		</div>
		<!--sticky 容器-->
	</div>
</template>

<script>
// import { debounce } from '@/utils/utils.js';
export default {
	name: 'LsSticky',
	props: {
		// 位置，默认值top，可选值：上：top，下：bottom
		position: {
			type: [String],
			default: 'bottom'
		},
		// 吸顶容器距离顶部(或底部)距离 px
		sticky: {
			type: [Number, String],
			default: 0
		},
		// 占位容器背景颜色
		bgColor: {
			type: String,
			default: 'none'
		},
		// 如果该页面是列表，而组件是在底部的话，要等数据加载完后，组件会被挤下去，再重新获取一下this.bottom的数据，这时组件的bottom值才是对的，不然会获取到错误的bottom值
		data: {
			type: [Array,Boolean, String, Object],
			default: () => []
		},
	},
	data() {
		return {
			timer: null,
			top: 0,
			bottom:0,
			left:0,
			height: 0,
			width:'100%',
			isFixed: false,
			zindex: 1,
			scrollTop:0,
			visible:true,//用来解决点击分页切换数据时，Fixed元素闪一下的问题
		}
	},
	computed: {},
	watch: {
		scrollTop: {
			handler(newValue, oldValue) {
				// console.log(55,newValue);
				this.updateStickyChange()
			},
			immediate: true
		},
		// 页面数据变化了的话,要重新获取一下bottom值
		data: {
			handler(newValue, oldValue) {
				this.visible = false
				// if(!this.$utils.test.isEmpty(newValue)){
				setTimeout(()=>{//不加延时的话，点击分页，从10条/页换到30条/页时，由于页面滚动条有500毫秒的滚动动作，如果马上获取位置的话，会导致bottom值取错
					this.updateScrollChange()
				},600)
				// }
			},
			deep:true
		},
	},

	mounted() {
		/* 	监听屏幕上下滚动。
			备注：如果 用window.onscroll的话，同一个页面用了两个<el-tab-pane>，当两个<el-tab-pane>里的内容都用了<LsSticky>时，
			点击第一个tab，再点击第二个tab，这时再点击第一个tab时，打印data里的数据，发现竟然是第二个tab里的data的数据;
			触发updateScrollChange时用到的$refs拿到的元素，竟然是第二个tab的LsSticky元素，会导致第一个元素bottom计算错误。  
			用window.addEventListener的话却没有问题，原因不明
			window.onscroll = () => {
				this.scrollTop = Number(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
			};
		 */
		window.addEventListener('scroll',()=>{
			this.scrollTop = Number(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
		})
		this.updateScrollChange()
	},

	methods: {
		// 用debounce的话,会闪一下,体验不好
		// updateStickyChange:debounce(function(){
		updateStickyChange(){
			if (this.timer) {
				// console.log(66,this.scrollTop);
				if (this.position=='top') {
					this.isFixed = (this.scrollTop * 1 || 0 + this.sticky) >= this.top
				}
				if (this.position=='bottom') {
					this.isFixed = (this.scrollTop * 1 || 0 + this.sticky) <= (this.bottom-window.innerHeight)
				}
				// console.log(22,(this.bottom-window.innerHeight));
				// console.log(33,(this.scrollTop * 1 || 0 + this.sticky));
				// console.log(44,this.isFixed);
				if (this.isFixed) {
					this.zindex = 999
				}
				this.$emit('isFixed', this.isFixed)
			}
		},
		// }),
		updateScrollChange() {
			this.isFixed = false
			if (this.timer) {
				clearTimeout(this.timer)
				this.timer = null
			}
			// 下面这个setTimeout，是为了解决当time=null时，由于页面可能会闪一下导致滚动条抖动一下而触发了updateStickyChange里面方法，从而导致this.bottom算错的问题
			setTimeout(()=>{
				this.timer = setTimeout(() => {
					this.visible = true
					// console.log(11,this.$refs['sticky-content'].getBoundingClientRect());
					// console.log(22,this.$refs['sticky-content'].clientWidth);
					// console.log(33,this.$refs['sticky-content'].clientHeight);
					this.top = this.$refs['sticky-content'].getBoundingClientRect().top + (this.scrollTop || 0)
					this.bottom = this.$refs['sticky-content'].getBoundingClientRect().bottom + (this.scrollTop || 0)
					this.left = this.$refs['sticky-content'].getBoundingClientRect().left
					this.height = this.$refs['sticky-content'].clientHeight
					this.width = this.$refs['sticky-content'].clientWidth
					this.$emit('sendTop', { top: this.top })
					this.$emit('sendBottom', { bottom: this.bottom })
					// console.log(12,this.bottom)
				}, 0)
			},10)
		}
	}
}
</script>

<style>
.ls-sticky-fixed {
	position: fixed;
	z-index: var(--zindex);
}
</style>
