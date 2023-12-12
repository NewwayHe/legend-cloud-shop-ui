<template>
    <div class="fixedBar" :style="{ left: leftWidth, width:`calc(100% - ${leftWidth})` }">
		<slot>
			<div>i am sticky</div>
		</slot>
    </div>
</template>

<script>
export default {
    name: 'Styick',
    computed: {
        // 根据侧边栏来left该fixed盒子 使盒子按钮内容居中
        leftWidth() {
            return this.$store.state.app.sidebar.opened ? '210px' : '54px'
        }
    }
}
</script>

<style>
.fixedBar {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 10;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-top: 1px solid #dadce0;
}
</style>
