<!-- /*
 * @Descripttion:职位管理
*/ -->
<template>
    <section class="">
        <div class="table">
            <el-card class="" shadow :body-style="{padding:`20px 20px 10px 20px`}">
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="addRole('')">新增</el-button>
                </el-row>

                <!--列表-->
                <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" header-row-class-name="headerRow" tooltip-effect="dark" class="w-100">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="roleName" label="职位名称" />
                    <el-table-column prop="createTime" label="创建时间" />
                    <el-table-column label="操作" align="left" fixed="right" width="180px ">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click.stop="addRole(scope.row.id, 'edit')">修改</el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
            </el-card>
        </div>
        <!-- 添加角色,分配权限 -->
        <dialog-add-pre ref="addPre" :role-id="roleId" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import dialogAddPre from './components/dialogAddPre'
export default {
    name: 'PositionManage',
    components: {
        dialogAddPre
    },
    mixins: [common, cud],
    data() {
        return {
            roleId: '',
            url: {
                getData: '/user/s/shop/userRole/queryRolePage',
                delete: '/user/s/shop/userRole'
            }
        }
    },
    mounted() {},
    methods: {
        addRole(id, type = 'add') {
            this.roleId = id
            this.$refs.addPre.showDialog(type)
        }
    }
}
</script>
