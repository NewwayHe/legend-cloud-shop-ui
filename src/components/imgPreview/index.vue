<!-- /*
 * @Descripttion:查看示例
*/ -->
<template>
	<el-popover popper-class="atooltip" :trigger="trigger" :disabled="disabled" :offset="offset" :placement="placement" class="ml-5" :class="className">
	    <img :width="width" :height="height" :src="src" alt="" />
	    <el-button type="text" slot="reference" class="p-0 font-12">{{ text }}</el-button>
	</el-popover>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
    components: { 'el-image-viewer': ElImageViewer },
    mixins: [],
    props: {
        text: {
            type: String,
            default: '查看示例'
        },
        width: {
            type: String,
            default: 'auto'
        },
        height: {
            type: String,
            default: 'auto'
        },
        trigger: {
            type: String,
            default: 'hover'
        },
        placement: {
            type: String,
            default: 'right'
        },
        disabled: {//Popover 是否可用
            type: Boolean,
            default: false
        },
        offset: {//出现位置的偏移量	
            type: Number,
            default: 0
        },
        src: String,
		className:String,
    },
    data() {
        return {
        }
    },
	computed: {},
    mounted() {},
    methods: {}
}
</script>
<style lang='scss'>
/* 修改popover样式 不能加scoped */
.el-popover.atooltip {
    padding: 10px;
}
</style>
<style lang="scss" scoped></style>
