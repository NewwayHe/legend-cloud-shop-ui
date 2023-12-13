/**
 * 获取用户浏览器UA
 */
const getUa = function () {
    const _cache = {}
    if (_cache.ua) {
        return _cache.ua
    }

    let isMobile = false
    let isApple = false
    let isAndroid = false
    let isUc = false
    let isWeixin = false
    let isQQ = false
    let isQQBrowser = false
    let isWeibo = false
    let isIE = false

    // #ifdef H5
    // APP端可用，plus.navigator.getUserAgent
    var ua = window.navigator.userAgent.toLocaleLowerCase()
    // console.log(ua);
    isMobile = !!ua.match(/AppleWebKit.*Mobile.*/i)
    isApple = !!ua.match(/(ipad|iphone|ipod|mac)/i)
    isAndroid = !!ua.match(/android/i)
    isUc = !!ua.match(/ucbrowser/i)
    isWeixin = !!ua.match(/micromessenger/i) // 微信内置浏览器
    isQQ = !!ua.match(/pa qq/i) // QQ内置浏览器
    isQQBrowser = !!ua.match(/MQQBrowser/i) // QQ浏览器
    isWeibo = !!ua.match(/weiBo/i)
    isIE = ua.match(/msie/) != null || ua.match(/trident/) != null
    // #endif

    _cache.ua = {
        isMobile: isMobile,
        isApple: isApple,
        isAndroid: isAndroid,
        isUc: isUc,
        isWeixin: isWeixin,
        isQQ: isQQ,
        isWeibo: isWeibo,
        isQQBrowser: isQQBrowser,
        isIE: isIE
    }

    return _cache.ua
}

/* 防抖
 *@param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 * @return {Function}     返回一个“去弹跳”了的函数
 * 用法：import { debounce } from '@/utils/utils.js';
 *       sure:debounce(function(){}),//备注，不能用箭头函数()=>，不然里面的this不对
 */
function debounce(fn, delay = 500) {
    let timer = null // 声明计时器
    return function () {
        const context = this
        const args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
}

/**
 * uView的防抖,名字是暂时的，升级版本再换回来
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
let timeout = null
function uDebounce(func, wait = 500, immediate = false) {
    // 清除定时器
    if (timeout !== null) clearTimeout(timeout)
    // 立即执行，此类情况一般用不到
    if (immediate) {
        var callNow = !timeout
        timeout = setTimeout(function () {
            timeout = null
        }, wait)
        if (callNow) typeof func === 'function' && func()
    } else {
        // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
        timeout = setTimeout(function () {
            typeof func === 'function' && func()
        }, wait)
    }
}

/* 节流
 *@param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 * @return {Function}     返回一个“去弹跳”了的函数
 * 用法：import { throttle } from '@/utils/utils.js';
 *       sure:throttle(function(){}),//备注，不能用箭头函数()=>，不然里面的this不对
 */
// 这个方法在手机端会出现点击触发第一次后,再次点击时会失效的bug
// function throttle(fn, delay = 500) {
// 	let last = 0;
// 	return function() {
// 		let curr = +new Date();
// 		if (curr - last > delay) {
// 			fn.apply(this, arguments);
// 			last = curr;
// 		}
// 	}
// }
function throttle(fn, delay = 500) {
    let flag = true
    return function () {
        if (!flag) return
        flag = false
        fn.apply(this, arguments)
        setTimeout(() => {
            flag = true
        }, delay)
    }
}
/*
 *@param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */
function createUUID() {
    var d = new Date().getTime()
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now() //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
}

/**
 * 处理时间戳的工具
 */
const time = {
    /**
     * 传送一个以前或将来的时间戳，计算现在距离这个时间多久，小于小时的返回:X分钟前(后)，大小于1天的返回：X小时前(后).......
     */
    timeAgo(time) {
        var nowTime = new Date().getTime()
        var f = nowTime - time
        var bs = f >= 0 ? '前' : '后' // 判断时间点是在当前时间的 之前 还是 之后
        f = Math.abs(f)
        if (f < 6e4) {
            return '刚刚'
        } // 小于60秒,刚刚
        if (f < 36e5) {
            return parseInt(f / 6e4) + '分钟' + bs
        } // 小于1小时,按分钟
        if (f < 864e5) {
            return parseInt(f / 36e5) + '小时' + bs
        } // 小于1天按小时
        if (f < 2592e6) {
            return parseInt(f / 864e5) + '天' + bs
        } // 小于1个月(30天),按天数
        if (f < 31536e6) {
            return parseInt(f / 2592e6) + '个月' + bs
        } // 小于1年(365天),按月数
        return parseInt(f / 31536e6) + '年' + bs // 大于365天,按年算
    },
    /**
     * 传送一个时间戳，返回num天后这个时间段的时间戳
     * now:时间戳(不存值就默认为当前时间的时间戳)
     * num：在now的时间戳的基础上，加num天
     * 例如：2021-05-13 21:02:56 (该时间的时间戳为：1620910976000)，要返回2天后 2021-05-15 21:02:56的时间戳，
     * 		addDays(1620910976000,2) = 1621083776000  (2021-05-15 21:02:56)
     */
    addDays(now = new Date().getTime(), num) {
        return now + num * 60 * 60 * 24 * 1000
    },

    /**
     * Parse the time to string
     * @param {(Object|string|number)} time
     * @param {string} cFormat
     * @returns {string | null}
     */
    parseTime(time, cFormat) {
        if (arguments.length === 0) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
                time = parseInt(time)
            }
            if (typeof time === 'number' && time.toString().length === 10) {
                time = time * 1000
            }
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
            const value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
            if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value]
            }
            return value.toString().padStart(2, '0')
        })
        return time_str
    },
    /**
     * @param {number} time
     * @param {string} option
     * @returns {string}
     */
    formatTime(time, option) {
        if (('' + time).length === 10) {
            time = parseInt(time) * 1000
        } else {
            time = +time
        }
        const d = new Date(time)
        const now = Date.now()

        const diff = (now - d) / 1000

        if (diff < 30) {
            return '刚刚'
        } else if (diff < 3600) {
            // less 1 hour
            return Math.ceil(diff / 60) + '分钟前'
        } else if (diff < 3600 * 24) {
            return Math.ceil(diff / 3600) + '小时前'
        } else if (diff < 3600 * 24 * 2) {
            return '1天前'
        }
        if (option) {
            return parseTime(time, option)
        } else {
            return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
        }
    }
}

