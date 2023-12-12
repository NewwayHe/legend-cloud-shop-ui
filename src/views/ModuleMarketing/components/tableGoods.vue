<template>
    <!-- /*
 * @Descripttion:商品列表组件
*/ -->
    <el-card class="table" shadow>
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100 border-left border-right rounded-5" size="mini">
            <template slot="empty"><empty empty-type="pro" text="暂无活动信息" /></template>
            <el-table-column label="" align="center" width="120">
                <template slot-scope="scope">
                    <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '6' }" />
                </template>
            </el-table-column>
            <el-table-column prop="name" class="pr-4" label="商品" align="center" min-width="200">
                <template slot-scope="scope">
                    <el-popover placement="top" width="500" trigger="hover" :title="scope.row.name">
                        <el-link target="_blank" :underline="false" :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.id">{{$shareRedirectUrl + '?detailsType=good&id=' + scope.row.id}}</el-link>
                        <el-link
                            slot="reference"
                            :underline="false"
                            class="line-clamp2"
                            :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.id"
                        >
                            {{ scope.row.name }}
                        </el-link>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="cnProperties" show-overflow-tooltip label="商品规格" align="center">
                <template slot-scope="scope">
                    {{ scope.row.cnProperties || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="price" show-overflow-tooltip label="销售价(元)" align="center" />
            <el-table-column prop="groupPrice" show-overflow-tooltip label="团购价格(元)" align="center" />
            <el-table-column prop="groupStocks" show-overflow-tooltip label="活动库存" align="center" />
            <el-table-column show-overflow-tooltip label="预估收益(元)" align="center">
                <template slot-scope="scope">暂无</template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script>
import serviceConfig from '@/config'
export default {
    components: {},
    props: {
        from: {
            type: String,
            default: 'group'
        },
        tableList: {
            type: [Array, Object]
        }
    },
    data() {
        return {
            config: serviceConfig
        }
    },
    computed: {},
    watch: {},
    created() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.table {
    ::v-deep .el-card__body {
        padding: 0px;
    }
}
</style>
