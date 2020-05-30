/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// email校验
const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

// 校验工具，校验失败后，给出相应提示
const validatorRank = (rank) => {
  let re
  if (rank == 3) {
    // rank=3，只能输入英文和数字，过滤下划线
    re = /[^A-Za-z0-9]/ig
  } else if (rank == 2) {
    // 默认rank=2，只过滤<>
    re = /[<>]/g
  } else if (rank == 4) {
    // rank=4，数字
    re = /[^0-9]/ig
  } else if (rank == 6) {
    // 默认rank=6，过滤指定特殊字符，针对于邮箱校验
    re = /[`~!#$^&*()=|{}':;',\\\[\]<>\/?~！#￥……&*（）——|{}【】'；：""'。，、？]/g
  } else {
    // 默认rank=5，过滤特殊字符
    re = /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g
  }
  return re
}

const validator = (rule, value, callback) => {
  let rank = rule.rank || 5
  // 是否必填
  if (rule.required) {
    required(value, callback)
  }
  // 字数限制
  if (value && rule.word) {
    var len = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
    if (len > rule.word) {
      callback(new Error(`长度不可大于${rule.word}`))
    }
  }
  // 字符限制，rank = 3
  if (value) {
    let re = validatorRank(rank)
    if (re.test(value)) {
      callback(new Error('格式错误'))
    }
  }
  // 通过
  callback()
}

// 验证邮箱
validator.Email = (rule, value, callback) => {
  // 是否必填
  if (rule.required) {
    required(value, callback)
  }
  // 验证邮箱
  if (!regEmail.test(value)) {
    callback(new Error('邮箱格式错误'))
  } else {
    // 通过
    callback()
  }
}

// 必填校验
const required = (value, callback) => {
  if (value === '') {
    callback(new Error('不可为空'));
  }
}

// 名称校验
validator.names = (rule, value, callback) => {
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入中文、英文、数字、下划线'));
  }
};

// 电话校验
validator.mobile = (rule, value, callback) => {
  if(value == null || value == ''){
		callback(new Error('请输入电话号码'));
	}else{
    value=Number(value)
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if(reg.test(value)){
      callback();
    }else{
      callback(new Error('请输入11位数字的正确电话号码'));
    }
	}
};

validator.namesReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;

/**
 * 手机号码
 * @param {*} s
 */
// function isMobile (s) {
// 	if(s == null || s == ''){
// 		return true
// 	}else{
// 		s=Number(s)
// 		return /^[1][3,4,5,7,8][0-9]{9}$/.test(s)
// 	}
// }
// /**
//  * 电话号码
//  * @param {*} s
//  */
// function isPhone (s) {
//   return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
// }
// /**
//  * URL地址
//  * @param {*} s
//  */
// function isURL (s) {
//   return /^http[s]?:\/\/.*/.test(s)
// }

// 导出公共校验方法
validator.validatorRank = validatorRank
validator.regEmail = regEmail
validator.isExternal = isExternal

export default validator
