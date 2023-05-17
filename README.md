# 关于本项目

1. 代码完全开源，欢迎大家审计。也可自行构建出js文件复制到Tampermonkey里面个人使用，构建方法在本文最下面
2. 脚本油猴安装地址：[https://greasyfork.org/zh-CN/scripts/458024](https://greasyfork.org/zh-CN/scripts/458024)
3. git仓库地址：[https://github.com/zyronon/v2ex-script](https://github.com/zyronon/v2ex-script)

# 为什么选择V2EX - 超级增强，脚本的优势在哪？

在社区中早已存在众多用于增强 v2ex.com 的[脚本](https://greasyfork.org/zh-CN/scripts/by-site/v2ex.com)
和[插件](https://chrome.google.com/webstore/search/v2ex?_category=extensions)，然而它们带来的体验良莠不齐，且大多数已经停止更新。

- 秒杀其他脚本或插件的楼中楼功能：
    - 其他脚本：只解析当前页，如果有很多页回复，楼中楼就会前言不搭后语莫名其妙的
    - 本脚本：加载所有回复然后再解析楼中楼，保证回复解析正确
- One For All，集成了市面上常见的增强（辅助）功能
  - 坏消息：是个缝合怪
  - 好消息：都缝了
  

# 功能列表

- 楼中楼
  - 可按高赞排序显示
  - 可只看楼主
- 自动签到
- 预览帖子正文
- 弹框显示帖子正文和回复
- 对用户打标签
- 正文超长自动折叠
- 划词 base64 解码，支持解码中文
- 一键@所有人，@管理员：回复时，可一键@所有人和@管理员
- 回复指定用户添加楼层号：回复时，自动添加楼层号，以保证脚本解析回复时能更准确的判断
- 自适应屏幕宽度，支持黑暗模式： 帖子详情弹框自适应屏幕宽度，无论什么分辨率都能完美展示，同时也支持黑暗模式
- 按钮异步请求：操作按钮（感谢、收藏、回复、隐藏）异步请求，不会刷新页面
- 新标签页打开链接，默认打开，可单独关闭
- 使用 SOV2EX 搜索，默认关闭，可单独打开

# 常见问题

<details>y
  <summary>为什么要加载所有回复？</summary>
如果有多页回复，只解析当前页的话，那么许多楼层会找不到@的人，因为有可能@的人在前一页
</details>
<details>
  <summary>为什么有的「楼中楼」回复的楼层不正确？</summary>
由于 V2EX 的原回复并没有记录回复的楼层，本脚本只能根据被回复的用户去寻找此用户的最近一条回复，然后嵌入到这后面去，这种方法并不能保证正确识别用户真正要回复的是哪一个楼层。
</details>
<details>
  <summary>为什么有的「楼中楼」回复指定了楼层还是不正确？</summary>

- 屏蔽用户导致楼层塌陷：你屏蔽了A，自A以后的回复的楼层号都会减1
  <br/>
- 忽略回复导致楼层塌陷：原理同上
  <br/>
- 回复时指定错了楼层号
  <br/>
- 脚本解析错误，请在[这里](https://github.com/zyronon/v2ex-script/discussions/7)反馈给我

</details>
<details>
  <summary>详情页加载很慢？</summary>
回复多时会加载很慢，其实不是脚本的问题。是因为请求V站的其他页的回复时，V站迟迟未返回，导致我无法进行后续的解析，所以只能显示加载中...
</details>

# 如何帮助我

作为开发者，创造对他人有用的东西始终是我的热情所在，这个项目也不例外。我投入了大量的时间和精力，致力于为 V2EX
用户带来更好的体验。因此，如果我的项目帮助了你，欢迎你为我的项目：

- 点个 Star ⭐️ 或分享给他人，让更多的人知道我的存在。
- 提供反馈，帮助我改进，以持续完善脚本。在[这里](https://github.com/zyronon/v2ex-script/discussions/7)提出。
- 请我喝一杯咖啡
- ![要饭地址](https://i.imgur.com/Eq6uROF.jpg)

#### 源代码：[https://github.com/zyronon/v2ex-script](https://github.com/zyronon/v2ex-script)

#### 更新日志：[https://greasyfork.org/zh-CN/scripts/458024/versions](https://greasyfork.org/zh-CN/scripts/458024/versions)

# 开发指南

## 步骤有点麻烦。但是是一次性的

1. 在硬盘新建一个空白目录。
2. 复制Chrome的快捷方式。然后右键新的快捷方式，点击属性，在属性弹框里面，点击上面的第二个Tab（快捷方式）
3. 找到目标，在输入框里面加上 --args --disable-web-security --disable-site-isolation-trials
   --user-data-dir=第一步建的目录地址（不用加引用）
   例："C:\Program Files\Google\Chrome\Application\chrome.exe" --args --disable-web-security
   --disable-site-isolation-trials --user-data-dir=C:\Users\abc\Documents\chrome2
4. 保存，然后双击打开这个快捷方式。这样子新打开的Chrome就允许跨域了
5. 在新开的Chrome里面安装tampermonkey这个插件
6. 在里面“添加新脚本”，复制以下内容

```js
// ==UserScript==
// @name         开发：V2EX - 超级增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab=*
// @match        https://*.v2ex.com/t/*
// @match        https://*.v2ex.com/recent*
// @match        https://*.v2ex.com/go/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  let $vue = document.createElement('iframe');
  $vue.src = 'http://localhost:3000/';
  document.body.appendChild($vue);
})();
```

7. 克隆本项目，然后安装依赖，然后启动。
8. 修改本项目的index.html文件里面第30行，将const isDev = false 改为const isDev = ture
9. 用新的Chrome打开v2ex.com。本脚本会自动注入到v2的网页里面
10. 像正常的vue项目一样开发即可

# 自行构建指南

1. 运行npm run build
2. 打开public/template.js，根据里面的注释提示，复制dist/assets目录下的css、js和根目录index.html的<script>标签的第18行以后的代码
3. 在浏览器点击Tampermonkey，点击“添加新脚本”，把template.js文件里面的所有内容粘贴进去，按Ctrl + S保存
4. 打开V2即可使用你自己的脚本
