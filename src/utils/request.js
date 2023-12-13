import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import qs from 'qs'
import { getToken } from '@/utils/auth'
import serviceConfig from '@/config'
import { string, singleMessage } from '@/utils/utils.js'

const service = axios.create({
    baseURL: serviceConfig.server, // url = base url + request url
    timeout: 10000 // request timeout
})
service.interceptors.request.use(
    (config) => {
        if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken()
        } else {
            config.headers['Authorization'] = 'Basic bGVnZW5kc2hvcDpsZWdlbmRzaG9w'
        }
        config.headers['source'] = 'SHOP'
        return config
    },
    (error) => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */
    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    (response) => {
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (response.status !== 200) {
            singleMessage.showMessage(res.msg)
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('您已经退出登录，您可以取消留在该页面或返回登录页面', '退出登录', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else if (response.request.responseType) {
            // 如果是文件流，则返回response
            return response
        } else {
            return res
        }
    },
    (error) => {
        console.log(JSON.parse(JSON.stringify(error)))
        console.log('err:' + error) // for debug
        let err = JSON.parse(JSON.stringify(error))
        let errTimeOut = ''
        // 如果是超过了 timeout请求时间
        if (err.message.indexOf('timeout of') != -1) {
            errTimeOut = '请求超时，请刷新页面后重试！'
        }

        singleMessage.showMessage(errTimeOut || error.response.data.msg || '网络请求异常, 请检查您的网络设置后刷新重试!')

        return Promise.reject(error)
    }
)

service.postForm = (url, data) => {
    return service({
        url,
        method: 'post',
        data: qs.stringify(data)
    })
}

service.delForm = (url, id) => {
    return service({
        url: url + '/' + id,
        method: 'delete'
    })
}

export const request = {
    /**
     * 请求方法(get、post和put)
     * @param url 请求url, 相对url
     * @param data 请求参数
     * @param opt 扩展配置
     */
    get(url, data, opt) {
        const requestParmams = {
            url,
            method: 'get',
            params: data
        }
        return this.sendRequest(requestParmams, opt)
    },

    getJson(url, data, opt) {
        const requestParmams = {
            url,
            method: 'get',
            params: qs.stringify(data)
        }
        return this.sendRequest(requestParmams, opt)
    },

    post(url, data, opt) {
        const requestParmams = {
            url,
            method: 'post',
            data
        }
        return this.sendRequest(requestParmams, opt)
    },

    postForm(url, data, opt) {
        const requestParmams = {
            url,
            method: 'post',
            data: qs.stringify(data)
        }
        return this.sendRequest(requestParmams, opt)
    },
    postFile(url, data, opt) {
        const requestParmams = {
            url,
            method: 'post',
            data: data
        }
        return this.sendRequest(requestParmams, { ...opt, addHeader: { 'Content-Type': 'multipart/form-data' } })
    },
    put(url, data, opt) {
        const requestParmams = {
            url,
            method: 'put',
            data: data
        }
        return this.sendRequest(requestParmams, opt)
    },
    delete(url, data, opt) {
        const requestParmams = {
            url,
            method: 'delete',
            data: data
        }
        return this.sendRequest(requestParmams, opt)
    },

    // 下载文件
    getFile(url, data) {
        const requestParmams = {
            url: url,
            method: 'get',
            params: data,
            data: { getFile: true },
            responseType: 'blob'
        }
        const opt = {
            addHeader: { 'Content-Type': 'application/json' }
        }
        this.sendRequest(requestParmams, opt)
            .then((res) => {
                // 如果是二进制的，则进行下载
                if (res.data.type === 'application/vnd.ms-excel' || res.data.type === 'application/vnd.ms-excel;charset=utf-8') {
                    //2022.4.26部分导出功能改为异步导出，故加判断。是excel文件则下载，否则就只弹提示

                    const fileName = string.getFileName(res.headers['content-disposition'])
                    if ('msSaveOrOpenBlob' in navigator) {
                        // IE下载文件
                        window.navigator.msSaveOrOpenBlob(res.data, fileName)
                    } else {
                        //其他浏览器下载文件
                        const fileContent = new Blob([res.data])
                        const link = document.createElement('a') // a标签下载
                        link.href = window.URL.createObjectURL(fileContent)
                        link.download = `${fileName}`
                        link.click()
                        window.URL.revokeObjectURL(link.href)
                    }
                    Message({
                        message: '导出成功',
                        type: 'success',
                        duration: 5 * 1000
                    })
                } else {
                    Message({
                        message: '文件正在生成中，请稍后前往右上角文件导出中心下载',
                        type: 'success',
                        duration: 5 * 1000
                    })
                }
            })
            .catch((err) => {
                Message({
                    message: '导出失败',
                    type: 'error',
                    duration: 5 * 1000
                })
            })
    },

    /**
     * 封装自定义请求方法
     * @param url 请求url
     * @param params 请求参数
     */
    sendRequest(params, options = {}) {
        return new Promise((resolve, reject) => {
            //后端需要服务来源
            if (params.url) {
                params.headers = {}
                params.headers['serviceName'] = params.url.split('/')[1]
            }
            if (options.addHeader) {
                //是否需要增加请求头参数
                Object.assign(params.headers, options.addHeader)
            }
            const defaultOptions = {
                isShowLoading: false, // 是否显示loadding,默认否
                isShowMessage: true // 是否显示当res.status != 1时的showToast，默认：显示
            }
            options = { ...defaultOptions, ...options }

            let loadingInstance = null
            if (options.isShowLoading) {
                loadingInstance = Loading.service()
            }
            service
                .request(params)
                .then((res) => {
                    if (res.code !== 1 && options.isShowMessage && res.msg) {
                        singleMessage.showMessage(res.msg)
                    }
                    resolve(res)
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
                .finally((res) => {
                    if (loadingInstance) {
                        loadingInstance.close()
                    }
                })
        })
    }
}

export default service
