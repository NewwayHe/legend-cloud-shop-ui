<template>
    <el-card class="" :body-style="{padding:`20px 20px 10px 20px`}">
        <div class="table">
            <el-table
				ref="multipleTable"
				v-loading="tableListLoading"
				:data="tableList"
				tooltip-effect="dark"
				header-row-class-name="headerRow"
				class="w-100"
			>
				<template slot="empty">
					<empty empty-type="pro" />
				</template>
				<el-table-column prop="businessName" label="文件名" >
					 <template slot-scope="scope">
						<span>{{ scope.row.businessName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="生成时间" width="160`">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注">
					<template slot-scope="scope">
						<div>{{ scope.row.remark}}</div>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<div>{{ scope.row.status | exportStatusFilter }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-link type="primary" :underline="false" v-if="scope.row.status == '20'" @click="excelDownload(scope.row.id)">下载</el-link>
						<span v-else>-</span>
					</template>
				</el-table-column>
			</el-table>
			<LsSticky :data="tableList">
				<el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
					<el-button size="small" @click="dbnSearch">刷新</el-button>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </div>
    </el-card>
</template>

<script>
import { excelCenter } from '@/api/ModuleCommon'
import commom  from '@/mixins/pages/commom.js'

export default {
    name: 'excelCenter',
    mixins:[commom],
    components:{},
    data() {
        return {
            url:{
                getData:'/basic/shop/export/excel/page'
            },
            isMounted:true,
        }
    },
    computed: {
        
    },
    filters:{
        exportStatusFilter(val){
            // status	状态(-1:导出失败, 10:正在导出 20:导出成功)
            let obj={
                '-1':'导出失败',
                '10':'正在导出',
                '20':'导出成功'
            }
            return obj[val] ? obj[val] : '-'
        }
    },
    mounted() {
    },
    methods: {
        //下载
       excelDownload(id){
           excelCenter.excelDownload({exportId:id}).then((res)=>{
           })
       }
    
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        ::v-deep .el-card {
            &__header {
                padding: 14px 20px;
            }   
        }
        .el-container {
            .el-aside {
                ul>li {
                    &+li {
                        margin-top: 8px;
                    }
                }
            }
        }
       
    }
    

    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
