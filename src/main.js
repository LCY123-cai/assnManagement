import Vue from 'vue'

// A modern alternative to CSS resets
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


// 全局样式
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

// 图标
import '@/icons'
// 权限控制
import '@/permission'

Vue.use(ElementUI)

// 全局导入自定义组件库
import xElement from './components/index.js'
Vue.use(xElement);

// 按需引入echarts
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
Vue.prototype.$echarts = echarts
// 引入animate.css
import animated from 'animate.css'
Vue.use(animated)
// 全局引入后端地址
// Vue.prototype.$url = "http://localhost:8085/"
const url = process.env.VUE_APP_BASE_API
// 图片地址
Vue.prototype.$imgUrl = `${url}/public/img/use/`
// 默认头像
Vue.prototype.$imgExample = `${url}/public/img/example/example2.jpeg`

// 全局引入格式化
import formatter from '@/utils/formatter'
Vue.prototype.$formatter = formatter

// 全局引入校验方法
import validate from '@/utils/validate'
Vue.prototype.$validate = validate

// 全局引入导入导出excel方法
import {
  excelExport
} from '@/utils/excel'
Vue.prototype.$excel = excelExport

// 阻止显示生产模式的消息
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
