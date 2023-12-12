/* Layout */
import Layout from '@/layout'
const ModuleMarketing = [
    {
        path: '/ModuleMarketing',
        component: Layout,
        redirect: '/ModuleMarketing/shopActivity',
        name: 'ModuleMarketing',
        meta: {
            title: '营销管理',
            icon: 'shuju'
        },
        children: [
            {
                path: 'marketing',
                component: () => import('@/views/ModuleMarketing/marketing'),
                name: 'marketing',
                meta: {
                    title: '营销广场'
                }
            },
            {
                path: 'activeCoupon',
                component: () => import('@/views/ModuleMarketing/activeCoupon'),
                name: 'activeCoupon',
                meta: {
                    title: '优惠券'
                }
            },
            {
                path: 'addCoupon',
                component: () => import('@/views/ModuleMarketing/activeCoupon/addCoupon'),
                // name: 'couponDetail',
                name: 'addCoupon',
                meta: {
                    title: '添加优惠券'
                },
                hidden: true
            },
            {
                path: 'couponData',
                component: () => import('@/views/ModuleMarketing/activeCoupon/couponData'),
                name: 'couponData',
                meta: {
                    title: '优惠券报表'
                },
                hidden: true
            }
        ]
    }
]

export default ModuleMarketing
