import decodeXML from '../XSS/decodeXML'

//把utf16的emoji表情字符进行转码成八进制的字符
const utf16toEntities = function(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则  
  return str.replace(patt, function (char) {
      var H, L, code;
      if (char.length === 2) {
          H = char.charCodeAt(0) // 取出高位  
          L = char.charCodeAt(1) // 取出低位  
          code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00 // 转换算法  
          return "&#" + code + ";"
      } else {
          return char
      }
  })
}

// test vscode online

//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
const entitiesToUtf16 = function(str) {
  str = decodeXML(str)  // 数据库返回特殊字符加上了'amp;' 做一遍转义即可
  return str.replace(/&#(\d+);/g, function (match, dec) {
      let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800
      let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00
      return String.fromCharCode(H, L)
  })
}

export default {
  utf16toEntities,
  entitiesToUtf16
}

// var testStr = "正常的🔥橘🍊💪181848"

// var res = utf16toEntities(testStr)
// log('res', res)

// var decode =  entitiesToUtf16(res)
// log('decode', decode)