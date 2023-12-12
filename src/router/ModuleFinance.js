/* Layout */
import Layout from '@/layout'
const ModuleFinance = [
    {
        path: '/ModuleFinance',
        component: Layout,
        redirect: '/ModuleFinance/bill/billList',
        name: 'ModuleFinance',
        meta: {
            title: '财务管理',
            icon: 'yonghu'
        },
        children: [
            {
                path: 'billList',
                component: () => import('@/views/ModuleFinance/bill/billList'), // Parent router-view
                name: 'billList',
                meta: { title: '结算账单' }
            },
            {
                path: 'billDetail',
                component: () => import('@/views/ModuleFinance/bill/billDetail'), // Parent router-view
                name: 'billDetail',
                meta: { title: '账单详情' }
            },
            {
                path: 'balance',
                component: () => import('@/views/ModuleFinance/balance'), // Parent router-view
                name: 'balance',
                meta: { title: '我的余额' }
            }
        ]
    }
]

export default ModuleFinance
