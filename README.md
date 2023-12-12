# 系统介绍
> 这是一个基于 vue-admin-template 管理后台。
> 平台管理系统

# 主要前端技术点
1.框架--vue,vue-router,vuex
2.第三方请求库--axios
3.UI框架--element
4.富文本--Tinymce
5.视频播放组件--xgplayer
6.时间处理组件--moment
7.拖拽组件--vuedraggable


# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

# 构建生产环境
npm run build
```

## 其它

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```


# 代码目录结构
├── public  // 公共文件夹，此文件夹不会打包压缩
│   ├── static
│   │   └── tinymce
│   ├── favicon.ico
│   └── index.html
├── src 
│   ├── api  // api接口统一模块管理
│   │   ├── menu.js
│   │   ├── ModuleCommon.js
│   │   ├── ModuleFinance.js
│   │   ├── ModuleGoods.js
│   │   ├── ModuleLive.js
│   │   ├── ModuleMarketing.js
│   │   ├── ModuleOrder.js
│   │   ├── ModuleStore.js
│   │   ├── ModuleSystem.js
│   │   ├── ModuleThirdParty.js
│   │   ├── ModuleUser.js
│   │   └── user.js
│   ├── assets // 静态文件管理文件夹
│   │   ├── 404_images
│   │   ├── defalutImg
│   │   ├── icons
│   │   └── images
│   ├── comCommon // 常用公用组件
│   │   ├── dialogUrl
│   │   └── dialogAudit.vue
│   ├── components //组件
│   │   ├── Breadcrumb
│   │   ├── Charts
│   │   ├── CustomTable
│   │   ├── dialogUrl
│   │   ├── Empty
│   │   ├── Hamburger
│   │   ├── IconSelect
│   │   ├── imgPreview
│   │   ├── iphone
│   │   ├── lsImage
│   │   ├── Pagination
│   │   ├── SelfTable
│   │   ├── Sticky
│   │   ├── SvgIcon
│   │   ├── Tinymce
│   │   ├── Upload
│   │   ├── Verifition
│   │   └── vueDraggableResizable
│   ├── config  // 配置文件
│   │   ├── index.js
│   │   └── serviceConfig.js
│   ├── filters
│   │   └── filters.js
│   ├── fonts // 字体文件
│   ├── fonts-bn  // 字体文件
│   ├── icons  // 图标
│   │   ├── svg
│   │   ├── index.js
│   │   └── svgo.yml
│   ├── layout // 公共布局
│   │   ├── components
│   │   ├── mixin
│   │   └── index.vue
│   ├── mixins // 混入
│   │   └── pages  //分页混入处理，每个分页就不用重复编写了
│   ├── router  //路由按模块划分管理
│   │   ├── index.js
│   │   ├── ModuleData.js
│   │   ├── ModuleFinance.js
│   │   ├── ModuleFinancial.js
│   │   ├── ModuleGoods.js
│   │   ├── ModuleLive.js
│   │   ├── ModuleMarketing.js
│   │   ├── ModuleOrder.js
│   │   ├── ModuleStore.js
│   │   ├── ModuleSystem.js
│   │   ├── ModuleThirdParty.js
│   │   └── ModuleUser.js
│   ├── store // 仓库
│   │   ├── modules
│   │   ├── getters.js
│   │   └── index.js
│   ├── styles
│   │   ├── commom.scss
│   │   ├── customTable.scss
│   │   ├── element-ui.scss
│   │   ├── element-variables.scss
│   │   ├── index.scss
│   │   ├── ls-main.scss
│   │   ├── mixin.scss
│   │   ├── sidebar.scss
│   │   ├── table.scss
│   │   ├── transition.scss
│   │   └── variables.scss
│   ├── utils
│   │   ├── auth.js
│   │   ├── clipboard.js
│   │   ├── dom-to-image.js
│   │   ├── encryption.js
│   │   ├── get-page-title.js
│   │   ├── index.js
│   │   ├── request.js
│   │   ├── scroll-to.js
│   │   ├── sku.js
│   │   ├── tools.js
│   │   └── validate.js
│   ├── views
│   │   ├── dashboard
│   │   ├── form
│   │   ├── login
│   │   ├── ModuleColleges
│   │   ├── ModuleData
│   │   ├── ModuleFinance
│   │   ├── ModuleFinancial
│   │   ├── ModuleGoods
│   │   ├── ModuleLive
│   │   ├── ModuleMarketing
│   │   ├── ModuleOrder
│   │   ├── ModuleStore
│   │   ├── ModuleSystem
│   │   ├── ModuleTag
│   │   ├── ModuleThirdParty
│   │   ├── ModuleUser
│   │   ├── nested
│   │   ├── table
│   │   ├── tree
│   │   └── 404.vue
│   ├── App.vue
│   ├── main.js
│   ├── permission.js
│   └── settings.js
├── babel.config.js
├── debug.log
├── directoryList.md
├── jest.config.js
├── jsconfig.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── README-zh.md
├── README.md
├── tree.md
├── vue.config.js
└── yarn.lock

```
