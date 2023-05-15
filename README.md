# 关于本项目
1. 代码完全开源，欢迎大家审计。也可自行构建出js文件复制到Tampermonkey里面个人使用，构建方法在本文最下面
2. 脚本油猴安装地址：[https://greasyfork.org/zh-CN/scripts/458024](https://greasyfork.org/zh-CN/scripts/458024)
3. git仓库地址：[https://github.com/zyronon/v2ex-script](https://github.com/zyronon/v2ex-script)

### 脚本做了什么？
因v2ex-plus的[爬虫事件](https://www.v2ex.com/t/939486#reply172)，在此做个解释

使用本脚本会增加额外请求，但不会用你的账号爬取其他信息
1. 打开v2ex首页（节点）时，脚本会遍历帖子列表拿到每一条帖子的id，然后批量调用v站的公开接口：[https://www.v2ex.com/api/topics/show.json?id=id](https://www.v2ex.com/api/topics/show.json?id=id)，调用此接口是用于预览正文
2. 打开详情页时，如果有多页回复，会请求其他页回复。因为拿到所有的回复才能拼凑出完整楼中楼

# 如何安装/使用该脚本？
<details>
  <summary>点击展开</summary>
<br/>
1. 先安装一个脚本管理器扩展
<br/>
<h3>在线安装</h3>
<ul>
<li>
Chrome / Firefox / Edge：安装 <a href="https://www.tampermonkey.net/index.php?browser=chrome&locale=zh">Tampermonkey</a>
</li>
<li>
Safari：安装 <a href="https://apps.apple.com/us/app/userscripts/id1463298887">Userscripts</a>
        <ul><li> Mac上的Tampermonkey收费，如果你已经安装过了Tampermonkey可以不用安装Userscripts</li></ul>
</li>
<li>
国产浏览器：请自动百度如何安装Tampermonkey
</li>
</ul>
<h3>离线安装（无法打开应用商店）</h3>
<ul>
<li>
请在 <a href="https://www.tampermonkey.net/index.php?browser=chrome&locale=zh">这个页面</a>或自行百度 下载Tampermonkey的文件
<ul>
<li>Chrome、Edge请使用crx后缀的文件</li>
<li>Firefox请使用xpi后缀的文件</li>
</ul>
</li>
<li>然后重新开启浏览器，进入扩展页面</li>
<li>拖动下载的文件到浏览器中</li>
</ul>

2. 点击 <a href=" https://greasyfork.org/zh-CN/scripts/458024">本页</a>的 “安装此脚本” 按钮

</details>

# 为什么选择V2EX - 超级增强，脚本的优势在哪？

在社区中早已存在众多用于增强 v2ex.com 的[脚本](https://greasyfork.org/zh-CN/scripts/by-site/v2ex.com)
和[插件](https://chrome.google.com/webstore/search/v2ex?_category=extensions)，然而它们带来的体验良莠不齐，且大多数已经停止更新。

- 秒杀其他脚本或插件的楼中楼功能：
    - 其他脚本：只解析当前页，如果有很多页回复，楼中楼就会前言不搭后语莫名其妙的
    - 本脚本：加载所有回复然后再解析楼中楼，保证回复解析正确
- 长期维护，快速响应，打造最高质量的 V2EX 脚本，提供最佳的体验。

# 功能列表

## ⊙主要功能

### # 楼中楼

回复以楼中楼的方式展示，并支持按感谢排序

- 加载所有回复，保持楼中楼回复解析正确
- 如果回复中指定了楼层，优先解析
- 提供三种展示方式：楼中楼、按感谢排序、V2原版
- 超过15层嵌套，默认隐藏剩余回复，点击可展开，保证嵌套过多不会导致页面变形

> **默认楼中楼** 如需切换，可随时点击帖子回复上方的按钮切换

### # 自动签到

当访问 V2EX 时，如果还没有签到，则脚本会 自动签到（后台签到，感觉不到，支持任意页面）

代码直接复制于：[V2EX 增强](https://greasyfork.org/zh-CN/scripts/424246)脚本，在此感谢其开发者

### # 预览帖子正文

在首页、节点页面，点击帖子右侧的回复数量，可直接预览帖子正文。也支持一键展开所有帖子正文和关闭

### # 弹框显示帖子正文和回复

列表点击帖子弹出正文和回复（不跳转页面），异步加载帖子内容
> **默认开启** 如需关闭，请点击[V站首页](v2ex.com)顶部的设置按钮，在设置弹框里面关闭 “点击列表的帖子，打开详情弹框”

### # 对用户打标签

可以对用户打标签，数据保存在你的V2EX的记事本里面，换浏览器也能显示

> **默认开启** 如需关闭，请点击[V站首页](v2ex.com)顶部的设置按钮，在设置弹框里面关闭 “用户打标签”

### # 正文超长自动折叠

当帖子的正文和回复的内容超长时，自动折叠收起，点击可展开
> **默认开启** 如需关闭，请点击[V站首页](v2ex.com)顶部的设置按钮，在设置弹框里面关闭 “正文超长自动折叠”

### # 划词 base64 解码，支持解码中文

在回复里面，划词弹出base64解码气泡卡片
> **默认开启** 如需关闭，请点击[V站首页](v2ex.com)顶部的设置按钮，在设置弹框里面关闭 “划词显示Base64解码框”

## ⊙更多功能

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

#### 源代码：[https://github.com/zyronon/v2ex-script](https://github.com/zyronon/v2ex-script)

#### 更新日志：[https://greasyfork.org/zh-CN/scripts/458024/versions](https://greasyfork.org/zh-CN/scripts/458024/versions)


# 待实现
 
- 单独显示高赞
- 高亮楼主回复
- 如果回复中，指定了楼层，用hover的形式显示
- 打标签功能（公共）
  https://gist.github.com/y4code/241e8a7d05286211ccf9ee05b996a02e
- 回复太多，考虑放后台，如924034
- 链接自动转图片
- 自动加载下一页
- 增加自动解析显示 base64 (https://github.com/bjzhou/v2ex-base64-decoder)
- 表情功能
    - https://greasyfork.org/zh-CN/scripts/435299-v2ex-emoticon/code

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
