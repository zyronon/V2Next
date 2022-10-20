import {createApp} from 'vue'
// const { createApp } = Vue
import './assets/less/index.less'
import Home from './views/Home.vue'

// document.head.appendChild(document.createElement('base')).target = '_blank'; // 让所有链接默认以新标签页打开
//fetch，host必须相同，不然报跨域
let appNode

if (import.meta.env.DEV && !window.isDev) {
    window.doc = window.top.document
    window.w = window.top
    window.win = () => window.top
    window.w.fetch2 = window.top.fetch
    window.$ = window.w.$
    window.url = 'https://www.v2ex.com'
    appNode = $("#app", window.doc)[0]
} else {
    window.doc = window.document
    window.w = window
    window.win = () => window
    window.w.fetch2 = window.fetch
    // window.url = location.origin
    window.url = 'https://www.v2ex.com'
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