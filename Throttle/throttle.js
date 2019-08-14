/**
 * 作用：节流函数
 *
 * 参数：
 *  1、wait 必填 节流时间 (数字格式毫秒单位)
 *  2、func 回调函数 注意：不要传入function() 而是 function
 *  3、params 回调函数需要用到的参数 数组格式
 *  4、trailing 是否记住最后一次点击 并在节流时间结束后自动执行回调 随意传入一个字符串即开启
 *
 * 示例：1、在import部分 引入并声明构造函数
 *       import {Throttle} from '@/common/libs/throttle'
 *       let throttle = Throttle()
 *
 *      2、在要节流的方法处使用
 *       handleIcon (index, commentId) {
 *        throttle(3000,this.handleClick,[index, commentId],'trailing')
 *       }
 */

export function Throttle () {
  console.log('执行函数') // 这是闭包，函数只要引入页面就执行了
  let timer = null
  let start = 0
  return function (wait, func, params, trailing) {
    let now = new Date()
    let remaining = wait - (now - start)
    console.log(remaining)
    // 拦截：延迟时间>多次点击间隔时间，执行：多次点击间隔时间>延迟时间
    if ((now - start) >= wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔
      // 但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      timer && clearTimeout(timer)
      timer = null
      start = now
      // console.log('1、延迟时间与间隔时间的差',remaining)
      return func(...params)
    } else if (!timer && trailing) {
      // trailing有值时，延时执行func函数
      // 频繁操作，设置定时器之后，之后的不会再走到这里创建定时器
      // 清除问题？只能在第二有效点击的时候才会清除
      timer = setTimeout(() => {
        timer = null
        console.log('定时器延时执行')
        return func(...params)
      }, wait)
    }
  }
}
export default {
  Throttle
}