/**
 * 处理颜色的工具
 */
const color = {
    /**
     * 十六进制颜色值转rgb值
     * 例如：colorRgb(#ee9922) = {r:238,g:153,b:34}
     */
    colorRgb(sColor) {
        if (sColor) {
            sColor = sColor.toLowerCase()
        }
        // 十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = '#'
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
                }
                sColor = sColorNew
            }
            // 处理六位的颜色值
            var sColorChange = []
            for (var i = 1; i < sColor.length; i += 2) {
                sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
            }

            return {
                r: sColorChange[0],
                g: sColorChange[1],
                b: sColorChange[2]
            }
        }
        return {}
    },

    /**
     * 将rgb或rgba表示方式转换为hex表示方式
     * 例如： rgbToHex('rgb(255,255,0)') = '#FFFF00'，rgbToHex('rgba(255,255,0,0.5)') = '#FFFF007F'(PC调试可以见到颜色，但手机真机不显示颜色)
     */
    rgbToHex(value) {
        if (/rgba?/.test(value)) {
            var array = value.split(',')
            //不符合rgb或rgb规则直接return
            if (array.length < 3) return ''
            value = '#'
            for (var i = 0, color; (color = array[i++]); ) {
                if (i < 4) {
                    //前三位转换成16进制
                    color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16)
                    value += color.length == 1 ? '0' + color : color
                } else {
                    //rgba的透明度转换成16进制
                    color = color.replace(')', '')
                    var colorA = parseInt(color * 255)
                    var colorAHex = colorA.toString(16)
                    value += colorAHex
                }
            }
            value = value.toUpperCase()
        }
        return value
    },

    //转化颜色(rgba转16进制，主要目的是把透明度去掉)
    // 例子： 值为：rgba(166, 115, 115, 0.3) ，转化16进制为： #e4d5d5 (把透明度去掉，在背景色为白色的情况下看上去是一样的)
    // 	this.$utils.color.getHexColor(rgba(166, 115, 115, 0.3)) = '#e4d5d5'
    getHexColor(color) {
        // 传的color须为字符串
        if (/rgb?/.test(color)) {
            var values = String(color)
                .replace(/rgba?\(/, '') // 把 "rgba(" 去掉，变成  "194, 7, 15, 1)"
                .replace(/\)/, '') // 把 ")" 去掉，变成 "194, 7, 15, 1"
                .replace(/[\s+]/g, '') // 把空格去掉，变成 "194,7,15,1"
                .split(',') // 变成数组 [194,7,15,1]
            var a = parseFloat(values[3] || 1), // values[3]是rgba中的a值，没有的话设置a为1，a可能为小数，所以用parseFloat函数
                r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255), // 转换为16进制
                g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
                b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
            color =
                '#' +
                ('0' + r.toString(16)).slice(-2) + // 转换后的16进制可能为一位，比如 7 就转换为 7 ， 15 转换为 f
                ('0' + g.toString(16)).slice(-2) + // 当为一位的时候就在前面加个 0，
                ('0' + b.toString(16)).slice(-2) // 若是为两位，加 0 后就变成了三位，所以要用 slice(-2) 截取后两位
        }
        return color
    }
}
// 数据效验
const test = {
    isEmpty(val) {
        // null or undefined
        if (val == null) return true

        if (typeof val === 'boolean') return false

        if (typeof val === 'number') return !val

        if (val instanceof Error) return val.message === ''

        switch (Object.prototype.toString.call(val)) {
            // String or Array
            case '[object String]':
            case '[object Array]':
                return !val.length

            // Map or Set or File
            case '[object File]':
            case '[object Map]':
            case '[object Set]': {
                return !val.size
            }
            // Plain Object
            case '[object Object]': {
                return !Object.keys(val).length
            }
        }
        return false
    },
    /**
     * 是否json字符串
     */
    jsonString(value) {
        if (typeof value == 'string') {
            try {
                var obj = JSON.parse(value)
                if (typeof obj == 'object' && obj) {
                    return true
                } else {
                    return false
                }
            } catch (e) {
                return false
            }
        }
        return false
    }
}
// 处理页面路由
const pages = {
    //url参数，转为对象 http://192.168.0.6:8082/?invitationCode=GK93J6 转为 {invitationCode: "GK93J6"}
    param2Obj(url) {
        const search = url.split('?')[1]
        if (!search) {
            return {}
        }
        return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') + '"}')
    }
}

