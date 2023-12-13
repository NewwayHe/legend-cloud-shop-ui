/* Layout */
import Layout from '@/layout'
const ModuleSystem = [
    {
        path: '/ModuleSystem',
        component: Layout,
        redirect: '/ModuleSystem/shopManage',
        name: 'ModuleSystem',
        meta: {
            title: '设置',
            icon: 'huiyuan'
        },
        children: [
            {
                path: 'baseSet',
                component: () => import('@/views/ModuleSystem/shopManage/baseSet.vue'), // Parent router-view
                name: 'baseSet',
                meta: { title: '店铺设置' }
            },
            {
                path: 'orderSystem',
                component: () => import('@/views/ModuleSystem/orderSystem/index'), // Parent router-view
                name: 'orderSystem',
                meta: { title: '订单设置' },
                children: [
                    {
                        path: 'ortherSet',
                        component: () => import('@/views/ModuleSystem/orderSystem/ortherSet'), // Parent router-view
                        name: 'ortherSet',
                        meta: { title: '其他设置' }
                    },
                    {
                        path: 'freightTemplate',
                        component: () => import('@/views/ModuleSystem/orderSystem/freightTemplate'), // Parent router-view
                        name: 'freightTemplate',
                        meta: { title: '运费模板' }
                    },
                    {
                        path: 'freightAdd',
                        component: () => import('@/views/ModuleSystem/orderSystem/freightTemplate/freightAdd'), // Parent router-view
                        name: 'freightAdd',
                        meta: { title: '新增运费模板' },
                        hidden: true
                    },
                    {
                        path: 'logistics',
                        component: () => import('@/views/ModuleSystem/orderSystem/logistics'),
                        name: 'logistics',
                        meta: { title: '物流设置' }
                    }
                ]
            },
            {
                path: 'materialCenter',
                component: () => import('@/views/ModuleSystem/materialCenter'), // Parent router-view
                name: 'materialCenter',
                meta: { title: '素材中心' }
            }
        ]
    }
]

export default ModuleSystem
