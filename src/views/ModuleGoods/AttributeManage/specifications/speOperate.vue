<!-- /*
 * @Descripttion:规格管理 - 新增/编辑
*/ -->
<template>
    <section class="formWarp">
        <el-card shadow>
            <el-form ref="form" :model="form" :rules="rules" label-width="132px" size="small" @submit.native.prevent>
				<el-form-item label="规格标题：" prop="propName">
					<el-input v-model.trim="form.propName" maxlength="20" show-word-limit class="w-450p" @input="form.propName = form.propName.replace(/\:/g, '：').replace(/\;/g, '；')" placeholder="请输入"/>
					<el-tooltip class="item" effect="dark" content="注：新增规格标题时，‘:’和‘;’是系统特殊字符，使用的话会强行转为中文符号。" placement="top">
						<i class="el-icon-question ml-10 text-000 font-16 opacity-3" style="font-size: 16px;"></i>
					</el-tooltip>
					<span class="ml-10 text-999">规格标题会显示在用户端的商品详情页中，最多20字</span>
				</el-form-item>
                <el-form-item label="规格副标题：" prop="memo">
                    <el-input v-model.trim="form.memo" class="w-450p" maxlength="50" show-word-limit placeholder="请输入"/>
                    <span class="ml-10 text-999">
                        类似于备注的功能，不显示在用户端，仅显示在后台中，建议名称为 "将要绑定的商品类目全路径名称 + 标题"
                    </span>
                </el-form-item>
                <el-form-item label="规格值：" prop="groupList">
                    <el-button type="primary" @click="addSpe">添加规格值</el-button>
                    <span class="ml-10 text-999">一个规格可添加多个规格值（拖动可以改变顺序）</span>
					<imgPreview class="ml-10" :src="require('@/assets/images/exampleImgs/speOperate.png')" />
                </el-form-item>
                <el-form-item class="btn_lastItem">
                    <el-table
                        ref="dragTable"
                        class="dialog-form-table w-450p"
                        tooltip-effect="dark"
                        size="mini"
                        :data="form.groupList"
                        header-row-class-name="headerRow"
                    >
						<el-table-column prop="name" align="center" width="300">
							<template slot="header">
								<el-row type="flex" align="middle" justify="center">
									规格值
									<el-tooltip class="item" effect="dark" content="注：新增规则值时，‘:’和‘;’是系统特殊字符，使用的话会强行转为中文符号。" placement="top">
										<i class="el-icon-question ml-5 mb-3 text-000 font-16 opacity-3" style="font-size: 16px;"></i>
									</el-tooltip>
								</el-row>
							</template>
							
							<template slot-scope="scope">
								<el-form :ref="'tableForm' + scope.$index" :model="scope.row" :rules="rules" size="small" @submit.native.prevent>
									<el-form-item prop="name">
										<el-input v-model.trim="scope.row.name" maxlength="50" show-word-limit @input="scope.row.name = scope.row.name.replace(/\:/g, '：').replace(/\;/g, '；')" placeholder="请输入"/>
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
import upload from '@/components/Upload'
import { specifications } from '@/api/ModuleGoods'
import DialogGroup from '../components/dialogGroup'
import Sortable from 'sortablejs'

