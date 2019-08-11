/*
  和 & &amp; 
  大于号 >  &gt; 
  小于号 <  &lt; 
  单引号 ‘ &apos; 
  双引号 “ &quot;
*/
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

// [关于转义涉及XSS攻击](https://juejin.im/post/5bad9140e51d450e935c6d64)
export default decodeXML
