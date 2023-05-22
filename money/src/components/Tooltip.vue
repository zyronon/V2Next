<template>
  <div class="pop-confirm">
    <Teleport to="body">
      <Transition>
        <div class="tip" ref="tip" v-if="show">
          {{ title }}
        </div>
      </Transition>
    </Teleport>
    <span @mouseenter="hoverIn" @mouseleave="show = false">
      <slot></slot>
    </span>
  </div>
</template>
<script>

import {nextTick} from "vue";

export default {
  name: "Tooltip",
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    hoverIn(e) {
      let rect = e.target.getBoundingClientRect()
      this.show = true
      nextTick(() => {
        let tip = this.$refs.tip.getBoundingClientRect()
        this.$refs.tip.style.top = rect.top - tip.height - 5 + 'px'
        this.$refs.tip.style.left = rect.left + rect.width / 2 + 'px'
      })
    }
  }
}
</script>