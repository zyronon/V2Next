import {createApp} from 'vue'
import './assets/less/index.less'
import Home from './views/Home.vue'
//fetch，host必须相同，不然报跨域
let appNode
if (window.win().isFrame) {
  appNode = $("#app", window.win().doc)[0]
} else {
  appNode = window.win().query("#app")
}
if (window.win().vue) {
  window.win().vue.unmount()
}

let vue = createApp(Home)
window.win().vue = vue
window.win().appNode = appNode
vue.config.unwrapInjectedRef = true
vue.config.errorHandler = (err, vm, info) => {
  console.error('通过vue errorHandler捕获的错误');
  console.error(err);
  console.error(vm);
  console.error(info);
}
vue.mount(appNode)

