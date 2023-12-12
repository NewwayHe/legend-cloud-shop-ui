import doPost from '@/utils/request.js'
import { request } from '@/utils/request.js'
import service from '@/utils/request.js'

const toStringValue = (obj) => {
    if (obj instanceof Array) {
        var arr = []
        for (var i = 0; i < obj.length; i++) {
            arr[i] = toStringValue(obj[i])
        }
        return arr
    } else if (typeof obj === 'object') {
        for (var p in obj) {
            obj[p] = toStringValue(obj[p])
        }
    } else if (typeof obj === 'number') {
        obj = obj + ''
    }
    return obj
}
// toStringValue():给对象/对象数组的属性值为数值型的转为字符串型

export function getDataFn(url, params = {}) {
    this.tableListLoading = true
    request
        .get(url, params, { isShowLoading: this.isShowLoading })
        .then((res) => {
            this.tableListLoading = false
            // this.tableTotal = res.data.count
            this.tableTotal = res.data.total
            this.tableList = res.data
        })
        .catch((e) => {
            // code=0,成功返回；反之，失败提示
            if (e.code && e.code !== 0) {
                // this.$message.error(e.message)
            }
            catchUrl(e, url)
            this.tableListLoading = false
        })
}

export function getLineFn(url, params = {}) {
    this.tableListLoading = true
    request
        .get(url, params, { isShowLoading: this.isShowLoading })
        .then((res) => {
            this.tableListLoading = false
            // this.tableTotal = res.data.count
            this.tableTotal = res.data.total
            let totalDealAmount = []
            let dealAmount = []
            let dealGoodNum = []
            let totalDealGoodNum = []
            let date = []
            res.data.map((item) => {
                totalDealAmount.push(item.totalDealAmount)
                dealAmount.push(item.dealAmount)
                dealGoodNum.push(item.dealGoodNum)
                totalDealGoodNum.push(item.totalDealGoodNum)
                date.push(item.time)
            })
            this.lineChartData.totalDealAmount = totalDealAmount
            this.lineChartData.dealAmount = dealAmount
            this.lineChartData.dealGoodNum = dealGoodNum
            this.lineChartData.totalDealGoodNum = totalDealGoodNum
            this.lineChartData.date = date
        })
        .catch((e) => {
            // code=0,成功返回；反之，失败提示
            if (e.code && e.code !== 0) {
                // this.$message.error(e.message)
            }
            catchUrl(e, url)
            this.tableListLoading = false
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
