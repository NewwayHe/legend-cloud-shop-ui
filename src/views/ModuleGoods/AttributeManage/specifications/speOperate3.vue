<!-- /*
 * @Descripttion:规格管理 - 新增/编辑
*/ -->
<template>
    <section class="formWarp">
        <el-card shadow>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type" @change="changeType">
                        <el-radio label="TXT">文本</el-radio>
                        <el-radio label="PIC">图片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="规格标题" prop="propName">
                    <el-input v-model="form.propName" maxlength="20" show-word-limit class="w-450p" />
                    <span class="ml-10 text-999">规格标题会显示在用户端的商品详情页中，最多20字</span>
                </el-form-item>
                <el-form-item label="规格副标题" prop="memo">
                    <el-input v-model="form.memo" class="w-450p" />
                    <span class="ml-10 text-999">
                        类似于备注的功能，不显示在用户端，仅显示在后台中，建议名称为 "将要绑定的商品类目全路径名称 + 标题"
                    </span>
                </el-form-item>
                <el-form-item label="关联参数分组" prop="relatedGroup">
                    <el-button type="primary" @click="showGroupDialog">关联</el-button>
                    <span class="ml-10 text-999">一个规格可添关联多个规格参数分组</span>
                    <div v-show="form.relatedGroup.length > 0">
                        <span>
                            已关联分组：
                            <el-tag
                                v-for="(tag, index) in form.relatedGroup"
                                :key="tag.id"
                                class="ml-10"
                                closable
                                size="small"
                                type="primary"
                                @close="delTag(index)"
                            >
                                {{ tag.name }}
                            </el-tag>
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="规格值" prop="groupList">
                    <el-button type="primary" @click="addSpe">添加规格值</el-button>
                    <span class="ml-10 text-999">一个规格可添加多个规格值（拖动可以改变顺序）</span>
                </el-form-item>
                <el-form-item>
                    <el-table
                        ref="dragTable"
                        class="dialog-form-table"
                        :class="tableWid"
                        tooltip-effect="dark"
                        size="mini"
                        :fit="false"
                        :data="form.groupList"
                        :header-cell-style="{ background: '#fafafa' }"
                    >
                        <el-table-column prop="name" label="规格值" width="300">
                            <template slot-scope="scope">
                                <el-form :ref="'tableForm' + scope.$index" :model="scope.row" :rules="rules" size="small">
                                    <el-form-item prop="name">
                                        <el-input v-model="scope.row.name" />
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="form.type == 'PIC'" prop="name">
                            <template slot="header">
                                <span>图片</span>
                                <p>建议尺寸：300*300px</p>
                            </template>
                            <template slot-scope="scope">
                                <el-form :ref="'tablePicForm' + scope.$index" inline-message :model="scope.row" :rules="rules" size="small">
                                    <el-form-item prop="pic">
                                        <imgCenter
                                            v-model="scope.row.pic"
                                            :uploadStyle="{ width: '80px' }"
                                        ></imgCenter>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-link :underline="false" type="primary" @click="delItem(scope)">删除</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
             </el-form>
			<el-row type="flex" justify="center" class="py-10">
				<el-button size="small" @click="onCancel">取消</el-button>
				<ls-button size="small" type="primary" @click="onSubmit">
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
import { specifications } from '@/api/ModuleGoods'
import DialogGroup from '../components/dialogGroup'
import Sortable from 'sortablejs'

export default {
    components: { DialogGroup },
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
                    pic: '',
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
            console.log(this.form)
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 这里获取表格中的所有form组件
                    const tableFormList = []
                    for (let i = 0; i < this.form.groupList.length; i++) {
                        const name = `tableForm${i}`
                        const picName = `tablePicForm${i}`
                        if (this.$refs[name]) {
                            tableFormList.push(this.$refs[name].validate())
                        }
                        if (this.$refs[picName]) {
                            tableFormList.push(this.$refs[picName].validate())
                        }
                    }
                    // 这里必须让表格内的数据全部验证通过后才能提交
                    Promise.all(tableFormList)
                        .then((res) => {
                            if (this.isEdit) {
                                this.editItem()
                            } else {
                                this.addItem()
                            }
                        })
                        .catch((err) => {
                            console.log('验证失败', err)
                        })
                }
            })
        },

        // 添加
        addItem() {
            specifications
                .add({
                    propName: this.form.propName,
                    memo: this.form.memo,
                    type: this.form.type,
                    attributeType: 'S',
                    prodPropList: this.form.groupList,
                    aggIdList: this.form.relatedGroup.map((item) => item.id),
                    source: 'SYS' // 这个写死
                })
                .then((res) => {
                    console.log(res)
                    this.$message({
                        message: '新增成功',
                        type: 'success',
                        onClose: () => {
                            this.$router.push({ path: '/ModuleGoods/attributeManage/specifications' })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 编辑
        editItem() {
            specifications
                .edit({
                    id: this.form.id,
                    propName: this.form.propName,
                    memo: this.form.memo,
                    type: this.form.type,
                    attributeType: 'S',
                    prodPropList: this.form.groupList,
                    aggIdList: this.form.relatedGroup.map((item) => item.id),
                    source: 'SYS' // 这个写死
                })
                .then((res) => {
                    console.log(res)
                    this.$message({
                        message: '编辑成功',
                        type: 'success',
                        onClose: () => {
                            this.$router.push({ path: '/ModuleGoods/attributeManage/specifications' })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 回去规格列表页
        onCancel() {
            this.$router.push({ path: '/ModuleGoods/attributeManage/specifications' })
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
