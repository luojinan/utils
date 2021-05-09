> 迭代器是设计模式中的一种,因此在阮一峰的es6文档中会用到接口的概念(Java设计模式的名称)

[es6官方文档-iterator](https://es6.ruanyifeng.com/?search=&&&x=13&y=7#docs/iterator)


之所以需要迭代器的原因是es6新增了不少伪数组(可迭代)

以往需要遍历的数据有对象和数组和dom元素数组

```js
// dom数组，不可forEach，可以普通for
const domList = document.getElementsByClassName('p');
```

因为对象和dom元素数组都不是数组，因此不能用forEach，但是都能通过普通for来实现遍历，因此编写难度没有什么问题

但是当出现伪数组，如Map、Set这些会连普通for都遍历不了，反而要用forEach

就出现了用一种能遍历所有数据类型数组方法的需求

这就出现了es6的迭代器


那么es6封装出来的迭代器是判断数据类型做不同方法遍历吗？并不是！
而是利用了数组长度进行取值判断

首先不用es6的迭代器,自己[手写一个迭代器](./miniJsIterator.js),理解迭代器可以遍历数组的原理

