<template>
    <section class="formWarp pr-20">
        <el-form ref="form" :model="model" label-width="132px" size="small" @submit.native.prevent>
            <el-form-item v-if="model.norms">
                <span slot="label">
                    商品规格
                    <el-tooltip placement="right">
                        <i class="el-icon-question font-16 text-000 opacity-3"></i>
                        <div slot="content" class="line-h-lg">
                            注：
                            <br />
                            一、商品规格，可使用平台提供的规格，也可自定义规格。自定义规格最多不可超过四组；
                            <br />
                            二、新增规格值时，‘:’和‘;’是系统特殊字符，使用的话会强行转为中文符号。
                        </div>
                    </el-tooltip>
                    ：
                </span>

                <div class="text-333">
                    平台提供规格：（注意：一、需要勾选后才能编辑使用，可增加自定义的规格值；二、重新选择上面的【商品类目】后，【商品规格】数据将会重置）
                </div>
                <!--  平台规格 -->
                <el-table
                    v-if="resultList && resultList.length"
                    ref="multipleTable"
                    :key="tableKey"
                    :data="resultList"
                    tooltip-effect="dark"
                    size="mini"
                    :header-row-style="{ background: '#F5F7FA' }"
                    style="width: 900px"
                    row-key="id"
                    border
                >
                    <el-table-column width="200">
                        <template slot="header">
                            <el-row type="flex" align="middle" justify="center">
                                规格名
                                <el-tooltip placement="right">
                                    <i class="el-icon-question font-16 text-000 opacity-3 v-middle ml-5"></i>
                                    <div slot="content" class="line-h-lg">图片规格需选取一个图片类型的主规格</div>
                                </el-tooltip>
                            </el-row>
                        </template>
                        <template slot-scope="scope">
                            <el-row type="flex" align="middle" justify="center">
                                <el-radio v-model="value.mainSpecificationId" class="line-clamp1" :label="scope.row.id" style="margin-right: 5px">
                                    {{ scope.row.propName }}
                                </el-radio>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格值">
                        <template slot-scope="scope">
                            <el-form-item class="con-mb-0">
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
                                                        @click.stop="delCustomNorms(scope.row.prodPropList, index, scope.row)"
                                                    ></i>
                                                </el-option>
                                            </el-select>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-row v-if="!isLookInfo" type="flex" align="middle">
                                            <i
                                                v-if="!scope.row.showInput"
                                                class="el-icon-circle-plus-outline font-20 mr-10 text-blue cursor-pointer"
                                                @click="showInput(scope.row, scope.$index, resultList)"
                                            ></i>
                                            <el-input
                                                v-model="scope.row.addName"
                                                style="transition: all 1s; overflow: hidden"
                                                :style="{ width: scope.row.showInput ? '200px' : '0px' }"
                                                maxlength="50"
                                                show-word-limit
                                            >
                                                <div slot="suffix">
                                                    <i class="el-icon-success text-blue font-18 cursor-pointer" @click="adds(scope.row)"></i>
                                                    <i class="el-icon-error font-18 cursor-pointer" @click="close(scope.row)"></i>
                                                </div>
                                            </el-input>
                                        </el-row>
                                    </el-col>
                                </el-row>
                                <div v-if="value.mainSpecificationId == scope.row.id && normsStyle != 'TXT'" class="mt-20 position-relative">
                                    <el-button
                                        v-if="!isLookInfo && curRowSelect(scope.row)"
                                        class="flex-end position-absolute right-0 top-0 zindex-2"
                                        type="primary"
                                        plain
                                        size="small"
                                        @click.stop="clearNorms(scope.row.prodPropList)"
                                    >
                                        清空
                                    </el-button>
                                    <el-form ref="forms" :key="num" :model="scope.row" label-width="80px" size="small">
                                        <template v-for="(item, index) in scope.row.prodPropList">
                                            <el-form-item
                                                v-if="item.selectFlag"
                                                :key="index"
                                                :rules="{ type: 'array', required: true, message: '请上传规格图片', trigger: 'change' }"
                                                :prop="'prodPropList.' + index + '.imgList'"
                                                class="text-left table-form"
                                            >
                                                <span slot="label" class="line-clamp2" :title="item.name">{{ item.name }}</span>
                                                <imgCenter
                                                    v-if="!isLookInfo"
                                                    v-model="item.imgList"
                                                    mult
                                                    :limit="5"
                                                    :upload-style="{ width: '50px', height: '50px' }"
                                                    @input="$refs.forms.validateField('prodPropList.' + index + '.imgList')"
                                                ></imgCenter>
                                                <template v-else-if="item.imgList.length">
                                                    <ls-image
                                                        v-for="item in item.imgList"
                                                        :key="item"
                                                        :src="item"
                                                        :options="{ w: 50, h: 50 }"
                                                    ></ls-image>
                                                </template>
                                                <template v-else>无图片</template>
                                            </el-form-item>
                                        </template>
                                    </el-form>
                                </div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" class="mt-15">
                    <el-button v-if="!isLookInfo" type="primary" plain size="small" @click="openDialogNormsTemplate">选择自定义规格</el-button>
                </el-row>
            </el-form-item>
        </el-form>
        <dialogNormsTemplate
            :key="1"
            ref="dialogNormsTemplate"
            :norms-mul-sels.sync="normsMulSels"
            @templateDataChange="templateDataChange"
        ></dialogNormsTemplate>
    </section>
