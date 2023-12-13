<template>
    <section class="">
        <el-card shadow>
            <div class="table">
                <el-row type="flex">
                    <el-col>
                        <el-radio-group v-model="switchType" size="medium" class="mb-20">
                            <el-radio-button label="setPersonalInfo">基本信息</el-radio-button>
                            <el-radio-button label="ortherSet">其它设置</el-radio-button>
                            <el-radio-button label="contactSet">客服设置</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </div>
            <keep-alive>
                <component :is="switchType" />
            </keep-alive>
        </el-card>
    </section>
</template>
<script>
import setPersonalInfo from './setPersonalInfo'
import ortherSet from '../orderSystem/ortherSet'
import contactSet from './contactSet'
export default {
    name: 'BaseSet',
    components: { setPersonalInfo, ortherSet, contactSet },
    data() {
        return {
            switchType: 'setPersonalInfo'
        }
    },
    computed: {},
    watch: {},

    mounted() {
        this.switchType = this.$route.query.switchType || 'setPersonalInfo'
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
::v-deep .el-card {
    border: 0 !important;
    box-shadow: none !important;
}
</style>
