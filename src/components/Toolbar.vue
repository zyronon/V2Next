<template>
  <div class="toolbar">
    <div class="tool" @click="checkIsLogin('reply')">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
        <path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
        <path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>回复</span>
    </div>
    <div v-if="post.once" class="tool" :class="{loading}" @click="toggleFavorite">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z"
            :fill="getIsFull(post.isFavorite)" :stroke="getColor(post.isFavorite)" stroke-width="2"
            stroke-linejoin="round"/>
      </svg>
      <span>{{ post.isFavorite ? '取消收藏' : '加入收藏' }}</span>
    </div>
    <div v-if="post.once && post.collectCount!==0" class="tool no-hover">
      <span>{{ post.collectCount + '人收藏' }}</span>
    </div>
  </div>
</template>

<script>
import eventBus from "../eventBus";
import {CMD} from "@/utils/type";

export default {
  name: "Toolbar",
  inject: [
    'isLogin',
    'post',
    'pageType'
  ],
  data() {
    return {
      timer: null,
      showTooltip: false,
      loading: false,
      loading2: false,
      loading3: false,
    }
  },
  methods: {
    checkIsLogin(emitName = '') {
      if (!this.isLogin) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '请先登录！'})
        return false
      }
      this.$emit(emitName)
      return true
    },
    getColor(val) {
      return val ? '#ff4500' : '#929596'
    },
    getIsFull(val) {
      return val ? '#ff4500' : 'none'
    },
    showTooltipHandler() {
      this.timer && clearTimeout(this.timer)
      this.showTooltip = true
    },
    hideTooltip() {
      this.timer = setTimeout(() => {
        this.showTooltip = false
      }, 500)
    },
    tweet() {
      if (!this.checkIsLogin()) return
      let username = window.user.username
      let url = `https://twitter.com/share?url=${window.baseUrl}/t/${this.post.id}?r=${username}&amp;related=v2ex&amp;hashtags=apple&amp;text=${this.post.title}`
      window.win().open(url, '_blank', 'width=550,height=370');
    },
    report() {
      if (!this.checkIsLogin()) return
      if (!this.isLogin) return
      if (this.post.isReport) return
      let username = window.user.username
      let url = `https://twitter.com/share?url=${window.baseUrl}/t/${this.post.id}?r=${username}&amp;related=v2ex&amp;hashtags=apple&amp;text=${this.post.title}`
      window.win().open(url, '_blank', 'width=550,height=370');
    },
    async toggleIgnore() {
      if (!this.checkIsLogin()) return
      let url = `${window.baseUrl}/${this.post.isIgnore ? 'unignore' : 'ignore'}/topic/${this.post.id}?once=${this.post.once}`
      //如果是帖子详情页，那么直接跳转到首页
      if (this.pageType === 'post') {
        this.loading2 = true
        let apiRes = await window.win().fetch(url)
        if (apiRes.redirected) {
          if (!this.post.isIgnore) {
            window.win().location = window.baseUrl
          }
          eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: this.post.isIgnore ? '取消成功' : '忽略成功'})
          eventBus.emit(CMD.MERGE, {isIgnore: !this.post.isIgnore})
        } else {
          eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '忽略失败'})
        }
        this.loading2 = false
      } else {
        if (this.post.isIgnore) {
          this.loading2 = true
        } else {
          eventBus.emit(CMD.IGNORE)
        }
        let apiRes = await window.win().fetch(url)
        if (apiRes.redirected) {
          if (this.post.isIgnore) {
            eventBus.emit(CMD.REFRESH_ONCE)
          }
          eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: this.post.isIgnore ? '取消成功' : '忽略成功'})
          eventBus.emit(CMD.MERGE, {isIgnore: !this.post.isIgnore})
        } else {
          eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '忽略成功,仅本次有效（接口调用失败！）'})
        }
        this.loading2 = false
      }
    },
    async toggleFavorite() {
      if (!this.checkIsLogin()) return
      // return eventBus.emit('merge', 'isFavorite')
      this.loading = true
      let url = `${window.baseUrl}/${this.post.isFavorite ? 'unfavorite' : 'favorite'}/topic/${this.post.id}?once=${this.post.once}`
      let apiRes = await window.win().fetch(url)
      this.loading = false
      if (apiRes.redirected) {
        let htmlText = await apiRes.text()
        if (htmlText.search(this.post.isFavorite ? '加入收藏' : '取消收藏')) {
          eventBus.emit(CMD.MERGE, {collectCount: this.post.isFavorite ? (this.post.collectCount - 1) : (this.post.collectCount + 1)})
          eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: this.post.isFavorite ? '取消成功' : '收藏成功'})
          eventBus.emit(CMD.REFRESH_ONCE, htmlText)
          eventBus.emit(CMD.MERGE, {isFavorite: !this.post.isFavorite})
          return
        }
      }
      eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '操作失败'})
    },
  }
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.toolbar {
  display: flex;
  align-items: center;
  color: @tool-color;

  .tooltip {
    //box-shadow: 0 0 0 3px gray;
    box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
    background: white;
    padding: 1rem;
    top: 4rem;
    left: -3rem;
    width: 15rem;
    position: absolute;
    z-index: 99;

    a {
      color: @blue-color !important;
    }
  }
}

</style>