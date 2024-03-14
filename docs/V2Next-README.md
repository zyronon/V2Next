# <p align="center">V2Next</p>
## <p align="center">UI美化、楼中楼、回复上下文、高赞回复、简洁模式、发送图片和表情 emoji、base64 解码</p> 
## <p align="center">这或许就是你需要的 V2EX 脚本</p>
## 现已支持移动端

- PC脚本安装地址：[https://greasyfork.org/zh-CN/scripts/458024](https://greasyfork.org/zh-CN/scripts/458024)
- 手机端脚本安装地址：[https://greasyfork.org/zh-CN/scripts/458024](https://greasyfork.org/zh-CN/scripts/458024)，安装教程:[https://v2next.netlify.app/mobile-install.html](https://v2next.netlify.app/mobile-install.html)
- git仓库地址：[https://github.com/zyronon/web-scripts](https://github.com/zyronon/web-scripts)

***本项目完全开源，目前由我一个人维护，如果您觉得好用，请帮我点一个Star，您的Star是对我最大的鼓励***


https://github.com/zyronon/web-scripts/assets/19986642/6db8a9ef-825a-4ef2-bbfe-17dd13dfc232

<br/>

## UI美化和卡片模式
![image](https://github.com/zyronon/web-scripts/assets/19986642/bf4986c8-889c-4408-8149-af85e557dd06)

<br/>

## 楼中楼、主题显示OP注册时间
![image](https://github.com/zyronon/web-scripts/assets/19986642/c5598b53-c0d4-4a0a-b1ad-c9e4740644c1)

<br/>

## 高赞回复、回复上下文
![image](https://github.com/zyronon/web-scripts/assets/19986642/8977a5d5-2842-433c-8c95-e9663a462684)
 
# <p align="center">特色功能</p>
![image](https://github.com/zyronon/web-scripts/assets/19986642/7b166d88-7684-49f0-ade1-b8fd295df3d7)

# <p align="center">其他功能</p>
![image](https://github.com/zyronon/web-scripts/assets/19986642/47e6cfbe-7151-4de1-ad2d-965c95fd35e1)

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
- 脚本解析错误，请在[这里](https://github.com/zyronon/v2ex-script/issues)反馈给我

</details>
<details>
  <summary>详情页加载很慢？</summary>
回复多时会加载很慢，其实不是脚本的问题。是因为请求V站的其他页的回复时，V站迟迟未返回，导致我无法进行后续的解析，所以只能显示加载中...
</details>

# 如何帮助我

这个项目花了我很多精力，如果对您有用：

- 点个 Star ⭐️ 或分享给他人，让更多的人知道我的存在。
- 提供反馈，帮助我改进，以持续完善脚本。在[这里](https://github.com/zyronon/v2ex-script/issues)提出。

#### 更新日志：[https://greasyfork.org/zh-CN/scripts/458024/versions](https://greasyfork.org/zh-CN/scripts/458024/versions)

