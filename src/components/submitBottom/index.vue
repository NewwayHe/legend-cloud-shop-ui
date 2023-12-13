<!--
    * Author  : zhangTj
    * Desc    : fixed在底部的栏目
	代码示例：
		//下面这个body-style是为了去掉el-card默认的padding:20px
		<el-card shadow :body-style="{padding:`20px 20px 0 20px`}"></el-card>
		<submitBottom>
			<el-row type="flex" justify="space-between" class="w-100 overflow-h px-20">
				<el-col class="text-nowrap flex-start">
					<el-button size="mini" class="allCheck">
						<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
					</el-button>
					<el-button size="small" @click="batchUpdate">批量审核</el-button>
				</el-col>
				<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
			</el-row>
		</submitBottom>
-->
<template>
    <div class="content-box app-wrapper" :style="{ height: `${conHeight - deductHeight}px` }">
        <!-- 下面这个1366，是跟.app-wrapper里的width:1366px相对应的，如果.app-wrapper里的width改了，下面这个1366也要跟着改 -->
        <div
            ref="contentBox"
            class="position-fixed bottom-0 border-top bg-fff zindex-99"
            :class="{ mobile: device === 'mobile' }"
            :style="{
                left: device === 'mobile' ? `20px` : sidebar.opened ? `230px` : `74px`,
                right: `${clientWidth >= 1366 ? 20 : 0}px`,
                transition: 'all 0.28s'
            }"
        >
            <div class="flex-center py-10 content-box">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
// import variables from '@/styles/variables.scss'
import { mapGetters } from 'vuex'
// :is-active="sidebar.opened"
export default {
    name: 'SubmitBottom',
    components: {},
    props: {
        deductHeight: {
            // 由于sidebar.scss里的.main-container里有一个padding-bottom:20px，所以这个20px要外面传进来，让占位符的框减少20px
            type: [Number, String],
            default: 20
        }
    },
    data() {
        return {
            clientWidth: 1920, //这个变量是为了解决屏幕太小时出现间隙的问题
            conHeight: 56
        }
    },
    computed: {
        // elementUI配色
        // variables() {
        //     return variables
        // },
        device() {
            return this.$store.state.app.device
        },
        ...mapGetters(['sidebar', 'userInfo'])
    },
    watch: {},
    created() {},
    destroyed() {},
    mounted() {
        window.onresize = () => {
            // console.log(11,document.documentElement.clientWidth)
            this.clientWidth = document.documentElement.clientWidth
        }
        // this.$nextTick(()=>{
        // console.log(11,[this.$refs.contentBox]);
        // console.log(22,this.$refs.contentBox.getBoundingClientRect().height); // 注意:不能用this.$refs.contentBox.clientHeight来取值,因为它输出的是向下取整的值,会比实际少1px
        // console.log(33,window.getComputedStyle(this.$refs.contentBox).height);
        // 另一个取到准确值的方法：this.conHeight = Math.ceil(parseFloat(window.getComputedStyle(this.$refs.contentBox).height)) // Math.ceil(parseFloat(52.2188px)) = 53
        this.conHeight = this.$refs.contentBox.getBoundingClientRect().height
        // })
    },
    methods: {}
}
</script>
