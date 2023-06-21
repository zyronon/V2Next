// ==UserScript==
// @name         V2EX - 超级增强
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  楼中楼回复(支持感谢数排序)、自动签到、使用 SOV2EX 搜索、列表预览内容、点击帖子弹框展示详情、对用户打标签、正文超长自动折叠、划词 base64 解码、一键@所有人,@管理员、操作按钮(感谢、收藏、回复、隐藏)异步请求、支持黑暗模式
// @author       Zyronon
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab=*
// @match        https://*.v2ex.com/t/*
// @match        https://*.v2ex.com/recent*
// @match        https://*.v2ex.com/go/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @require      https://unpkg.com/vue@3.3.2/dist/vue.runtime.global.prod.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @license      GPL License
// ==/UserScript==

(function () {
  //Vue打包后的的css和js文件一定要同时复制。同一次build的js和css是匹配的，打包后的"data-v-c9f8a6c7"这种东西，会重新生成，不能混用！！！
  //Vue打包后的的css和js文件一定要同时复制。同一次build的js和css是匹配的，打包后的"data-v-c9f8a6c7"这种东西，会重新生成，不能混用！！！
  //Vue打包后的的css和js文件一定要同时复制。同一次build的js和css是匹配的，打包后的"data-v-c9f8a6c7"这种东西，会重新生成，不能混用！！！
  let style = `
  
  
    这里放Vue打包的css，位置在dist/assets/index-hash值.css，把这个css文件里面的内容，全部复制粘贴到这里
    这里放Vue打包的css，位置在dist/assets/index-hash值.css，把这个css文件里面的内容，全部复制粘贴到这里
    这里放Vue打包的css，位置在dist/assets/index-hash值.css，把这个css文件里面的内容，全部复制粘贴到这里
    
    
    `
  let addStyle = document.createElement("style");
  addStyle.rel = "stylesheet";
  addStyle.type = "text/css";
  addStyle.innerHTML = style
  document.head.append(addStyle)


  function runVueCode() {
    setTimeout(function () {


      '这里放Vue 打包后的js，位置在dist/assets/index-hash值.js，全部复制粘贴到这里。对就是全部！全部复制粘贴到这里！'
      '这里放Vue 打包后的js，位置在dist/assets/index-hash值.js，全部复制粘贴到这里。对就是全部！全部复制粘贴到这里！'
      '这里放Vue 打包后的js，位置在dist/assets/index-hash值.js，全部复制粘贴到这里。对就是全部！全部复制粘贴到这里！'


    })
  }

  try {
    if (Vue) runVueCode()
  } catch (e) {
    console.log('Vue报错不存在', e)
    let vueScript = document.createElement("script");
    vueScript.src = 'https://cdn.jsdelivr.net/npm/vue@3.3.2/dist/vue.runtime.global.prod.js'
    vueScript.addEventListener('load', runVueCode)
    document.body.appendChild(vueScript);
  }

  try {
    if ($) {
    }
  } catch (e) {
    console.log('$报错不存在', e)
    let jqScript = document.createElement("script");
    jqScript.src = 'https://unpkg.com/jquery@3.7.0/dist/jquery.min.js'
    document.body.appendChild(jqScript);
  }

  const isDev = false

  //这里放index.html里面<script>标签的第18行以后的js内容，复制粘贴到这里
})();