<template>
    <section class="formWarp pl-20 pr-20">
        <!-- 选择商品类目form -->
        <el-form ref="form" :model="value" :rules="rules" label-width="132px" size="small">
            <div class="form-title">基本信息</div>
            <el-form-item prop="globalCategoryId">
                <span slot="label">
                    商品类目
                    <el-tooltip class="item" placement="right">
                        <div slot="content">选择商城设置的商品类目，用户可通过商品类目快速定位商品</div>
                        <i class="el-icon-question font-16 text-000 opacity-3"></i>
                    </el-tooltip>
                    ：
                </span>
                <el-cascader
                    ref="elCascader"
                    v-model="value.globalCategoryId"
                    style="width: 450px"
                    :props="{ label: 'name', value: 'id' }"
                    :options="formCategory"
                    :clearable="!($route.query.productId && !allowEdit)"
                    @visible-change="visibleChange"
                ></el-cascader>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label">
                    商品名称
                    <el-tooltip class="item" placement="right">
                        <div slot="content">用户可通过商品名称快速搜索商品</div>
                        <i class="el-icon-question font-16 text-000 opacity-3"></i>
                    </el-tooltip>
                    ：
                </span>
                <el-input v-model="value.name" class="showLimint" style="width: 450px" maxlength="60" show-word-limit placeholder="请输入" />
            </el-form-item>
            <el-form-item>
                <span slot="label">
                    库存预警值
                    <el-tooltip class="item" placement="right">
                        <div slot="content">当商品库存≤库存预警值时，系统会发送通知</div>
                        <i class="el-icon-question font-16 text-000 opacity-3"></i>
                    </el-tooltip>
                    ：
                </span>
                <lsInput v-model="value.stocksArm" class="w-450p" :min="1" :max="999999" :precision="0" text-align="left" />
            </el-form-item>
            <el-form-item>
                <span slot="label">
                    商品品牌
                    <el-tooltip class="item" placement="right">
                        <div slot="content">选择了【商品类目】后，才可以选择该商品类目对应的品牌</div>
                        <i class="el-icon-question font-16 text-000 opacity-3"></i>
                    </el-tooltip>
                    ：
                </span>
                <el-select v-model="value.brandId" class="w-450p" filterable placeholder="请选择" :disabled="!branchList.length">
                    <el-option v-for="item in branchList" :key="item.value" :label="item.brandName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- 设置其他信息form -->
            <el-form-item>
                <span slot="label">
                    店铺类目
                    <el-tooltip class="item" placement="right">
                        <div slot="content">选择店铺自设的商品类目，用户在该店铺里可通过店铺类目快速定位商品</div>
                        <i class="el-icon-question font-16 text-000 opacity-3"></i>
                    </el-tooltip>
                    ：
                </span>
                <el-cascader
                    :key="key"
                    v-model="value.shopCategoryId"
                    :props="{ label: 'name', value: 'id' }"
                    :options="shopCategoryTree"
                    clearable
                    class="w-450p"
                ></el-cascader>
            </el-form-item>
            <el-form-item>
                <span slot="label">
                    商品卖点
                    <el-tooltip class="item" placement="right">
                        <div slot="content">可用简短的语言描述商品的卖点</div>
                        <i class="el-icon-question font-16 text-000 opacity-3"></i>
                    </el-tooltip>
                    ：
                </span>
                <el-input
                    v-model="value.brief"
                    class="showLimint"
                    maxlength="500"
                    show-word-limit
                    type="textarea"
                    resize="none"
                    :rows="2"
                    style="width: 450px"
                    placeholder="请输入"
                />
                <imgPreview class="ml-10 v-text-bottom" text="手机端示例" :src="require(`@/assets/images/exampleImgs/H5-brief.jpg`)" />
                <imgPreview class="ml-10 v-text-bottom" text="PC端示例" :src="require(`@/assets/images/exampleImgs/pc-brief.jpg`)" />
            </el-form-item>
        </el-form>
    </section>
</template>
<script>
import eventBus from '@/store/eventBus.js'
import { addGood, commodityBrand } from '@/api/ModuleGoods'
export default {
    components: {},
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
            key: 0,
            formCategory: [], //商品类目数据
            rules: {
                name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                globalCategoryId: [{ required: true, message: '请选择商品类目', trigger: 'change' }],
                stocksArm: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }]
            },
            branchList: [],
            shopCategoryTree: [], //类目树
            allowEdit: false
        }
    },
    computed: {
        isLookInfo() {
            return this.$route.query.isLookInfo ? true : false
        }
    },
    watch: {
        'value.globalCategoryId'(newVale) {
            if (newVale && newVale[newVale.length - 1]) {
                this.getBrandList(newVale[newVale.length - 1])
            }
        }
    },

    created() {
        this.getPlatformCategory()
        this.getCategory()
    },
    methods: {
        //获取平台商品类目
        getPlatformCategory() {
            addGood.getPlatformCategory({ parentId: -1 }).then((res) => {
                if (res.code == 1) {
                    this.formCategory = this.$utils.array.getTreeData(res.data)
                }
            })
        },
        onSubmit() {
            return new Promise((resolve) => {
                // 需要验证表单
                let valid1 = null
                this.$refs['form'].validate((valid) => {
                    valid1 = valid
                })
                if (valid1) {
                    resolve(true)
                } else {
                    this.$scrollIntoView(this.$refs.form)
                    resolve(false)
                }
            })
        },
        //获取类目数据
        getCategory() {
            addGood.shopCategory({ status: 3 }).then((res) => {
                // console.log(res)
                if (res.code == 1) {
                    this.shopCategoryTree = this.$utils.array.getTreeData(res.data)
                    this.key++
                    this.$forceUpdate()
                }
            })
        },
        //获取品牌
        getBrandList(id) {
            commodityBrand.queryByCategory(id).then((res) => {
                if (res.code == 1) {
                    this.branchList = res.data
                    this.value.brandId = ''
                }
            })
        },
        visibleChange(e) {
            // 如果是编辑
            if (e && this.$route.query.productId && !this.allowEdit) {
                this.$refs.elCascader.dropDownVisible = false
                this.$confirm('重新选择类目可能会导致当前已填写数据部分丢失，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.allowEdit = true
                        eventBus.$emit('allowEdit', this.allowEdit)
                    })
                    .catch(() => {})
            }
        }
    }
}
</script>

<style scoped lang="scss">
.line {
    text-align: center;
}
.showLimint {
    &::v-deep .el-input__inner {
        padding-right: 45px;
    }
    &::v-deep .el-textarea__inner {
        padding-right: 45px;
    }
}
</style>
