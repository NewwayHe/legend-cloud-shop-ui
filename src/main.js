import 'babel-polyfill'
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import '@/fonts/iconfont.js'
import '@/fonts/iconfont.css'

import zhLocale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/icons' // icon
import '@/permission' // permission control

import App from './App'
import store from './store'
import router from './router'

import tinymce from 'tinymce'
Vue.prototype.$tinymce = tinymce // 将全局tinymce对象指向给Vue作用域下
import VueTinymce from '@packy-tang/vue-tinymce'
Vue.use(VueTinymce)

// 过滤器引用
import filters from '@/filters/filters'
Vue.use(filters)
//指令
Vue.directive('lsLoading', {
    inserted(el, binding) {
        var oi = document.createElement('i')
        oi.setAttribute('class', 'el-icon-loading')
        el.addEventListener('click', (e) => {
            el.classList.add('is-loading')
            el.insertBefore(oi, el.firstElementChild)
            el.disabled = true
            setTimeout(() => {
                el.disabled = false
                el.removeChild(oi)
                el.classList.remove('is-loading')
            }, 1500)
        })
    }
})

store.dispatch('user/getSystemConfig') // 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等

import config from '@/config'
Vue.prototype.$config = config
Vue.prototype.$photoServer = config.photoServer
Vue.prototype.$shareRedirectUrl = config.shareUrl + '/pages/webview/shareUrlRedirect'
import * as utils from '@/utils/utils.js'
Vue.prototype.$utils = utils // 各种实用的方法
import checkInfo from '@/utils/checkInfo.js'
Vue.prototype.$checkInfo = checkInfo // 数据效验

// 公共组件
import lsImage from '@/components/lsImage'
Vue.component('lsImage', lsImage)
import imgCenter from '@/components/ImgCenter'
Vue.component('imgCenter', imgCenter)
import imgPreview from '@/components/imgPreview'
Vue.component('imgPreview', imgPreview)
import Pagination from '@/components/Pagination'
Vue.component('Pagination', Pagination)
import Empty from '@/components/Empty'
Vue.component('empty', Empty)
import submitBottom from '@/components/submitBottom'
Vue.component('submitBottom', submitBottom)
import Sticky from '@/components/Sticky'
Vue.component('Sticky', Sticky)
import lsButton from '@/components/lsButton'
Vue.component('lsButton', lsButton)
import lsInput from '@/components/lsInput'
Vue.component('lsInput', lsInput)
import LsSticky from '@/components/LsSticky'
Vue.component('LsSticky', LsSticky)

// 金额限制两位小数或限制整数
Vue.prototype.$inputInteger = "if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}" // 只能输入整数，用法：<el-input :oninput="$inputInteger" />
Vue.prototype.$inputMoney = `if(this.value=='00'){this.value='0';}else{this.value = this.value.replace(/[^\0-9.]/g, '').replace(/[\.]{2,}/, ".").replace(/[\.]([0-9]{2}).*$/, '.$1').replace(/[A-Z|a-z|\（|\）|[ ]|\s*|\(|\)|\【|\】|\u4e00-\u9fa5]{0,20}/, '')}` //只能输小数点后两位，用法同上
Vue.prototype.$blurMoney = `this.value = this.value.replace(/(^[0-9]+)(\.$)/, "$1").replace(/^[\.]$/, '').replace(/^[\.]([0-9]+)$/, '0.$1')` //只能输小数点后两位(失去焦点时才校验)，用法：<el-input @blur="$blurMoney" />
Vue.prototype.$inputBanChinese = "this.value=this.value.replace(/[^a-zA-Z0-9]/g,'')" // 只能输入字母和数字
/*
  引入当服务器没有该图片时，就直接用该图片
    使用方法：<img :src="$photoServer + item.userImage" alt="图片服务器出错了!" :onerror="$defaultImg" >
    注    意：该全局变量是结合:onerror 一起用的
*/
Vue.prototype.$defaultImg = 'this.src="' + require('./assets/images/defalut-img/default-img.png') + '"'
//$router.push时自动加时间戳(缓存的页面，点击新增时，要加个时间戳才能更新页面)
function routerPushStamp(name, query) {
    this.$router.push({ name: name, query: { ...{ time: new Date().getTime() }, ...query } })
}
Vue.prototype.$routerPushStamp = routerPushStamp

// 屏幕主去滚动到指定ref元素处，例子：this.$scrollIntoView(this.$refs.form)
function scrollIntoView(refCon, block = 'center', inline = 'start', behavior = 'smooth') {
    this.$nextTick(() => {
        refCon.$el.scrollIntoView({ block: block, inline: inline, behavior: behavior }) //定位到当前楼层
    })
}
Vue.prototype.$scrollIntoView = scrollIntoView
Vue.use(ElementUI, { zhLocale })
Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App)
})
