import Layout from '@/layout'

const ModuleOperate = [
    {
        path: '/ModuleOperate',
        component: Layout,
        redirect: '/ModuleOperate/operateManange',
        name: 'ModuleOperate',
        meta: {
            title: '运营管理',
            icon: 'data'
        },
        children: [
            // 商品管理start
            {
                path: 'businessManage',
                component: () => import('@/views/ModuleOperate/businessManage'),
                name: 'businessManage',
                meta: { title: '交易管理' },
                children: [
                    {
                        path: 'order',
                        component: () => import('@/views/ModuleOperate/businessManage/order'),
                        name: 'order',
                        meta: { title: '商品订单' }
                    },
                    {
                        path: 'orderDetail',
                        component: () => import('@/views/ModuleOperate/businessManage/order/orderDetail'),
                        name: 'orderDetail',
                        meta: { title: '订单详情' },
                        hidden: true
                    },
                    
                    {
                        path: 'serviceOrderList',
                        component: () => import('@/views/ModuleOperate/businessManage/serviceOrderList'),
                        name: 'serviceOrderList',
                        meta: { title: '售后订单' }
                    },
                    {
                        path: 'refuseDetail',
                        component: () => import('@/views/ModuleOperate/businessManage/serviceOrderList/refuseDetail'),
                        name: 'refuseDetail',
                        meta: { title: '售后订单详情' },
                        hidden: true
                    },
                    {
                        path: 'shopApplicationDetail',
                        component: () => import('@/views/ModuleOperate/businessManage/serviceOrderList/shopApplicationDetail'),
                        name: 'shopApplicationDetail',
                        meta: { title: '商家申请售后订单详情' },
                        hidden: true
                    },
                    {
                        path: 'invoice',
                        component: () => import('@/views/ModuleOperate/businessManage/invoice'),
                        name: 'invoice',
                        meta: { title: '发票管理' }
                    },
                    {
                        path:'batchSend',
                        component: () => import('@/views/ModuleOperate/businessManage/order/batchSend'),
                        name: 'batchSend',
                        meta: { title: '批量发货' }
                    }
                ]
            },
            {
                path: 'commentManage',
                component: () => import('@/views/ModuleOperate/commentManage'),
                name: 'commentManage',
                meta: { title: '评论管理' },
                children: [
                    {
                        path: 'commentList',
                        component: () => import('@/views/ModuleOperate/commentManage/commentList'),
                        name: 'commentList',
                        meta: { title: '评论列表' }
                    },
                    {
                        path: 'commentInfo',
                        component: () => import('@/views/ModuleOperate/commentManage/commentList/commentInfo'),
                        name: 'commentInfo',
                        meta: { title: '评论详情' },
                        hidden: true
                    },
                    {
                        path: 'commentDetail',
                        component: () => import('@/views/ModuleOperate/commentManage/commentList/commentDetail'),
                        name: 'commentDetail',
                        meta: { title: '评论详情' },
                        hidden: true
                    }
                ]
            },
        ]
    },
    {
        path: '/orderPrint',
        component: () => import('@/views/ModuleOperate/businessManage/order/orderPrint'),
        name: 'orderPrint',
        meta: { title: '打印订单' },
        hidden: true
    }
]

export default ModuleOperate
