import config from '@/config'
let amapKey = config.AmapKey
let jscode = config.AmapJsCode
let amapVersion = '1.4.15'//备注：这里只有1.3，1.4.11和2.0版本，填1.4~1.9都是没有这个版本的。2.0版本的话如果key值是错误的，不能输出错误信息，而且2.0版本只有经纬度没有详细地址信息
let _createScript = url => {
    let jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    document.head.appendChild(jsapi)
}
export default () => {
    return new Promise(resolve => {
        if (!window.AMap) { // 判断window下有没有AMap对象，再判断是否引入cdn地图
            _createScript(`https://webapi.amap.com/maps?v=${amapVersion}&key=${amapKey}&callback=aMapInitCallback&jscode=${jscode}"`)
			window._AMapSecurityConfig = {
				securityJsCode:jscode,
			}
            window.aMapInitCallback = () => {
                _createScript('//webapi.amap.com/ui/1.1/main.js')
                // 创建定时器 当AMapUI有值的时候 清除定时器 并resolve
                let interval = setInterval(() => {
                    if (window.AMapUI) {
                        clearInterval(interval)
                        resolve(window.AMap)
                    }
                }, 50)
            }
        } else resolve(window.AMap)
    })
}


