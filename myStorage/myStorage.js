/**
 * 直接存入对象，取出来直接是对象
 * 设置超时时间 数字秒、{time:数字秒}、{time:日期字符串}、{time:Date对象}
 */
// 对象->字符串
function _serialize(item) {
  return JSON.stringify(item);
}
// 字符串->对象
function _deserialize(string) {
  return JSON.parse(string)
}

/***************************************************************/

// 判断key是否是字符串，若不是则报个警告不报错，并转换为字符串（为了兼容数字？）
function _checkKey(key) {
  if (typeof key !== 'string') {
    console.warn(key + ' used as a key, but it is not a string.');
    key = String(key);
  }
  return key;
}
// 判断options.time值是否是日期对象
function _isDateObj(date) {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
}
// timer三种情况：数字类型(秒为单位)，字符串类型（日期格式），date对象类型
function _getEndDateByOption(timer, now) {
  now = now || new Date()
  // time是数字(秒为单位)或者日期字符串的情况
  if (typeof timer === 'number') {
    timer = new Date(now.getTime() + timer * 1000)
  } else if (typeof timer === 'string') {
    timer = new Date(timer) // 字符串结束日期，可能设置错误，写了比当前时间早（要做处理吗？）
  }
 
  // time是Date对象的情况
  if (timer && !_isDateObj(timer)) {
    throw new Error('`timer` parameter cannot be converted to a valid Date instance');
  }
  return timer
}
// 判断本地缓存数据里是否有结束时间（内含 c-当前时间戳 b-超时时间戳  v-内存值）
function _checkObj(item) {
  if (typeof item !== 'object') {
    return false;
  }
  if (item) {
    if ('nowTimeNum' in item && 'endTimeNum' in item && 'val' in item) {
      return true;
    }
  }
  return false;
}
// 判断是否过期
function _isTimeOut(obj) {
  const timeNow = (new Date()).getTime()
  return timeNow >= obj.endTimeNum
}
/***************************************************************/
const StorageAPI = {
  set(key, value,options) {
    // 判断key值，判断val值，判断时间值
    key = _checkKey(key)
    // 判断options入参，不是对象的话，转换为对象
    if (typeof options === 'number') {
      options = {
        time: options
      }
    }
    const obj = {
      val: _serialize(value),
      nowTimeNum: (new Date()).getTime(), // 当前时间戳
      endTimeNum: _getEndDateByOption(options.time).getTime()
    }
    console.log('要存入缓存的数据',obj)
    try {
      this.storage.setItem(key, _serialize(obj))
    } catch (err) {
      console.log('存入本地缓存失败',err)
    }
    return _serialize(value)
  },
  get(key) {
    key = _checkKey(key)
    let obj = null
    try {
      obj = _deserialize(this.storage.getItem(key))
    } catch (err) {
      console.log('获取本地缓存失败',err)
      return null
    }
    // 判断本地缓存数据里是否有结束时间
    if (_checkObj(obj)) {
      if (!_isTimeOut(obj)) return _deserialize(obj.val)
      else {
        this.delete(key)
        return null
      }
    }
    // 获取普通本地缓存数据（没有设置过期时间）
    return obj
  },
  delete(key) {
    this.storage.removeItem(key);
    return key
  }
}
export function StorageClass() {
  this.storage = localStorage
}
StorageClass.prototype = StorageAPI;

export default StorageClass