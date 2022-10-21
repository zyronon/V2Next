<template>
  <div class="post-editor-wrapper" :class="{isFocus}">
    <textarea class="post-editor"
              ref="txt"
              placeholder="请尽量让自己的回复能够对别人有帮助"
              @focus="isFocus = true"
              @blur="isFocus = false"
              :class="editorId"
              v-model="content"></textarea>
    <textarea class="hide" :class="editorId"></textarea>
    <div class="toolbar">
      <div class="button"
           :class="{disabled,loading}"
           @click="submit">回复
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, inject, onBeforeUnmount, onMounted, ref} from "vue";
import eventBus from "../eventBus";
import {CMD} from "../utils/type";

const {replyInfo, replyFloor} = defineProps(['replyInfo', 'replyFloor'])
const post = inject('post')
const allReplyUsers = inject('allReplyUsers')
const isFocus = ref(false)
const loading = ref(false)
const editorId = ref('editorId_' + Date.now())
const content = ref(replyInfo)
const txt = ref(null)

const disabled = computed(() => {
  if (content.value) {
    return content.value === replyInfo
  } else {
    return true
  }
})

async function submit() {
  if (disabled.value || loading.value) return
  loading.value = true
  let item = {
    thankCount: 0,
    isThanked: false,
    isOp: post.value.username === window.user.username,
    id: Date.now(),
    username: window.user.username,
    avatar: window.user.avatar,
    date: '几秒前',
    floor: post.value.replyCount + 1,
    reply_content: content.value || Date.now(),
    children: [],
    replyUsers: [],
    replyFloor: replyFloor || -1
  }
  loading.value = false
  return console.log(item)
  let matchUsers = content.value.match(/@([\w]+?[\s])/g)
  if (matchUsers) {
    matchUsers.map(i => {
      let username = i.replace('@', '').replace(' ', '')
      item.reply_content = item.reply_content.replace(username, `<a href="/member/${username}">${username}</a>`)
    })
  }
  // this.loading = false
  // eventBus.emit('refreshOnce',)
  // eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
  // eventBus.emit('addReply', item)
  // this.content = this.replyInfo
  // return console.log('item', item)

  let url = `${window.url}/t/${this.post.id}`
  $.post(url, {content: content.value, once: post.once}).then(
      res => {
        // console.log('回复', res)
        loading.value = false
        content.value = replyInfo
        eventBus.emit('refreshOnce', res)
        eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
        eventBus.emit('addReply', item)
      },
      err => {
        this.loading = false
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '回复失败'})
      }
  )
}

onMounted(() => {
  $(`.${editorId.value}`).each(function () {
    this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
  }).on("input", function () {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + "px";
  });
  txt.value && txt.value.focus()
})
onBeforeUnmount(() => {
  $(`.${editorId.value}`).off()
})

</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.post-editor-wrapper {
  width: 100%;
  border-radius: .4rem;
  border: 1px solid @border;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: all .3s;

  &.isFocus {
    border: 1px solid @border-hover;
  }

  .hide {
    position: absolute;
    left: -9999px;
  }

  .post-editor {
    width: 100%;
    max-width: 100%;
    padding: .6rem 1.4rem;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.4rem;
    min-height: 13rem;
  }

  .toolbar {
    box-sizing: border-box;
    text-align: end;
    padding: .5rem 1rem;
    width: 100%;
    position: relative;
    background: rgb(246, 247, 248);
  }
}

</style>