<!-- /*
 * @Descripttion:参数管理 - 新增/编辑
*/ -->
<template>
    <section class="formWarp sku-data">
        <el-card shadow>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
                <el-form-item label="模板名称" prop="transName">
                    <el-input v-model="form.transName" maxlength="20" class="w-450p" />
                </el-form-item>
                <el-form-item label="是否包邮" prop="freeFlag">
                    <el-switch v-model="form.freeFlag"></el-switch>
                </el-form-item>
                <!-- 包邮 -->
                <template v-if="form.freeFlag">
                    <el-form-item label="区域限售">
                        <el-table
                            tooltip-effect="dark"
                            size="mini"
                            border
                            :data="form.locationSalesTemp"
                            :header-cell-style="{ background: '#fafafa' }"
                        >
                            <el-table-column prop="area" label="地区(选择可支持销售的地区)" align="center">
                                <template slot-scope="scope">
                                    <div class="d-flex a-center j-center">
                                        <span v-if="scope.row.area">{{ scope.row.area }}</span>
                                        <el-link
                                            v-else
                                            :underline="false"
                                            type="primary"
                                            @click="editSelect('locationSalesTemp', scope.row, scope.$index)"
                                        >
                                            选择地区
                                        </el-link>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="操作" align="center"  width="200">
                                <template slot-scope="scope">
                                    <el-link :underline="false" type="primary" @click="editSelect('locationSalesTemp', scope.row, scope.$index)">
                                        编辑
                                    </el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </template>
                <!-- //没有包邮 -->
                <template v-else>
                    <el-form-item label="计费方式" prop="transType">
                        <el-radio-group v-model="form.transType">
                            <el-radio label="1">按件数</el-radio>
                            <el-radio label="2">按重量</el-radio>
                            <el-radio label="3">按体积</el-radio>
                            <el-radio label="4">固定运费</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="运费计算">
                        <!-- 非固定运费 -->
                        <el-table
                            v-if="form.transType != 4"
                            :key="1"
                            :span-method="transFeeSpanMethod"
                            tooltip-effect="dark"
                            size="mini"
                            border
                            :data="form.transFeeDTOList"
                            :header-cell-style="{ background: '#fafafa' }"
                        >
                            <el-table-column prop="area" label="地区" align="center" width="500">
                                <template slot-scope="scope">
                                    {{ scope.row.area }}
                                </template>
                            </el-table-column>
                            <el-table-column label="首重/体积/件" align="center">
                                <template slot="header">
                                    <el-row type="flex" align="middle" justify="center">
                                        <i class="text-danger font-18 v-middle">*</i>
                                        <div class="flex-shrink mr-3 ml-3">{{ labelTitle(form.transType) }}</div>
                                    </el-row>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'transFeeDTOList.' + scope.$index + '.firstNum'"
                                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                                    >
										<lsInput v-model="scope.row.firstNum" :precision="form.transType==1?2:3" :min="0" :max="999999"/>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="运费(元)" align="center">
                                <template slot="header">
                                    <el-row type="flex" align="middle" justify="center">
                                        <i class="text-danger font-18 v-middle">*</i>
                                        <div class="flex-shrink mr-3 ml-3">运费(元)</div>
                                    </el-row>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'transFeeDTOList.' + scope.$index + '.firstPrice'"
                                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                                    >
										<lsInput v-model="scope.row.firstPrice" :precision="2" :min="0" :max="999999"/>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="续重/体积/件" align="center">
                                <template slot="header">
                                    <el-row type="flex" align="middle" justify="center">
                                        <i class="text-danger font-18 v-middle">*</i>
                                        <div class="flex-shrink mr-3 ml-3">{{ labelTitle(form.transType, false) }}</div>
                                    </el-row>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'transFeeDTOList.' + scope.$index + '.addNum'"
                                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                                    >
										<lsInput v-model="scope.row.addNum" :precision="form.transType==1?2:3" :min="0" :max="999999"/>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="运费(元)" align="center">
                                <template slot="header">
                                    <el-row type="flex" align="middle" justify="center">
                                        <i class="text-danger font-18 v-middle">*</i>
                                        <div class="flex-shrink mr-3 ml-3">运费(元)</div>
                                    </el-row>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'transFeeDTOList.' + scope.$index + '.addPrice'"
                                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                                    >
										<lsInput v-model="scope.row.addPrice" :precision="2" :min="0" :max="999999"/>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="操作" align="center"  width="200">
                                <template slot-scope="scope">
                                    <template v-if="scope.$index + 1 != form.transFeeDTOList.length">
                                        <el-link :underline="false" type="primary" @click="delTypeList('transFeeDTOList', scope.$index)">
                                            删除
                                        </el-link>
                                        <el-link :underline="false" type="primary" @click="editSelect('transFeeDTOList', scope.row, scope.$index)">
                                            编辑
                                        </el-link>
                                    </template>
                                    <template v-else>
                                        <el-link :underline="false" type="primary" @click="addSelect('transFeeDTOList')">选择地区</el-link>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 固定运费 -->
                        <el-table
                            v-else
                            :key="2"
                            tooltip-effect="dark"
                            size="mini"
                            border
                            :span-method="transConstSpanMethod"
                            :data="form.transConstFeeDTOList"
                            :header-cell-style="{ background: '#fafafa' }"
                        >
                            <el-table-column prop="area" label="地区" align="center" width="500">
                                <template slot-scope="scope">
                                    {{ scope.row.area }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="每张订单固定运费（元）" align="center">
                                <template slot="header">
                                    <el-row type="flex" align="middle" justify="center">
                                        <i class="text-danger font-18 v-middle">*</i>
                                        <div class="flex-shrink mr-3 ml-3">每张订单固定运费（元）</div>
                                    </el-row>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'transConstFeeDTOList.' + scope.$index + '.constantPrice'"
                                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                                    >
                                        <el-input v-model="scope.row.constantPrice" placeholder=">=0.00" />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="操作" align="center"  width="200">
                                <template slot-scope="scope">
                                    <template v-if="scope.$index + 1 != form.transConstFeeDTOList.length">
                                        <el-link :underline="false" type="primary" @click="delTypeList('transConstFeeDTOList', scope.$index)">
                                            删除
                                        </el-link>
                                        <el-link
                                            :underline="false"
                                            type="primary"
                                            @click="editSelect('transConstFeeDTOList', scope.row, scope.$index)"
                                        >
                                            编辑
                                        </el-link>
                                    </template>
                                    <template v-else>
                                        <el-link :underline="false" type="primary" @click="addSelect('transConstFeeDTOList')">选择地区</el-link>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>

                    <!-- /条件包邮 -->
                    <el-form-item v-if="form.transType != 4" label="条件包邮" prop="conditionFreeFlag">
                        <el-switch v-model="form.conditionFreeFlag"></el-switch>
                        <el-form-item v-if="form.conditionFreeFlag">
                            <el-table
                                tooltip-effect="dark"
                                size="mini"
                                :span-method="transFreeSpanMethod"
                                border
                                :data="form.transFreeDTOList"
                                :header-cell-style="{ background: '#fafafa' }"
                            >
                                <el-table-column prop="area" label="地区" align="center" />
                                <el-table-column prop="name" label="操作" align="center" >
                                    <template slot="header">
                                        <div class="d-flex a-center j-center">
                                            <i class="text-danger font-18 v-middle mr-10">*</i>
                                            <el-form-item prop="transFreeType" style="margin-bottom: 0">
                                                <el-radio-group v-model="form.transFreeType">
                                                    <div>
                                                        <el-radio :label="2">满额包邮（设置包邮金额）</el-radio>
                                                    </div>
                                                    <div>
                                                        <el-radio :label="1">满件包邮（设置包邮件数）</el-radio>
                                                    </div>
                                                </el-radio-group>
                                            </el-form-item>
                                        </div>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="'transFreeDTOList.' + scope.$index + '.number'"
                                            :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                                        >
                                            <el-input v-model="scope.row.number" placeholder=">=0.00" />
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" label="操作" align="center"  width="200">
                                    <template slot-scope="scope">
                                        <template v-if="scope.$index + 1 != form.transFreeDTOList.length">
                                            <el-link :underline="false" type="primary" @click="delTypeList('transFreeDTOList', scope.$index)">
                                                删除
                                            </el-link>
                                            <el-link
                                                :underline="false"
                                                type="primary"
                                                @click="editSelect('transFreeDTOList', scope.row, scope.$index)"
                                            >
                                                编辑
                                            </el-link>
                                        </template>
                                        <template v-else>
                                            <el-link :underline="false" type="primary" @click="addSelect('transFreeDTOList')">选择地区</el-link>
                                        </template>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="onCancel">取消</el-button>
                    <ls-button type="primary" :asyncFunction="onSubmit">确定</ls-button>
                </el-form-item>
            </el-form>
        </el-card>
        <dialogAreaSelect
            ref="dialogAreaSelect"
            :current-all-list="currentAllList"
            :template-list="templateList"
            @dialogAreaSelect="dialogAreaChange"
        ></dialogAreaSelect>
    </section>
</template>

<script>
import { freightTemplate } from '@/api/ModuleSystem'
import dialogAreaSelect from './components/dialogAreaSelect.vue'

export default {
    name:'freightAdd',
    components: {
        dialogAreaSelect,
    },
    data() {
        return {
            id: '', //当前页面的id
            form: {
                id: '',
                status: 1,
                transName: '', //运费模板名称
                transType: '1', //运费类型
                freeFlag: false, //是否包邮
                regionalSalesFlag: '', // 是否区域限售0，不支持，1，支持
                chooseAreaFlag: '', // 指定地区设置运费，0：关闭 1：开启
                conditionFreeFlag: false, // 条件包邮 false：关闭 true：开启
                locationRestrictedSalesList: [{}], //包邮情况下的区域限售 选中的省市 provinceList
                locationSalesTemp: [
                    // 固定运费
                    {
                        area: '',
                        provinceList: []
                    }
                ],
                transConstFeeDTOList: [{}], // 固定运费
                transFeeDTOList: [{}], // 运费计算
                transFreeType: 1, // 1、满件包邮 2、满金额包邮
                transFreeDTOList: [{}] // 条件包邮
            },
            templateList: [], //当前选择运费模板
            currentIndex: 0, //当前选择运费模板index
            rules: {
                transName: [
                    {
                        required: true,
                        message: '运费模板不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            dialogEdit: false, //是否修改地区
            isEdit: false,
            listType: 'transConstFeeDTOList'
        }
    },
    computed: {
        currentAllList() {
            let resultList = []
            if (this.form[this.listType]) {
                this.form[this.listType].forEach((item) => {
                    if (item.provinceList) {
                        resultList.push(...item.provinceList)
                    }
                })
            }
            return resultList
        },
        labelTitle() {
            return function (state, flag = true) {
                const stateText = {
                    1: flag ? '首件' : '续件',
                    2: flag ? '首重/KG' : '续重/KG',
                    3: flag ? '首体积/L' : '续体积/L',
                    4: flag ? '首重/体积/件' : '续重/体积/件'
                }
                return stateText[state]
            }
        }
    },
    created() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id
            this.isEdit = true
            this.getDetail(this.id)
        } else {
            this.isEdit = false
        }
    },
    mounted() {},
    methods: {
        getDetail(id) {
            freightTemplate.transportDet(id).then((res) => {
                if (res.code) {
                    this.form = res.data
                    if (res.data.transFeeDTOList) {
                        let tempList = res.data.transFeeDTOList.push({})
                        this.$set(this.form, 'transFeeDTOList', res.data.transFeeDTOList)
                    } else {
                        this.$set(this.form, 'transFeeDTOList', [{}])
                    }
                    if (res.data.transFreeDTOList) {
                        let tempList = res.data.transFreeDTOList.push({})
                        this.$set(this.form, 'transFreeDTOList', res.data.transFreeDTOList)
                    } else {
                        this.$set(this.form, 'transFreeDTOList', [{}])
                    }

                    if (res.data.transConstFeeDTOList) {
                        let tempList = res.data.transConstFeeDTOList.push({})
                        this.$set(this.form, 'transConstFeeDTOList', res.data.transConstFeeDTOList)
                    } else {
                        this.$set(this.form, 'transConstFeeDTOList', [{}])
                    }
                    this.$set(this.form, 'locationRestrictedSalesList', res.data.locationRestrictedSalesList || [])
                    this.$set(this.form, 'locationSalesTemp', [
                        {
                            area: res.data.area,
                            provinceList: res.data.locationRestrictedSalesList || []
                        }
                    ])
                }
            })
        },
        //合并运费模板
        transFeeSpanMethod({ rowIndex, columnIndex }) {
            if (rowIndex + 1 == this.form.transFeeDTOList.length) {
                if (columnIndex === 5) {
                    return [1, 6]
                } else {
                    return [0, 0]
                }
            }
        },
        //合并运费模板
        transConstSpanMethod({ rowIndex, columnIndex }) {
            if (rowIndex + 1 == this.form.transConstFeeDTOList.length) {
                if (columnIndex === 2) {
                    return [1, 3]
                } else {
                    return [0, 0]
                }
            }
        },
        //合并运费模板
        transFreeSpanMethod({ rowIndex, columnIndex }) {
            if (rowIndex + 1 == this.form.transFreeDTOList.length) {
                if (columnIndex === 2) {
                    return [1, 3]
                } else {
                    return [0, 0]
                }
            }
        },
        //在选择地址前多加一行
        addLast(listType) {
            this.form[listType].splice(this.form[listType].length - 1, 0, {})
        },
        //获取省市地区名字
        getName(templateList) {
            let name = ''
            templateList.forEach((item) => {
                if (item.selectFlag) {
                    name += item.name + '(全省)、'
                } else {
                    name += item.name + '('
                    item.children.forEach((childItem, index) => {
                        if (item.children.length - 1 == index) {
                            name += childItem.name + ')、'
                            return
                        }
                        name += childItem.name + '、'
                    })
                }
            })
            // 删除最后一个'、'
            name = name.substr(0, name.length - 1)
            return name
        },
        //运费模板弹窗地区改变
        dialogAreaChange(templateList) {
            //如果是修改弹窗确定
            if (this.dialogEdit) {
                this.$set(this.form[this.listType][this.currentIndex], 'area', this.getName(templateList))
                this.$set(this.form[this.listType][this.currentIndex], 'provinceList', templateList)
            } else {
                this.form[this.listType].splice(this.form[this.listType].length - 1, 0, {
                    provinceList: templateList,
                    area: this.getName(templateList)
                })
            }
        },
        //修改运费模板，打开弹窗
        editSelect(listType, item, index) {
            this.dialogEdit = true
            this.currentIndex = index
            this.templateList = item.provinceList
            this.listType = listType
            this.$nextTick(() => {
                this.$refs.dialogAreaSelect.showDialog()
            })
        },
        //添加运费模板
        addSelect(listType) {
            this.dialogEdit = false
            this.templateList = []
            this.listType = listType
            this.$nextTick(() => {
                this.$refs.dialogAreaSelect.showDialog()
            })
        },
        //删除类型
        delTypeList(listType, index) {
            this.form[listType].splice(index, 1)
        },
        // 提交
        onSubmit() {
            return new Promise(resolve=>{
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.form.locationSalesTemp && this.form.locationSalesTemp.length) {
                            this.form.locationRestrictedSalesList = this.form.locationSalesTemp[0].provinceList
                            this.form.area = this.form.locationSalesTemp[0].area
                        }
                        freightTemplate[this.isEdit ? 'transportEdit' : 'transportAdd'](this.form).then((res) => {
                            if (res.code) {
                                // 如果选择包邮或者固定运费
                                if (this.form.freeFlag || this.form.transType == '4') {
                                    let transQueryType = ''
                                    this.form.freeFlag ? (transQueryType = 3) : (transQueryType = 2)
                                    // 保存参数以便返回查询
                                    sessionStorage.setItem('type', transQueryType)
                                }
                                setTimeout(() => {
                                    this.$router.push({
                                        name: 'freightTemplate'
                                    })
                                }, 1500)
                            }
                        }).finally(_=>{
                            resolve()
                        })
                    }else{
                        resolve()
                    }
                })
            })
        },

        // 取消返回上一个路由
        onCancel() {
            this.$router.push({
                name: 'freightTemplate'
            })
        }
    }
}
</script>
