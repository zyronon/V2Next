<script setup lang="ts">
import SearchIcon from "./search-icon.vue";
</script>

<template>
  <div id="home">
    <div class="content">
      <div class="info">
        <h1 class="title">
          <span>V2Next</span>
        </h1>
        <div class="desc">
          <p>UI美化、楼中楼、回复上下文、高赞回复、简洁模式、发送图片和表情 emoji、base64 解码</p>
          <p>这或许就是你需要的 V2EX 脚本</p>
        </div>
      </div>

      <div class="actions">
        <div class="action">
          <a href="/pc-install">安装到PC</a></div>
        <div class="action">
          <a href="/mobile-install">安装到手机</a></div>
        <div class="action">
          <a href="https://github.com/zyronon/V2Next" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>

      <div class="notice">
        <div>
          <strong>尊重用户隐私</strong> ━ 绝不收集用户数据
        </div>
        <div>
          <strong>跨端通用</strong> ━ PC、手机均可使用
        </div>
        <div>
          <strong>免费使用</strong> ━ 所有功能均免费使用
        </div>
      </div>

      <div class="display">
        <video
            autoplay
            muted
            loop
            src="../assets/video/d-min.mp4"></video>
      </div>

      <div class="important-desc">
        <div class="item">
          <div class="title">UI美化和卡片模式</div>
          <div class="desc-content">
            <div class="desc">
              <p>UI 设计更现代化，为你带来愉悦的视觉体验。</p>
              <p>卡片模式无需进入主题，在列表中即可浏览主题内容</p>
              <p>点击列表标题或内容，在当前页面弹框显示主题详情，无需刷新界面，就像Reddit那样！</p>
            </div>
            <div class="img-wrapper">
              <img src="../assets/img/1.png" alt="">
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title" style="text-align:right;">楼中楼、主题显示OP注册时间</div>
          <div class="desc-content">
            <div class="img-wrapper">
              <img src="../assets/img/2.png" alt="">
            </div>
            <div class="desc">
              <p>自动解析所有回复并以楼中楼的形式展示，更轻松理清回复与回复之间的关系，无需再用 Ctrl + F
                搜索用户回复了什么</p>
              <p>自动查询OP注册时间并显示，小于7天会被标红</p>
            </div>
          </div>
        </div>
        <div class="item" style="margin-bottom: 0;">
          <div class="title">高赞回复、回复上下文</div>
          <div class="desc-content">
            <div class="desc">
              <p>自动筛选出感谢最多的回复，第一时间追上热评</p>
              <p>点击上下文按钮，一键查看相关联的所有回复</p>
            </div>
            <div class="img-wrapper">
              <img src="../assets/img/3.png" alt="">
            </div>
          </div>
        </div>
      </div>

      <h3 class="features-type">特色功能</h3>
      <div class="features">
        <div class="item">
          <div class="icon">📰</div>
          <div class="title">楼中楼</div>
          <div class="details">主题下的评论回复支持层级展示，可以更轻松地跟踪和回复其他用户的评论</div>
        </div>
        <div class="item">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="lucide lucide-view ">
              <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z"></path>
              <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"></path>
              <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path>
            </svg>
          </div>
          <div class="title">弹框查看主题</div>
          <div class="details">
            点击标题，在当前页面弹框显示主题正文和回复，无需刷新界面，就像Reddit那样！
          </div>
        </div>
        <div class="item">
          <!--          <div class="icon">❤</div>-->
          <div class="icon">🔥</div>
          <div class="title">高赞回复展示</div>
          <div class="details">自动筛选出感谢最多的回复，第一时间追上热评</div>
        </div>

        <div class="item">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
              <g fill="none" stroke-linejoin="round" stroke-width="4">
                <path fill="#2F88FF" stroke="#000"
                      d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z"/>
                <path stroke="#fff" stroke-linecap="round"
                      d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431"/>
                <path stroke="#000" stroke-linecap="round" d="M33.2216 33.2217L41.7069 41.707"/>
              </g>
            </svg>
          </div>
          <div class="title">查看回复上下文</div>
          <div class="details">无需 Ctrl + F 搜索回复内容，一键查看相关联的所有回复</div>
        </div>
        <div class="item">
          <div class="icon">
            <svg t="1705250087347" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="38393" width="30" height="30">
              <path
                  d="M512.8 420.8c-156.8 234.4-141.6 576.8-48 578.4 96.8 2.4-14.4-394.4 48-578.4zM480.8 395.2c-227.2 74.4-392 311.2-328.8 361.6 64.8 52 191.2-272 328.8-361.6zM487.2 376C290.4 288 24 332 31.2 399.2c7.2 68.8 307.2-49.6 456-23.2zM512.8 354.4c-89.6-169.6-300-300.8-331.2-256-32 46.4 241.6 152 331.2 256zM531.2 354.4C626.4 228 632 34.4 580.8 29.6c-52.8-4.8-7.2 223.2-49.6 324.8zM548 366.4c144.8 3.2 295.2-94.4 272-135.2-24-41.6-173.6 112-272 135.2zM561.6 399.2c160 119.2 420 160.8 431.2 109.6 11.2-52.8-299.2-48.8-431.2-109.6zM539.2 426.4c29.6 216 211.2 417.6 264.8 375.2 55.2-43.2-207.2-233.6-264.8-375.2z"
                  fill="#E83518" p-id="38394"></path>
              <path d="M919.2 622.4l16 32.8 36 4.8-25.6 25.6 5.6 36-32-16.8-32 16.8 6.4-36-26.4-25.6 36-4.8z"
                    fill="#F4D31F" p-id="38395"></path>
              <path
                  d="M520 339.2l16 32.8 36 5.6-25.6 24.8 5.6 36-32-16.8-32 16.8 6.4-36-26.4-24.8 36-5.6zM239.2 792.8l14.4 30.4 34.4 4.8-24.8 24 5.6 33.6-29.6-16-30.4 16 5.6-33.6-24.8-24 34.4-4.8zM151.2 188h-32v-32c0-2.4-1.6-4-4-4s-4 1.6-4 4v32h-32c-2.4 0-4 1.6-4 4s1.6 4 4 4h32v32c0 2.4 1.6 4 4 4s4-1.6 4-4v-32h32c2.4 0 4-1.6 4-4s-1.6-4-4-4z"
                  fill="#F5E328" p-id="38396"></path>
            </svg>
          </div>
          <div class="title">界面美化</div>
          <div class="details">UI 设计更现代化，为你带来愉悦的视觉体验</div>
        </div>

        <div class="item">
          <div class="icon">📅</div>
          <div class="title">主题显示OP注册时间</div>
          <div class="details">自动查询OP注册时间并显示，小于7天会被标红</div>
        </div>

        <div class="item">
          <div class="icon">
            <svg t="1705247776349" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="30456" width="32" height="32">
              <path d="M432.4 453.5l-17 46.7h34.4z" fill="#FFFFFF" p-id="30457"></path>
              <path
                  d="M725.3 259.7H312.2c-16.5 0-30 13.5-30 30v413.1c0 16.5 13.5 30 30 30h413.1c16.5 0 30-13.5 30-30V289.7c0-16.6-13.5-30-30-30z m-98.8 164.5h25.4V550h-25.4V424.2z m-116.5 0h40.8c15.5 0 25.5 0.6 30.2 1.9 7.2 1.9 13.2 6 18.1 12.3 4.9 6.3 7.3 14.5 7.3 24.5 0 7.7-1.4 14.2-4.2 19.5s-6.4 9.4-10.7 12.4c-4.3 3-8.7 5-13.2 6-6.1 1.2-14.8 1.8-26.4 1.8h-16.6V550H510V424.2z m-90.7 0h26.9L496.5 550h-27.6l-11-28.6h-50.3L397.2 550h-27l49.1-125.8z m229.1 273.3H352.6c-19.4 0-35.1-15.7-35.1-35.1v-295c0-5.5 4.5-10 10-10s10 4.5 10 10v295c0 8.3 6.8 15.1 15.1 15.1h295.8c5.5 0 10 4.5 10 10s-4.4 10-10 10z"
                  fill="#FFFFFF" p-id="30458"></path>
              <path
                  d="M569.4 479.2c3.4-1.3 6-3.4 7.9-6.2 1.9-2.8 2.9-6.1 2.9-9.8 0-4.6-1.3-8.4-4-11.3-2.7-3-6.1-4.8-10.2-5.6-3-0.6-9.1-0.9-18.3-0.9h-12.3v35.7h13.9c10 0.1 16.7-0.6 20.1-1.9z"
                  fill="#FFFFFF" p-id="30459"></path>
              <path
                  d="M648.4 677.5H352.6c-8.3 0-15.1-6.8-15.1-15.1v-295c0-5.5-4.5-10-10-10s-10 4.5-10 10v295c0 19.4 15.7 35.1 35.1 35.1h295.8c5.5 0 10-4.5 10-10s-4.4-10-10-10z"
                  fill="#06F3FF" p-id="30460"></path>
              <path
                  d="M865 386.5c11 0 20-9 20-20s-9-20-20-20h-69.7v-56.8c0-38.6-31.4-70-70-70h-27.8v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3H611v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3h-46.5v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3H438v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3h-85.8c-38.6 0-70 31.4-70 70v56.8h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7V433h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7v46.5h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7V606h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7v56.8c0 38.6 31.4 70 70 70H343v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h46.5v72.5c0 11 9 20 20 20s20-9 20-20v-72.5H516v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h46.5v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h82.8c38.6 0 70-31.4 70-70V646H865c11 0 20-9 20-20s-9-20-20-20h-69.7v-46.5H865c11 0 20-9 20-20s-9-20-20-20h-69.7V473H865c11 0 20-9 20-20s-9-20-20-20h-69.7v-46.5H865zM755.3 702.7c0 16.5-13.5 30-30 30H312.2c-16.5 0-30-13.5-30-30v-413c0-16.5 13.5-30 30-30h413.1c16.5 0 30 13.5 30 30v413z"
                  fill="#005BFF" p-id="30461"></path>
              <path
                  d="M407.6 521.4h50.3l11 28.6h27.6l-50.4-125.8h-26.9l-49 125.8h27l10.4-28.6z m24.8-67.9l17.3 46.7h-34.3l17-46.7zM535.4 502.6H552c11.5 0 20.3-0.6 26.4-1.8 4.5-1 8.9-3 13.2-6 4.3-3 7.9-7.1 10.7-12.4s4.2-11.8 4.2-19.5c0-10-2.4-18.2-7.3-24.5-4.9-6.3-10.9-10.4-18.1-12.3-4.7-1.3-14.8-1.9-30.2-1.9H510V550h25.4v-47.4z m0-57.1h12.3c9.2 0 15.2 0.3 18.3 0.9 4.1 0.7 7.5 2.6 10.2 5.6 2.7 3 4 6.8 4 11.3 0 3.7-1 7-2.9 9.8-1.9 2.8-4.6 4.9-7.9 6.2-3.4 1.3-10.1 2-20.1 2h-13.9v-35.8zM626.5 424.2h25.4V550h-25.4z"
                  fill="#005BFF" p-id="30462"></path>
            </svg>
          </div>
          <div class="title">操作异步请求</div>
          <div class="details">感谢、收藏、回复、隐藏均为异步请求，无需刷新页面，为你带来现代化的使用体验</div>
        </div>
        <div class="item">
          <div class="icon">🏷️</div>
          <div class="title">用户标签</div>
          <div class="details">对用户设置标签以进行标记</div>
        </div>
      </div>

      <h3 class="features-type">其他功能</h3>
      <div class="features">
        <div class="item">
          <div class="icon">
            <svg t="1705247630407" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="21422" width="32" height="32">
              <path
                  d="M829.64898 849.502041H194.35102c-43.885714 0-79.412245-35.526531-79.412244-79.412245V253.910204c0-43.885714 35.526531-79.412245 79.412244-79.412245h635.29796c43.885714 0 79.412245 35.526531 79.412244 79.412245v516.179592c0 43.885714-35.526531 79.412245-79.412244 79.412245z"
                  fill="#D2F4FF" p-id="21423"></path>
              <path
                  d="M909.061224 656.195918l-39.706122-48.065306L626.416327 365.714286c-19.330612-19.330612-50.677551-19.330612-70.008164 0L419.526531 502.073469c-2.612245 2.612245-5.22449 3.134694-6.791837 3.134694-1.567347 0-4.702041-0.522449-6.791837-3.134694L368.326531 464.979592c-19.330612-19.330612-50.677551-19.330612-70.008164 0l-143.673469 143.673469-39.706122 48.065306v113.893878c0 43.885714 35.526531 79.412245 79.412244 79.412245h635.29796c43.885714 0 79.412245-35.526531 79.412244-79.412245v-114.416327"
                  fill="#16C4AF" p-id="21424"></path>
              <path
                  d="M273.763265 313.469388m-49.632653 0a49.632653 49.632653 0 1 0 99.265306 0 49.632653 49.632653 0 1 0-99.265306 0Z"
                  fill="#E5404F" p-id="21425"></path>
              <path
                  d="M644.179592 768h-365.714286c-11.493878 0-20.897959-9.404082-20.897959-20.897959s9.404082-20.897959 20.897959-20.897959h365.714286c11.493878 0 20.897959 9.404082 20.897959 20.897959s-9.404082 20.897959-20.897959 20.897959zM461.322449 670.82449h-182.857143c-11.493878 0-20.897959-9.404082-20.897959-20.897959s9.404082-20.897959 20.897959-20.89796h182.857143c11.493878 0 20.897959 9.404082 20.897959 20.89796s-9.404082 20.897959-20.897959 20.897959z"
                  fill="#0B9682" p-id="21426"></path>
            </svg>
          </div>
          <div class="title">便捷图片上传</div>
          <div class="details">粘贴、拖放极速上传图片</div>
        </div>
        <div class="item">
          <div class="icon">💻</div>
          <div class="title">划词 base64 解码</div>
          <div class="details">选中需要解码的文字，即可自动解码</div>
        </div>
        <div class="item">
          <div class="icon">😊</div>
          <div class="title">表情回复支持</div>
          <div class="details">评论输入框可以选择 Emoji 和贴吧表情，让回复更加生动和有趣</div>
        </div>


        <div class="item">
          <div class="icon">
            <svg t="1705247475142" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13380"
                 width="24" height="24">
              <path
                  d="M904.533333 746.666667c-12.8 0-21.333333-8.533333-21.333333-21.333334v-21.333333c0-29.866667-25.6-55.466667-55.466667-55.466667h-76.8c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333333h76.8c55.466667 0 98.133333 42.666667 98.133334 98.133333v21.333333c0 12.8-8.533333 21.333333-21.333334 21.333334zM661.333333 989.866667H170.666667c-55.466667 0-98.133333-42.666667-98.133334-98.133334v-183.466666c0-55.466667 42.666667-98.133333 98.133334-98.133334h72.533333c12.8 0 21.333333 8.533333 21.333333 21.333334s-8.533333 21.333333-21.333333 21.333333H170.666667c-29.866667 0-55.466667 25.6-55.466667 55.466667v183.466666c0 29.866667 25.6 55.466667 55.466667 55.466667h490.666666c12.8 0 21.333333 8.533333 21.333334 21.333333s-8.533333 21.333333-21.333334 21.333334z"
                  fill="#7162AD" p-id="13381"></path>
              <path
                  d="M819.2 989.866667H725.333333c-12.8 0-21.333333-8.533333-21.333333-21.333334s8.533333-21.333333 21.333333-21.333333h93.866667c34.133333 0 64-29.866667 64-64v-85.333333c0-12.8 8.533333-21.333333 21.333333-21.333334s21.333333 8.533333 21.333334 21.333334v85.333333c0 59.733333-46.933333 106.666667-106.666667 106.666667z"
                  fill="#A495FC" p-id="13382"></path>
              <path
                  d="M409.6 196.266667c-4.266667 0-12.8 0-17.066667-4.266667-8.533333-8.533333-8.533333-21.333333 0-29.866667l89.6-89.6c8.533333-8.533333 21.333333-8.533333 29.866667 0s8.533333 21.333333 0 29.866667l-85.333333 89.6c-4.266667 4.266667-12.8 4.266667-17.066667 4.266667z"
                  fill="#7162AD" p-id="13383"></path>
              <path
                  d="M588.8 196.266667c-4.266667 0-12.8 0-17.066667-4.266667l-89.6-89.6c-8.533333-8.533333-8.533333-21.333333 0-29.866667s21.333333-8.533333 29.866667 0l89.6 89.6c8.533333 8.533333 8.533333 21.333333 0 29.866667 0 4.266667-8.533333 4.266667-12.8 4.266667z"
                  fill="#7162AD" p-id="13384"></path>
              <path
                  d="M499.2 750.933333c-12.8 0-21.333333-8.533333-21.333333-21.333333v-640c0-12.8 8.533333-21.333333 21.333333-21.333333s21.333333 8.533333 21.333333 21.333333v640c0 12.8-8.533333 21.333333-21.333333 21.333333z"
                  fill="#7162AD" p-id="13385"></path>
            </svg>
          </div>
          <div class="title">新标签页打开链接</div>
          <div class="details">新标签页打开主题，不用再频繁刷新或者手动右键打开了</div>
        </div>


        <div class="item">
          <div class="icon">📃</div>
          <div class="title">长回复优化</div>
          <div class="details">智能折叠长篇回复，一键展开查看完整内容</div>
        </div>
        <div class="item">
          <div class="icon">📆</div>
          <div class="title">自动签到</div>
          <div class="details">自动领取每日签到奖励</div>
        </div>

        <div class="item">
          <div class="icon">@</div>
          <div class="title">一键@所有人，@管理员</div>
          <div class="details">回复时，可一键@所有人和@管理员</div>
        </div>
        <div class="item">
          <div class="icon">🅰️</div>
          <div class="title">链接自动转图片</div>
          <div class="details">回复中 imgur 链接会自动转换成图片</div>
        </div>

        <div class="item">
          <div class="icon">🌗</div>
          <div class="title">智能感应主题</div>
          <div class="details">自动跟随系统切换浅色/深色主题，自适应屏幕宽度，支持黑暗模式</div>
        </div>

        <div class="item">
          <div class="icon">⭐</div>
          <div class="title">收藏提醒</div>
          <div class="details">防止账号被封无法查看收藏的主题</div>
        </div>

        <div class="item">
          <div class="icon">💳</div>
          <div class="title">卡片模式</div>
          <div class="details">无需进入主题，在列表中即可浏览主题内容</div>
        </div>

        <div class="item">
          <div class="icon">⚡</div>
          <div class="title">简洁模式</div>
          <div class="details">隐藏用户头像，去除非必要信息，界面看起来更清爽</div>
        </div>
      </div>

      <section class="faq" id="faq">
        <div class="title">常见问题</div>
        <div class="questions">
          <div class="list-wrapper">
            <div class="question-wrapper">
              <div class="question">
                <div class="name">
                  <search-icon class="dark"/>
                  <search-icon class="blue"/>
                  为什么要加载所有回复？
                </div>
                <div class="desc">如果有多页回复，只解析当前页的话，那么许多楼层会找不到@的人，因为有可能@的人在前一页
                </div>
              </div>
            </div>
            <div class="question-wrapper">
              <div class="question">
                <div class="name">
                  <search-icon class="dark"/>
                  <search-icon class="blue"/>
                  为什么有的「楼中楼」回复的楼层不正确？
                </div>
                <div class="desc">由于 V2EX
                  的原回复并没有记录回复的楼层，本脚本只能根据被回复的用户去寻找此用户的最近一条回复，然后嵌入到这后面去，这种方法并不能保证正确识别用户真正要回复的是哪一个楼层。
                </div>
              </div>
            </div>

          </div>
          <div class="list-wrapper">
            <div class="question-wrapper">
              <div class="question">
                <div class="name">
                  <search-icon class="dark"/>
                  <search-icon class="blue"/>
                  详情页加载很慢？
                </div>
                <div class="desc">
                  <p>加载慢的原因：脚本在请求V站主题数据，V站迟迟不返回，脚本就会显示加载中...</p>
                  <p>一般来说，楼中楼解析所需要时间很短，短到可以忽略不计</p>
                  <br>
                  <p>
                    1. 直接打开的主题（如地址为 t/123456
                    这种）：回复小于100条，脚本将会直接进行楼中楼解析。如果回复超过100条，V站会进行分页，脚本需要先请求其他几页的回复，再进行解析
                  </p>
                  <br>
                  <p>
                    2. 弹框打开的主题，脚本需要先请求主题数据，然后再进行解析
                  </p>
                  <br>
                  <p>所以，大家可以打开控制台查看一下请求，看一下V站大概多长时间返回数据</p>
                </div>
              </div>
            </div>
            <div class="question-wrapper">
              <div class="question">
                <div class="name">
                  <search-icon class="dark"/>
                  <search-icon class="blue"/>
                  为什么有的「楼中楼」回复指定了楼层还是不正确？
                </div>
                <div class="desc">
                  <p>1. 屏蔽用户导致楼层塌陷：你屏蔽了A，自A以后的回复的楼层号都会减1</p>
                  <p>2. 忽略回复导致楼层塌陷：原理同上</p>
                  <p>3. 回复时指定错了楼层号</p>
                  <p>4. 脚本解析错误，请在<a href="https://github.com/zyronon/v2ex-script/issues">这里</a>反馈给我</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @w: 65vw;
  @mt: 64px;
  @fs: 42px;

  .info {
    .title {
      text-align: center;
      font-size: 72px;
      font-weight: bold;
      line-height: 1.4;
      color: var(--vp-home-hero-name-color);
      background: var(--vp-home-hero-name-background);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: var(--vp-home-hero-name-color);
    }

    .desc {
      font-size: 24px;
      line-height: 1.4;
      font-weight: bold;
      white-space: pre-wrap;
      color: var(--vp-c-text-2);
    }
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 20px;

    .action {
      cursor: pointer;
      border-radius: 210px;
      padding: 10px 30px;
      font-size: 16px;
      border-color: var(--vp-button-brand-border);
      color: var(--vp-button-brand-text);
      background-color: var(--vp-button-brand-bg);

      &:hover {
        border-color: var(--vp-button-brand-hover-border);
        color: var(--vp-button-brand-hover-text);
        background-color: var(--vp-button-brand-hover-bg)
      }

      &:nth-child(3) {
        border-color: var(--vp-button-alt-border);
        color: var(--vp-button-alt-text);
        background-color: var(--vp-button-alt-bg);

        &:hover {
          border-color: var(--vp-button-alt-hover-border);
          color: var(--vp-button-alt-hover-text);
          background-color: var(--vp-button-alt-hover-bg);
        }
      }
    }
  }

  .notice {
    margin-top: 32px;
    width: 65vw;
    display: flex;
    justify-content: space-between;
  }

  .display {
    margin-top: 40px;
    margin-bottom: 40px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    overflow: hidden;
    //display: none;

    video {
      width: 80vw;
    }
  }

  .important-desc {
    width: 75vw;
    margin-top: @mt;

    .item {
      width: 100%;
      margin-bottom: 80px;

      .title {
        font-size: @fs;
        font-weight: bold;
        line-height: 1;
      }

      .desc-content {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        gap: 50px;

        .desc {
          font-size: 22px;
          color: var(--vp-c-text-2);

          p {
            margin-bottom: 15px;
          }
        }

        .img-wrapper {
          min-width: 75%;
          flex: 1;
          padding: 32px;
          background: linear-gradient(to top, #fff 0, hsla(0, 0%, 100%, 0) 100%), linear-gradient(to right, rgb(247 185 85/.1) 0, rgb(255 0 128/.1) 100%);
          border-radius: 24px;
          overflow: hidden;

          img {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0px 6px 20px 2px #e1e1e1;
            //box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }

  .features-type {
    margin-top: 80px;
    font-size: @fs;
    line-height: 1;
    font-weight: bold;
  }

  .features {
    margin-top: 30px;
    width: 65vw;
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: 220px;
    gap: 20px;

    .item {
      height: 220px;
      background: var(--vp-c-bg-soft);
      display: flex;
      flex-direction: column;
      padding: 24px;
      border-radius: 12px;

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        border-radius: 6px;
        background-color: var(--vp-c-default-soft);
        width: 48px;
        height: 48px;
        font-size: 24px;
        transition: background-color .25s;
      }

      .title {
        line-height: 24px;
        font-size: 16px;
        font-weight: bold;
      }

      .details {
        flex-grow: 1;
        padding-top: 8px;
        line-height: 24px;
        font-size: 14px;
        font-weight: bold;
        color: var(--vp-c-text-2);
      }
    }
  }

  .faq {
    margin-top: 80px;
    width: 65vw;
    margin-bottom: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: @fs;
      font-weight: bold;
      letter-spacing: 0;
    }

    .questions {
      margin-top: 30px;
      width: 100%;
      display: flex;
      gap: 24px;

      .list-wrapper {
        width: 50%;
        display: flex;
        flex-direction: column;

        .question-wrapper {
          padding-bottom: 24px;

          &:hover {
            .blue {
              display: block !important;
            }

            .desc {
              height: unset;
              margin-top: 20px;
            }

            .dark {
              display: none !important;
            }

            .name {
              color: var(--vp-carbon-ads-hover-text-color);
            }
          }
        }
      }

      .question {
        border-radius: 16px;
        background: var(--vp-c-bg-soft);
        padding: 24px 16px;

        .name {
          display: flex;
          font-size: 18px;
          font-weight: bold;
          line-height: 24px;
          letter-spacing: 0;

          svg {
            width: 24px;
            height: 24px;
            margin-right: 12px;
          }

          .blue {
            display: none;
          }
        }

        .desc {
          height: 0;
          margin-left: 40px;
          opacity: 1;
          overflow: hidden;
          font-size: 20px;
          font-weight: bold;
          line-height: 24px;
          letter-spacing: 0;
          transition: all .3s;
          color: var(--vp-c-text-2);

          a {
            color: var(--vp-carbon-ads-hover-text-color);
          }
        }
      }
    }
  }
}
</style>

<style module>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
}
</style>
