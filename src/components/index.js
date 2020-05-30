/**
 * 将常用的组件在这里进行汇总，后续全局引用
 */
import select from './Select/select.vue';
import input from './Input/input.vue';
import table from './Table/table.vue';
import dialog from './Dialog/dialog.vue';
import shade from './shade/index.js';
import button from './Button/button.vue';

const components = [
  select,
  input,
  table,
  dialog,
  shade,
  button
]
const install = function (Vue, opts = {}) {
  // 加入遮罩
  Vue.prototype.$shade = shade;
  components.map(component => {
    Vue.component(component.name, component);
  });
}

export default {
  install
}
