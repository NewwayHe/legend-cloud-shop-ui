<template>
	<div v-if="!collapse" class="text-center">
		<transition name="sidebarLogoFade">
			<div class="d-flex j-center a-center m-30 overflow-h">
				<ls-image :src="shopInfo.shopAvatar" :isPreview="false" :options="{ w: '50', h: '50', br: '2' }"></ls-image>
				<div class="overflow-h flex-1 ml-10 h-50p flex-col-between text-left">
					<div class="font-14 line-clamp2">{{ shopInfo.shopName }}</div>
					<el-button
						size="mini"
						class="mt-10"
						style="width: 60px;height: 20px; padding: 3px 4px;"
						@click.stop="goShop"
					>
						查看商城
					</el-button>
				</div>
			</div>
		</transition>
		<dialogPreview ref="dialogPreview"/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'

export default {
	name: 'SidebarLogo',
	components: { dialogPreview },
	computed: {
		...mapGetters(['shopInfo'])
	},
	props: {
		collapse: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {
			title: '',
			logo: ''
		};
	},
	created() {
		console.log(this.getShopInfo);
	},
	methods:{
		goShop(){
			// window.open(this.$shareRedirectUrl + `?detailsType=shop&device=pc&shopId=${this.shopInfo.id}&isPreview=false`, '_blank')
			this.$refs.dialogPreview.showDialog({url:this.$shareRedirectUrl + `?detailsType=shop&device=pc&shopId=${this.shopInfo.id}&isPreview=false`});
		}
	}
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
	transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
	opacity: 0;
}
</style>
