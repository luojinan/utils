### 一行代码去重数组

![](https://luojinan.github.io//post-images/1565402943271.png)

> `new Set()`返回一个set对象，把它展开并放入空数组中，才能形成一个数组

```js
const list = [1, 1, 2, 3, 6, 45, 8, 5, 4, 6, 5]
const uniqueList = [...new Set(list)] // [1, 2, 3, 6, 45, 8, 5, 4]
```