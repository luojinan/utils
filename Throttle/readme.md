> 节流函数`throttle`用于**解决频繁操作问题**，限制一定时间内点击不触发事件

### 使用方法
1、**在import部分 引入并声明构造函数**
```js
  import {Throttle} from '@/common/libs/throttle'
  let throttle = Throttle()
```
 2、**在要节流的方法处使用**
 ```js
  handleIcon (index, commentId) {
   throttle(3000 , this.handleClick , [ index, commentId ] , 'trailing' )
  }
 ```

---
[toc]

---
### 一、不同的实现方法
#### 1、定时器
- **缺点**
> **首次也会被延迟**，不会立即执行
```js
// 使用setTimeout实现
function throttle (fn, delay) {
  let flag = false
  if (!flag) {
    return function() {
      let context = this, args = arguments
      flag = setTimeout(() => {
        fn.apply(context, args)
        flag = true
      }, delay)
    }
  }
}
```

#### 2、时间戳
- **缺点**
> 在不可操作时间段中，点击无效，**时间段结束不自动执行**，要再点击一次
> 有时需求，频繁操作后，**要记住最后一次点击，并定时结束自动执行**

```js
//  比较两次时间戳的间隔 是否大于等于 指定的时间 来决定是否执行事件回调
function throttle (fn, delay) {
  let start = 0
  return function () {
    if (now - start >= delay) {
        let context = this, args = arguments, now = new Date()
        fn.apply(context, args);
        start = now
    }
  }
}
```

### 二、最优方法
- **结合使用**
> 首次执行使用**时间戳方法**（非频繁操作）
> 1、后续继续使用**时间戳方法**(频繁操作且不需要自动执行最后一次)
> 2、后续执行包括记住最后一次点击都使用**定时器方法**（频繁操作且自动执行最后一次）

---
### 三、开始封装工具函数
> 这里以`vue`项目为例子封装

#### 1、utils文件夹封装
> 注意：这里利用了`闭包的方式（且不自执行）`
> `function return function`来设置`局部变量`
> 关于`局部变量`看**第四点**
```js
function Throttle (func, wait, trailing) {
    console.log('执行函数') // 这是闭包，函数只要引入页面就执行了
    let timer = null
    let start = 0
    return function () {
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
            console.log('非频繁操作，点击间隔为：',remaining)
            return func()
        } else if (!timer && trailing) {
            // trailing有值时，延时执行func函数
            // 频繁操作，第一次设置定时器之后，之后的不会再走到这里创建定时器
            // 清除问题，只能在第二有效点击的时候才会清除
            timer = setTimeout(() => {
                timer = null
                console.log('频繁操作，定时器延时执行')
                return func
            }, wait)
        }
    }
}
```

#### 2、页面内调用
> 1、引入工具函数`utils文件夹`
> 2、并执行`节流闭包函数`，外部（即：初始化局部变量），不会执行内部`return`的`function`
```js
import {Throttle} from '@/common/libs/throttle'
let throttle = Throttle()
```
> 3、在`methods`相应**需要节流的方法**里调用
```js
methods:{
    handleIcon (index) {
        // 执行节流闭包函数，内部 function ,已初始化时间，并以此计算点击间隔
        // 传入 回调函数fn，不可操作时长
        throttle(this.handleClick(index),3000)
    },
    handleClick(index){
        console.log( `点击了第${index}个按钮` )
    }
}
```

---
### 四、局部变量问题
> 以此**抽离封装函数**，做到不需要在`vue`的`data`里设置`变量`
> 否则要在`data`里存入`点击时间戳`来做**点击间隔判断**

> 局部变量概念，把变量设为私有变量，外部函数无法修改，**只能被自己修改，或者内部函数修改**

`function return function` 方式，要分开执行`外部`和`内部方法`
- 一次用于**初始化局部变量**
- 一次用于**执行内部操作**

![](https://luojinan.github.io//post-images/1565782932409.png)

---
### 五、回调函数无法传参问题
> 到这一步，在项目页面已经可以实现节流（既能第一次生效又能自动执行最后一次）
> 但是，发现传入回调函数是整个函数，不带`( )`，即：**无法带参数**
#### 1、尝试不传入整个函数,而是传入`func()`
- **当前情况**
- **传入的只能是整个函数，而不发传入参数**
![](https://luojinan.github.io//post-images/1565782935988.png)

---
- **修改为可以传入`function()`**
- **导致传入的不再是函数，而是一个值**
![](https://luojinan.github.io//post-images/1565782951392.png)

---
#### 2、曲线救国,给工具函数传参数,而不是给回调函数传参数
- **节流工具函数**
```js
export function Throttle () {
    let start = 0
    // 传入节流时间，整个回调函数，传入回调函数的参数数组，是否自动执行标识
    return function (wait, func, params, trailing) {
        ...
        ...
        return  func(...params)
    }
}
```
- **页面调用，传入节流函数的参数**
```js
handleIcon ( index, commentId ) {
    throttle( 3000 , this.handleClick , [ index, commentId ] , 'trailing' )
}
```
