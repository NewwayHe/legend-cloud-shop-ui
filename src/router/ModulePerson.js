import Layout from '@/layout'
const ModulePerson = [
    {
        path: '/ModulePerson',
        component: Layout,
        redirect: '/ModulePerson/personal/accountManage',
        name: 'ModulePerson',
        meta: {
            title: '个人信息',
            icon: 'huiyuan'
        },
        children: [
            {
                path: 'personal',
                component: () => import('@/views/ModulePerson/personal'), // Parent router-view
                name: 'personal',
                meta: { title: '账户安全' },
                children: [
                    {
                        path: 'accountManage',
                        component: () => import('@/views/ModulePerson/personal/accountManage'),
                        name: 'accountManage',
                        meta: { title: '个人信息' }
                    },
                    {
                        path: 'editAccountInfo',
                        component: () => import('@/views/ModulePerson/personal/editAccountInfo'),
                        name: 'editAccountInfo',
                        meta: { title: '验证步骤' },
                        hidden: true
                    }
                ]
            }
        ]
    }
]

export default ModulePerson