// 处理string字符串
const string = {
    /**
     * 获取请求头中的文件名
     * @param {string} name
     * @returns {Boolean}
     */
    getFileName(name) {
        let result = null
        if (name && /filename=.*/gi.test(name)) {
            result = name.match(/filename=.*/gi)
            return decodeURI(result[0].split('=')[1])
        }
        return 'file'
    },

    /**
     * 将带小数点的数字切割成整数和小数部分
     * @param text {String||Number}   要传文本
     * @param digits {Number}   默认是2位小数点
     * @return {Array}   返回一个数组，Array[0]是整数部分，Array[1]是小数部分，
     *  * 用法：import { formatNumber } from '@/utils/utils.js';
     *          data: Money: formatNumber,
     *          {{ Money(cash)[0] }}.{{ Money(cash)[1] }}
     */
    formatNumber(text = 0, digits = 2) {
        if (!text) {
            text = 0
        }
        if (!(text instanceof Number)) {
            text = Number(text)
        }

        text = text.toFixed(digits).toString()
        if (text.indexOf('.') == -1) {
            text = text + '.00'
        }
        return text.indexOf('.') != -1 ? text.split('.') : text.join('')
    },

    /* 只能输入整数(只处理input的type=number时的情况)
	用法：
		setTimeout(()=>{
			this.params.num  = this.$utils.string.inputInteger(value)
		},10) 
	*/
    inputInteger(value) {
        if (value) {
            if (value == '00') {
                return '0'
            } else if (String(value).indexOf('.') > -1) {
                //把小数点.去掉
                let valueTemp = String(value).replace('.', '')
                if (value.length > 1 && value[0] == '0') {
                    //把0.1里的0去掉
                    valueTemp = valueTemp.slice(1)
                }
                return valueTemp
            } else if (value.length > 1 && value[0] == '0') {
                //把01里的0去掉
                return value.slice(1)
            } else {
                return String(value)
                    .replace('.', '')
                    .replace(/[^0-9]/g, '')
            }
        }
    },

    /* 只能输小数点后precision(默认是2)位，可以输入负数(只处理input的type=number时的情况)
	用法：
		setTimeout(()=>{
			this.params.moneyu  = this.$utils.string.inputDigits(value,2)
		},10) 
	*/
    inputDigits(value, digits = 2, min) {
        if (value) {
            if (value == '00') {
                return '0'
            } else {
                // 如果要求输入的是正整数
                if (digits === 0 || digits === '0') {
                    if (String(value).indexOf('.') > -1) {
                        //把小数点.去掉
                        let valueTemp = String(value).replace('.', '')
                        if (value.length > 1 && value[0] == '0') {
                            //把0.1里的0去掉
                            valueTemp = valueTemp.slice(1)
                        }
                        return valueTemp
                    } else if (value.length > 1 && value[0] == '0') {
                        //把01里的0去掉
                        return value.slice(1)
                    } else {
                        return String(value)
                            .replace('.', '')
                            .replace(/[^0-9]/g, '')
                    }
                    //如果要求输入的是小数
                } else {
                    if (Number(min) >= 0 && (String(value).indexOf('-') > -1 || String(value).indexOf('+') > -1)) {
                        //如果min>=0，则不准输入-，把负号+-去掉
                        return String(value).replace('-', '').replace('+', '')
                    } else if (value.length > 1 && value[0] == '0' && value[1] != '.') {
                        //把01里的0去掉
                        return value.slice(1)
                    } else {
                        var regs1 = new RegExp(/[\.]{3,}/)
                        var regs2 = new RegExp(/[\.]([0-9]{2}).*$/)
                        // return String(value).replace(/[^\0-9.]/g, '').replace(/[\.]{2,}/, ".").replace(/[\.]([0-9]{2}).*$/, '.$1').replace(/[A-Z|a-z|\（|\）|[ ]|\s*|\(|\)|\【|\】|\u4e00-\u9fa5]{0,20}/, '')
                        return String(value)
                            .replace(/[^\0-9.]/g, '')
                            .replace(new RegExp(`[\.]{${digits},}`), '.')
                            .replace(new RegExp(`[\.]([0-9]{${digits}}).*$`), '.$1')
                            .replace(/[A-Z|a-z|\（|\）|[ ]|\s*|\(|\)|\【|\】|\u4e00-\u9fa5]{0,20}/, '')
                    }
                }
            }
        }
    },

    /* 只能输小数点后两位，且只能输入正数
	用法：
		setTimeout(()=>{
			this.params.moneyu  = this.$utils.string.inputMoney(value)
		},10) 
	*/
    inputMoney(value) {
        if (value) {
            if (value == '00') {
                return '0'
            } else if (String(value).indexOf('-') > -1) {
                //把负号-去掉
                return String(value).replace('-', '')
            } else if (value.length > 1 && value[0] == '0' && value[1] != '.') {
                //把01里的0去掉
                return value.slice(1)
            } else {
                return String(value)
                    .replace(/[^\0-9.]/g, '')
                    .replace(/[\.]{2,}/, '.')
                    .replace(/[\.]([0-9]{2}).*$/, '.$1')
                    .replace(/[A-Z|a-z|\（|\）|[ ]|\s*|\(|\)|\【|\】|\u4e00-\u9fa5]{0,20}/, '')
            }
        }
    },

    /* 只能输[0~9.9]的折扣数，如果要设置[0.1~9.9]的话，就要用到<ls-input :min="0.1">(只处理input的type=number时的情况)
	用法：
		setTimeout(()=>{
			this.params.discount  = this.$utils.string.inputDiscount(value)
		},10) 
	*/
    inputDiscount(value) {
        if (value) {
            if (value == '00') {
                return '0'
            } else {
                let reg = /^((0.[1-9]{1})|(([1-9]{1})(.\d{1})?))$/
                if (value == 0) {
                    //防止下面match报错
                    return value //0.1
                } else if (value.length > 1 && value[0] == '0' && value[1] != '.') {
                    return value.slice(1)
                } else if (String(value).match(reg)) {
                    return String(value).match(reg)[0]
                } else if (value.length > 3) {
                    return value.slice(0, 3)
                } else if (value > 9.9) {
                    return 9.9
                    // PC端输入1.后,会直接走下面的return undefined
                } else if (value.length > 1 && value[1] == '.') {
                    return value.replace('..', '.') //输入1..自动变为1.
                } else {
                    return undefined
                }
            }
        }
    },
    /**
     * 获取文件后缀名(扩展名)
     * @param  {str} :文件路径
     * 例如：getSuffix("file:///storage/emulated/0/opmark/User/Pic/hangge.png")，输出png
     * @return {String}
     */
    getSuffix(str) {
        // 获取最后一个.的位置
        const index = str.lastIndexOf('.')
        // 获取后缀
        const ext = str.substr(index + 1)
        // 输出结果
        return ext
    }
}

