import { request } from '@/utils/request'

const helpApi = {
    // 获取所有帮助栏目项
    getMenuList: (data) => request.get('/shop/s/all/shopNewsCategory', data),
    // 获取某帮助栏目项下的文章
    getMenuArticle: (data) => request.get('/shop/all/shopNews', data),
    // 依据关键字查询帮助文章
    searchArticle: (data) => request.get('/shop/shopWord', data),
    // 查看文章详情
    getShopNewsDetail: (data) => request.get('/shop/get/shopNews', data)
}

export { helpApi }
