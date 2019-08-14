> 调用发送短信接口后，**开启倒计时**、并**使按钮不可点击**

### 效果图

![](https://luojinan.github.io//post-images/1565785631215.gif)

---
### 实现步骤
- **点击按钮**，调用短信接口成功后把 `canClick = false`
- vue项目使用`watch`监听`canClick`标志符
    - `canClick`变化为`true`或`false`都会**触发监听**
    - 而**倒计时**只会在`canClick`由`true`变为`false`（点击发送）时触发
- **倒计时结束**清除定时器，并把 `canClick = true`

---
### 部分示例代码
```js
watch: {
    canClick (e) {
        // 监听canclick变为false时执行倒计时
        if ( !e ) {
            clearInterval( this.timer )   // 确保上一次的定时器被清除(可能有延迟)
            this.timer = setInterval( ( )  => {
                this.second--
                // 当秒数减为0时，重置秒数和按钮可点击状态
                if (!this.second) {
                    this.second = 60
                    this.canClick = true
                    clearInterval(this.timer)
                    this.disabled = false
                }
            }, 1000)    //每隔1000毫秒减1 second
        }
    }
}
```