// 处理object对象
const object = {
    /**
     * 深拷贝
     * @param {*} obj 拷贝对象(object or array)
     * @param {*} cache 缓存数组
     */
    // deepClone(obj, cache = []) {
    //     // typeof [] => 'object'
    //     // typeof {} => 'object'
    //     if (obj === null || typeof obj !== 'object') {
    //         return obj
    //     }
    //     // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
    //     /**
    //      * 类似下面这种
    //      * var a = {b:1}
    //      * a.c = a
    //      * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
    //      */
    //     const hit = cache.filter((c) => c.original === obj)[0]
    //     if (hit) {
    //         return hit.copy
    //     }

    //     const copy = Array.isArray(obj) ? [] : {}
    //     // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
    //     cache.push({
    //         original: obj,
    //         copy
    //     })
    //     Object.keys(obj).forEach((key) => {
    //         copy[key] = object.deepClone(obj[key], cache)
    //     })

    //     return copy
    // },

    deepClone(originObj) {
        if (originObj == undefined || typeof originObj !== 'object') {
            return originObj
        }
        const target = new originObj.constructor()

        for (let k in originObj) {
            if (originObj.hasOwnProperty(k)) {
                target[k] = object.deepClone(originObj[k])
            }
        }
        return target
    },

    /**
     * 两个对象的深度合并
     * @param {*} obj1 拷贝对象1
     * @param {*} obj2 拷贝对象2
     */
    deepMerge(obj1, obj2) {
        let key
        for (key in obj2) {
            // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
            // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
            obj1[key] =
                obj1[key] && obj1[key].toString() === '[object Object]' && obj2[key] && obj2[key].toString() === '[object Object]'
                    ? object.deepMerge(obj1[key], obj2[key])
                    : (obj1[key] = obj2[key])
        }
        return obj1
    },

    /**
     * @param {string} str
     * @returns {Boolean}
     */
    getQueryParam() {
        return { ...arguments }
    }
}
// 处理Array数组
const array = {
    /**
	 * 交换数组两个下标元素的位置
	 * @param {Array} arr
	 * @param {String} index1
	 * @param {String} index2
	 * @returns {Array}
	 * 用法：//点击上移 clickUp(index){ this.swapArray(this.tableData, index-1, index); },
	        //点击下移 clickDown(index){ this.swapArray(this.tableData, index, index+1); },
	 */
    swapArray(arr, oldIndex, newIndex) {
        arr[oldIndex] = arr.splice(newIndex, 1, arr[oldIndex])[0]
        return arr
    },

    /**
     * 递归构建树方法
     * data：需要递归的数组
     * children：需要将空的数组子元素设为undefined的子数组名字
     */
    getTreeData(data, children = 'children') {
        // 循环遍历json数据
        for (var i = 0; i < data.length; i++) {
            if (data[i][children] == 'null' || data[i][children].length < 1) {
                // children若为空数组，则将children设为undefined
                data[i][children] = undefined
            } else {
                // children若不为空数组，则继续 递归调用 本方法
                array.getTreeData(data[i][children])
            }
        }
        return data
    },

    /**
     * 将一维数组拆分为二维数组
     * arr：需要拆分的一维的数组
     * size：需要将空的数组子元素设为undefined的子数组名字
     */
    arrToTwoDim(arr, size) {
        var result = []
        if (arr && arr.length) {
            arr.forEach((item, index) => {
                const page = Math.floor(index / size)
                if (!result[page]) {
                    result[page] = []
                }
                result[page].push(item)
            })
        }
        return result
    },

    /**
     * 数组去重
     * arr：有可能是里面元素的id相同的数组
     * id：key值为id(当不传id值时，则arr数组内的元素为字符串，数组根据Set方法直接对比元素去重,传id则arr数组内的元素为对象，数组根据键值是唯一的来去重)
     * 用法：this.$utils.array.delRepeat(arr)--这时arr内的元素不是对象形式 或 this.$utils.array.delRepeat(arr,'name')--这时arr内的元素是对象形式
     * 备注：如果元素不是对象形式，则用Set来处理，例如：let newArr = new Set(['1','1','2'])来处理,得出newArr结果：['1','2']
     */
    delRepeat(arr, id) {
        // 如果arr内元素是对象
        if (id) {
            const obj = {}
            arr = arr.reduce((item, next) => {
                obj[next[id]] ? '' : (obj[next[id]] = true && item.push(next))
                return item
            }, [])
            // 如果arr内元素是字符串
        } else {
            arr = [...new Set(arr)]
        }
        return arr
    }
}

