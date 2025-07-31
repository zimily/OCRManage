import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n英文语言包
import locale from 'element-ui/lib/locale/lang/zh-CN' // 引入中文

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app', router, store, render: h => h(App)
})

// 在项目的main.js 定一个自定义指令,为了去掉择出el-radio__original元素，并删除掉属性aria-hidden
Vue.directive('removeAriaHidden', {
  bind(el, binding) {
    const ariaEls = el.querySelectorAll('.el-radio__original')
    ariaEls.forEach((item) => {
      item.removeAttribute('aria-hidden')
    })
  }
})
