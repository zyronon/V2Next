import {createApp} from 'vue'
import './assets/less/index.less'
import Home from './views/Home.vue'
// document.head.appendChild(document.createElement('base')).target = '_blank'; // 让所有链接默认以新标签页打开
//fetch，host必须相同，不然报跨域
let appNode
// if (import.meta.env.DEV && window.win().isFrame) {
if (window.win().isFrame) {
  appNode = $("#app", window.win().doc)[0]
} else {
  appNode = $("#app")[0]
}
if (window.win().vue) {
  window.win().vue.unmount()
}

let vue = createApp(Home)
vue.config.unwrapInjectedRef = true
vue.mount(appNode)
window.win().vue = vue