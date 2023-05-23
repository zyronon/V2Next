<template>
  <div class="point">
    <PopConfirm
        :disabled="disabled"
        :title="`确认花费 10 个铜币向 @${item.username} 的这条回复发送感谢？`"
        @confirm="thank">
      <div class="up" @click="thankError">
        <svg :class="{disabled}" width="19" height="19" viewBox="0 0 48 48" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path
              d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
              :fill="getIsFull()" :stroke="getColor()" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
        </svg>
      </div>
    </PopConfirm>
    <div class="num">{{ item.thankCount ? item.thankCount : '感谢' }}</div>
  </div>
</template>
<script>
import eventBus from "@/utils/eventBus.js";
import {CMD} from "@/utils/type";
import PopConfirm from "@/components/PopConfirm.vue";

const loveColor = 'rgb(224,42,42)'
export default {
  name: "Point",
  components: {PopConfirm},
  inject: ['post', 'isLogin'],
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    full: {
      type: Boolean,
      default() {
        return true
      }
    },
    apiUrl: '',
  },
  computed: {
    disabled() {
      return (this.item.username === window.user.username) || this.item.isThanked || !this.isLogin
    }
  },
  methods: {
    getColor() {
      if (this.item.isThanked) return loveColor
      return this.full ? loveColor : '#929596'
    },
    getIsFull() {
      if (this.item.isThanked) return loveColor
      return this.full ? loveColor : 'none'
    },
    thankError() {
      if (this.item.username === window.user.username) {
        return eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '不能感谢自己'})
      }
      if (this.item.isThanked) {
        return eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '已经感谢过了'})
      }
      if (!this.isLogin) {
        return eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '请先登录！'})
      }
    },
    async thank() {
      this.$emit('addThank')
      //https://www.v2ex.com/thank/topic/886147?once=38719
      let url = `${window.baseUrl}/thank/${this.apiUrl}?once=${this.post.once}`
      $.post(url).then(res => {
        if (!res.success) {
          this.$emit('recallThank')
          eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: res.message})
        }
        eventBus.emit(CMD.REFRESH_ONCE, res.once)
      }, err => {
        this.$emit('recallThank')
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '感谢失败'})
        eventBus.emit(CMD.REFRESH_ONCE)
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.point {
  margin-left: 1rem;
  font-size: 1.2rem;
  min-width: 4rem;
  //background: rgb(248, 249, 250);
  border-radius: @border-radius 0 0 @border-radius;
  display: flex;
  align-items: center;
  flex-direction: row !important;
  //min-width: 6rem !important;
  padding: 0 !important;

  .up {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .num {
    margin-left: .2rem;
    font-weight: 700;
    color: black;
    user-select: none;
  }

  svg {
    width: 2.0rem;
    padding: .4rem;
    border-radius: .2rem;

    &:hover {
      background: rgb(229, 229, 229);
    }

    &.disabled {
      cursor: not-allowed;

      &:hover {
        background: unset !important;
      }
    }
  }


}

</style>