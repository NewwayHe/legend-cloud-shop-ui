<template>
    <section class="">
		<el-card shadow>
			<!-- 查询 -->
			<div class="search">
				<el-form :inline="true" :model="searchFilters" size="small">
					<el-form-item label="活动名称"><el-input v-model="searchFilters.groupName" placeholder="请输入" /></el-form-item>
					<el-form-item label="开始/结束时间">
						<el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate" />
					</el-form-item>
					<el-form-item>
						<el-button size="small" @click.stop="dbnSearch">搜索</el-button>
						<el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
					</el-form-item>
				</el-form>
			</div>        
			<!--列表-->
			<!-- 有多选：row-key="id" @selection-change="selectionChange" -->
			<el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" row-key="id" @selection-change="selectionChange">
			<!-- 有排序：@sort-change="changeSort" -->
			<!-- <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" @sort-change="changeSort"> -->
			<!-- 没多选，没排序 -->
			<!-- <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow"> -->
				<!-- 有多选 -->
				<el-table-column type="selection" reserve-selection width="42" :selectable="(row)=>{return !(row.status===0||row.status=='-1')}"/>
				<el-table-column label="序号" type="index" width="48" />
				<el-table-column prop="custName" label="客户名" show-overflow-tooltip min-width="140"  />
				<el-table-column label="创建时间" width="140">
					<template slot-scope="scope">
						{{ scope.row.createTime | dateformat }}
					</template>
				</el-table-column>
				<el-table-column label="操作" align="left" fixed="right">
				    <template slot-scope="scope">
				        <span class="table__action">
				            <el-link :underline="false" type="primary" @click="showDialog(scope.row)">查看</el-link>
				        </span>
				    </template>
				</el-table-column>
			</el-table>
			<!-- 表格底部操作/分页 -->
			<el-row type="flex" justify="space-between" class="mt-30">
				<el-col>
					<el-button size="mini" class="allCheck pl-10 pr-10">
						<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
					</el-button>
					<el-button size="small" @click="handleDel('batch')">批量删除</el-button>
				</el-col>
				<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
			</el-row>
		</el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom.js'
import cud from '@/mixins/pages/cud.js'
export default {
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: "/custPhoneInfoService/list",
                update: "/custPhoneInfoService/update",
                delete: "/custPhoneInfoService/deleteById",
                create: "/custPhoneInfoService/create",
                mulDel: "/custPhoneInfoService/mulDelete" // 注意返回去的是id的数组['asb','sdf']
            }
        }
    }
}
</script>
