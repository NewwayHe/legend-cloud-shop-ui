import * as formFn from './formFn.js'
import { debounce } from '@/utils/utils.js'
import serviceConfig from '@/config'
export default {
    data() {
        return {
            searchFilters: {}, // 搜索参数
            fixFilters: {}, //固定搜索参数
            tableList: [], // 表格列表
            tableListLoading: false, // 表格请求loading
            isShowLoading: false, //表格是否有loading
            tableTotal: 0, // 表格列表总数
            page: {
                // 表格页码
                pageSize: 10,
                curPage: 1
            },
            orderBy: {
                // 排序
                prop: '',
                order: ''
            },
            isMounted: serviceConfig.asyncRoutes,
            allList: {}
        }
    },
    methods: {
        /**
         *  获取表格列表
         */
        getData() {
            const param = {
                ...this.fixFilters,
                ...this.searchFilters,
                ...this.page,
                ...this.orderBy
            }
            formFn.getDataFn.apply(this, [this.url.getData, param])
        },
        // 获取折线图数据
        getLine() {
            const param = {
                ...this.fixFilters,
                ...this.searchFilters,
                ...this.page,
                ...this.orderBy
            }
            formFn.getLineFn.apply(this, [this.url.getLine, param])
        },
        // 导出报表
        getExcel() {
            const param = {
                ...this.fixFilters,
                ...this.searchFilters,
                ...this.page,
                ...this.orderBy
            }
            formFn.getExcel.apply(this, [this.url.getExcel, param])
        },
        /**
         * 搜索列表加防抖
         */
        dbnSearch: debounce(function () {
            this.page.curPage = 1
            this.getData()
            this.getLine()
        }),

        dbnExcel: debounce(function () {
            this.page.curPage = 1
            this.getExcel()
        }),
        /**
         * 搜索列表
         */
        doSearch() {
            this.page.curPage = 1
            this.getData()
            this.getLine()
        },
        /**
         *  重置搜素参数加防抖
         */
        dbnResetSearch: debounce(function () {
            let whiteList = arguments[0]
            if (!(whiteList instanceof Array)) {
                whiteList = []
            }
            for (const key in this.searchFilters) {
                if (whiteList.length != 0) {
                    for (const item of whiteList) {
                        if (key !== item) {
                            this.searchFilters[key] = ''
                        }
                    }
                } else {
                    this.searchFilters[key] = ''
                }
            }
            this.date = '' // 这里做一处时间兼容，date字段并没有放在searchFilters对象中，而是放在外面
            // this.searchFilters = {}
            this.page.curPage = 1
            this.getData()
        }),
        /**
         *  页码改变
         */
        currentPageChange(p) {
            this.page.curPage = p
            this.getData()
        },
        /**
         *  页数改变
         */
        pageSizeChange(size) {
            this.page.pageSize = size
            this.getData()
        },
        /**
         *  排序改变
         */
        changeSort(val) {
            console.log(val)
            this.orderBy.prop = val.prop
            this.orderBy.order = val.order

            if (val.order == 'ascending') {
                this.orderBy.order = 'asc'
            } else if (val.order == 'descending') {
                this.orderBy.order = 'desc'
            } else {
                this.orderBy.order = val.order
            }
            // this.page.curPage = 1
            this.getData()
            // column: {…} order: "ascending" prop: "date"
            // 根据当前排序重新获取后台数据,一般后台会需要一个排序的参数
        },
        indexMethod(idx) {
            return (this.page.curPage - 1) * this.page.pageSize + (idx + 1)
        }
    },
    mounted() {
        if (this.isMounted) {
            this.getData()
            this.getLine()
        }
    },

    activated() {
        if (!this.isMounted) {
            this.getData()
            this.getLine()
        }
    },
    created() {}
}
