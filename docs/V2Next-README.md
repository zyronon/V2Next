## V2Next - 最好用的V站脚本

<video  width="100%" src="https://github.com/zyronon/web-scripts/assets/19986642/6db8a9ef-825a-4ef2-bbfe-17dd13dfc232" controls>
  Your browser does not support the video tag.
</video>

UI美化、楼中楼、回复上下文、高赞回复、简洁模式、发送图片和表情 emoji、base64 解码等等，**支持移动端**

## 安装使用
- PC脚本安装地址: [greasyfork.org/zh-CN/scripts/458024](https://greasyfork.org/zh-CN/scripts/458024)![i](https://img.shields.io/greasyfork/dt/458024)
- 手机端脚本安装地址: [greasyfork.org/zh-CN/scripts/458024](https://greasyfork.org/zh-CN/scripts/458024)，安装教程: [mobile-install.html](https://v2next.netlify.app/mobile-install.html)
- Github: [github.com/zyronon/web-scripts](https://github.com/zyronon/web-scripts)

**使用其他类似的脚本或插件可能会导致冲突，如果在使用过程中发现网页内容有误，建议关闭其他插件以排查问题。**

> 分享我的其他开源项目：
>
>_[**douyin
** - Vue.js 仿抖音 imitation TikTok~](https://github.com/zyronon/douyin) <img src="https://img.shields.io/github/stars/zyronon/douyin.svg?style=flat-square&label=Star&color=4285dd&logo=github" height="16px" />_  
> _[**Typing Word
** - 可在网页上使用的背单词软件~](https://github.com/zyronon/typing-word) <img src="https://img.shields.io/github/stars/zyronon/typing-word.svg?style=flat-square&label=Star&color=4285dd&logo=github" height="16px" />_


### 特色功能
- 楼中楼：主题下的评论回复支持层级展示，可以更轻松地跟踪和回复其他用户的评论
- 弹框查看主题：点击标题，在当前页面弹框显示主题正文和回复，无需刷新界面，就像Reddit那样！
- 高赞回复展示：自动筛选出感谢最多的回复，第一时间追上热评
- 查看回复上下文：无需 Ctrl + F 搜索回复内容，一键查看相关联的所有回复
- 界面美化：UI 设计更现代化，为你带来愉悦的视觉体验
- 主题显示OP注册时间：自动查询OP注册时间并显示，小于7天会被标红
- 操作异步请求：感谢、收藏、回复、隐藏均为异步请求，无需刷新页面，为你带来现代化的使用体验
- 用户标签：对用户设置标签以进行标记
<details>
  <summary>点击发现更多功能👇</summary>

---

- 便捷图片上传：粘贴、拖放极速上传图片
- 划词 base64 解码：选中需要解码的文字，即可自动解码
- 表情回复支持：评论输入框可以选择 Emoji 和贴吧表情，让回复更加生动和有趣
- 新标签页打开链接：新标签页打开主题，不用再频繁刷新或者手动右键打开了
- 长回复优化：智能折叠长篇回复，一键展开查看完整内容
- 自动签到：自动领取每日签到奖励
- 一键@所有人，@管理员：回复时，可一键@所有人和@管理员
- 链接自动转图片：回复中 imgur 链接会自动转换成图片
- 智能感应主题：自动跟随系统切换浅色/深色主题，自适应屏幕宽度，支持黑暗模式
- 收藏提醒：防止账号被封无法查看收藏的主题
- 卡片模式：无需进入主题，在列表中即可浏览主题内容
- 简洁模式：隐藏用户头像，去除非必要信息，界面看起来更清爽
</details>

## 功能效果展示

### UI美化和卡片模式
![image](https://github.com/zyronon/web-scripts/assets/19986642/bf4986c8-889c-4408-8149-af85e557dd06)

### 楼中楼、主题显示OP注册时间
![image](https://github.com/zyronon/web-scripts/assets/19986642/c5598b53-c0d4-4a0a-b1ad-c9e4740644c1)

### 高赞回复、回复上下文
![image](https://github.com/zyronon/web-scripts/assets/19986642/8977a5d5-2842-433c-8c95-e9663a462684)

## 常见问题

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
- 脚本解析错误，请在[这里](https://github.com/zyronon/v2ex-script/issues)反馈给我

</details>
<details>
  <summary>详情页加载很慢？</summary>
回复多时会加载很慢，其实不是脚本的问题。是因为请求V站的其他页的回复时，V站迟迟未返回，导致我无法进行后续的解析，所以只能显示加载中...
</details>

## 我的其他脚本列表

[//]: # (- [V2EX-Next-PC]&#40;https://v2next.netlify.app/&#41;![i]&#40;https://img.shields.io/greasyfork/dt/458024&#41;:)
[//]: # (  UI美化、楼中楼、回复上下文、高赞回复、发送图片\表情...)
[//]: # (- [V2EX-Next-Mobile]&#40;https://v2next.netlify.app/&#41;![i]&#40;https://img.shields.io/greasyfork/dt/485356&#41;:)
[//]: # (  V2Next的移动版，专门为手机网页优化过)
- [油管新标签页打开](https://greasyfork.org/zh-CN/scripts/476514)![i](https://img.shields.io/greasyfork/dt/476514):
  针对油管PC端，点击视频新标签页打开
- [油管移动端增强](https://greasyfork.org/zh-CN/scripts/487013)![i](https://img.shields.io/greasyfork/dt/487013):
  针对油管移动端，点击视频新标签页打开、改变播放速度、记忆播放速度，修改布局

> _所有脚本均在 **Chrome、Firefox、Edge 浏览器 + Tampermonkey 扩展** 环境下测试通过！_

## 如何帮助我

这个项目花了我很多精力，如果对您有用：

- 点个 Star ⭐️ 或分享给他人，让更多的人知道我的存在。
- 提供反馈，帮助我改进，以持续完善脚本。在[这里](https://github.com/zyronon/v2ex-script/issues)提出。

#### 更新日志：[https://greasyfork.org/zh-CN/scripts/458024/versions](https://greasyfork.org/zh-CN/scripts/458024/versions)

