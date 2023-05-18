<script setup>
import eventBus from "@/eventBus";
import {CMD} from "@/utils/type";
import {onMounted, ref, watch} from "vue";
import {inject} from 'vue'

const config = inject('config')
const props = defineProps(['html'])
const contentRef = ref(null)
const checkHeight = 900
const mask = ref(false)
const handOpen = ref(false)

function mouseup(e) {
  if (!config.value.base64) return;
  let selectionText = window.win().getSelection().toString()
  // console.log(selectionText)
  if (selectionText) {
    let r = selectionText.match(/([A-Za-z0-9+/=]+)/g)
    if (r) {
      // console.log('base64', r, e)
      // console.log(e.pageX)
      // console.log(e.pageY)
      if (r[0].length < 4) return
      eventBus.emit(CMD.SHOW_TOOLTIP, {text: r[0], e})
    }
  }
}

watch(config.value, (newVale) => {
  if (!newVale.contentAutoCollapse) {
    mask.value = false
  }
})

watch([() => contentRef.value, () => props.html], () => {
  if (!contentRef.value || !props.html) return
  if (!config.value.contentAutoCollapse) return;
  //如果有图片，还没加载完，此刻content.value的高度不会包括图片的高度
  contentRef.value.querySelectorAll('img').forEach(item => {
    item.removeEventListener('load', checkContentHeight)
    item.addEventListener('load', checkContentHeight)
  })
  checkContentHeight()
}, {immediate: true, flush: 'post'})

function checkContentHeight() {
  if (handOpen.value) return;
  let rect = contentRef.value.getBoundingClientRect()
  // console.log('rect', rect.height)
  mask.value = rect.height >= checkHeight
}

</script>
<template>
  <div class="html-wrapper" v-if="props.html">
    <div :class="{mask}">
      <div ref="contentRef" v-bind="$attrs" v-html="props.html" @mouseup="mouseup"></div>
    </div>
    <div v-if="mask" class="expand" @click="mask = false;handOpen = true">展开</div>
  </div>
</template>
<style lang="less" scoped>
@import "@/assets/less/index.less";

.html-wrapper {
  position: relative;

  .mask {
    max-height: 90rem;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(180deg, #000 80%, transparent);
  }

  .expand {
    position: absolute;
    z-index: 1;
    bottom: 2rem;
    padding: .2rem 1.5rem;
    border-radius: 2rem;
    border: 1px solid gray;
    background: white;
    color: gray;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
  }
}
</style>