export default {
    name: 'SpeOperate',
    components: { DialogGroup, upload },
    data() {
        return {
            form: {
                id: '',
                type: 'TXT',
                propName: '',
                memo: '',
                groupList: [{ name: '', pic: '', sequence: 1 }], // 规格值数组
                relatedGroup: [] // 关联参数分组数组
            },
            rules: {
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                propName: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
                groupList: [{ required: true, validator: this.checkGroupList }],
                name: [{ required: true, message: '规格值不能为空', trigger: 'blur' }],
                pic: [{ validator: this.checkPic }]
            },
            tableWid: 'w-450p',
            isEdit: false,
            sortable: null, // 拖拽的实例
            // 用于缓存原本的规格参数数组
            originalGroupList: {
                TXT: [],
                PIC: []
            }
        }
    },
    watch: {
        'form.type': {
            immediate: true,
            handler(value) {
                if (value === 'TXT') {
                    this.tableWid = 'w-450p'
                } else {
                    this.tableWid = 'w-630p'
                }
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        let type = to.query.type;
        let title = to.meta.title.split('/')
        if(type === 'add' || type === 'similar') {
            to.meta.text = '新增规格'   //面包屑
            title[1] = '新增规格'       //顶部导航栏[黑色区显示]
        }else {
            to.meta.text = '编辑规格'
            title[1] = '编辑规格'   
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
            this.getItem()
        } else {
            this.isEdit = true
            this.form.id = this.$route.query.id
            this.getItem()
        }
        this.init()
    },
    mounted() {
        this.$nextTick(() => {
            this.setSort()
        })
    },
    methods: {
        // 初始化页面
        init() {
            this.originalGroupList.TXT = []
            this.originalGroupList.PIC = []
            this.$nextTick(() => {
                this.$refs.form.resetFields()
            })
        },

        // 获取规格的信息(编辑/类似导入时调用)
        getItem() {
            specifications
                .detail(this.form.id)
                .then((res) => {
                    this.form = Object.assign({}, this.form, res.data)
                    this.form.relatedGroup = res.data.aggBO // 规格参数分组
                    this.form.groupList = res.data.prodPropList // 规格值
                    this.originalGroupList[this.form.type] = res.data.prodPropList
                    console.log('form data', this.form)
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

        // 切换类型
        changeType(value) {
            if (value === 'TXT') {
                this.tableWid = 'w-450p'
            } else {
                this.tableWid = 'w-630p'
            }
            if (this.originalGroupList[value].length !== 0) {
                this.form.groupList = this.originalGroupList[value]
            } else {
                this.form.groupList = [
                    {
                        name: '',
                        pic: '',
                        sequence: 1
                    }
                ]
            }
        },

        // 添加规格值(如果没有选择类型，则不能添加规格值)
        addSpe() {
            if (!this.form.type) {
                this.$refs.form.validateField('type', (res) => {
                    console.log(res)
                })
            } else {
                this.form.groupList.push({
                    name: '',
                    sequence: this.form.groupList.length + 1
                })
            }
        },

        // 删除一个规格值
        delItem(scope) {
            this.form.groupList.splice(scope.$index, 1)
        },

        // 提交
        onSubmit() {
            return new Promise(async resolve=>{
                console.log(this.form)
                await this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        // 这里获取表格中的所有form组件
                        const tableFormList = []
                        for (let i = 0; i < this.form.groupList.length; i++) {
                            const name = `tableForm${i}`
                            if (this.$refs[name]) {
                                tableFormList.push(this.$refs[name].validate())
                            }
                        }
                        // 这里必须让表格内的数据全部验证通过后才能提交
                        await Promise.all(tableFormList)
                            .then(async (res) => {
                                if (this.isEdit) {
                                    await this.editItem()
                                } else {
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

        // 添加
        addItem() {
            return new Promise(resolve=>{
                specifications
                    .add({
                        propName: this.form.propName,
                        memo: this.form.memo,
                        type: this.form.type,
                        attributeType: 'S',
                        prodPropList: this.form.groupList,
                        aggIdList: this.form.relatedGroup.map((item) => item.id),
                        source: 'USER' // 这个写死
                    })
                    .then((res) => {
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        })
                        this.$router.push({ path: '/ModuleGoods/attributeManage/specifications' })
                    }).finally(_=>{
                        resolve()
                })
            })
        },

        // 编辑
        editItem() {
            return new Promise(resolve=>{
                specifications
                .edit({
                    id: this.form.id,
                    propName: this.form.propName,
                    memo: this.form.memo,
                    type: this.form.type,
                    attributeType: 'S',
                    prodPropList: this.form.groupList,
                    aggIdList: this.form.relatedGroup.map((item) => item.id),
                    source: 'USER' // 这个写死
                })
                .then((res) => {
                    console.log(res)
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    })
                    this.$router.push({ path: '/ModuleGoods/attributeManage/specifications' })
                })
                .catch((err) => {
                    console.log(err)
                }).finally(_=>{
                    resolve()
                })
            })
            
        },

        // 回去规格列表页
        onCancel() {
            this.$router.push({ name: 'specifications' })
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

        // 检查图片是否上传
        checkPic(rule, picValue, callback) {
            if (this.form.type === 'TXT') {
                callback()
            } else {
                if (picValue === '') {
                    callback(new Error('请上传图片'))
                } else {
                    callback()
                }
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

<style lang="scss" scoped>
/* 由于使用了字数提示 但是ELEMENT并未做好处理 当输入过长时 输入的字符会被字数提示(position:absolute)给遮挡 */
.el-input {
    ::v-deep .el-input__inner {
        padding-right: 46px;
    }
}
</style>
