<script setup>
import eventBus from "@/eventBus";
import {CMD} from "@/utils/type";

const props = defineProps(['html'])

function mouseup(e) {
  let selectionText = window.w.getSelection().toString()
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
</script>
<template>
  <div v-bind="$attrs" v-html="props.html" @mouseup="mouseup"></div>
</template>

