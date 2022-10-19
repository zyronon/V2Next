<template>
  <div class="toolbar">
    <div class="tool" :class="post.once?'no-hover':''">
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
        <path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
        <path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>{{ post.replyCount }}条回复</span>
    </div>
    <div v-if="post.once" class="tool" :class="{loading}" @click="toggleFavorite">
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34 10V4H8V38L14 35" stroke="#929596" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="none" stroke="#929596" stroke-width="2"
              stroke-linejoin="round"/>
      </svg>
      <span>{{ post.isFavorite ? '取消收藏' : '加入收藏' }}</span>
    </div>
    <div v-if="post.once && post.collectCount!==0" class="tool no-hover">
      <span>{{ post.collectCount + '人收藏' }}</span>
    </div>

    <div class="tool" @click="tweet">
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 6H42V20" stroke="#929596" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path
            d="M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6"
            stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M25.7998 22.1999L41.0998 6.8999" stroke="#929596" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
      <span>Tweet</span>
    </div>
    <div v-if="post.once" class="tool" :class="{'loading':loading2}" @click="toggleIgnore">
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30"
            stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path
            d="M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705"
            stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M42 42L6 6" stroke="#929596" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
      <span>{{ post.isIgnore ? '取消忽略' : '忽略主题' }}</span>
    </div>
    <div v-if="post.once && post.isLogin" class="tool" :class="{'loading':loading3,'no-hover':post.isLogin}" @click="report">
      <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z" fill="#929596" stroke="#929596"
              stroke-width="4" stroke-linejoin="round"/>
        <path d="M8 42H40" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 13L7 14" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 3.9999L14 6.9999" stroke="#929596" stroke-width="4" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M10.0001 9.99989L7.00009 6.99989" stroke="#929596" stroke-width="4" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
      <span>{{ post.isReport ? '你已对本主题进行了报告' : '报告这个主题' }}</span>
    </div>
    <div class="tool no-hover" v-if="post.once"
         @mouseenter="showTooltipHandler"
         @mouseleave="hideTooltip"
    >
      <div v-if="showTooltip"
           class="tooltip"
           @mouseenter="showTooltipHandler"
           @mouseleave="hideTooltip"
      >
        脚本有问题？<a target="_blank" href="https://github.com/zyronon/v2ex-script/issues">点击这里提一个Issue</a>
      </div>
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 44H12H16" stroke="#929596" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M12 44V4" stroke="#929596" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M40 6H12V22H40L36 14L40 6Z" fill="none" stroke="#929596" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>脚本有问题？</span>
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
    'post'
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
  created() {
    console.log(this)
  },
  methods: {
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
      let username = window.user.username
      let url = `https://twitter.com/share?url=${window.url}/t/${this.post.id}?r=${username}&amp;related=v2ex&amp;hashtags=apple&amp;text=${this.post.title}`
      window.w.open(url, '_blank', 'width=550,height=370');
    },
    report() {
      if (!this.isLogin) return
      if (this.post.isReport) return
      let username = window.user.username
      let url = `https://twitter.com/share?url=${window.url}/t/${this.post.id}?r=${username}&amp;related=v2ex&amp;hashtags=apple&amp;text=${this.post.title}`
      window.w.open(url, '_blank', 'width=550,height=370');
    },
    async toggleIgnore() {
      if (this.post.isIgnore) {
        this.loading2 = true
      } else {
        eventBus.emit('ignore')
      }
      let url = `${window.url}/${this.post.isIgnore ? 'unignore' : 'ignore'}/topic/${this.post.id}?once=${this.post.once}`
      let apiRes = await window.w.fetch(url)
      if (apiRes.redirected) {
        if (this.post.isIgnore) {
          eventBus.emit('refreshOnce')
        }
        eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: this.post.isIgnore ? '取消成功' : '忽略成功'})
        eventBus.emit('merge', {isIgnore: !this.post.isIgnore})
        this.loading2 = false
        return
      }
      eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '忽略成功,仅本次有效（接口调用失败！）'})
      this.loading2 = false
    },
    async toggleFavorite() {
      // return eventBus.emit('merge', 'isFavorite')
      this.loading = true
      let url = `${window.url}/${this.post.isFavorite ? 'unfavorite' : 'favorite'}/topic/${this.post.id}?once=${this.post.once}`
      let apiRes = await window.w.fetch(url)
      this.loading = false
      if (apiRes.redirected) {
        let htmlText = await apiRes.text()
        if (htmlText.search(this.post.isFavorite ? '加入收藏' : '取消收藏')) {
          eventBus.emit('merge', {collectCount: this.post.isFavorite ? (this.post.collectCount - 1) : (this.post.collectCount + 1)})
          eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: this.post.isFavorite ? '取消成功' : '收藏成功'})
          eventBus.emit('refreshOnce', htmlText)
          eventBus.emit('merge', {isFavorite: !this.post.isFavorite})
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