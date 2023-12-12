<!-- /*
 * @Descripttion:参数管理 - 新增/编辑
*/ -->
<template>
    <section class="formWarp">
        <el-card shadow>
            <el-form ref="form" :model="form" :rules="rules" label-width="132px" size="small">
                <el-form-item label="参数标题：" prop="propName">
                    <el-input v-model.trim="form.propName" maxlength="20" show-word-limit class="w-450p" placeholder="请输入"/>
                    <span class="ml-10 text-999">参数标题会显示在用户端的商品详情页中，最多20字</span>
                </el-form-item>
                <el-form-item label="参数副标题：" prop="memo">
                    <el-input v-model.trim="form.memo" class="w-450p" placeholder="请输入"/>
                    <span class="ml-10 text-999">
                        类似于备注的功能，不显示在用户端，仅显示在后台中，建议名称为 "将要绑定的商品类目全路径名称 + 标题"
                    </span>
                </el-form-item>
                <el-form-item label="参数值：" prop="groupList">
                    <el-button type="primary" @click="addSpe">添加参数值</el-button>
                    <span class="ml-10 text-999">
                        一个参数可添加多个参数值值（拖动可以改变顺序）
						<imgPreview class="ml-10" :src="require('@/assets/images/exampleImgs/paraOperate.png')" />
                    </span>
                </el-form-item>
                <el-form-item class="btn_lastItem">
                    <el-table
                        v-show="form.groupList.length > 0"
                        ref="dragTable"
                        class="dialog-form-table w-450p"
                        tooltip-effect="dark"
                        size="mini"
                        :data="form.groupList"
					    header-row-class-name="headerRow"
                    >
                        <el-table-column prop="name" label="参数值" align="center" width="300">
                            <template slot-scope="scope">
                                <el-form :ref="'tableForm' + scope.$index" :key="scope.row.id" :model="scope.row" :rules="rules" size="small">
                                    <el-form-item prop="name">
                                        <el-input v-model.trim="scope.row.name" placeholder="请输入" :maxlength="50"/>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-link class="text-blue" :underline="false" type="primary" @click="delItem(scope)">删除</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
			<el-row type="flex" justify="center" class="py-10">
				<el-button size="small" @click="onCancel">取消</el-button>
				<ls-button size="small" type="primary" :asyncFunction="onSubmit">
					保存
				</ls-button>
			</el-row>
        </el-card>

        <dialog-group
            ref="groupDialog"
            source="specification"
            :item-id="0"
            :related-row="form.relatedGroup"
            :show-tip="false"
            @relateGroup="saveRelatedGroup"
        />
    </section>
</template>

<script>
import { params } from '@/api/ModuleGoods'
import Sortable from 'sortablejs'
import DialogGroup from '../components/dialogGroup'

