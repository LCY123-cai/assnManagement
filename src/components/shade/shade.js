import Shade from './shade.vue';
import Vue from 'vue';


let ShadeConstructor = Vue.extend(Shade);
let instance;
let seed = 1

/**
 * @desc 遮罩组件
 * @author 李文旭
 * @param {String} [options] - 参数为字符串时，直接改变消息内容
 * @param {Object} [options.message] 消息内容
 * @param {Object} [options.type] 动画类型
 * @returns {null} 不返回
 */
const shade = function (options) {
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  if (options && options.button && typeof options.button === 'boolean') {
    options.button = {
      buttonShow: options.button
    };
  }
  if (Vue.prototype.$isServer) return;
  // 加入参数
  instance = new ShadeConstructor({
    data: options
  })
  instance.id = 'shade_' + seed++;
  // 生成实例
  instance.$mount();
  // 插入到body
  document.body.appendChild(instance.$el)
  // 修改style(渐变色)
  window.setTimeout(() => {
    if(instance.$el.style){
      instance.$el.style.opacity = 1
    }
  }, 100)
}
shade.open = function () {
  console.log(2222)

}
shade.close = function () {
  instance.close()
}

export default shade