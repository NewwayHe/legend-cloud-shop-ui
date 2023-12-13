// var interval = setInterval((selector)=>{
//     document.querySelector(selector)
//     console.log(stopInterval)
//     console.log(document.querySelector(selector))
//     if(document.querySelector(selector)){
//         stopInterval()
//     }
// },500)

var stopInterval = () => {
    clearInterval(interval)
}

const domSearch = (selector, callback) => {
    console.log('fffffff')
    let startTime = Date.now()
    let MAX_OBSERVE_TIME = 30e3
    let found = false
    let intervalId = setInterval(function () {
        if (found) {
            clearInterval(intervalId)
            return
        }
        let elapse = Date.now() - startTime
        if (elapse > MAX_OBSERVE_TIME) {
            clearInterval(intervalId)
            return
        }
        let element = document.querySelector(selector)
        if (!element) {
            console.log(selector + '元素不存在')
            return
        }
        found = true
        callback(element)
    }, 100)
}

export default domSearch
