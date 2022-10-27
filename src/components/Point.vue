<template>
  <div class="point" :class="type">
    <div class="up" @click.stop="thank">
      <svg v-show="item.isThanked" :class="{disabled}" width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
            fill="#ff4500" stroke="#ff4500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-show="!item.isThanked" :class="{disabled}" width="19" height="19" viewBox="0 0 48 48" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
            fill="none" stroke="#9b9b9b" stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="num">{{ item.thankCount ? item.thankCount : '感谢' }}</div>
  </div>
</template>
<script>
import eventBus from "../eventBus";
import {CMD} from "@/utils/type";

export default {
  name: "Point",
  inject: ['post'],
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default() {
        return 'horizontal'
      }
    },
    apiUrl: '',
  },
  computed: {
    disabled() {
      return (this.item.username === window.win().user.username) || this.item.isThanked
    }
  },
  methods: {
    async thank() {
      if (this.item.username === window.win().user.username) {
        return eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '不能感谢自己'})
      }
      if (this.item.isThanked) {
        return eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '已经感谢过了'})
      }
      this.$emit('addThank')
      //https://www.v2ex.com/thank/topic/886147?once=38719
      let url = `${window.url}/thank/${this.apiUrl}?once=${this.post.once}`
      $.post(url).then(res => {
        console.log('感谢', res)
        if (!res.success) {
          this.$emit('recallThank')
          eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: res.message})
        }
        eventBus.emit(CMD.REFRESH_ONCE, res.once)

      }, err => {
        this.$emit('recallThank')
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '感谢失败'})
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.horizontal {
  flex-direction: row !important;
  //min-width: 6rem !important;
  padding: 0 !important;

  .num {
    margin-left: .2rem;
  }
}

.point {
  font-size: 1.2rem;
  padding: 1rem 0;
  min-width: 4rem;
  //background: rgb(248, 249, 250);
  border-radius: @border-radius 0 0 @border-radius;
  display: flex;
  flex-direction: column;
  align-items: center;

  .up {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .num {
    font-weight: 700;
    color: black;
  }

  svg {
    width: 2.0rem;
    padding: .4rem;
    border-radius: .2rem;

    &:hover {
      background: rgb(229, 229, 229);
    }
  }

  .disabled {
    &:hover {
      background: unset;
    }
  }
}

</style>