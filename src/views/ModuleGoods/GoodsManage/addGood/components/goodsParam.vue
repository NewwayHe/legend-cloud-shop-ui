<template>
    <section class="formWarp pl-20 pr-20">
        <el-form ref="form" class="table-form" label-width="120px" size="small">
            <section class="formWarp">
                <el-form ref="form" label-width="132px" size="small">
                    <el-form-item label="商品参数：">
                        <div class="text-999 font-main">商品参数，可使用平台提供的参数，也可自定义参数。自定义参数最多不可超过五组。</div>
                        <div class="text-333">平台提供的参数，可增加自定义的参数值</div>

                        <div class="overflow-h" :style="{ height: isOpen ? '' : '0px' }">
                            <el-table
                                v-if="resultList && resultList.length"
                                ref="multipleTable"
                                :data="resultList"
                                tooltip-effect="dark"
                                size="mini"
                                style="width: 900px"
                                border
                            >
                                <el-table-column width="200" label="参数名" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item>{{ scope.row.propName }}</el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="参数值" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-row type="flex" align="middle">
                                                <el-col class="" :span="16">
                                                    <el-row type="flex" class="flex-wrap">
                                                        <el-select
                                                            :ref="scope.row.id"
                                                            v-model="scope.row.selectList"
                                                            class="w-100 mr-15"
                                                            multiple
                                                            placeholder="请选择"
                                                            @change="changeSelect(scope.row, $event)"
                                                        >
                                                            <el-option
                                                                v-for="(item, index) in scope.row.prodPropList"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id"
                                                            >
                                                                <span style="float: left">{{ item.name }}</span>
                                                                <i
                                                                    v-if="item.customValue"
                                                                    class="el-icon-error text-ccc font-16 ml-15 main-hover"
                                                                    @click.stop="delCustomParam(scope.row.prodPropList, index, scope.row)"
                                                                ></i>
                                                            </el-option>
                                                        </el-select>
                                                    </el-row>
                                                </el-col>
                                                <!-- v-if="scope.row.source=='SYS'" -->
                                                <el-col :span="8">
                                                    <el-row v-if="!isLookInfo" type="flex" align="middle">
                                                        <i
                                                            v-if="!scope.row.showInput"
                                                            class="el-icon-circle-plus-outline font-20 mr-10 text-blue cursor-pointer"
                                                            @click="showInput(scope.row, scope.$index, resultList)"
                                                        ></i>
                                                        <el-input
                                                            v-model.trim="scope.row.addName"
                                                            style="transition: all 1s; overflow: hidden"
                                                            :style="{ width: scope.row.showInput ? '200px' : '0px' }"
                                                            maxlength="50"
                                                            show-word-limit
                                                        >
                                                            <div slot="suffix">
                                                                <i
                                                                    class="el-icon-success text-blue font-18 cursor-pointer"
                                                                    @click="adds(scope.row)"
                                                                ></i>
                                                                <i class="el-icon-error font-18 cursor-pointer" @click="close(scope.row)"></i>
                                                            </div>
                                                        </el-input>
                                                    </el-row>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button
                                v-if="!isLookInfo"
                                class="mt-15"
                                type="primary"
                                plain
                                size="small"
                                @click="openDialogParamTemplate('dialogParamTemplate')"
                            >
                                增加自定义参数
                            </el-button>
                            <el-table
                                v-if="customResultList && customResultList.length"
                                ref="multipleTable"
                                :data="customResultList"
                                tooltip-effect="dark"
                                size="mini"
                                :header-row-style="{ background: '#F5F7FA' }"
                                :span-method="spanMethodGroup"
                                style="width: 900px"
                                class="mt-15"
                                border
                            >
                                <el-table-column width="200" label="参数组" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item>{{ scope.row.groupName }}</el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column width="200" label="参数" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item>{{ scope.row.propName }}</el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="参数值" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-row type="flex" align="middle">
                                                <el-col :span="24">
                                                    <el-row type="flex" class="flex-wrap">
                                                        <el-select
                                                            v-model="scope.row.selectList"
                                                            class="w-100"
                                                            multiple
                                                            placeholder="请选择"
                                                            @change="changeSelect(scope.row, $event, 'custom')"
                                                        >
                                                            <el-option
                                                                v-for="item in scope.row.prodPropList"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-row>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button
                                v-if="!isLookInfo"
                                class="mt-15"
                                type="primary"
                                plain
                                size="small"
                                @click="openDialogParamTemplate('dialogParamGroup')"
                            >
                                增加自定义参数组
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
                <dialogParamTemplate
                    :key="1"
                    ref="dialogParamTemplate"
                    attribute-type="P"
                    :norms-mul-sels.sync="paramMulSels"
                    @templateDataChange="templateDataChange"
                ></dialogParamTemplate>
                <dialogParamGroup
                    :key="2"
                    ref="dialogParamGroup"
                    :norms-mul-sels.sync="paramGroupMulSels"
                    @templateDataChange="paramGroupChange"
                ></dialogParamGroup>
            </section>
        </el-form>

        <!-- 展开/收起 -->
        <div class="w-100 text-333" :class="isOpen ? '' : 'is-no-open'">
            <div class="m-0-auto text-center cursor-pointer main-hover" style="width: 80px; height: 25px; line-height: 25px" @click="openContent">
                {{ isOpen ? '收起' : '展开' }}
                <span class="iconfont ml-1" :class="isOpen ? 'icon-ArrowUp' : 'icon-ArrowDown'" style="font-size: 14px"></span>
            </div>
        </div>
    </section>
