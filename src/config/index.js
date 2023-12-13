/*
 * @Description: 配置公用参数
 * 备注:本文件是dev环境下才走的，正式环境下不走这里,而是走serviceConfig.js
 */
// let env = 'dev'
let env = 'test'
const configs = {
    dev: {
        shareUrl: 'http://localhost:8080' /* 分享专用链接(跳手机端) */,
        // server: 'http://192.168.0.112:9999', /* API请求服务器 */
        server: 'http://192.168.0.73:9999' /* API请求服务器 */,
        photoServer: 'http://192.168.0.16:9000/dev7.0-code-sr1/', // 图片服务器地址
        AmapKey: '' /*高德地图的key值(https://lbs.amap.com/上申请)，需要配合AmapJsCode(安全密钥)一起用*/,
        AmapJsCode: ''
        // asyncRoutes: true //true：本地路由，false(或者屏蔽)：后端动态路由
    },
    // 链接：http://mall-shop.legendmall.cn	(13800138000 / Aa123456)
    test: {
        shareUrl: 'http://localhost:8080' /* 分享专用链接(跳手机端) */,
        // shareUrl: 'http://mall.legendmall.cn',/* 分享专用链接(跳手机端) */
        server: 'http://mall-api.legendmall.cn' /* API请求服务器 */,
        photoServer: 'http://mall-minio.legendmall.cn/legend-cloud/' /* 图片服务器 */,
        AmapKey: '' /*高德地图的key值(https://lbs.amap.com/上申请)，需要配合AmapJsCode(安全密钥)一起用*/,
        AmapJsCode: ''
        // asyncRoutes: true //true：本地路由，false(或者屏蔽)：后端动态路由
    }
}
const config = configs[env]
export default config
