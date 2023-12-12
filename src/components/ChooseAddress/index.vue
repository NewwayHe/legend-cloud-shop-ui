<template>
    <div class="flex-start">
        <el-select v-model="value.provinceId" class="flex-1" filterable placeholsder="请选择" @focus="returnSelection" @change="chooseProvinces">
            <el-option v-for="item in province" :key="item.key" :value="item.key * 1" :label="item.value" />
        </el-select>
        <el-select v-model="value.cityId" class="flex-1 ml-15" filterable placeholder="请选择" @change="chooseCity">
            <el-option v-for="item in city" :key="item.key" :value="item.key * 1" :label="item.value" />
        </el-select>
        <el-select v-model="value.areaId" class="flex-1 ml-15" filterable placeholder="请选择" @change="chooseArea">
            <el-option v-for="item in area" :key="item.key" :value="item.key * 1" :label="item.value" />
        </el-select>
    </div>
</template>

<script>
import { shopMoveIn } from '@/api/ModuleCommon'
export default {
    name: 'ChooseAddress',
    props: {
        value: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            province: [], //省份
            city: [], //城市
            area: [] //地级市
        }
    },
    watch: {
        'value.provinceId': {
            handler(newV) {
                if (newV) {
                    this.returnSelection()
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {},
    methods: {
        // 回选时加载数据用
        returnSelection() {
            // 请求地址数据,让已经选中的地址上屏
            if (!this.province.length) {
                shopMoveIn.locationProvinces().then((res) => {
                    if (res.code == 1) {
                        this.province = res.data
                    }
                })
            }

            if (this.value.provinceId) {
                shopMoveIn.locationCities(this.value.provinceId).then((res) => {
                    if (res.code == 1) {
                        this.city = res.data
                    }
                })
            }
            if (this.value.cityId) {
                shopMoveIn.locationAreas(this.value.cityId).then((res) => {
                    if (res.code == 1) {
                        this.area = res.data
                    }
                })
            }
        },
        chooseProvinces(e) {
            shopMoveIn.locationCities(e).then((res) => {
                if (res.code == 1) {
                    this.city = res.data
                    this.area = []
                    this.value.cityId = ''
                    this.value.areaId = ''
                }
            })
        },
        chooseCity(e) {
            shopMoveIn.locationAreas(e).then((res) => {
                if (res.code == 1) {
                    this.area = res.data
                    this.value.areaId = ''
                }
            })
        },
        chooseArea(e) {
            this.value.areaId = e
        }
    }
}
</script>

<style scoped>
.empty {
    text-align: center;
    padding: 80px 0;
}
.empty p {
    line-height: 1;
    margin: 0;
    margin-bottom: 20px;
}
</style>
