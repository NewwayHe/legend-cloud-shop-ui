<!--
    * Time    : 2021-02-05 16:01:42
    * Author  : yinjing
    * Desc    : 数字input  搬运了element input-number源码 修改其监听方式
	* 备注    : 该组件已经弃用，请用上一楼的<lsInput>组件
-->
<template>
    <inputNumber
        :value="value"
        class="w-100"
        :controls="controls"
        :step-strictly="stepStrictly"
        :step="step"
        :size="size"
        :min="min"
        :max="max"
        :precision="precision"
        :controls-position="controlsPosition"
        @input="inputChange"
        :disabled="disabled"
    ></inputNumber>
</template>

<script>
import inputNumber from './components/input-number/src/input-number'
export default {
    name: 'InputNumber',
    name: '',
    components: { inputNumber },
    props: {
        value: {
            type: [Number, String],
            default: undefined
        },
        //是否只能输入 step 的倍数
        stepStrictly: {
            type: Boolean,
            default: false
        },
        // 保留小数点几位
        precision: {
            type: [Number, String]
        },
        //计数器步长
        step: {
            type: [Number, String]
        },
        //最小值
        min: {
            type: [Number, String]
        },
        //最大值
        max: {
            type: [Number, String]
        },
        // 控制按钮位置
        controlsPosition: {
            type: String
        },
        // 是否显示控制按钮
        controls: {
            type: Boolean,
            default: false
        },
        size:String,
        disabled:{
            type: Boolean,
            default:false
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() {},
    destroyed() {},
    mounted() {},
    methods: {
        inputChange(value) {
            if (!value || value == '') {
                value = undefined
            }
            this.$emit('input', value)
        }
    }
}
</script>

<style lang="scss" scoped></style>
