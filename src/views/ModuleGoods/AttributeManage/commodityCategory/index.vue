<!-- /*
 * @Descripttion:商品类目
*/ -->
<template>
    <section class="">
        <div class="table">
            <el-card class="mb-15" shadow>
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="toAdd">新增一级类目</el-button>
                </el-row>
                <el-row class="mb-20">
                    <el-alert class="theme" :closable="false" show-icon>
                        <p>商品类目,用于管理商品,需要先创建一级类目,再创建二级类目,再创建三级类目</p>
                    </el-alert>
                </el-row>

                <el-table
                    ref="table"
                    v-loading="tableListLoading"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    border
                    header-row-class-name="headerRow"
                    :indent="70"
                    :data="tableList"
                    :tree-props="{ children: 'children' }"
                >
                    <template slot="empty">
                        <empty empty-type="pro" text="暂无相关类目" />
                    </template>
                    <el-table-column prop="name" label="类目类型" width="450">
                        <template slot-scope="scope">
                            <span v-if="scope.row.grade == 1" class="ml-10">一级类目</span>
                            <span v-if="scope.row.grade == 2" class="ml-10">二级类目</span>
                            <span v-if="scope.row.grade == 3" class="ml-10">三级类目</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="类目名称" />
                    <el-table-column prop="icon" label="父类">
                        <template slot-scope="scope">
                            <span v-if="scope.row.grade == 1">顶级</span>
                            <span v-else>{{ scope.row.parentName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="seq" label="权重"  min-width="80"/>
                    <el-table-column prop="icon" label="状态">
                        <template slot-scope="scope">
                            <span class="status-pass" v-if="scope.row.status">上线</span>
                            <span class="status-done" v-else>下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" fixed="right" width="300px" >
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="checkDetail(scope.row)">查看</el-link>
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">编辑</el-link>
                                <el-link :underline="false" type="primary" @click.stop="updateState(scope.row)">
                                    {{ scope.row.status ? '下线' : '上线' }}
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row)">删除</el-link>
                                <el-link v-if="scope.row.grade < 3" :underline="false" type="primary" @click="addNextCategory(scope.row)">
                                    {{ scope.row.grade == 1 ? '添加二级类目' : '添加三级类目' }}
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </section>
</template>
<script>
import { category } from '@/api/ModuleGoods'
import { debounce } from '@/utils/utils.js'

export default {
    name: 'CommodityCategory',
    components: {},
    data() {
        return {
            tableListLoading: false,
            tableList: [],
            tableKey: 0
        }
    },
    mounted() {},
    activated() {
        this.getData()
    },
    methods: {
        // 初始化
        getData() {
            this.tableListLoading = true
            category
                .page({
                    status: 3
                })
                .then((res) => {
                    console.log(res)
                    this.tableListLoading = false
                    this.tableList = res.data
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 搜索
        dbnSearch: debounce(function () {
            this.page.curPage = 1
            this.getData()
        }),

        // 查看详情
        checkDetail(row) {
            let parentName = row.parentId === -1 ? '' : row.parentName
            this.$router.push({
                name: 'categoryDetail',
                query: {
                    id: row.id,
                    parentName: parentName,
                    gradeId: row.grade
                }
            })
        },

        // 新增一级类目
        toAdd() {
            this.$router.push({
                name: 'categoryOperate',
                query: {
                    status: 'add',
                    grade: '1'
                }
            })
        },

        // 编辑
        toEdit(row) {
            this.$router.push({
                name: 'categoryOperate',
                query: {
                    status: 'edit',
                    grade: row.grade,
                    parentId: row.parentId,
                    categoryId: row.id
                }
            })
        },

        // 添加下级类目
        addNextCategory(row) {
            this.$router.push({
                name: 'categoryOperate',
                query: {
                    parentName: row.name,
                    status: 'add',
                    grade: row.grade + 1,
                    parentId: row.id
                }
            })
        },

        // 上/下线
        updateState(row) {
            this.$confirm(
                `${row.status ? '类目下线后，用户无法浏览关联的商品。确定下线？' : '类目上线后，用户可以浏览关联的商品。确定上线？'}`,
                '提示',
                {
                    type: 'warning'
                }
            ).then(() => {
                console.log(row)
                category.changeStatus(row.id, Number(!row.status)).then((res) => {
                    if (!res.code) {
                        return
                    }
                    this.$message.success('操作成功')
                    this.getData()
                })
            })
        },

        // 删除
        handleDel(row) {
            console.log(this.$refs.table.store.states.lazyTreeNodeMap)
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                category.delete(row.id).then((res) => {
                    if (res.code) {
                        this.$message.success('删除成功')
                        this.getData()
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.el-tree ::v-deep .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
}

::v-deep .el-table__expand-icon {
    transition: none;
}

//有子节点 且未展开
.el-table::v-deep .el-icon-arrow-right:before {
    content: '\E78A';
    display: block;
    width: 20px;
    height: 20px;
    font-size: 20px;
    background-size: 16px;
    color: #ffa800;
}

//有子节点 且已展开
.el-table::v-deep .el-table__expand-icon--expanded {
    transform: none;

    .el-icon-arrow-right:before {
        content: '\E784';
        display: block;
        width: 20px;
        height: 20px;
        font-size: 20px;
        background-size: 16px;
        color: #ffa800;
    }
}
</style>
