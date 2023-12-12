/* Layout */
import Layout from '@/layout'
const ModuleCommon = [
    {
        path: '/register',
        component: () => import('@/views/ModuleCommon/register/index'),
        hidden: true,
		meta: { title: '注册' }
    },
    {
        path: '/agreeMent',
        name: 'agreeMent',
        component: () => import('@/views/ModuleCommon/components/agreeMent'),
        hidden: true,
		meta: { title: '注册协议' }
    },
    {
        path: '/forgetPwd',
        component: () => import('@/views/ModuleCommon/forgetPwd/index'),
        hidden: true,
		meta: { title: '忘记密码' }
    },
    {
        path: '/login',
        component: () => import('@/views/ModuleCommon/login/index'),
        hidden: true,
		meta: { title: '账号登录' }
    },
    {
        path: '/staffLogin',
        component: () => import('@/views/ModuleCommon/login/staffLogin'),
        hidden: true,
		meta: { title: '员工账号登录' }
    },
    {
        path: '/shopMoveIn',
        component: () => import('@/views/ModuleCommon/shopMoveIn/index'),
        name:'shopMoveIn',
        hidden: true,
		meta: { title: '商家入驻' }
    },
    {
        path: '/userHelpCenter',
        component: () => import('@/views/ModuleCommon/userHelpCenter/index'),
        hidden: true,
		meta: { title: '帮助中心' }
    },
    {
        path: '/userMessage',
        component: () => import('@/views/ModuleCommon/userMessage'),
        hidden: true,
		meta: { title: '消息' }
    },
    {
        path: '/userMessageDetail',
        component: () => import('@/views/ModuleCommon/userMessage/userMessageDetail'),
        hidden: true,
		meta: { title: '消息详情' }
    },
    {
        path: '/help',
        component: Layout,
        name: 'help',
        children: [
            {
                path: 'helpCenter',
                component: () => import('@/views/ModuleCommon/helpCenter'),
                name: 'helpCenter',
                meta: { title: '帮助中心' }
            }
        ],
        hidden: true
    },

    {
        path: '/messageManage',
        component: Layout,
        name: 'messageManage',
        children: [
            {
                path: 'message',
                component: () => import('@/views/ModuleCommon/message'),
                name: 'message',
                hidden: true,
                meta: { title: '消息' }
            },
            {
                path: 'messageDetail',
                component: () => import('@/views/ModuleCommon/message/messageDetail'),
                name: 'messageDetail',
                hidden: true,
                meta: { title: '消息详情' }
            }
        ]
    }
]

export default ModuleCommon
