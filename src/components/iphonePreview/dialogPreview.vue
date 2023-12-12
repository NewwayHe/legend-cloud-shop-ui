<template>
	<div v-if="dialog.visible">
		<div class="v-modal" style="z-index: 2002" @click="dialog.visible = false"></div>
		<div class="el-dialog__wrapper flex-center overflow-h" style="z-index: 2003" @click="dialog.visible = false">
			<div class="flex-center cursor-zoom-out zoom-out0005" style="height: 700px">
				<iphonePreview :scale="scale">
					<slot slot="screen">
						<!-- 备注：如果用height="100%"的话，会出现一个小小的滚动条，如果用pointer-events: none;则滚动不了 -->
						<iframe id="iframeId" :src="urlTemp" height="100%" width="100%" frameborder="0"></iframe>
						<!-- 遮罩层 -->
						<div
							class="w-100 position-absolute top-0 left-0"
							style="background-color: rgba(0,0,0,.0);height: 100%;"
							v-show="show"
							@mousedown.prevent="mousedown"
							@mousewheel.prevent="mousewheel"
						></div>
					</slot>
				</iphonePreview>
			</div>
		</div>
	</div>
</template>

<script>
import iphonePreview from '@/components/iphonePreview';
import { GoodsManage } from '@/api/ModuleGoods';

export default {
	name: 'DialogPreview',
	components: { iphonePreview	},
	props: {
	},
	data() {
		return {
			dialog: {
				visible: false
			},
			show: true,
			urlTemp:'',
			scale: 1,	//兼容 1280*800的 macBook 为0.7
		};
	},
	computed: {},
	watch: {
		'dialog.visible': {
			handler(nV) {
				if(!nV) {
					// 如果弹窗关闭了 则清除事件监听
					window.removeEventListener('resize', this.resizeChangeScale)
				}else {
					this.$nextTick(()=> {
						window.addEventListener('resize', this.resizeChangeScale)
					})
				}
			},
			immediate: true,
		}
	},
	created() {
		this.resizeChangeScale()
	},
	mounted() {},
	methods: {
		/* 显示dialog
		 * @param obj {Object}  
		 * 		obj = {
		 * 			id:'',//当有id时，就是去商品详情(要根据id来获取token)
		 * 			url:'',//当有id时，该处的值会无效
		 * 		}
		 * 用法：this.$refs.dialogPreview.showDialog({url:url}) 
		 */
		showDialog(obj) {
			this.$nextTick(() => {
				// console.log(111,obj);
				if (obj.id) {
					GoodsManage.proPreview({ productId: obj.id }).then(res => {
						if (res.code) {
							this.urlTemp = this.$shareRedirectUrl + `?detailsType=good&device=mobile&id=${obj.id}&token=${res.data}&viewDraft=${obj.viewDraft}`
							this.dialog.visible = true;
						}
					});
				}else{
					this.urlTemp = obj.url
					this.dialog.visible = true;
				}

			});
		},
		// 监听遮罩层按下鼠标左键
		mousedown() {
			// console.log(333);
		},
		// 监听遮罩层鼠标滚动
		mousewheel() {
			// console.log(444);
			this.show = false;
			setTimeout(() => {
				this.show = true;
			}, 100);
		},
		/* 监听屏幕尺寸改变 改变缩放 */
		resizeChangeScale() {
			if(window.innerHeight < 900) {
				this.scale = 0.7;
			}else {
				this.scale = 1;
			}
		}
	}
};
</script>

<style lang="scss" scoped></style>
