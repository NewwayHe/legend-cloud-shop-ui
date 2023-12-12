// 时间格式
import moment from 'moment'
// 全局过滤器
const importFilters = (Vue) => {
	// 金额（ 保留两位，向下取整，例如：{{12.5599 | priceFilter}} = ￥12.55，{{12 | priceFilter}} = ￥12.00，{{12.5 | priceFilter}} = ￥12.50 ）
	Vue.filter('priceFilter', (val) => {
		if (val && String(val).includes('.')) {
			let text = String(val)
			// 如果只有1位小数，则后面拼一个0
			if (String(val).split(".")[1].length == 1) {
				text = String(val) + '0'
			}
			return '￥' + text.substring(0, text.indexOf(".") + 3); // 只取小数点后两位，后面的全部切割掉(不进行四舍五入)
		} else {
			if (!val) val = 0;
			return '￥' + Number(val).toFixed(2);
		}
	});
	/**
	 * 	把小数后N位后面的数字去掉(截取)（ 保留N位小数，向下取整，不进行四舍五入，例如：{{12.5599 | cutDecimal}} = 12.55，{{12 | cutDecimal}} = 12，{{12.5 | cutDecimal}} = 12.5 ）
	 *	用途：例如，某个页面width:100%，里面的子元素要分成6份，那就是 (100/6)%，这时页面会显示16.66666667%，如果用toFixed(2)那会导致全部加起来大于100%而导致最后一个元素换行，这时就要用这个来截取到16.66%
	 */

	Vue.filter('cutDecimal', (val, num = 2) => {
		// 如果有小数点，才截取
		if (val && String(val).includes('.')) {
			let text = String(val)
			// 如果只有1位小数，则后面拼一个0
			return text.substring(0, text.indexOf(".") + num + 1); // 只取小数点后num位，后面的全部切割掉(不进行四舍五入)
		} else {
			return val;
		}
	});
	// 处理范围金额（只处理一个范围, 保留两位，向下取整）如：0.88~6.43243 => ￥0.88~￥6.43
	Vue.filter('priceRangeFilters', (val, split = '~') => {
		const filter = (price) => {
			if (price && String(price).includes('.')) {
				let text = String(price)
				// 如果只有1位小数，则后面拼一个0
				if (String(price).split(".")[1].length == 1) {
					text = String(price) + '0'
				}
				return '￥' + text.substring(0, text.indexOf(".") + 3); // 只取小数点后两位，后面的全部切割掉(不进行四舍五入)
			} else {
				if (!price) price = 0
				return '￥' + Number(val).toFixed(2)
			}
		}
		if (val && val.includes(split)) {
			let arr = val.split(split)
			return `${filter(arr[0])}~${filter(arr[1])}`
		} else {
			return filter(val)
		}
	})
	// 日期过滤
	Vue.filter('dateFilter', function(val) {
		return val.substr(0, 10)
	})
	Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
		return dataStr ? moment(dataStr).format(pattern) : '暂无'
	})
	Vue.filter('getLabelText', function(value, list, label = 'label') {
		let data = list.find((v) => v.value === value)
		if (data) {
			return data[label]
		} else {
			return ''
		}
	})
	// 将金额拆成 99, 999. 00 的格式 , 
    // 前缀符号 默认为 '' 需要则传第二个参数 '￥'
    Vue.filter('priceComma',(money, prefix = '')=> {
        if (!money) money = 0
        money += '';    //先转为字符串
        let integral,fraction;   //整数,小数部分
        if(typeof money === 'string' && money.indexOf('.') > -1) {
            // 获取整数
            integral =  money.split('.')[0]
            // money = money.slice(0, integral.length + 1 + 2);    // +1 是 . +2是截取小数两位
            fraction = (money.split('.')[1]).slice(0,2)
        }
        // 用逗号,拼接整数
        function comma(integral) {
            if(integral.length <= 3) return integral;
            return (integral.slice(0,3) + ',') + comma(integral.slice(3))
        }
        if(integral) {      //如果有整数 则代表有小数
            integral = comma(integral)
            money = integral + '.' + fraction
        }else { //没有小数
            money = comma(money) + '.00'
        }
        return prefix + money
    })
}

export default importFilters
