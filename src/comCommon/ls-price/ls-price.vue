<template>
    <span
        :class="className"
        :style="{ 'font-size': optionstyle.ds + 'px', color: optionstyle.dc, 'font-weight': optionstyle.dw, 'font-family': 'arial' }"
    >
        <span :class="{ 'font-weight': moneyIconWeight }" v-if="!noMoneyIcon">￥</span>
        <span :style="{ 'font-size': optionstyle.is + 'px', color: optionstyle.ic, 'font-weight': optionstyle.iw }">{{ priceTemp(price)[0] }}</span>
        <span :style="{ 'font-weight': optionstyle.dw }" v-if="priceTemp(price)[1]">.{{ priceTemp(price)[1] }}</span>
    </span>
</template>

<script>
export default {
    name: 'ls-price',
    props: {
        // 价格
        price: {
            type: [Number, String],
            default: 0
        },
        className: {
            type: String
        },
        /*
        options：Object
        用法：:options="{ic:'green',is:60}"
        备注：如果只有微信端和APP端，可以用以下方法给对象设默认值(如下)，但H5会报错(只是报错，功能还是正常的)，
             H5如果不在HTML上接收这个参数的话，可以用default:()=>{}来解决，如果要把这个参数写在HTML上，则只能在computed里设置默认值
        options : {
            type: Object,
            default:{
                is : 28,//integer-size,整数字体大小
                ic : '',//integer-color,整数字体颜色，默认是主题颜色
                iw : 500,//integer-weight,整数字体字重
                ds : 24,//decimal-size,小数、整数及￥字体大小
                dc : '',//decimal-color,小数、整数及￥字体颜色，默认是主题颜色
                dw : 500,//decimal-weight,小数、整数及￥字体字重
            }
        }, 
        */
        options: Object,

        // 是否显示￥符号，true:不显示，false:显示，默认值为:false
        noMoneyIcon: {
            type: [Boolean, String],
            default: false
        },
        // 是否加强￥符号的字重，默认值为:false(不加强￥字重)
        moneyIconWeight: {
            type: [Boolean, String],
            default: false
        },
    },
    data() {
        return {
        }
    },
    computed: {
        optionstyle() {
            let options2 = {}
            if (this.options) {
                options2 = {
                    is: this.options.is||14, // integer-size,整数字体大小
                    ic: this.options.ic?this.options.ic:'', // integer-color,整数字体颜色
                    iw: this.options.iw||500, // integer-weight,整数字体字重
                    ds: this.options.ds||12, // decimal-size,小数字体大小
                    dc: this.options.dc?this.options.dc:'', // decimal-color,小数字体颜色
                    dw: this.options.dw||500 // decimal-weight,小数字体字重
                }
            } else {
                options2 = {
                    is: 14, // integer-size,整数字体大小
                    ic: '', // integer-color,整数字体颜色
                    iw: 500, // integer-weight,整数字体字重
                    ds: 12, // decimal-size,小数字体大小
                    dc:'', // decimal-color,小数字体颜色
                    dw: 500 // decimal-weight,小数字体字重
                }
            }
            return options2
        },
        
        priceTemp() {//统一管理商品价格
            return function(price) {
                let arr = []
                if (price&&price.toString().indexOf("~")!=-1) {//判断money是否为1.00~2.00的模式
                    arr = [price,'']
                }else{
                    arr = this.$utils.string.formatNumber(price ? price : 0)
                }
                return  arr
            }
        },
    },
    created() {},

    methods: {}
}
</script>

<style lang="scss" scoped></style>

<!-- 用法：
    HTML：
		<view class="price">
			<ls-price :price="allpay" :options="{is:32}"/>
		</view>
 -->
