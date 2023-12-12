/* Layout */
import Layout from '@/layout'
const ModuleData = [
    {
        path: '/ModuleData',
        component: Layout,
        redirect: '/ModuleData/reportManage',
        name: 'ModuleData',
        meta: {
            title: '数据管理',
            icon: 'data'
        },
        children: [
            {
                path: 'productData',
                component: () => import('@/views/ModuleData/productData'),
                name: 'productData',
                meta: {
                    title: '商品报表'
                },
                children: [
                    {
                        path: 'productStatistics',
                        component: () => import('@/views/ModuleData/productData/productStatistics'),
                        name: 'productStatistics',
                        meta: {
                            title: '商品统计'
                        }
                    },
                    {
                        path: 'salesRanking',
                        component: () => import('@/views/ModuleData/productData/salesRanking'),
                        name: 'salesRanking',
                        meta: {
                            title: '商品销售排行'
                        }
                    },
                    {
                        path: 'dataTrends',
                        component: () => import('@/views/ModuleData/productData/dataTrends'),
                        name: 'dataTrends',
                        meta: {
                            title: '趋势图'
                        }
                    },
                    {
                        path: 'productSurvey',
                        component: () => import('@/views/ModuleData/productData/productSurvey'),
                        name: 'productSurvey',
                        meta: {
                            title: '商品概况'
                        }
                    },
                    {
                        path: 'categorySurvey',
                        component: () => import('@/views/ModuleData/productData/categorySurvey'),
                        name: 'categorySurvey',
                        meta: {
                            title: '类目概况'
                        }
                    }
                ]
            },
        ]
    }
]

export default ModuleData
