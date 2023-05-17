<script lang="ts">
import {defineComponent} from "vue"
import {PageType} from "./types"

export default defineComponent({
  data() {
    return {
      loading: window.pageType === PageType.Post,
      loadMore: false,
      isLogin: !!window.user.username,
      pageType: window.pageType,
      isNight: window.isNight,
      msgList: [
        // {type: 'success', text: '123', id: Date.now()}
      ],
      stopMe: false,//停止使用脚本
      show: false,
      showConfig: false,
      current: window.clone(window.initPost),
      list: [],
      config: window.config,
      tags: window.user.tags,
      tagModal: {
        show: false,
        currentUsername: '',
        tag: '',
      }
    }
  },
})
</script>

<template>
</template>

<style scoped lang="less">
</style>
