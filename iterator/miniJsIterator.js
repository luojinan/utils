/**
 * 手写一个普通的迭代器
 * 因为用到length取下一项,map数组没有length因此该迭代器无法遍历
 * 
 * 迭代器class只是用于判断是否最后一项和取值,并不能遍历
 * 遍历：手动使用while判断遍历的
 * 
 * for of 就是手动while遍历的语法糖
 * 而迭代器class则被原生写到了可迭代的数组(Map Set Object NodeList Array)原型上了
 * 
 */

// 迭代器class
class Iterator {
  constructor(ListClass) {
    this.list = ListClass.list;
    this.index = 0;
  }

  //  获取下一项
  getNext() {
    if (this.hasNext) {
      return this.list[this.index++];
    }
    return false;
  }

  //  判断是否遍历完成
  hasNext() {
    if (this.index >= (this.list.length || 0)) {
      console.log('遍历结束');
      return false;
    } else {
      return true;
    }
  }
};

// 子类class,如果用继承,多个时会污染父类的变量
class ListClass {
  constructor(list) {
    this.list = list;
  }

  // 初始化遍历器
  initIterator() {
    return new Iterator(this);
  }
};

const arr = new Map([[1, 1]]); // 该方法用到length判断,因此map数组用该迭代器依旧无法遍历
const list = [1, 2, 3, 4];
const listClass = new ListClass(list); // 创建子类class
const iterator = listClass.initIterator(); // 初始化迭代器(这里其实也可以让创建子类class时直接初始化迭代器)

// 手动遍历
while (iterator.hasNext()) {
  console.log(iterator.getNext());
}