</template>
<script>
import { addGood } from '@/api/ModuleGoods'
import dialogNormsTemplate from './dialogNormsTemplate'
import { specifications } from '@/api/ModuleGoods'
import eventBus from '@/store/eventBus.js'
export default {
    components: {
        dialogNormsTemplate
    },

    props: {
        categoryId: {
            type: [String, Number, Array]
            // required:true
        },
        normsStyle: {
            type: [String, Number]
        },
        value: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            mainNorms: '',
            tableKey: 0,
            normsTable: [],
            normsCustomTable: [],
            skuList: [],
            normsMulSels: [],
            model: {
                norms: 1
            },
            speckList: [],
            num: 0, //用来解决点击【清空】后，数据更新了，但页面却没渲染成功的问题
            allowEdit: false
        }
    },
    computed: {
        speckListTem() {
            return this.getSelectNorms(this.resultList)
        },
        resultList() {
            let arr = this.normsTable.concat(this.normsCustomTable)
            return this.$utils.array.delRepeat(arr, 'id') // 数组去重
        },
        // 当前多规格是否有勾选 有勾选才出现清空按钮
        curRowSelect() {
            return (row) => {
                return row.prodPropList.some((item) => item.selectFlag)
            }
        },
        isLookInfo() {
            return this.$route.query.isLookInfo ? true : false
        }
    },
    watch: {
        speckListTem: {
            handler(newVal) {
                this.$emit('speckListChange', newVal)
            },
            // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
            immediate: true
        },
        //商品类目
        categoryId: {
            handler(newVale) {
                //初始化数据
                if (this.$route.query.isDraft + '' == 'true') {
                    this.normsTable = this.initData(this.value.specificationList).map((item) => {
                        return { ...item, selectList: [] }
                    })
                    this.normsCustomTable = this.initData(this.value.specificationList, 'USER').map((item) => {
                        return { ...item, selectList: [] }
                    })
                    if (!this.value.mainSpecificationId && this.resultList.length > 0) {
                        this.value.mainSpecificationId = this.resultList[0].id
                    }
                    // 回选
                    this.$nextTick(() => {
                        this.setSelectList(this.resultList)
                    })
                    return
                }
                if (newVale && newVale[newVale.length - 1]) {
                    this.value.mainSpecificationId = undefined
                    addGood
                        .querySpecifivationByCategoryId(newVale[newVale.length - 1], {
                            productId: this.$route.query.productId && !this.allowEdit ? this.$route.query.productId : null
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                //初始化数据
                                this.normsTable = this.initData(res.data).map((item) => {
                                    return { ...item, selectList: [] }
                                })
                                //初始化数据
                                this.normsCustomTable = this.initData(res.data, 'USER').map((item) => {
                                    return { ...item, selectList: [] }
                                })
                                // this.tableKey++
                                //默认选中第一个规格
                                if (!this.value.mainSpecificationId && this.resultList.length > 0) {
                                    this.value.mainSpecificationId = this.resultList[0].id
                                }
                                // 回选
                                this.$nextTick(() => {
                                    this.setSelectList(this.resultList)
                                })
                            }
                        })
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        eventBus.$on('allowEdit', (value) => {
            // console.log('进allowEdit了：',value)
            this.allowEdit = value
        })
        this.getSkuList()
    },
    methods: {
        // 回选
        setSelectList(arr) {
            arr.forEach((item) => {
                item.prodPropList.forEach((item1) => {
                    if (item1.selectFlag && item1.id) {
                        item.selectList.push(item1.id)
                    }
                })
            })
        },
        //数据初始化,需要把添加imgList属性数组
        // source
        initData(list, type = 'SYS') {
            let resultList = []
            list.forEach((item) => {
                item.showInput = false
                if (item.source == type) {
                    resultList.push(item)
                }
                item.prodPropList.forEach((childItem) => {
                    if (!childItem.imgList) {
                        if (childItem.pic) {
                            childItem.imgList = [childItem.pic]
                        } else {
                            childItem.imgList = []
                        }
                    }
                })
            })
            return resultList
        },
        //模板选择提交
        templateDataChange() {
            specifications.getByIds({ ids: this.normsMulSels.join(',') }).then((res) => {
                if (res.code == 1) {
                    let newNorms = this.initData(res.data, 'USER')
                    newNorms.forEach((item) => {
                        let sameValue = this.normsCustomTable.find((oldNorm) => oldNorm.id == item.id)
                        if (sameValue) {
                            item.prodPropList = sameValue.prodPropList
                        }
                    })
                    this.$nextTick(() => {
                        this.normsCustomTable = newNorms.map((item) => {
                            return { ...item, selectList: [] }
                        })
                        if (!this.value.mainSpecificationId) {
                            this.value.mainSpecificationId = this.resultList[0].id
                        }
                    })
                }
            })
        },
        //打开规格模板
        openDialogNormsTemplate() {
            this.normsMulSels = this.normsCustomTable.map((item) => item.id)
            this.$refs['dialogNormsTemplate'].showDialog()
        },
        //显示input
        showInput(row, index, list) {
            // type custom 自定义 platform
            this.$nextTick(() => {
                list.forEach((item) => {
                    if (item.id == row.id) {
                        item.showInput = true
                    } else {
                        item.showInput = false
                    }
                })
                this.$refs.multipleTable.doLayout()
            })
        },
        //清除当前行的规格
        close(row) {
            row.addName = ''
            row.showInput = false
        },
        //添加当前行的规格
        adds(row) {
            if (!row.addName) return
            // addGood.userPropertyValueId({propId:row.id,name:row.addName}).then(res=>{
            addGood.userPropertyValueId({ propId: row.id }).then((res) => {
                row.prodPropList.push({
                    customValue: true,
                    name: row.addName,
                    id: res.data,
                    selectFlag: false,
                    propId: row.id,
                    imgList: []
                })
                row.addName = ''
                row.showInput = false
                this.$refs[row.id].toggleMenu()
            })
        },
        delCustomNorms(list, index, item) {
            item.selectList = item.selectList.filter((item) => item != list[index].id)
            list.splice(index, 1)
            this.getSkuList()
        },
        changeSelect(item, event) {
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
                setTimeout(() => {
                    this.getSkuList()
                }, 500)
            })
        },
        //初始化sku
        getSkuList() {
            this.skuList = []
            let skuArray = []
            //将勾选的平台规格和自定义规格筛选并
            this.getSelectNorms(this.resultList).forEach((item) => {
                skuArray.push(item.prodPropList)
            })
            //将勾选的平台规格和自定义规格筛选
            this.speckList = this.getSelectNorms(this.resultList)
            if (skuArray && skuArray.length) {
                this.getSkuData([], [], 0, skuArray)
            } else {
                this.skuList = []
            }
            this.$emit('skuChange', this.skuList, this.speckList, this.getSelectComNorms(this.resultList))
        },
        // 递归获取每条SKU数据
        getSkuData(skuArr = [], nameArr = [], i, list) {
            for (let j = 0; j < list[i].length; j++) {
                if (i < list.length - 1) {
                    skuArr[i] = list[i][j]['propId'] + ':' + list[i][j]['id']
                    // 如果规格名字上带有特殊字符;和:,则强行转换为中文符号
                    nameArr[i] =
                        this.speckList[i]['propName'].replace(/\:/g, '：').replace(/\;/g, '；') +
                        ':' +
                        list[i][j]['name'].replace(/\:/g, '：').replace(/\;/g, '；')
                    this.getSkuData(skuArr, nameArr, i + 1, list) // 递归循环
                } else {
                    // 如果规格名字上带有特殊字符;和:,则强行转换为中文符号
                    let cnProperties =
                        this.speckList[i]['propName'].replace(/\:/g, '：').replace(/\;/g, '；') +
                        ':' +
                        list[i][j]['name'].replace(/\:/g, '：').replace(/\;/g, '；')
                    this.skuList.push({
                        properties: [...skuArr, list[i][j]['propId'] + ':' + list[i][j]['id']].join(';'),
                        cnProperties: [...nameArr, cnProperties].join(';'),
                        name: '',
                        price: '',
                        costPrice: '',
                        originalPrice: '',
                        actualStocks: '',
                        partyCode: '',
                        modelId: '',
                        volume: '',
                        pic: '',
                        weight: ''
                    })
                }
            }
        },
        // 获取选中的商品参数
        getSelectNorms(normsList) {
            let resultList = []
            normsList.forEach((item) => {
                if (findSelectChild(item.prodPropList) && findSelectChild(item.prodPropList).length) {
                    resultList.push({ id: item.id, source: item.source, propName: item.propName, prodPropList: findSelectChild(item.prodPropList) })
                }
            })
            return resultList
            function findSelectChild(list) {
                return list.reduce(function (prev, item) {
                    if (item.selectFlag) {
                        prev.push(item)
                    }
                    return prev
                }, [])
            }
        },
        // 获取用户自定义“平台”规格选中参数
        getSelectComNorms(normsList = []) {
            let resultList = []
            normsList.forEach((item) => {
                if (findSelectChild(item.prodPropList) && findSelectChild(item.prodPropList).length) {
                    resultList.push({ id: item.id, prodPropList: findSelectChild(item.prodPropList) })
                }
            })
            return resultList
            function findSelectChild(list) {
                return list.reduce(function (prev, item) {
                    if (item.selectFlag && item.customValue) {
                        prev.push({ id: item.id, name: item.name })
                    }
                    return prev
                }, [])
            }
        },
        //获取主规格上传的图片
        getMainNormsImg(resultList = []) {
            let mainImg = resultList.find((item) => item.id == this.value.mainSpecificationId)
            return findSelectImg(mainImg.prodPropList)
            function findSelectImg(list) {
                return list.reduce(function (prev, item, index) {
                    if (item.selectFlag) {
                        prev.push({ valueId: item.id, propId: item.propId, valueName: item.name, imgList: item.imgList, seq: index })
                    }
                    return prev
                }, [])
            }
        },
        clearNorms(list) {
            list.forEach((item) => {
                item.imgList = []
                this.$set(item, 'imgList', [])
            })
            this.num++
        },
        confirm(callback) {
            if (this.value.mainSpecificationId) {
                const curMainSelected = this.resultList.find((item) => item.id == this.value.mainSpecificationId)
                if (!this.curRowSelect(curMainSelected)) {
                    this.$scrollIntoView(this.$refs.form)
                    callback(false)
                    return this.$message.error('请在当前勾选的主规格里至少勾选一个规格值')
                }
                this.$refs['forms'].validate((valid) => {
                    if (valid) {
                        let img = this.getMainNormsImg(this.resultList)
                        callback(true, img)
                    } else {
                        this.$scrollIntoView(this.$refs.forms)
                        callback(false)
                    }
                })
            } else {
                this.$scrollIntoView(this.$refs.form)
                this.$message.error('多规格有图模式必须选择一个图片规格')
                callback(false)
            }
        }
    }
}
</script>

<style scoped lang="scss">
// 规格值超出两行...,但前面的*会强行换行,所以要加入display:flex
::v-deep .table-form {
    .el-form-item__label {
        display: flex;
    }
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

::v-deep .con-mb-0 {
    &.el-form-item--small.el-form-item {
        margin-bottom: 0px !important;
    }
}
</style>
