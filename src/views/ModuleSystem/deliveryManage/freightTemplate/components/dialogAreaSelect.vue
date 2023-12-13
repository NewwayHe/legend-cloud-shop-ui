<template>
    <!-- 选择地区 -->
    <el-dialog title="选择地区" custom-class="dialog-form areaSelect" width="805px" :visible.sync="dialogVisible">
        <el-scrollbar style="height: 500px">
            <el-row v-for="provinceItem in areaList" :key="provinceItem.id" style="padding: 0 15px">
                <el-col :span="5">
                    <el-checkbox
                        :key="provinceItem.id"
                        v-model="provinceItem.selectFlag"
                        :disabled="provinceItem.disable"
                        @change="
                            (v) => {
                                provinceItemChange(provinceItem, v)
                            }
                        "
                    >
                        {{ provinceItem.name }}
                    </el-checkbox>
                </el-col>
                <el-col :span="19">
                    <el-checkbox
                        v-for="cityItem in provinceItem.children"
                        :key="cityItem.id"
                        v-model="cityItem.selectFlag"
                        :disabled="cityItem.disable"
                        class="mb-20"
                        @change="
                            (v) => {
                                cityItemChange(provinceItem, cityItem, v)
                            }
                        "
                    >
                        {{ cityItem.name }}
                    </el-checkbox>
                </el-col>
            </el-row>
        </el-scrollbar>
        <el-row style="padding: 0 15px">
            <el-checkbox v-model="checkedAll" :disabled="checkDisable" @change="allSelectChange">全选</el-checkbox>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button v-ls-loading size="small" type="primary" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { addressApi } from '@/api/ModuleCommon'

export default {
    props: {
        templateList: {
            //传进来的当前模板数据
            type: Array,
            default() {
                return []
            }
        },
        currentAllList: {
            //传进来所有模板数据
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            areaList: []
        }
    },
    computed: {
        checkDisable() {
            let flag = false
            if (this.areaList.filter((item) => item.disable).length) {
                flag = true
            }
            return flag
        },
        checkedAll: {
            get() {
                return this.areaList.length != 0 && this.areaList.length == this.areaList.filter((item) => item.selectFlag).length
            },
            set(val) {
                return val
            }
        }
    },
    watch: {
        dialogVisible(newVal) {
            if (!newVal) {
                this.getTreeData(this.areaList)
            }
        }
    },
    created() {
        addressApi.loadProvinceCity().then((res) => {
            if (res.code) {
                this.areaList = this.getTreeData(res.data)
            }
        })
    },
    methods: {
        // 递归构建树方法
        getTreeData(data) {
            // 循环遍历json数据
            for (var i = 0; i < data.length; i++) {
                if (!data[i].children || data[i].children == 'null' || data[i].children.length < 1) {
                    // children若为空数组，则将children设为undefined
                    data[i].selectFlag = false
                    data[i].disable = false
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    data[i].selectFlag = false
                    data[i].disable = false
                    this.getTreeData(data[i].children)
                }
            }
            return data
        },
        submitForm() {
            let areaList = JSON.parse(JSON.stringify(this.areaList))
            let resultList = []
            areaList.forEach((provinceItem) => {
                let tempList = this.getProvinceCheckList(provinceItem)
                if (tempList && tempList.length) {
                    resultList.push({
                        id: provinceItem.id,
                        name: provinceItem.name,
                        selectFlag: provinceItem.selectFlag,
                        children: tempList
                    })
                }
            })
            this.$emit('dialogAreaSelect', resultList)
            this.dialogVisible = false
        },
        //获取省份下勾选的城市数据。给提交使用
        getProvinceCheckList(provinceItem) {
            if (!provinceItem.children && !provinceItem.children.length) {
                return []
            }
            let resultList = []
            provinceItem.children.forEach((item) => {
                if (item.selectFlag) {
                    resultList.push(item)
                }
            })
            return resultList
        },
        //全部选择框改变
        allSelectChange(value) {
            this.areaList.forEach((provinceItem) => {
                provinceItem.selectFlag = value
                this.changeCheckState(provinceItem, value)
            })
        },
        //省份选择框改变
        provinceItemChange(provinceItem, value) {
            provinceItem.selectFlag = value
            this.changeCheckState(provinceItem, value)
        },
        //城市选择框改变
        cityItemChange(provinceItem, cityItem, value) {
            if (!value) {
                provinceItem.selectFlag = value
                return
            }
            if (this.getProvinceCheckState(provinceItem)) {
                provinceItem.selectFlag = value
            }
        },
        //改变省份下的所有城市状态
        changeCheckState(provinceItem, value) {
            provinceItem.children.forEach((cityItem) => {
                cityItem.selectFlag = value
            })
        },
        //判断省份以下的所有城市选择框是否都为true如果是返回true，不是返回false
        getProvinceCheckState(provinceItem) {
            let checkedState = true
            let checked = provinceItem.children.every((cityItem) => cityItem.selectFlag)
            if (!checked) {
                checkedState = false
            }
            return checkedState
        },
        //树结构扁平
        flatData(resultArr = [], arr) {
            arr.forEach((item) => {
                resultArr.push(item)
                item.children && item.children.length > 0 ? this.flatData(resultArr, item.children) : ''
                // item.children = ''    //如果扁平化后的数组需要显示父子层级，可以把这一项删除
            })
            return resultArr
        },
        //合并树结构
        mergeTreeData(treeArr, flatArr) {
            // 循环遍历json数据
            for (var i = 0; i < treeArr.length; i++) {
                //如果有childreen 递归替换
                if (treeArr[i].children && treeArr[i].children.length) {
                    this.mergeTreeData(treeArr[i].children, flatArr)
                }
                // 找出选中的城市和省份
                let findArr = flatArr.find((item) => {
                    return treeArr[i].id == item.id
                })
                if (findArr) {
                    treeArr[i].selectFlag = findArr.hasOwnProperty('selectFlag') ? findArr.selectFlag : true
                    treeArr[i].disable = false
                }
            }
            return treeArr
        },
        //合并树结构
        mergeTreeAllData(treeArr, flatArr) {
            // 循环遍历json数据
            for (var i = 0; i < treeArr.length; i++) {
                //如果有childreen 递归替换
                if (treeArr[i].children && treeArr[i].children.length) {
                    this.mergeTreeAllData(treeArr[i].children, flatArr)
                }
                // 找出选中的城市和省份
                let findArr = flatArr.find((item) => {
                    return treeArr[i].id == item.id
                })
                if (findArr) {
                    treeArr[i].selectFlag = false
                    treeArr[i].disable = true
                } else {
                    treeArr[i].disable = false
                }
            }
            return treeArr
        },
        showDialog() {
            this.dialogVisible = true
            // 先合并 并禁用所有已选中的城市和省份
            let tempAllList = this.flatData([], this.currentAllList)
            this.mergeTreeAllData(this.areaList, tempAllList)
            // 再合并 并勾选当前模板已选中的城市和省份
            let tempList = this.flatData([], this.templateList)
            this.mergeTreeData(this.areaList, tempList)
        }
    }
}
</script>

<style lang="scss" scoped>
// 用了el-scrollbar的,谷歌浏览上就将原生的scrollbar去掉
.areaSelect ::v-deep .el-scrollbar__wrap::-webkit-scrollbar {
    display: none;
}
</style>