export default {
    components: { DialogGroup },
    data() {
        return {
            form: {
                id: '',
                propName: '',
                memo: '',
                searchFlag: '',
                groupList: [{ name: '', sequence: 1 }], // 参数值数组
                relatedGroup: [] // 关联参数分组数组
            },
            rules: {
                propName: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
                searchFlag: [{ required: true, message: '请选择', trigger: 'change' }],
                groupList: [{ required: true, validator: this.checkGroupList }],
                name: [{ required: true, message: '参数值不能为空', trigger: 'blur' }]
            },
            isEdit: false,
            sortable: null // 拖拽的实例
        }
    },
    beforeRouteEnter(to, from, next) {
        let type = to.query.type;
        let title = to.meta.title.split('/')
        if(type === 'add' || type === 'similar') {
            to.meta.text = '新增参数'   //面包屑
            title[1] = '新增参数'       //顶部导航栏[黑色区显示]
        }else {
            to.meta.text = '编辑参数'
            title[1] = '编辑参数'   
        }
        to.meta.title = title.join('/')

        next()
    },
    created() {
        if (this.$route.query.type === 'add') {
            this.isEdit = false
        } else if (this.$route.query.type === 'similar') {
            this.isEdit = false
            this.form.id = this.$route.query.id
            this.getDetail()
        } else {
            this.isEdit = true
            this.form.id = this.$route.query.id
            this.getDetail()
        }
    },
    mounted() {
        this.$nextTick(() => {})
    },
    methods: {
        // 初始化页面
        init() {
            this.$nextTick(() => {
                this.$refs.form.resetFields()
            })
        },

        // 类似导入/编辑时获取其详情
        getDetail() {
            params
                .detail(this.form.id)
                .then((res) => {
                    console.log(res)
                    this.form = Object.assign({}, this.form, res.data)
                    this.form.groupList = res.data.prodPropList
                    this.form.searchFlag = Number(res.data.searchFlag)
                    this.form.relatedGroup = res.data.aggBO // 规格参数分组
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 表格变成拖拽
        setSort() {
            const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                setData: function (dataTransfer) {
                    dataTransfer.setData('Text', '')
                },
                onEnd: (evt) => {
                    // 拖拽后可进行一些数据处理
                    console.log('i am testing', evt)
                    const oldSeq = this.form.groupList[evt.oldIndex].sequence
                    const newSeq = this.form.groupList[evt.newIndex].sequence
                    this.$set(this.form.groupList[evt.oldIndex], 'sequence', newSeq)
                    this.$set(this.form.groupList[evt.newIndex], 'sequence', oldSeq)
                    console.log(this.form.groupList)
                }
            })
        },

        // 添加规格值
        addSpe() {
            this.form.groupList.push({
                name: '',
                sequence: this.form.groupList.length + 1
            })
        },

        // 删除一个规格值
        delItem(scope) {
            this.form.groupList.splice(scope.$index, 1)
        },

        // 提交
        onSubmit() {
            return new Promise(resolve=>{
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const tableFormList = []
                        for (let i = 0; i < this.form.groupList.length; i++) {
                            const name = `tableForm${i}`
                            if (this.$refs[name]) {
                                tableFormList.push(this.$refs[name].validate())
                            }
                        }
                        // 这里必须验证所有的表格输入框后才能保存/编辑
                        Promise.all(tableFormList)
                            .then(async (res) => {
                                if (this.isEdit) {
                                    // 编辑
                                    await this.editItem()
                                } else {
                                    // 新增
                                    await this.addItem()
                                }
                            })
                            .catch((err) => {
                                console.log('验证失败', err)
                            }).finally(_=>{
                                resolve()
                            })
                    }else{
                        resolve()
                    }
                })
            })
        },

        // 新增
        addItem() {
            return new Promise(resolve=>{
                console.log(this.form)
                params
                    .add({
                        propName: this.form.propName,
                        memo: this.form.memo,
                        searchFlag: Boolean(this.form.searchFlag),
                        type: 'TXT', // 这个写死
                        attributeType: 'P', // 这个写死
                        prodPropList: this.form.groupList,
                        aggIdList: this.form.relatedGroup.map((item) => item.id),
                        source: 'USER' // 这个写死
                    })
                    .then((res) => {
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        })
                        this.$router.push({ path: '/ModuleGoods/attributeManage/params' })
                    })
                    .catch((err) => {
                        console.log(err)
                    }).finally(_=>{
                    resolve()
                })
            })
        },

        // 编辑
        editItem() {
            return new Promise(resolve=>{
                params
                .edit({
                    id: this.form.id,
                    propName: this.form.propName,
                    memo: this.form.memo,
                    searchFlag: Boolean(this.form.searchFlag),
                    type: 'TXT', // 这个写死
                    attributeType: 'P', // 这个写死
                    prodPropList: this.form.groupList,
                    aggIdList: this.form.relatedGroup.map((item) => item.id),
                    source: 'USER' // 这个写死
                })
                .then((res) => {
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    })
                    this.$router.push({ path: '/ModuleGoods/attributeManage/params' })
                })
                .catch((err) => {
                    console.log(err)
                }).finally(_=>{
                    resolve()
                })
            })
            
        },

        // 取消返回上一个路由
        onCancel() {
            this.$router.push({ name: 'params' })
        },

        // 验证规格值表格是否为空
        checkGroupList(rule, groupList, callback) {
            console.log(rule)
            if (groupList.length < 1) {
                callback(new Error('至少添加一个规格值'))
            } else {
                callback()
            }
        },

        // 显示关联分组参数Dialog
        showGroupDialog() {
            this.$refs.groupDialog.dialogShow()
        },

        // 获取关联的规格参数分组
        saveRelatedGroup(selectedRow) {
            console.log('选择保存的关联组', selectedRow)
            this.form.relatedGroup = this.form.relatedGroup.concat(selectedRow)
            // 这里会对返回来的关联分组进行去重
            const obj = {}
            this.form.relatedGroup = this.form.relatedGroup.reduce((item, next) => {
                obj[next.id] ? '' : (obj[next.id] = true && item.push(next))
                return item
            }, [])
            this.$refs.groupDialog.dialogClose()
        },

        // 删除关联的分组
        delTag(itemIndex) {
            this.form.relatedGroup.splice(itemIndex, 1)
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

