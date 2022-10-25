import {createApp} from 'vue'
import './assets/less/index.less'
import Home from './views/Home.vue'

// document.head.appendChild(document.createElement('base')).target = '_blank'; // 让所有链接默认以新标签页打开
//fetch，host必须相同，不然报跨域
let appNode

if (import.meta.env.DEV && !window.isFrame) {
  appNode = $("#app", window.doc)[0]
} else {
  // window.url = location.origin
  appNode = $("#app")[0]
}

if (!window.user) {
  let top2 = $('.tools .top:eq(1)', window.doc).text()
  if (top2 === '注册') {
    window.user = {}
  } else {
    window.user = {
      username: top2,
      avatar: $('#Rightbar .box:eq(0) .avatar', window.doc).attr('src')
    }
  }
}

let app = createApp(Home)
app.config.unwrapInjectedRef = true
app.mount(appNode)