/**
 * 处理图片的工具
 */
const image = {
    /** 图片转base64格式(现在只有小程序上有用)
     *  @param  {img} :图片路径，必须是string，不然会报错
     * 例子：image.base64Img('/static/images/defalut-img/head-default.jpg')，得出的是data:image/png;base64,*********的图片
     */
    base64Img(img) {
        let suffix = ''
        suffix = string.getSuffix(img)
        return img
    },

    /**
	 *  路径转base64
	 * @param {Object} input:传送进来的文本框里输入的字符串，如果没有输入内容，则返回：true
	 * 使用：
	 *  import { image } from '@/utils/utils.js';
	 *  image.pathToBase64(path).then(res => {
	        console.log(res)
	    }).catch(error => {
	        console.error(error)
	    })
	 */
    /**
     * 路径转base64
     * @param {Object} string
     */

    pathToBase64(path) {
        return new Promise((resolve, reject) => {
            const _canvas = () => {
                let image = new Image()
                image.onload = function () {
                    let canvas = document.createElement('canvas')
                    // 获取图片原始宽高
                    canvas.width = this.naturalWidth
                    canvas.height = this.naturalHeight
                    // 将图片插入画布并开始绘制
                    canvas.getContext('2d').drawImage(image, 0, 0)
                    let result = canvas.toDataURL('image/png')
                    resolve(result)
                    canvas.height = canvas.width = 0
                }
                image.src = path
                image.setAttribute('crossOrigin', 'Anonymous')
                image.src = path
                console.log('path:', path)
                image.onerror = (error) => {
                    // image.src = require('@/src/assets/images/defalut-img/default-img.png');
                    console.error(`urlToBase64 error: ${path}`, JSON.stringify(error))
                    // reject(new Error('urlToBase64 error'));
                }
            }
            const _fileReader = (blob) => {
                const fileReader = new FileReader()
                fileReader.onload = (e) => {
                    resolve(e.target.result)
                }
                fileReader.readAsDataURL(blob)
                fileReader.onerror = (error) => {
                    console.error('blobToBase64 error:', JSON.stringify(error))
                    reject(new Error('blobToBase64 error'))
                }
            }
            const isFileReader = typeof FileReader === 'function'
            if (/^(http|\/\/)/.test(path) && isFileReader) {
                window.URL = window.URL || window.webkitURL
                const xhr = new XMLHttpRequest()
                xhr.open('get', path, true)
                xhr.timeout = 2000
                xhr.responseType = 'blob'
                xhr.onload = function () {
                    if (this.status == 200) {
                        _fileReader(this.response)
                    } else {
                        _canvas()
                    }
                }
                xhr.onreadystatechange = function () {
                    if (this.status === 0) {
                        console.error('图片跨域了，得后端处理咯')
                    }
                }
                xhr.send()
            } else if (/^blob/.test(path) && isFileReader) {
                _fileReader(path)
            } else {
                _canvas()
            }
        })
    },

    /**
     * base64转路径
     * @param {Object} base64
     * 用法：this.miniCode = await this.$utils.image.base64ToPath(res.data)
     */
    base64ToPath(base64) {
        const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64) || []
        return new Promise((resolve, reject) => {
            // mime类型
            let mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
            //base64 解码
            let byteString = atob(base64.split(',')[1])
            //创建缓冲数组
            let arrayBuffer = new ArrayBuffer(byteString.length)
            //创建视图
            let intArray = new Uint8Array(arrayBuffer)
            for (let i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i)
            }
            resolve(URL.createObjectURL(new Blob([intArray], { type: mimeString })))
        })
    }
}

import { Message } from 'element-ui'
//单例模式抽象，分离创建对象的函数和判断对象是否已经创建(第二版单例)
const createSingle = function (fn) {
    let result
    return function () {
        return result || (result = new fn(...arguments))
    }
}

class MessageModal {
    constructor() {
        this.show = false
    }
    showMessage(msg) {
        if (this.show) {
            return
        }
        this.show = true
        let that = this
        Message({
            message: msg || 'Error',
            type: 'error',
            duration: 5 * 1000,
            onClose: function () {
                that.show = false
            }
        })
    }
}
const selfMessage = createSingle(MessageModal)
const singleMessage = selfMessage()

export { getUa, debounce, uDebounce, throttle, createUUID, time, color, test, pages, string, object, array, image, selfMessage, singleMessage }
