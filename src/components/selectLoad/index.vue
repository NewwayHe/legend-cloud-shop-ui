<template>
    <div>
        <el-select
            v-model="labelIds"
            v-el-select-loadmore="loadmore"
            :multiple="multiple"
            filterable
            remote
            :remote-method="remoteMethod"
            clearable
            placeholder="请选择"
        >
            <el-option v-for="(item, index) in labelList" :key="index" :label="item.name" :value="item[labelFile]" />
        </el-select>
    </div>
</template>

<script>
/**
 * 使用注意：
 * 该组件在作用是下拉选择框上拉加载数据和远程搜索
 */
import { request } from '@/utils/request.js'
export default {
    directives: {
        'el-select-loadmore': {
            bind(el, binding) {
                // 获取element-ui定义好的scroll盒子
                const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
                SELECTWRAP_DOM.addEventListener('scroll', function () {
                    /**
                     * scrollHeight 获取元素内容高度(只读)
                     * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                     * clientHeight 读取元素的可见高度(只读)
                     * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                     * ele.scsrollHeight - ele.scrollTop === ele.clientHeight;
                     */
                    const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
                    condition && binding.value()
                })
            }
        }
    },
    props: {
        value: {},
        // 是否多选
        multiple: {
            type: Boolean,
            default: true
        },
        url: {
            type: String,
            default: ''
        },
        searchName: {
            type: String,
            default: 'name'
        },
        labelFile: {
            type: String,
            default: 'id'
        },
        topLabel: {
            //置顶字段
            type: String,
            default: 'code'
        }
    },
    data() {
        return {
            labelIds: '',
            topValue: '', //置顶值
            formData: {
                curPage: 1
            },
            total: 0,
            labelList: []
        }
    },
    watch: {
        value: {
            handler(newValue) {
                this.labelIds = newValue
                //如果置顶值有了值就不赋值
                if (newValue && !this.topValue) {
                    this.topValue = newValue
                }
            },
            immediate: true,
            deep: true
        },
        labelIds(newValue) {
            this.$emit('input', newValue)
        }
    },
    mounted() {
        this.select2SysDelivery()
    },
    methods: {
        remoteMethod(query) {
            this.formData.curPage = 0
            this.select2SysDelivery({ [this.searchName]: query })
        },
        loadmore() {
            if (!this.hasMore()) {
                return
            }
            this.formData.curPage++
            this.select2SysDelivery()
        },
        // 判断有没有更多
        hasMore() {
            return !(this.labelList.length >= this.total)
        },
        select2SysDelivery(formData) {
            request.get(this.url, { ...formData, ...this.formData, [this.topLabel]: this.topValue }).then((res) => {
                if (res.code && res.data && res.data.resultList) {
                    if (res.data.curPageNO == 1) {
                        this.labelList = [...res.data.resultList]
                    } else {
                        this.labelList = [...this.labelList, ...res.data.resultList]
                    }
                    this.total = res.data.total
                }
            })
        }
    }
}
</script>

<style></style>
