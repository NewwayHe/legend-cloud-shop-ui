<template>
    <section class="formWarp">
        <el-card shadow>
            <el-form ref="form" :model="form" :rules="formRule" label-width="150px" size="small">
                <el-form-item label="类目类型：" prop="grade">
                    <span v-if="form.grade == 1">一级类目</span>
                    <span v-if="form.grade == 2">二级类目</span>
                    <span v-if="form.grade == 3">三级类目</span>
                </el-form-item>
                <el-form-item label="父级：" prop="parentId">
                    <span>{{ form.parentName || '顶级' }}</span>
                    <span class="m-20 mr-0 ml-10 complain--color">父类，即新增类目的上级类目，一个类目只可绑定一个父类</span>
					<imgPreview class="ml-10" :src="require('@/assets/images/exampleImgs/leimu.png')" />
                </el-form-item>
                <el-form-item label="类目名称：" prop="name">
                    <el-input v-model="form.name" class="w-450p" maxlength="6" placeholder="类目标题，最多不能超过6个字符" />
                    <span class="m-20 ml-10 complain--color">类目名称，会显示在用户端给用户查看</span>
                </el-form-item>
                <el-form-item label="排序：" prop="seq">
                    <el-input v-model="form.seq" min="0" type="number" class="w-450p" placeholder="请输入"/>
                    <span class="m-20 ml-10 complain--color">设置类目顺序</span>
                </el-form-item>
                <el-form-item label="状态：" prop="status" class="btn_lastItem">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">上线</el-radio>
                        <el-radio :label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
			<el-row type="flex" justify="center" class="py-10">
				<el-button size="small" @click="onCancel">取消</el-button>
				<ls-button size="small" type="primary" :asyncFunction="onSubmit">
					保存
				</ls-button>
			</el-row>
        </el-card>
    </section>
</template>

<script>
import { category } from '@/api/ModuleGoods'
import IconSelect from '@/components/IconSelect'

export default {
    components: {
        IconSelect
    },
    data() {
        return {
            form: {
                id: '',
                grade: '',
                parentId: '',
                parentName: '', // 父级名称
                name: '',
                seq: '',
                icon: '',
                aggId: '',
                returnValidPeriod: '',
                keyword: '',
                catDesc: '',
                title: '',
                status: 1
            },
            formRule: {
                parentId: [{ required: true }],
                name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                seq: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
                status: [{ required: true, message: '请选择类目状态', trigger: 'blur' }]
            },
            aggList: [], // 规格参数分组数组
            isEdit: false // 编辑标识
        }
    },
    beforeRouteEnter(to, from, next) {
        let status = to.query.status;
        let { text } = from.meta;
        if(status === 'add') {
            to.meta.text = '新增商品类目'   //面包屑
            to.meta.title = text + '/新增商品类目'       //顶部导航栏[黑色区显示]
        }else {
            to.meta.text = '编辑商品类目'
            to.meta.title = text + '/编辑商品类目'
        }

        next()
    },
    mounted() {
        this.form.grade = Number(this.$route.query.grade)
        this.form.parentId = this.$route.query.parentId || -1
        this.form.parentName = this.$route.query.parentName || ''
        if (this.$route.query.status === 'edit') {
            this.isEdit = true
            this.getDetail()
        } else {
            this.isEdit = false
        }
    },
    methods: {
        // 获取详情(编辑时调用)
        getDetail() {
            category
                .detail(this.$route.query.categoryId)
                .then((res) => {
                    console.log(res)
                    this.form = Object.assign({}, this.form, res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取所有规格参数数组
        getAggList() {
            category
                .aggListAll()
                .then((res) => {
                    console.log(res)
                    this.aggList = res.data
                    this.aggList.unshift({ id: '', name: '无' })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 提交
        onSubmit() {
            return new Promise(resolve=>{
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (this.isEdit) {
                            await this.edit()
                        } else {
                            await this.add()
                        }
                        resolve()
                    }else{
                        resolve()
                    }
                })
            })
            
        },

        // 添加
        add() {
            return new Promise(resolve=>{
                category
                .add(this.form)
                .then((res) => {
                    console.log(res)
                    this.$message({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.$router.push({ name: 'commodityCategory' })
                })
                .catch((err) => {
                    console.log(err)
                }).finally(_=>{
                    resolve()
                })
            })
        },

        // 编辑
        edit() {
            return new Promise(resolve=>{
            console.log('test', this.form)
            category
                .edit(this.form)
                .then((res) => {
                    console.log(res)
                    this.$message({
                        message: '编辑成功',
                        type: 'success',
                    })
                    this.$router.push({ name: 'commodityCategory' })
                })
                .catch((err) => {
                    console.log(err)
                }).finally(_=>{
                    resolve()
                })
            })
        },

        // 选择图标
        selected(name) {
            this.form.icon = name
        },

        // 取消
        onCancel() {
            this.$router.push({ name: 'commodityCategory' })
        },

        // 检查图片不能为空
        checkPic(rule, picValue, callback) {
            if (picValue === '') {
                callback(new Error('请上传图片'))
            } else {
                callback()
            }
        }
    }
}
</script>

<style lang='scss'>
/* 修改popover样式 不能加scoped */
.el-popover.atooltip {
    padding: 10px;
}
</style>
<style scoped></style>
