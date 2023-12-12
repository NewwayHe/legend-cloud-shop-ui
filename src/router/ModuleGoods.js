/* Layout */
import Layout from '@/layout'
const ModuleGoods = [
    {
        path: '/ModuleGoods',
        component: Layout,
        redirect: '/ModuleGoods/goodsManage',
        name: 'ModuleGoods',
        meta: {
            title: '商品管理',
            icon: 'shangpin'
        },
        children: [
            // 商品管理start
            {
                path: 'GoodsManage',
                component: () => import('@/views/ModuleGoods/GoodsManage/index'), // Parent router-view
                name: 'GoodsManage',
                meta: { title: '商品管理' },
                children: [
                    // {
                    //     path: 'addGood',
                    //     component: () => import('@/views/ModuleGoods/GoodsManage/addGood'), // Parent router-view
                    //     name: 'addGood',
                    //     meta: { title: '商品添加' , noCache: true},
                    //     hidden: true
                    // },
                    {
                        path: 'goodList',
                        component: () => import('@/views/ModuleGoods/GoodsManage/goodList'), // Parent router-view
                        name: 'goodList',
                        meta: { title: '商品列表' }
                    },
                    {
                        path: 'aduitList',
                        component: () => import('@/views/ModuleGoods/GoodsManage/aduitList'), // Parent router-view
                        name: 'goodsManageAduitList',
                        meta: { title: '商品审核列表' }
                    },

                    {
                        path: 'violationsGood',
                        component: () => import('@/views/ModuleGoods/GoodsManage/violationsGood'), // Parent router-view
                        name: 'violationsGood',
                        meta: { title: '违规商品列表' }
                    },
                    {
                        path: 'goodsRecoveryList',
                        component: () => import('@/views/ModuleGoods/GoodsManage/goodsRecoveryList'), // Parent router-view
                        name: 'goodsRecoveryList',
                        meta: { title: '商品回收站' }
                    },
                    {
                        path: 'report',
                        component: () => import('@/views/ModuleGoods/GoodsManage/report'), // Parent router-view
                        name: 'goodsManageReport',
                        meta: { title: '商品举报' }
                    }
                ]
            },
            {
                path: 'addGood',
                component: () => import('@/views/ModuleGoods/GoodsManage/addGood'), // Parent router-view
                name: 'addGood',
                meta: { title: '商品添加', noCache: true },
                hidden: true
            },
            // 商品管理end
            // //属性管理start
            {
                path: 'AttributeManage',
                component: () => import('@/views/ModuleGoods/AttributeManage/index'), // Parent router-view
                name: 'AttributeManage',
                meta: {
                    title: '属性管理'
                },
                children: [
                    {
                        path: 'specifications',
                        component: () => import('@/views/ModuleGoods/AttributeManage/specifications/index'), // Parent router-view
                        name: 'specifications',
                        meta: { title: '规格管理' }
                    },
                    {
                        path: 'speOperate',
                        component: () => import('@/views/ModuleGoods/AttributeManage/specifications/speOperate'), // Parent router-view
                        name: 'speOperate',
                        meta: { title: '新增规格' },
                        hidden: true
                    },
                    {
                        path: 'params',
                        component: () => import('@/views/ModuleGoods/AttributeManage/params'), // Parent router-view
                        name: 'params',
                        meta: { title: '参数管理' }
                    },
                    {
                        path: 'paramsOperate',
                        component: () => import('@/views/ModuleGoods/AttributeManage/params/paramsOperate'), // Parent router-view
                        name: 'paramsOperate',
                        meta: { title: '新增参数' },
                        hidden: true
                    },
                    {
                        path: 'paramsGroup',
                        component: () => import('@/views/ModuleGoods/AttributeManage/paramsGroup'), // Parent router-view
                        name: 'paramsGroup',
                        meta: { title: '参数组管理' }
                    },
                    {
                        path: 'commodityCategory',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityCategory'), // Parent router-view
                        name: 'commodityCategory',
                        meta: { title: '商品类目' }
                    },
                    {
                        path: 'categoryDetail/:id',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityCategory/categoryDetail'), // Parent router-view
                        name: 'categoryDetail',
                        meta: { title: '查看商品类目', noCache: true },
                        hidden: true
                    },
                    {
                        path: 'categoryOperate',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityCategory/categoryOperate'), // Parent router-view
                        name: 'categoryOperate',
                        meta: { title: '编辑商品类目', noCache: true },
                        hidden: true
                    },
                    {
                        path: 'commodityBrand',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityBrand'), // Parent router-view
                        name: 'commodityBrand',
                        meta: { title: '商品品牌' }
                    },
                    {
                        path: 'commodityBrandDetail',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityBrand/commodityBrandDetail'), // Parent router-view
                        name: 'commodityBrandDetail',
                        meta: { title: '查看关联商品', noCache: true },
                        hidden: true
                    }
                    // {
                    //     path: 'specificationParamsGroup',
                    //     component: () =>
                    //         import ('@/views/ModuleGoods/AttributeManage/specificationParamsGroup/index'), // Parent router-view
                    //     name: 'specificationParamsGroup',
                    //     meta: { title: '规格参数分组' }
                    // },
                    // {
                    //     path: 'speParGroupDetail/:id',
                    //     component: () =>
                    //         import ('@/views/ModuleGoods/AttributeManage/specificationParamsGroup/speParGroupDetail'), // Parent router-view
                    //     name: 'speParGroupDetail',
                    //     meta: { title: '规格参数分组详情', noCache: true },
                    //     hidden: true
                    // },
                    // {
                    //     path: 'speParaGroupOper',
                    //     component: () =>
                    //         import ('@/views/ModuleGoods/AttributeManage/specificationParamsGroup/speParaGroupOper'), // Parent router-view
                    //     name: 'speParaGroupOper',
                    //     meta: { title: '新增规格参数分组' },
                    //     hidden: true
                    // }
                ]
            },
            // //属性管理end
            {
                path: 'InventoryManage',
                component: () => import('@/views/ModuleGoods/InventoryManage/index'), // Parent router-view
                name: 'InventoryManage',
                meta: { title: '库存管理' },
                alwaysShow: true,
                children: [
                    {
                        path: 'inventoryManageList',
                        component: () => import('@/views/ModuleGoods/InventoryManage/inventoryManageList'), // Parent router-view
                        name: 'inventoryManageList',
                        meta: { title: '商品库存' }
                    },
                    {
                        path: 'arrivalNotice',
                        component: () => import('@/views/ModuleGoods/InventoryManage/arrivalNotice'), // Parent router-view
                        name: 'arrivalNotice',
                        meta: { title: '到货通知' }
                    }
                ]
            }
        ]
    }
]

export default ModuleGoods