</template>
<script>
import dialogParamTemplate from './components/dialogNormsTemplate'
import dialogParamGroup from './components/dialogParamGroup'
import { addGood } from '@/api/ModuleGoods'
import { specifications, paramGroup } from '@/api/ModuleGoods'
import eventBus from '@/store/eventBus.js'
export default {
    components: {
        dialogParamTemplate,
        dialogParamGroup
    },
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
            paramMulSels: [], //选中参数模板列表
            paramsTable: [], // 平台表格列表
            customParams: [], // 用户表格列表
            paramGroupMulSels: [], //选中参数组模板列表
            paramsGroupTable: [], // 平台组表格列表
            customGroupTable: [], // 用户参数组表格列表
            arrGroup: [], // 参数组跨行
            isOpen: this.$route.query.isLookInfo ? true : false, // 展开/收起
            allowEdit: false
        }
    },
    computed: {
        //参数列表
        resultList() {
            let arr = this.paramsTable.concat(this.customParams)
            return this.$utils.array.delRepeat(arr, 'id') // 数组去重
        },
        //自定义参数列表
        customResultList() {
            let arr = this.paramsGroupTable.concat(this.customGroupTable)
            return this.$utils.array.delRepeat(arr, 'id') // 数组去重
        },
        isLookInfo() {
            return this.$route.query.isLookInfo ? true : false
        }
    },
    watch: {
        'value.globalCategoryId': {
            handler(newVale) {
                if (newVale && newVale[newVale.length - 1]) {
                    if (this.$route.query.isDraft + '' == 'true') {
                        this.paramsTable = this.initData(this.value.paramBOList).map((item) => {
                            return { ...item, selectList: [] }
                        })
                        this.customParams = this.initData(this.value.paramBOList, 'USER').map((item) => {
                            return { ...item, selectList: [] }
                        })
                        this.paramsGroupTable = this.filtterGroupData(this.value.paramGroupBOList).map((item) => {
                            return { ...item, selectList: [] }
                        })
                        this.customGroupTable = this.filtterGroupData(this.value.paramGroupBOList, 'USER').map((item) => {
                            return { ...item, selectList: [] }
                        })
                        // 回选
                        this.$nextTick(() => {
                            this.setSelectList(this.resultList)
                            this.setSelectList(this.customResultList, 'custom')
                        })
                        return
                    }
                    addGood
                        .queryPropertyByCategoryId(newVale[newVale.length - 1], {
                            productId: this.$route.query.productId && !this.allowEdit ? this.$route.query.productId : null
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                this.paramsTable = this.initData(res.data).map((item) => {
                                    return { ...item, selectList: [] }
                                })
                                this.customParams = this.initData(res.data, 'USER').map((item) => {
                                    return { ...item, selectList: [] }
                                })
                                // 回选
                                this.$nextTick(() => {
                                    this.setSelectList(this.resultList)
                                })
                            }
                        })
                    paramGroup
                        .getByCategoryId(newVale[newVale.length - 1], {
                            productId: this.$route.query.productId && !this.allowEdit ? this.$route.query.productId : null
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                this.paramsGroupTable = this.filtterGroupData(res.data).map((item) => {
                                    return { ...item, selectList: [] }
                                })
                                this.customGroupTable = this.filtterGroupData(res.data, 'USER').map((item) => {
                                    return { ...item, selectList: [] }
                                })
                                // 回选
                                this.$nextTick(() => {
                                    this.setSelectList(this.customResultList, 'custom')
                                })
                            }
                        })
                }
            },
            deep: true,
            immediate: true
        }
    },

    mounted() {
        eventBus.$on('allowEdit', (value) => {
            // console.log('进allowEdit了：',value)
            this.allowEdit = value
        })
    },
    methods: {
        changeSelect(item, event, type) {
            this.$nextTick(() => {
                if (item.prodPropList && item.prodPropList.length) {
                    item.prodPropList.forEach((item1) => {
                        if (event.includes(item1.id)) {
                            item1.selectFlag = true
                        } else {
                            item1.selectFlag = false
                        }
                    })
                }
                if (type == 'custom') {
                    this.$nextTick(() => {
                        this.setdates(this.customResultList)
                    })
                }
            })
        },
        // 回选
        setSelectList(arr, type) {
            arr.forEach((item) => {
                item.prodPropList.forEach((item1) => {
                    if (item1.selectFlag && item1.id) {
                        item.selectList.push(item1.id)
                    }
                })
            })
            if (type == 'custom') {
                this.$nextTick(() => {
                    this.setdates(this.customResultList)
                })
            }
        },
        // 筛选参数组规格
        filtterGroupData(list, type = 'SYS') {
            return list.filter((item) => item.source == type)
        },
        //初始化数据
        initData(list, type = 'SYS') {
            let resultList = []
            list.forEach((item) => {
                if (item.source == type) {
                    resultList.push(item)
                }
                item.showInput = false
            })
            return resultList
        },
        //设置参数组跨行数组收集
        setdates(arr) {
            this.arrGroup = []
            var obj = {},
                k
            for (var i = 0, len = arr.length; i < len; i++) {
                k = 'legendshop' + arr[i].groupId
                if (obj[k]) obj[k]++
                else obj[k] = 1
            }
            for (var o in obj) {
                for (let i = 0; i < obj[o]; i++) {
                    if (i === 0) {
                        this.arrGroup.push(obj[o])
                    } else {
                        this.arrGroup.push(0)
                    }
                }
            }
        },
        //设置参数组跨行方法
        spanMethodGroup({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                let _row = this.arrGroup[rowIndex]
                let _col = this.arrGroup[rowIndex] > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        //参数组修改值
        paramGroupChange() {
            paramGroup.getByIds({ ids: this.paramGroupMulSels.join(',') }).then((res) => {
                if (res.code == 1) {
                    let newParamsGroup = this.initData(res.data, 'USER').map((item) => {
                        return { ...item, selectList: [] }
                    })
                    newParamsGroup.forEach((item) => {
                        let sameValue = this.customGroupTable.find((oldNorm) => oldNorm.id == item.id)
                        if (sameValue) {
                            item.prodPropList = sameValue.prodPropList
                        }
                    })
                    this.customGroupTable = newParamsGroup
                    this.$nextTick(() => {
                        this.setdates(this.customResultList)
                    })
                }
            })
        },
        //模板确定
        templateDataChange() {
            specifications.getByIds({ ids: this.paramMulSels.join(',') }).then((res) => {
                if (res.code == 1) {
                    let newParams = this.initData(res.data, 'USER').map((item) => {
                        return { ...item, selectList: [] }
                    })
                    newParams.forEach((item) => {
                        let sameValue = this.customParams.find((oldNorm) => oldNorm.id == item.id)
                        if (sameValue) {
                            item.prodPropList = sameValue.prodPropList
                        }
                    })
                    this.customParams = newParams
                }
            })
        },
        //删除参数
        delCustomParam(list, index, item) {
            item.selectList = item.selectList.filter((item) => item != list[index].id)
            list.splice(index, 1)
        },
        //打开参数
        openDialogParamTemplate(templateType) {
            if (templateType == 'dialogParamTemplate') {
                this.paramMulSels = this.customParams.map((item) => item.id)
            } else {
                this.paramGroupMulSels = this.customGroupTable.map((item) => item.groupId)
            }

            this.$refs[templateType].showDialog()
        },
        showInput(row, index, list) {
            this.$nextTick(() => {
                list.forEach((item) => {
                    if (item.id == row.id) {
                        item.showInput = true
                    } else {
                        item.showInput = false
                    }
                })
            })
        },
        //清除当前行的规格
        close(row) {
            row.addName = ''
            row.showInput = false
        },
        //添加当前行的参数
        adds(row) {
            if (!row.addName) return
            addGood.userPropertyValueId({ propId: row.id }).then((res) => {
                row.prodPropList.push({
                    customValue: true,
                    name: row.addName,
                    id: res.data,
                    propId: row.id
                })
                row.addName = ''
                row.showInput = false
                this.$refs[row.id].toggleMenu()
            })
        },
        // 获取用户自定义“平台”规格选中参数
        getSelectComParams() {
            let list = []
            this.resultList.forEach((item) => {
                if (findSelectChild(item.prodPropList) && findSelectChild(item.prodPropList).length) {
                    list.push({ id: item.id, prodPropList: findSelectChild(item.prodPropList) })
                }
            })
            return list
            function findSelectChild(list) {
                return list.reduce(function (prev, item) {
                    if (item.selectFlag && item.customValue) {
                        prev.push({ id: item.id, name: item.name })
                    }
                    return prev
                }, [])
            }
        },

        // 展开/收起
        openContent() {
            this.isOpen = !this.isOpen
        },

        //提交
        onSubmit() {
            this.value.parameter = JSON.stringify(this.resultList.filter((item) => item.source == 'SYS'))
            this.value.userParameter = JSON.stringify(this.resultList.filter((item) => item.source == 'USER'))
            this.value.paramGroupList = this.customResultList
            let arr = this.value.customPropertyValueList.concat(this.getSelectComParams())
            this.value.customPropertyValueList = this.$utils.array.delRepeat(arr, 'id') //去重
        }
    }
}
</script>

<style scoped lang="scss">
.el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
}
.is-no-open {
    position: relative;
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 80%);
    padding-top: 100px;
    margin-top: -80px; //这个如果设成-100就会挡住上面的商品价格
}

::v-deep .el-select__tags {
    .el-tag.el-tag--info {
        // el-select组件里超出显示...
        .el-select__tags-text {
            max-width: 170px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            word-break: break-all;
        }
        .el-tag__close {
            top: -6px;
        }
    }
}
</style>
