## V2Next - 最好用的V站辅助工具

UI美化、楼中楼、回复上下文、高赞回复、简洁模式、发送图片和表情 emoji、base64 解码等等，**手机 App 已发布**

### 安装地址
- Android Apk：https://github.com/zyronon/V2Next/releases
- iOS App 请自行打包
- PC脚本安装地址: [greasyfork.org/zh-CN/scripts/458024](https://greasyfork.org/zh-CN/scripts/458024)![i](https://img.shields.io/greasyfork/dt/458024)

### 主要功能
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

## 截图

### App截图
<div align="center">
    <img src="https://github.com/zyronon/V2Next-app/blob/6522b974033f92249f40216ec2bfef53c11fb0e5/docs/1.jpg?raw=true" width="32%"></img>
    <img src="https://github.com/zyronon/V2Next-app/blob/6522b974033f92249f40216ec2bfef53c11fb0e5/docs/2.jpg?raw=true" width="32%"></img>
    <img src="https://github.com/zyronon/V2Next-app/blob/6522b974033f92249f40216ec2bfef53c11fb0e5/docs/3.jpg?raw=true" width="32%"></img>
    <img src="https://github.com/zyronon/V2Next-app/blob/6522b974033f92249f40216ec2bfef53c11fb0e5/docs/4.jpg?raw=true" width="32%"></img>
    <img src="https://github.com/zyronon/V2Next-app/blob/6522b974033f92249f40216ec2bfef53c11fb0e5/docs/5.jpg?raw=true" width="32%"></img>
    <img src="https://github.com/zyronon/V2Next-app/blob/6522b974033f92249f40216ec2bfef53c11fb0e5/docs/6.jpg?raw=true" width="32%"></img>
</div>

### PC脚本截图

![image](https://github.com/zyronon/web-scripts/assets/19986642/bf4986c8-889c-4408-8149-af85e557dd06)
![image](https://github.com/zyronon/web-scripts/assets/19986642/c5598b53-c0d4-4a0a-b1ad-c9e4740644c1)
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
 
## 如何帮助我

这个项目花了我很多精力，如果对您有用：

- 点个 Star ⭐️ 或分享给他人，让更多的人知道我的存在。
- 提供反馈，帮助我改进，以持续完善脚本。在[这里](https://github.com/zyronon/V2Next/issues)提出。

## 感谢
[VVEX](https://github.com/guozhigq/flutter_v2ex): 很多思路借鉴了 VVEX， 特别感谢 🙏
