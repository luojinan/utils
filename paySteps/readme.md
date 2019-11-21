[小程序支付文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_4&index=3)

[威富通文档](https://open.swiftpass.cn/openapi/doc?index_1=3&index_2=1&chapter_1=190&chapter_2=953)

[github--支付组件逻辑部分](https://github.com/luojinan/utils/blob/master/patSteps/index.vue)

![](https://luojinan.github.io//post-images/1574298585705.png)

![](https://luojinan.github.io//post-images/1574298592249.png)

---

由图可知，支付流程主要分为，`创建订单`，`支付步骤`，`支付完成对账`
- **创建订单**，由小程序openid、商品id，创建出订单号和支付用的参数（给微信支付api）
- **支付步骤**。由`前端小程序api`做好不同情况处理，点击取消点击`确定，异常`等
- **支付完成对账**，由订单号、商品名、支付信息`得已购信息`

![](https://luojinan.github.io//post-images/1574298597465.png)

---

### 1、创建订单接口`createPayOrder`
- 入参：
    - 代金券id
    - 用户id
- 出参：
    - 支付信息payinfo
    - 订单id

---

### 2、微信发起支付`wx.requestPayment`
- 入参：
    - 支付信息payInfo
- 出参：
    - 状态
👆注意，promisify之后，取消支付也是走的catch路线
支付成功，不像接口有个statusCode，而是`res.errMsg == 'requestPayment:ok'`

👇微信api发起支付，有如下三种情况
- 取消支付
- 支付失败
- 支付成功

> 取消支付：调用取消订单接口。因为订单已经创建，所以要做释放内存清除无效订单的操作，这个接口实际上相当于删除订单接口
> 支付失败：弹窗提示
> 支付成功：调用对账接口。获取到已购代金券id，用于跳转到该已购代金券详情页面等后续操作。


---
### 3、取消订单接口`cancelBuy`
- 入参
    - 订单id
    - 代金券id
    - 用户id
- 出参
    - status

---
### 4、对账接口`payStatusForPage`
- 入参
    - 订单id
    - 跳转页面（？？？）
    - 支付信息
    - 代金券名（？？？）
- 出参
    - 获得积分
    - 已购代金卷id

---
### 注意点
#### 1、decodeURIComponent()
![](https://luojinan.github.io//post-images/1574298604909.png)
从上一个页面传递过来的对象值，经过json转为对象之前要
[MDN--decodeURIComponent()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
示例
![](https://luojinan.github.io//post-images/1574298611697.png)
👆可知是用来解码中文.......

不要用这种方法做页面传值，应该存本地缓存传对象，获取到对象之后清除本地缓存

---
#### 2、catch里的return👇
![](https://luojinan.github.io//post-images/1574298617306.png)
