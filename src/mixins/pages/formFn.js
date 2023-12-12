import doPost from '@/utils/request.js'
import { request } from '@/utils/request.js'
import service from '@/utils/request.js'
import { object } from '@/utils/utils.js'

/** @param {Object} o为表单默认要显示的默认值，如果无，就不填写，可选 */
export function createFn(obj) {
    this.dialogForm.isVisible = true
    this.$nextTick(() => {
        if (obj && obj.type != 'click') {
            this.dialogForm.formData = Object.assign({}, object.deepClone(obj))
        }
        this.dialogForm.isEdit = false
        this.dialogForm.title = '新增'
    })
}

export function editFn(row = {}) {
    this.dialogForm.isEdit = true
    this.dialogForm.title = '编辑'
    this.dialogForm.isVisible = true
	
	this.$nextTick(() => {
		this.dialogForm.formData = Object.assign({}, object.deepClone(row))
	})
}

export function delFn(row, url) {
    this.$confirm('确认删除该数据吗?', '提示', {
        type: 'warning'
    })
        .then(() => {
            service.request({ url: url + '/' + row[this.rowKey], method: 'delete' }).then((res) => {
				if (res.code) {
				    this.$message.success('删除成功')
				    this.getData()
				} else {
				    this.$message.warning(res.msg)
				}
            })
            .catch((e) => {
                // this.$message.error(e.message)
                catchUrl(e, url)
            })
        })
        .catch(() => {
            // this.$message.info('取消删除')
        })
}

export function submitFn(formName, url, isEdit) {
    const title = isEdit ? '编辑' : '添加'
    this.$refs[formName].validate((valid) => {
        if (valid) {
            request[isEdit ? 'put' : 'post'](url, this.dialogForm.formData)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.success(`${title}成功`)
                        this.getData()
                        this.dialogForm.isVisible = false
                    }
                })
                .catch((e) => {
                    catchUrl(e, url, `${title}`)
                })
        } else {
            console.error('Error submit ----- Form invalid !')
            return false
        }
    })
}

export function getDataFn(url, params = {}) {
    this.tableListLoading = true
    request
        .get(url, params, { isShowLoading: this.isShowLoading })
        .then((res) => {
            if(res.code) {
				this.tableList = res?.data?.resultList || []
                // 如果有自定义选择列时 tableDatas赋值必须写在tableList下面 
                // 因为下面语句会优先执行到双向数据监听
                this.tableDatas = res?.data || ''
                this.tableTotal = res?.data?.total || 0
            }
        })
        .catch((e) => {
            catchUrl(e, url)
        })
		.finally((res) => {
            this.tableListLoading = false
        })
}

export function getExcel(url, params = {}) {
    request.getFile(url, params)
}

export function mulDelFn(url, params = {}, message = '') {
    if (!params.ids) {
        if (!this.mulSels?.length) {
            this.$message.warning('请选择至少一条数据')
            // this.$alert('请选择至少一条数据', '提示')
            return
        }
    }
    this.$confirm(message ? message : '确认删除该数据吗?', '提示', {
        type: 'warning'
    })
        .then(() => {
            request
                .put(url, {
                    ids: this.mulSels,
                    ...params
                })
                .then((res) => {
                    if(res.code) {
                        if(params.single && params.callback) {  //单删
                            params.callback()
                        }else {     //批量删
                            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()       //清除表格选择勾选行
                        }
                        this.$message.success('操作成功')
                        this.getData()
                    }
                })
                .catch((e) => {
                    catchUrl(e, url)
                    this.$confirm(e.message, '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.dialogForm.isVisible = false
                    })
                })
        })
        .catch(() => {
            // this.$message.info('取消删除')
        })
}

function catchUrl(e, url, detail) {
    console.group(`Error found in doPost(${url})`)
    if (detail) console.info(`--${detail}--报错！`)
    console.error(e)
    console.groupEnd()
}

function catchFn(e, fn) {
    console.group(`Error found in method (${fn.name})`)
    console.error(e)
    console.groupEnd()
}
