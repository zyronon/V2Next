<template>
  <Transition>
    <div v-if="show" class="setting-modal modal" :class="{isNight}">
      <div class="mask" @click="$emit('update:show',false)"></div>
      <div class="wrapper">
        <div class="title">
          脚本设置
        </div>
        <div class="sub-title">
          设置自动保存到本地，下次打开依然生效
        </div>
        <div class="body">
          <div class="option-list">
            <div class="option-title">列表:</div>
            <div class="option">
              <span>列表帖子展示方式：</span>
              <div class="radio-group2" :class="{isNight}">
                <div class="radio"
                     @click="config.viewType = 'table'"
                     :class="config.viewType === 'table'?'active':''">表格
                </div>
                <div class="radio"
                     @click="config.viewType = 'card'"
                     :class="config.viewType === 'card'?'active':''">卡片
                </div>
              </div>
            </div>
            <div class="option">
              <span>列表hover时显示预览按钮：</span>
              <div class="switch gray" :class="{active:config.showPreviewBtn,isNight}"
                   @click="config.showPreviewBtn = !config.showPreviewBtn"/>
            </div>
            <div class="notice">
              此项需要刷新页面才能生效
            </div>
            <div class="option">
              <span>点击列表的帖子，打开详情弹框 ：</span>
              <div class="switch gray" :class="{active:config.clickPostItemOpenDetail,isNight}"
                   @click="config.clickPostItemOpenDetail = !config.clickPostItemOpenDetail"/>
            </div>
            <div class="notice">
              若关闭此项，点击列表的帖子时，不会打开弹框，会跳转网页
            </div>
            <div class="option-title">帖子:</div>
            <div class="option">
              <span>回复展示方式：</span>
              <div class="radio-group2" :class="{isNight}">
                <div class="radio"
                     @click="config.commentDisplayType = 0"
                     :class="config.commentDisplayType === 0?'active':''">楼中楼
                </div>
                <div class="radio"
                     @click="config.commentDisplayType = 1"
                     :class="config.commentDisplayType === 1?'active':''">感谢
                </div>
                <div class="radio"
                     @click="config.commentDisplayType = 3"
                     :class="config.commentDisplayType === 3?'active':''">只看楼主
                </div>
                <div class="radio"
                     @click="config.commentDisplayType = 2"
                     :class="config.commentDisplayType === 2?'active':''">V2原版
                </div>
              </div>
            </div>
            <div class="option">
              <span>单独打开帖子时默认显示楼中楼 ：</span>
              <div class="switch gray" :class="{active:config.autoOpenDetail,isNight}"
                   @click="config.autoOpenDetail = !config.autoOpenDetail"/>
            </div>
            <div class="notice">
              单独打开这种地址 https://v2ex.com/t/xxxx 时，是否默认显示楼中楼
            </div>
            <div class="option">
              <span>点击左右两侧透明处关闭帖子详情弹框：</span>
              <div class="switch gray" :class="{active:config.closePostDetailBySpace,isNight}"
                   @click="config.closePostDetailBySpace = !config.closePostDetailBySpace"/>
            </div>
            <div class="option-title">点赞:</div>
            <div class="option">
              <span>显示高赞回复：</span>
              <div class="switch gray" :class="{active:config.showTopReply,isNight}"
                   @click="config.showTopReply = !config.showTopReply"/>
            </div>
            <div class="option">
              <span>最多显示多少个高赞回复：</span>
              <input type="number" min="1" v-model="config.topReplyCount">
            </div>
            <div class="option">
              <span>最少需要多少赞才能被判定为高赞：</span>
              <input type="number" min="1" v-model="config.topReplyLoveMinCount">
            </div>
            <div class="option-title">记忆阅读:</div>
            <div class="option">
              <span>记录上次阅读楼层（误差1层左右）：</span>
              <div class="switch gray" :class="{active:config.rememberLastReadFloor,isNight}"
                   @click="config.rememberLastReadFloor = !config.rememberLastReadFloor;config.autoJumpLastReadFloor = false"/>
            </div>
            <div class="option">
              <span>打开帖子自动跳转到上次阅读楼层：</span>
              <div class="switch gray" :class="{active:config.autoJumpLastReadFloor,isNight}"
                   @click="config.autoJumpLastReadFloor = !config.autoJumpLastReadFloor"/>
            </div>
          </div>

          <div class="option-list">
            <div class="option-title">其他:</div>
            <div class="option">
              <span>显示工具栏：</span>
              <div class="switch gray" :class="{active:config.showToolbar,isNight}"
                   @click="config.showToolbar = !config.showToolbar"/>
            </div>
            <div class="notice">
              关闭此项会隐藏以下三个工具栏
              <div>
                1. 首页”卡片/表格“
              </div>
              <div>
                2. 详情页”楼中楼/只看楼主/感谢/V2原版“
              </div>
              <div>
                3. 单独打开帖子时”点击显示楼中楼“
              </div>
            </div>
            <div class="option">
              <span>新标签页打开链接 ：</span>
              <div class="switch gray" :class="{active:config.newTabOpen,isNight}"
                   @click="config.newTabOpen = !config.newTabOpen;config.clickPostItemOpenDetail = !config.newTabOpen"/>
            </div>
            <div class="option">
              <span>用户打标签(跨平台，数据保存在自己的记事本)：</span>
              <div class="switch gray" :class="{active:config.openTag,isNight}"
                   @click="config.openTag = !config.openTag"/>
            </div>
            <div class="option">
              <span>正文超长自动折叠：</span>
              <div class="switch gray" :class="{active:config.contentAutoCollapse,isNight}"
                   @click="config.contentAutoCollapse = !config.contentAutoCollapse"/>
            </div>
            <div class="option">
              <span>划词显示Base64解码框：</span>
              <div class="switch gray" :class="{active:config.base64,isNight}"
                   @click="config.base64 = !config.base64"/>
            </div>
            <div class="option">
              <span>使用 SOV2EX 搜索：</span>
              <div class="switch gray" :class="{active:config.sov2ex,isNight}"
                   @click="config.sov2ex = !config.sov2ex"/>
            </div>
            <div class="notice">
              此项需要刷新页面才能生效
            </div>
            <div class="option">
              <span>帖子宽度：</span>
              <input type="text" v-model="config.postWidth">
            </div>
            <div class="notice">
              默认为77rem。接受合法的width值：
              <a href="https://vue3js.cn/interview/css/em_px_rem_vh_vw.html#%E4%BA%8C%E3%80%81%E5%8D%95%E4%BD%8D"
                 target="_blank">rem、px、vw、vh</a>。
              vw代表屏幕百分比，如想要屏幕的66%，请填写66vw
            </div>
            <div class="notice">
              提示：此项设置以后，单独打开详情页时会出现帖子突然变宽（窄）的问题，暂时无解
            </div>
            <div class="option">
              <span>自动签到：</span>
              <div class="switch gray" :class="{active:config.autoSignin,isNight}"
                   @click="config.autoSignin = !config.autoSignin"/>
            </div>

            <div class="option">
              <span>自定义背景：</span>
              <input type="text" v-model="config.customBgColor">
            </div>
            <div class="notice">
              接受一个合法的css color值：例如<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value"
                                               target="_blank">red、#ffffff、rgb(222,222,22)</a>等等。
              没图片时的背景默认为 #e2e2e2。
            </div>
            <div class="notice">
              此项需要刷新页面才能生效
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "Setting",
  inject: ['isNight'],
  props: {
    modelValue: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      config: window.clone(this.modelValue),
    }
  },
  watch: {
    config: {
      handler(n) {
        n.topReplyLoveMinCount = Math.trunc(n.topReplyLoveMinCount)
        if (n.topReplyLoveMinCount < 0) {
          n.topReplyLoveMinCount = 1
        }
        this.$emit('update:modelValue', n)
      },
      deep: true
    }
  },
  created() {
  }
}
</script>

<style scoped lang="less">
.isNight {
  .wrapper {
    background: #22303f !important;
    //background: rgb(24,34,45) !important;

    .title, .option-title, .option > span {
      color: darkgrey;
    }

    .notice {
      color: gray !important;
    }
  }
}

.setting-modal {
  .wrapper {
    z-index: 9;
    background: #f1f1f1;
    border-radius: .8rem;
    font-size: 1.4rem;
    //box-shadow: 0 0 6px 4px gainsboro;
    padding: 2rem;
    max-height: 80vh;
    max-width: 80vw;
    overflow: auto;

    .sub-title {
      color: gray;
      font-size: 1.4rem;
    }

    .option-title {
      text-align: start;
      font-size: 1.6rem;
      font-weight: bold;
      margin-top: 1.5rem;
    }

    .body {
      display: flex;
      gap: 3rem;

      .option-list {
        width: 40rem;
      }
    }

    .notice {
      font-size: 12px;
      padding-left: 3rem;
      text-align: left;

      a {
        color: blue;
      }
    }
  }
}

</style>