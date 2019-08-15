/**
 * 作用：防抖函数(用于输入框/拖拽等)
 *
 * 参数：
 *  1、fn 必填 回调函数，传入整个函数func，不可带func()
 *  3、params 回调函数需要用到的参数 多个时数组格式，单个时数组/字符串格式
 *  4、delay 非必填 默认500毫秒，自定义时间时，前面params要传,可传个null
 *
 * 示例：1、在import部分 引入并声明构造函数
 *       import Debounce from '@/common/libs/debounce'
 *       let debounce = Debounce()
 *
 *      2、在要防抖的方法处使用
 *       changephone (e) {
 *        debounce(() => {
 *          console.log(e.mp.detail, '输入的手机号码')
 *          this.phone = e.mp.detail
 *        })
 *      }
 */

export function Debounce () {
  let timer = null
  console.log('init Debounce', timer);
  return function (fn, params, delay = 500) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      params ? fn(...params) : fn()
    }, delay)
  }
}

export default Debounce
