/* Layout */
import Layout from '@/layout'
const ModuleSystem = [
    {
        path: '/ModuleUser',
        component: Layout,
        redirect: '/ModuleUser/userManage',
        name: 'ModuleUser',
        meta: {
            title: '用户管理',
            icon: 'yonghu'
        },
        children: [
            {
                path: 'positionManage',
                component: () => import('@/views/ModuleUser/positionManage'), // Parent router-view
                name: 'positionManage',
                meta: { title: '职位管理' }
            },
            {
                path: 'staffManage',
                component: () => import('@/views/ModuleUser/staffManage'), // Parent router-view
                name: 'staffManage',
                meta: { title: '员工管理' }
            }
        ]
    }
]

export default ModuleSystem
