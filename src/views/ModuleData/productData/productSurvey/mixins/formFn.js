import doPost from '@/utils/request.js'
import { request } from '@/utils/request.js'
import service from '@/utils/request.js'

/** @param {Object} o为表单默认要显示的默认值，如果无，就不填写，可选 */
export function createFn(obj) {
    if (obj && obj.type != 'click') {
        this.dialogForm.formData = Object.assign({}, this.$utils.object.deepClone(obj))
    }
    this.dialogForm.isEdit = false
    this.dialogForm.title = '新增'
    this.$nextTick(() => {
        this.dialogForm.isVisible = true
    })
}

export function editFn(row = {}) {
    this.dialogForm.isEdit = true
    this.dialogForm.title = '编辑'
    this.dialogForm.isVisible = true

    this.$nextTick(() => {
        this.dialogForm.formData = Object.assign({}, this.$utils.object.deepClone(row))
    })
}

export function delFn(row, url) {
    this.$confirm('确认删除该数据吗?', '提示', {
        type: 'warning'
    })
        .then(() => {
            service
                .request({
                    url: url + '/' + row.id,
                    method: 'delete'
                })
                .then((res) => {
                    if (res.code) {
                        this.$message.success('删除成功')
                        this.getData()
                    } else {
                        this.$message.warning(res.msg)
                    }
                })
                .catch((e) => {
                    catchUrl(e, url)
                })
        })
        .catch(() => {
            this.$message.info('取消删除')
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
        .get(url, params, {
            isShowLoading: this.isShowLoading
        })
        .then((res) => {
            this.tableListLoading = false
            this.tableTotal = res?.data?.total || 0
            this.tableList = res?.data?.resultList || []
        })
        .catch((e) => {
            catchUrl(e, url)
            this.tableListLoading = false
        })
        .finally((res) => {
            this.tableListLoading = false
        })
}

export function getLineFn(url, params = {}) {
    this.tableListLoading = true
    request
        .get(url, params, {
            isShowLoading: this.isShowLoading
        })
        .then((res) => {
            this.tableListLoading = false
            let dateList = []
            let people = []
            let frequency = []
            let mpPeople = []
            let mpFrequency = []
            let miniPeople = []
            let miniFrequency = []
            let appPeople = []
            let appFrequency = []
            let h5People = []
            let h5Frequency = []
            let List = []
            res.data.map((item) => {
                dateList.push(item.time)
                people.push(item.people)
                frequency.push(item.frequency)
                mpPeople.push(item.mpPeople)
                mpFrequency.push(item.mpFrequency)
                miniPeople.push(item.miniPeople)
                miniFrequency.push(item.miniFrequency)
                appPeople.push(item.appPeople)
                appFrequency.push(item.appFrequency)
                h5People.push(item.h5People)
                h5Frequency.push(item.h5Frequency)
            })
            this.allList = {
                dateList: dateList,
                people: people,
                frequency: frequency,
                mpPeople: mpPeople,
                mpFrequency: mpFrequency,
                miniPeople: miniPeople,
                miniFrequency: miniFrequency,
                appPeople: appPeople,
                appFrequency: appFrequency,
                h5People: h5People,
                h5Frequency: h5Frequency
            }
        })
        .catch((e) => {
            catchUrl(e, url)
            this.tableListLoading = false
        })
        .finally((res) => {
            this.tableListLoading = false
        })
}

export function getExcel(url, params = {}) {
    request
        .getFile(url, params, {})
        .then((res) => {})
        .catch((e) => {
            catchUrl(e, url)
        })
        .finally((res) => {})
}

export function mulDelFn(url) {
    if (!this.mulSels?.length) {
        this.$alert('请选择要删除的数据', '提示')
        return
    }
    this.$confirm('确认删除该数据吗?', '提示', {
        type: 'warning'
    })
        .then(() => {
            request
                .delete(url, {
                    ids: this.mulSels
                })
                .then((res) => {
                    if (res.code) {
                        this.$message.success('删除成功')
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
            this.$message.info('取消删除')
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
