> 对于移动端，用户有可能输入`emoji`，并传入数据库，会导致**无法识别而报错**

> 这里涉及2个工具方法：
> 1、`utf16的emoji表情字符` 转码 成`utf8的字符`
> 2、`八进制的字符` 转码 成`十六进制的emoji表情字符`

---
[toc]

---

### 一、emoji转字符
```js
//把utf16的emoji表情字符进行转码成八进制的字符
const utf16toEntities = function(str) {
    // 检测utf16字符正则
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g
    return str.replace(patt, function (char) {
        var H, L, code
        if (char.length === 2) {
            H = char.charCodeAt(0) // 取出高位
            L = char.charCodeAt(1) // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            return "&#" + code + ";"
        } else {
            return char
        }
    })
}
```
### 二、字符转emoji
```js
//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
const entitiesToUtf16 = function(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800
        let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00
        return String.fromCharCode(H, L)
    })
}
```
### 三、转义问题
> 数据库做了安全处理，返回的字符由`&`:变成了`&amp;`，导致**字符转emoji**失败

```js
const changeList = {
    '&': '&amp;',
    '>': '&gt;',
    '<': '&lt;',
    "'": '&gt;',
    '"': '&quot;',
}
/**
* 由于安全原因, 数据库返回的一些字符是经过转义的, 需要翻译回来
* 返回翻译回来的字符串
*/
function decodeXML (origin) {
    var result = origin
    for (const key in changeList) {
        if (changeList.hasOwnProperty(key)) {
            const item = changeList[key]
            result = result.replace(new RegExp(item, 'gm'), key)
        }
    }
    return result
}
```
- **在`二、字符转emoji`的方法加上，字符转义方法**
```js
//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
const entitiesToUtf16 = function(str) {
     // 数据库返回特殊字符加上了'amp;' 做一遍转义即可
    str = decodeXML(str)
    return str.replace(/&#(\d+);/g, function (match, dec) {
        ...
        ...
    })
}
```
### 四、测试
```js
var testStr = "正常的🔥橘🍊💪181848"
var res = utf16toEntities(testStr)
console.log('res', res)
var decode = entitiesToUtf16(res)
console.log('decode', decode)
```
---
[关于转义涉及XSS攻击](https://juejin.im/post/5bad9140e51d450e935c6d64)

如有建议和疑问可联系

QQ：1017386624

邮箱：1017386624@qq.com