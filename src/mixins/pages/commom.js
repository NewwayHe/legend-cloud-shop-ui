import * as formFn from './formFn.js'
import { debounce, object } from '@/utils/utils.js'
import setting from '@/settings'
import serviceConfig from '@/config'
export default {
    watch: {
        // 手动点击了侧边栏的展开与收缩 也要重新进行计算
        // 用nextTick会不生效 因为侧边栏收起需要时间导致布局计算的宽度不准确而导致BUG
        '$store.state.app.sidebar.opened'() {
            // this.$nextTick(()=>{
            //     // this.formWrapBtnFn()
            //     setTimeout(()=>{
            //         this.formWrapBtnFn()
            //     },300)
            // })
            setTimeout(() => {
                this.formWrapBtnFn()
            }, 300)
        }
    },
    data() {
        return {
            searchFilters: {}, // 搜索参数
            rawSearchFilters: {}, //重置时使用原有的搜索参数
            fixFilters: {}, // 固定参数
            tableDatas: '', //用来接收res.data
            tableList: [], // 表格列表
            typeLink: setting.linkTag,
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
            /* 一个页面中本身混入了[common]，子组件又混入了[common]
                父组件有fromWrapBtn 而子组件又没有formWrapBtn 
                则在屏幕resize时 子组件的created会覆盖父组件的created 导致父组件refs.fromWrapBtn会被子组件进行覆盖而丢失
                因此该变量在这种情况下要进行置True 来标识子组件不走created中的resize
                example: 财务管理——>平台资金明细——>查看[账单明细]
            */
            sonEffect: false
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
        // 导出Excel
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
        }),
        // 导出Excel防抖
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
            this.searchFilters = object.deepClone(this.rawSearchFilters)
            this.page.curPage = 1
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection() //清除表格选择勾选行
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
        },
        // 搜索表单的按钮组在小尺寸屏幕时需换行对齐输入框[结合防抖在1329px时获取form的offsetWidth会莫名多10px]
        formWrapBtnFn: debounce(function () {
            // console.log('formWrapBtn--',this.$refs.formWrapBtn);
            if (!this.$refs.formWrapBtn) return
            let el = this.$refs.formWrapBtn.$el
            let pWidth = el.offsetWidth
            let totalWidth = 0,
                childs = [...el.children],
                childLen = childs.length
            // console.log('childs--',childs,childLen)
            let preWrapChildW = parseInt(this.$refs.formWrapBtn.labelWidth || '86px') + 12 //保存换行前的第一个元素的labelWidth+marginRight 按钮组的marginLeft大小 以该元素的labelWidth + marginRight为准
            childs.forEach((child, index) => {
                // totalWidth += (child.offsetWidth + ((index === childLen - 1) ? 0 : 30));
                totalWidth += child.offsetWidth + 30
                // console.log('pre--',totalWidth,pWidth)
                if (totalWidth > pWidth) {
                    //换行
                    // console.log('totalWidth--',totalWidth, pWidth, index)
                    totalWidth = child.offsetWidth + 30
                    if (index === childLen - 1) {
                        //按钮组
                        child.classList.add('formWrapBtn')
                        child.style.marginLeft = preWrapChildW + 'px'
                    }
                } else {
                    if (child.classList.contains('formWrapBtn')) {
                        child.classList.remove('formWrapBtn')
                        child.style.marginLeft = 0
                    }
                }
            })
        }, 200)
    },
    created() {
        this.rawSearchFilters = object.deepClone(this.searchFilters) //某些页面有另外的搜索参数，拷贝一份原有的搜索参数
    },
    mounted() {
        if (this.isMounted) {
            console.log('走mounted')
            this.getData()
        }
        // 页面一定会走mounted
        if (!this.sonEffect) {
            this.formWrapBtnFn()
            window.addEventListener('resize', this.formWrapBtnFn)
        }
    },

    activated() {
        if (!this.isMounted) {
            this.getData()
        }
        if (!this.sonEffect) {
            this.formWrapBtnFn()
            window.addEventListener('resize', this.formWrapBtnFn)
        }
    },

    deactivated() {
        if (!this.sonEffect) {
            window.removeEventListener('resize', this.formWrapBtnFn)
        }
    },

    destroyed() {
        if (!this.sonEffect) {
            window.removeEventListener('resize', this.formWrapBtnFn)
        }
    }
}
