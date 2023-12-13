/* table列表多选功能例子:
	HTML部分:
		注意：
		一、一定要加ref="multipleTable"，不然全禁选的el-checkbox样式会显示错误；
		二、row-key="id"，如果tableList里取的value对应的key值是prodId而不是id的话，则这样设：row-key="prodId"
		三、如果有排序，<el-table>里可加入@sort-change="changeSort"
		四、下面例子的:selectable意思为：status==0或status=='-1'不可选(禁用)，其它的可选
		<el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" row-key="id" @selection-change="selectionChange">
			<el-table-column type="selection" reserve-selection width="42" :selectable="(row)=>{return !(row.status===0||row.status=='-1')}"/>
		</el-table>
		
		<el-button size="mini" class="allCheck">
			<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
		</el-button>
		<el-button size="small" @click="batchEdit">批量处理</el-button>
	JS部分：
		batchEdit() {
			if (!this.mulSels?.length) {
			    this.$message.warning('请至少选择一条数据')
			    return
			}
			this.接口方法(this.mulSels)
		},
*/

import * as formFn from './formFn'
import { debounce } from '@/utils/utils.js'
export default {
    data() {
        return {
            dialogForm: {
                // 弹窗表单
                isEdit: false, // 是否修改
                isVisible: false, // 是否显示
                title: '', // 弹窗标题
                formData: {}, // 弹窗表单
                formRule: {} // 弹窗表单验证规则
            },
            mulSels: [], // 批量选中的元素的id集合。取的value值是<el-table>里设置的row-key值，不设row-key的话，默认值为'id'
            mulSelsRows: [], // 批量选中的元素集合
            tableLayout: {
                //单元格宽度设置(自定义表格)
                colTotalWidth: 0, //可以在mounted之前进行赋值
                // d_XX 默认宽度 m_xx 至少宽度(按剩余比例分配)
                d_80: '80',
                m_80: '80',
                m_100: '100',
                m_140: '140',
                m_180: '180',
                m_280: '280',
                bodyWidth: '100%'
            }
        }
    },

    computed: {
        // this.mulSel取的value值在tableList里对应的key值，<el-table>里不设置row-key的话，默认值为'id'
        rowKey() {
            return this.$refs?.multipleTable?.rowKey || 'id'
        },

        //底部全选按钮与表格顶部的全选按钮状态同步[半选状态]
        checkHalf() {
            if (this.checkAll) {
                return false
            } else if (this.mulSels?.length) {
                return true
            } else {
                return false
            }
        },

        // 可选元素 = this.tableList - 禁选元素
        selectableList() {
            let selectable = null //如果设置了禁选项，则该变量用来接受页面上selectable上的方法
            //注意，有多选功能的<el-table>，一定要写上ref="multipleTable"，不然会出bug
            if (this.$refs?.multipleTable?.columns?.length) {
                this.$refs?.multipleTable?.columns.forEach((item) => {
                    // 注意,如果table列表有两个selection,那这个逻辑可能会出问题
                    if (item.type == 'selection') {
                        // 获取页面上<el-table-column type="selection" :selectable="(row)=>{return row.status}"> 里的selectable方法
                        selectable = item.selectable
                    }
                })
            }
            // 如果设置了禁选项,则 可选元素 = this.tableList - 禁选元素。否则可选元素就是默认为this.tableList
            return selectable
                ? this.tableList.filter((item) => {
                      return selectable(item)
                  })
                : this.tableList
        },

        checkAll: {
            get() {
                let tableIds = this.selectableList.map((item) => item[this.rowKey])
                // console.log(11,tableIds);//[3151, 3052, 3051]
                // console.log(22,this.mulSels);//[3151]
                return tableIds?.length && tableIds.every((item) => this.mulSels.includes(item))
            },
            set(val) {
                return val
            }
        }
    },
    watch: {
        'dialogForm.isVisible': {
            handler(newV) {
                if (newV === false) {
                    this.$refs.myForm && this.$refs.myForm.resetFields()
                    this.dialogForm.formData = {}
                }
            }
        },
        /* 自定义表格选择列 */
        tableList: {
            handler(nList) {
                // 如果已经加载完接口,并且全部都为禁选,则给.el-checkbox和.el-checkbox__input同时加上一个.is-disabled
                if (nList?.length) {
                    //注意，有多选功能的<el-table>，一定要写上ref="multipleTable"，不然会出bug
                    // console.log(33,this.$refs?.multipleTable);
                    const selectEl = this.$refs?.multipleTable?.$el.querySelector('.el-table-column--selection')
                    const checkBoxEl = selectEl ? selectEl.querySelector('.el-checkbox') : null
                    const checkBoxInputEl = selectEl ? selectEl.querySelector('.el-checkbox__input') : null
                    if (checkBoxEl && checkBoxInputEl) {
                        if (!this.selectableList?.length) {
                            // 不加$nextTick的话，如果是第一页全选，点击第二页(假设第二页为全部禁选)时，下面的add('is-disabled')就会被element-ui瞬间覆盖掉
                            this.$nextTick(() => {
                                checkBoxEl.classList.add('is-disabled')
                                checkBoxInputEl.classList.add('is-disabled')
                            })
                        } else {
                            this.$nextTick(() => {
                                checkBoxEl.classList.remove('is-disabled')
                                checkBoxInputEl.classList.remove('is-disabled')
                            })
                        }
                    }
                }
            }
        }
    },
    methods: {
        /**
         * 表单创建（添加功能）
         */
        handleCreate(objValue) {
            // formFn.createFn.apply(this)
            formFn.createFn.apply(this, [objValue])
        },
        /**
         *  表单修改（表单修改）
         */
        handleEdit(row, col, idx) {
            formFn.editFn.apply(this, [row])
        },
        /**
         *  删除某一项列表
         */
        handleDel(row, col, idx) {
            formFn.delFn.apply(this, [row, this.url.delete])
        },
        /**
         *  删除多选列表
         */
        handleMulDel(param, message) {
            if (this.url && this.url.mulDel) {
                formFn.mulDelFn.call(this, this.url.mulDel, param, message)
            } else {
                console.log('多选删除失败：获取不到删除地址')
            }
        },
        /**
         * @param {String} formName //表单名字
         */
        debounceSubmit(formName) {
            this.DSubmitFn(formName)
        },
        /**
         * @param {type} formName  // 表单提交表单名字
         */
        doSubmitForm(formName) {
            /* 分别是“修改”和“新增”的url */
            const _url = this.dialogForm.isEdit ? this.url.update : this.url.create
            formFn.submitFn.apply(this, [formName, _url, this.dialogForm.isEdit])
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        /**
         * 表单新增/编辑+表单重置
         */
        handleBeforeClose() {
            this.$refs['myForm'].resetFields()
            this.dialogForm.isVisible = false
        },
        /**
         *  点击选择
         */
        selectionChange(val) {
            // console.log('selVal--',val)
            this.mulSels = val.map((item) => item[this.rowKey])
            this.mulSelsRows = val
        },
        /**
         *  全选
         */
        selAll() {
            this.$refs.multipleTable.toggleAllSelection()
        },

        // 根据屏幕拉伸改变table的宽度（仿ELEMENT）自定义表格使用
        // 参数为各列预设的宽度总和
        // ref必须为设置bodyWidth的父级元素
        updateTableLayout: debounce(function () {
            if (!this.$refs.wrapTable) return
            let curElTotalWidth = this.$refs.wrapTable.offsetWidth
            // let colTotalWidth = (48 + 80 + 100 + 100 + 80 + 100 + 140 * 4 + 80);
            let colTotalWidth = this.tableLayout.colTotalWidth
            console.log('elWidth--', this.$refs.wrapTable.offsetWidth, colTotalWidth)
            let bodyWidth = '100%',
                d_80 = 80,
                m_80 = 80,
                m_100 = 100,
                m_140 = 140,
                m_180 = 180,
                m_280 = 280
            if (curElTotalWidth > colTotalWidth) {
                //有剩余空间
                let ratio = (curElTotalWidth - colTotalWidth) / colTotalWidth
                // 没有minWidth的默认宽度比例大小
                d_80 = 80 + Math.floor(80 * ratio)
                m_80 = d_80
                m_100 = 100 + Math.floor(100 * ratio)
                m_140 = 140 + Math.floor(140 * ratio)
                m_180 = 180 + Math.floor(180 * ratio)
                m_280 = 280 + Math.floor(280 * ratio)
                bodyWidth = '100%'
            } else {
                bodyWidth = colTotalWidth + 2 + 'px' //+2是因为缩小时边框会丢失
            }
            Object.assign(this.tableLayout, {
                bodyWidth,
                d_80: d_80 + '',
                m_80: m_80 + '',
                m_100: m_100 + '',
                m_140: m_140 + '',
                m_180: m_180 + '',
                m_280: m_280 + ''
            })
        }, 200)
    },
    created() {
        this.DSubmitFn = debounce((v) => this.doSubmitForm(v))
    },
    mounted() {
        // 页面一定会走mounted
        if (this.tableLayout.colTotalWidth > 0) {
            this.updateTableLayout()
            window.addEventListener('resize', this.updateTableLayout)
        }
    },

    activated() {
        // tab页切换时 会导致$refs.wrapTable的指向改变 因此不能单纯依靠mounted加载一次
        if (this.tableLayout.colTotalWidth > 0) {
            this.updateTableLayout()
            window.addEventListener('resize', this.updateTableLayout)
        }
    },

    deactivated() {
        if (this.tableLayout.colTotalWidth > 0) {
            window.removeEventListener('resize', this.updateTableLayout)
        }
    },

    destroyed() {
        if (this.tableLayout.colTotalWidth > 0) {
            window.removeEventListener('resize', this.updateTableLayout)
        }
    }
}
