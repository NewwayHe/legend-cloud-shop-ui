<template>
    <section>
        <div class="d-flex font-14">
            <div class="" style="width: 400px">
                <el-card shadow>
                    <div slot="header" class="flex-between">
                        <span>分组名称</span>
                        <span>操作</span>
                    </div>
                    <el-scrollbar :style="{ height: '650px' }">
                        <div>
                            <div>
                                <svg-icon icon-class="icon-wenjianjia" />
                                <svg class="icon" aria-hidden="true" :style="{ width: '20px', height: '20px' }">
                                    <use xlink:href="#icon-wenjianjia"></use>
                                </svg>
                                <span>全部</span>
                            </div>
                            <div v-for="(item, index) in groupList" :key="index">
                                <img src="http://manongyun.oss-cn-hangzhou.aliyuncs.com/Qmpaas/le-icon-folder.png" />
                                <el-input v-if="is_edit === item.id" v-model="item.name" placeholder="请输入内容" :maxlength="8">
                                    <el-button
                                        slot="append"
                                        type="primary"
                                        @click="
                                            (e) => {
                                                UpdateGroupItem(item)
                                                is_edit = -1
                                            }
                                        "
                                    >
                                        确认
                                    </el-button>
                                </el-input>
                                <span v-else>{{ item.name }}</span>
                                <div class="picture-selet__detail-action">
                                    <span type="text" @click="is_edit = item.id">编辑</span>
                                    |
                                    <span type="text" @click="handleGroupDelete(item.id, 2)">删除</span>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-card>
            </div>

            <div></div>
        </div>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { set } from 'nprogress'
import { debounce } from '@/utils/utils.js'
export default {
    name: 'MaterialCenter',
    components: { },
    mixins: [common, cud],

    data() {
        return {
            url: { getData: '/basic/s/file/queryPageByShop' }
        }
    },

    computed: {},
    mounted() {},
    methods: {}
}
</script>
<style lang="scss" scoped>
::v-deep .el-card__header {
    background-color: #f3f5f7;
}
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>
