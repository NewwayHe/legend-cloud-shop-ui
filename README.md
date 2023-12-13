### 企业级微服务架构电商系统
- 🦾 [Legend Cloud 是一款企业级微服务架构电商系统，全面拥抱Spring全家桶，基于Spring 6.0.13 、Spring Boot 3.1.5、Spring Cloud 2022.0.4、Spring Authorization Server 1.1.3、Spring Cloud Alibaba 2022.0.0.0、Nacos 2.2.1 等主流技术栈开发的B2B2C电商系统，遵循SpringBoot 编程思想，高度模块化和可配置化。具备服务发现、配置、熔断、限流、降级、监控、多级缓存、分布式事务、等功能。 ] 

## 演示地址
- 🗂 [商城后台管理](http://mall-admin.legendmall.cn/)
- 📦 [商城商家端](http://mall-shop.legendmall.cn/)
- ⚡️ [用户H5端](http://mall.legendmall.cn/)

## 相关项目地址
- 📑 [B2C单体版地址(暂未开源,敬请期待)](https://gitee.com/legendmall/legend)
- 🍍 [前端-平台端工程地址](https://gitee.com/legendmall/legend-cloud-admin-ui)
- 🎨️ [前端-商家端工程地址](https://gitee.com/legendmall/legend-cloud-shop-ui)
- 🔥️ [前端-用户端工程地址](https://gitee.com/legendmall/legend-cloud-user-ui)

## 功能介绍
- ✅ [详情见官方网站](https://code.legendshop.cn/)

# 授权协议
本项目基于 APGL 3.0 开源协议，商业项目请联系授权，并遵守以下补充条款：
不得将本软件应用于危害国家安全、荣誉和利益的行为，不能以任何形式用于非法为目的的行为。
在延伸的代码中（修改现有源代码衍生的代码中）需要带有原来代码中的协议、版权声明和其他原作者 规定需要包含的说明（请尊重原作者的著作权，不要删除或修改文件中的Copyright和@author信息） 更不要，全局替换源代码中的 Legendshop Cloud等字样，否则你将违反本协议条款承担责任。
您若套用本软件的一些代码或功能参考，请保留源文件中的版权和作者，需要在您的软件介绍明显位置 说明出处，举例：本软件基于 Legend Cloud 微服务架构，并附带链接：https://www.legendshop.cn
任何基于本软件而产生的一切法律纠纷和责任，均于作者无关。
如果你对本软件有改进，希望可以贡献给我们，双向奔赴互相成就才是王道。
本项目已申请软件著作权，请尊重开源。

# 系统介绍
> 这是一个基于 vue-admin-template 管理后台。
> 商家管理系统

# 主要前端技术点
1.框架--vue,vue-router,vuex
2.第三方请求库--axios
3.UI框架--element
4.富文本--Tinymce
5.视频播放组件--xgplayer
6.时间处理组件--moment
7.拖拽组件--vuedraggable
8.阿里图标库
9.可视化图表库--e-Charts

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
│   ├── favicon.ico	 // 网站图标
│   └── index.html	// 应用的入口 HTML 文件
├── src 		// 项目源代码
│   ├── api  // api接口统一模块管理
│   │   ├── menu.js
│   │   ├── ModuleCommon.js 	// 通用模块api
│   │   ├── ModuleData.js		// 数据管理模块api
│   │   ├── ModuleFinance.js	// 财务管理模块api
│   │   ├── ModuleGoods.js		// 商品管理模块api
│   │   ├── ModuleHelp.js		// 帮助中心模块api
│   │   ├── ModuleMarketing.js	// 营销管理模块api
│   │   ├── ModuleOperate.js	// 运营管理模块api
│   │   ├── ModuleOrder.js		// 订单管理模块api
│   │   ├── ModuleSystem.js		// 系统设置模块api
│   │   ├── ModuleUser.js		// 用户管理模块api
│   │   └── user.js				// 登录相关api
│   ├── assets // 静态资源文件，如图片、字体等
│   │   ├── 404_images
│   │   ├── defalutImg
│   │   ├── icons
│   │   └── images
│   ├── comCommon // 常用公用组件
│   │   ├── dialogLink
│   │   └── dialogAudit.vue
│   ├── components // Vue 组件
│   │   ├── Breadcrumb
│   │   ├── Charts
│   │   ├── CustomTable
│   │   ├── dialogUrl
│   │   ├── Empty //数据为空时统一组件
│   │   ├── Hamburger
│   │   ├── IconSelect
│   │   ├── imgPreview
│   │   ├── iphone // 一个手机模型
│   │   ├── lsImage // 线上图片用这个组件
│   │   ├── Pagination //el-pagination组件二次封装
│   │   ├── SelfTable
│   │   ├── lsSticky // 吸顶组件
│   │   ├── SvgIcon
│   │   ├── Tinymce // 富文本
│   │   ├── Upload // 图片上传组件
│   │   ├── Verifition // 登录滑块验证组件
│   │   └── vueDraggableResizable // 拖拽组件
│   ├── config  // 配置文件
│   │   ├── index.js // 本地调试环境的服务器的配置
│   │   └── serviceConfig.js // 线上生产环境的服务器的配置
│   ├── filters
│   │   └── filters.js // 统一封装的filters方法
│   ├── fonts // 阿里图标库
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
│   │   ├── index.js	// 跳转路由文件(注意：下面的路由，只有在config.js(生产环境是serviceConfig.js文件)里将asyncRoutes设为true，才会生效，否则是以admin后台配置的路由为准)
│   │   ├── ModuleCommon.js		// 通用模块路由
│   │   ├── ModuleData.js		// 数据管理模块路由
│   │   ├── ModuleFinance.js	// 财务管理模块路由
│   │   ├── ModuleGoods.js		// 商品管理模块路由
│   │   ├── ModuleMarketing.js	// 营销管理模块路由
│   │   ├── ModuleOperate.js	// 运营管理模块路由
│   │   ├── ModulePerson.js		// 个人信息模块路由
│   │   ├── ModuleSystem.js		// 系统设置模块路由
│   │   └── ModuleUser.js		// 用户管理模块路由
│   ├── store // vuex的状态控制文件夹
│   │   ├── modules
│   │   ├── getters.js
│   │   └── index.js	// 状态变量文件
│   ├── styles
│   │   ├── commom.scss
│   │   ├── customTable.scss
│   │   ├── element-ui.scss
│   │   ├── element-variables.scss
│   │   ├── index.scss
│   │   ├── ls-main.scss  // 公共css样式(整个项目就用这个)
│   │   ├── mixin.scss
│   │   ├── sidebar.scss
│   │   ├── table.scss
│   │   ├── transition.scss
│   │   └── variables.scss
│   ├── utils // 工具类组件
│   │   ├── auth.js
│   │   ├── checkInfo.js	//统一封装的正则效验方法
│   │   ├── clipboard.js
│   │   ├── dom-to-image.js  // html元素转图片
│   │   ├── encryption.js	// 加密
│   │   ├── get-page-title.js
│   │   ├── index.js
│   │   ├── request.js	//接口统一js
│   │   ├── scroll-to.js
│   │   ├── sku.js
│   │   ├── utils.js	// 本项目大部分的工具类js写在这个文件里
│   │   └── validate.js
│   ├── views	// 页面组件，我们开发的页面就是写在这
│   │   ├── dashboard
│   │   ├── login
│   │   ├── ModuleCommon	// 通用模块
│   │   ├── ModuleData		// 数据管理模块
│   │   ├── ModuleFinance	// 财务管理模块
│   │   ├── ModuleGoods		// 商品管理模块
│   │   ├── ModuleMarketing // 营销管理模块
│   │   ├── ModuleOrder		// 订单管理模块
│   │   ├── ModuleOperate	// 运营管理模块
│   │   ├── ModulePerson	// 个人信息模块
│   │   ├── ModuleSystem	// 系统设置模块
│   │   ├── ModuleUser		// 用户管理模块
│   │   └── 404.vue
│   ├── App.vue		// 根组件
│   ├── main.js 	//应用入口文件
│   ├── permission.js
│   └── settings.js
├── .gitignore		// Git 忽略文件配置
├── babel.config.js		// Babel 配置文件
├── jest.config.js
├── jsconfig.json
├── package.json	// 项目配置和依赖
├── postcss.config.js
├── README.md		// 项目说明文件
└── vue.config.js	// Vue CLI 配置文件

```

