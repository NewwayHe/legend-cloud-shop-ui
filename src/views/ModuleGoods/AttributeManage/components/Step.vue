<template>
    <div class="step-wrapper">
        <div class="step-1">
            <div class="item">
                <div class="line"></div>
                <div class="button">
                    <router-link to="/ModuleGoods/attributeManage/specifications">
                        <el-button type="primary" size="mini" plain>设置规格</el-button>
                    </router-link>
                </div>
            </div>

            <div class="item">
                <div class="line"></div>
                <div class="button">
                    <router-link to="/ModuleGoods/attributeManage/params">
                        <el-button type="primary" size="mini" plain>设置参数</el-button>
                    </router-link>
                    <router-link to="/ModuleGoods/attributeManage/paramsGroup">
                        <el-button style="margin-left: 15%" type="primary" size="mini" plain>设置参数组</el-button>
                    </router-link>
                </div>
            </div>
            <div class="item">
                <div class="line"></div>
                <div class="button">
                    <router-link to="/ModuleGoods/attributeManage/commodityBrand">
                        <el-button type="primary" size="mini" plain>设置品牌</el-button>
                    </router-link>
                </div>
            </div>
            <div class="item">
                <div class="line"></div>
                <div class="button">
                    <router-link to="/ModuleGoods/attributeManage/commodityCategory">
                        <el-button type="primary" size="mini" plain>设置类目</el-button>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="step-2">
            <div class="line"></div>
            <div class="button">
                <router-link to="/ModuleGoods/attributeManage/specificationParamsGroup">
                    <el-button type="primary" size="small" plain>类目关联规格/参数/参数组/品牌</el-button>
                </router-link>
            </div>
        </div>
        <div class="step-3 flex-1 text-center" style="align-self: center">
            <div>
                <span class="sumit">商家发布商品</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Step'
}
</script>

<style lang="scss" scoped>
::v-deep.el-step.is-horizontal {
    .el-step__line {
        height: 1px;
    }
}
::v-deep.el-step__title.is-wait {
    font-size: 12px;
}
</style>

<style lang="scss" scoped>
.step-wrapper {
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    .step-1 {
        margin-left: 7%;
        position: relative;
        flex-basis: 33.3%;

        .item {
            margin-bottom: 20px;
            position: relative;

            .line {
                position: absolute;
                height: 1px;
                width: 100%;
                top: 50%;
                left: 0;
                background-color: #c0c4cc;
            }

            .button {
                position: relative;
                z-index: 1;
            }

            &:after {
                content: '';
                position: absolute;
                width: 1px;
                height: calc(100% + 20px);
                background-color: #c0c4cc;
                top: 50%;
                right: 0;
            }
        }

        .item:last-child:after {
            content: none;
        }

        .item:last-child {
            margin-bottom: 0;
        }

        &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -100%;
            width: 100%;
            height: 1px;
            background-color: #c0c4cc;
        }
    }

    .step-2 {
        flex: 1;
        align-self: center;
        text-align: center;
        position: relative;
        flex-basis: 33.3%;

        .line {
            height: 1px;
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            background-color: #c0c4cc;
        }

        .button {
            position: relative;
            z-index: 1;
        }
    }

    .step-3 {
        flex: 1;
        position: relative;
        z-index: 1;
        flex-basis: 33.3%;

        .sumit {
            padding: 10px;
            border: 1px solid #409eff;
            border-radius: 5px;
            background: #409eff;
            color: #fff;
            font-size: 12px;
        }
    }
}
</style>
