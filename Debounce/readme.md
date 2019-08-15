> 防抖函数`debounce`用于**解决连续触发同一事件问题**，限制延迟一定时间后触发事件

### 效果图
- **没有防抖的输入框**
![](https://luojinan.github.io//post-images/1565834657948.gif)
- **加了防抖的输入框**
![](https://luojinan.github.io//post-images/1565834660305.gif)

---
### 使用方法
1、**在import部分 引入并声明构造函数**
```js
  import Debounce from '@/common/libs/debounce'
  let debounce = Debounce()
```
 2、**在要节流的方法处使用**(传入回调函数外，还可传入回调函数需要的参数，见源码)
 ```js
  changePhone (e) {
    debounce(() => {
      console.log(e.mp.detail, '输入的手机号')
      this.phone = e.mp.detail
    })
  }
 ```
