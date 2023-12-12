<template>
    <div class="m-20">
        <div v-html="agreement.text"></div>
    </div>
</template>

<script>
import { loginPage } from '@/api/ModuleCommon'
export default {
    name: 'AgreeMent',
    data() {
        return {
            code: '',
            agreement: {}
        }
    },
    mounted() {
        this.code = this.$route.query.code
        loginPage.queryById({ code: this.code }).then((res) => {
            if (res.code === 1) {
                if (res.data.type === 0) {
                    // 协议类型 0 链接 1 富文本
                    window.open(res.data.url, '_self')
                } else {
                    this.agreement = res.data
                    this.visible = true
                }
            }
        })
    },
    methods: { }
}
</script>

<style lang="scss" scoped></style>
