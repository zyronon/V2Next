# 主要功能

### # 楼中楼
回复以楼中楼的方式展示，并支持按感谢排序
- 加载所有回复，保持楼中楼回复解析正确
- 提供三种展示方式：楼中楼、按感谢排序、V2原版
- 超过15层嵌套，默认隐藏剩余回复，点击可展开，保证嵌套过多不会导致页面变形

### # 预览帖子内容
在首页、节点页面，点击列表中的帖子，可直接预览帖子内容。也支持一键展开所有帖子内容和关闭

### # 弹框显示帖子内容和回复
列表点击帖子弹出帖子回复（不跳转页面），异步加载帖子内容

### # 对用户打标签
可以对用户打标签，数据保存在你的V2EX的记事本里面，换浏览器也能显示

### # 按钮异步请求
操作按钮（感谢、收藏、回复、隐藏）异步请求，不会刷新页面

### # 划词 base64 解码，支持解码中文
在回复里面，划词弹出base64解码气泡卡片

### # 自适应屏幕宽度，支持黑暗模式
帖子详情弹框自适应屏幕宽度，无论什么分辨率都能完美展示，同时也支持黑暗模式

### # 回复指定用户添加楼层号
回复时，自动添加楼层号，尽管本脚本不以楼层号来解析，原因在下面。但为了保证其他脚本显示正常也默认加上

### 关于楼中楼
- 注：其他的脚本的楼中楼回复功能。是基于当前页面做解析。如果回复没超过一页，显示正常，如果回复超过一页，楼中楼就会显示的莫名奇妙
- 注：v2的帖子详情页，打开时并不总是第一页，比如回复有3页时，打开帖子详情页展示的最后一页的回复
- 注：本脚本不以‘#楼层’ 来做解析。因为v2的回复被忽略后，会占据原来的楼层。导致按‘#楼层’解析，会出问题


# 如何安装/使用该脚本？
要使用该脚本，需要浏览器安装一个 [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 脚本管理器扩展（Chrome / Firefox / Edge）。

其他基于 Chromium 内核的浏览器（如国内套皮浏览器）都可以使用 Chrome 的扩展。

请确保使用 Tampermonkey 扩展，其他的用户脚本管理器可能导致无法正常使用脚本。

不会离线安装 .crx 扩展？ 请重新开启 Chrome、Edge 隐藏 [拖入安装 .crx 扩展] 功能！


# 更新日志：
[https://greasyfork.org/zh-CN/scripts/458024/versions](https://greasyfork.org/zh-CN/scripts/458024/versions)

# 源代码
源码请见♥: [https://github.com/zyronon/v2ex-script](https://github.com/zyronon/v2ex-script)

如果觉得还不错，就去 Github 点个 [⭐ Star] 鼓励一下下吧（或者多多分享）！


# 待实现
- 自动签到
- 高亮楼主回复
- 集成 sov2ex
- 如果回复中，指定了楼层，用hover的形式显示
- 打标签功能
   https://gist.github.com/y4code/241e8a7d05286211ccf9ee05b996a02e
- 回复太多，考虑放后台，如924034
- @所有人，@管理员 @Livid @Kai @Olivia @GordianZ @sparanoid
  - https://www.v2ex.com/t/919630#reply9 这个帖子有mod回复
- 链接自动转图片
- 自动加载下一页
- 新标签页打开链接
- 去掉首页配置
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

# 打包指南

1. 如果你修改了index.html里面的第一个<script>标签的内容。那么也要复制到脚本里面。注意：const isDev = true 要修改为 const
   isDev = false。其他的js内容全部复制替换到脚本的第40行之后即可
2. 运行npm run build
3. 复制dist/assets目录下的css和js，css复制替换到脚本的21行，js复制替换到脚本的32行
4. 注意，js和css一定要同时复制。vue打包后的"data-v-c9f8a6c7"这种东西，会重新生成
