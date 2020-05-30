// 时间格式化
// import moment from 'moment'
// 静态代码表
import codeList from './codeList'
import moment from 'moment'
// 空值控制
const nullValue = '-'

/**
 * @desc 格式化方法
 * @param {String | Array | Object} data 参数
 * @param {Object} selectName 格式化类型
 * @param {Object} selectsExtend 格式化拓展参数
 * @returns {String} 格式化数据
 */
function selects(data, selectName, selectsExtend) {

  let text = codeList[selectName].find((val) => {
    return val.value == data
  })
  return text.label || nullValue
}

function time(text, formatConfig="YYYY-MM-DD") {
  text = moment(text).format(formatConfig);
  return text;
}

export default {
  selects,
  nullValue,
  time
}
