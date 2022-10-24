<template>
  <div class="post-editor-wrapper" :class="{isFocus}">
    <textarea class="post-editor"
              ref="txtRef"
              @focus="isFocus = true"
              @blur="onBlur"
              :class="editorId"
              @input="onInput"
              @keydown="onKeydown"
              v-model="content"></textarea>
    <div class="get-cursor">
      <span v-html="cursorHtml"></span>
      <span class="cursor" ref="cursorRef">|</span>
    </div>
    <div class="toolbar">
      <span>请尽量让自己的回复能够对别人有帮助</span>
      <div class="button"
           :class="{disabled,loading}"
           @click="submit">回复
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, h, inject, onBeforeUnmount, onMounted, ref} from "vue";
import eventBus from "../eventBus";
import {CMD} from "../utils/type";

const {replyInfo, replyFloor} = defineProps(['replyInfo', 'replyFloor'])
const post = inject('post')
const allReplyUsers = inject('allReplyUsers')
let isFocus = ref(false)
const loading = ref(false)
const editorId = ref('editorId_' + Date.now())
const content = ref(replyInfo)
const txtRef = ref(null)
const cursorRef = ref(null)
const none = ref('<span style="white-space:pre-wrap;"> </span>')

const cursorHtml = computed(() => {
  if (!txtRef.value || !content.value) return ''
  let index = txtRef.value?.selectionStart || 0
  return content.value.substring(0, index)
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/\n/g, '<br/>')
      .replace(/\s/g, none.value);
})

const disabled = computed(() => {
  if (content.value) {
    return content.value === replyInfo
  } else {
    return true
  }
})

function off() {
  eventBus.emit(CMD.SHOW_CALL, {show: false})
  eventBus.off(CMD.SET_CALL)
}

function show(text) {
  // console.log('show')
  // let r = getPosition(txtRef.value)
  let r = cursorRef.value.getBoundingClientRect()
  // console.log('r', r)
  eventBus.emit(CMD.SHOW_CALL, {show: true, top: r.top, left: r.left, text})
  eventBus.off(CMD.SET_CALL)
  eventBus.on(CMD.SET_CALL, e => {
    let cursorPos = txtRef.value.selectionStart
    let start = content.value.slice(0, cursorPos)
    let end = content.value.slice(cursorPos, content.value.length)
    let lastCallPos = start.lastIndexOf('@')
    // console.log('e', e)
    start = content.value.slice(0, lastCallPos + 1)
    content.value = start + e + ' ' + end
    let moveCursorPos = start.length + e.length + 1
    // console.log(moveCursorPos)
    setTimeout(() => {
      txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
    })
    eventBus.off(CMD.SET_CALL)
  })
}

// const show = debounce(_show, 500)

function onKeydown(e) {
  let code = e.keyCode
  switch (code) {
      //删除
    case 8:
      //如果最后一个字符是@，那么就关闭
      if (content.value === '@') {
        off()
      }
      break
    case 37:
    case 38:
    case 39:
    case 40:
      setTimeout(() => onInput({data: ''}), 100)
      break
  }
}

function onInput(e) {
  let cursorPos = txtRef.value.selectionStart
  if (!content.value) return
  // console.log('cursorPos', cursorPos, content.value)
  // console.log('e.data', e.data)
  if (e.data === ' ') {
    return off()
  }
  if (e.data === '@') {
    if (content.value.length !== 1) {
      if (content.value[cursorPos - 2] === ' ' || content.value[cursorPos - 2] === '\n') {
        return show('')
      }
    } else {
      return show('')
    }
    off()
  } else {
    // console.log('当前光标位置', cursorPos)
    let judgeStr = content.value.slice(0, cursorPos)
    // console.log('判断的字符串', judgeStr)
    let lastCallPos = judgeStr.lastIndexOf('@')
    // console.log('最后一个@的位置', lastCallPos)
    if (lastCallPos === -1) {
      return off()
    }
    let callStr = judgeStr.slice(lastCallPos, cursorPos)
    // console.log('callStr', callStr)
    let hasSpace = callStr.includes(' ')
    // console.log('是否有空格', hasSpace)
    if (hasSpace) {
      off()
    } else {
      if (lastCallPos === 0) {
        return show(callStr.replace('@', ''))
      }
      if (content.value.length !== 1) {
        if (content.value[lastCallPos - 1] === ' ' || content.value[lastCallPos - 1] === '\n') {
          return show(callStr.replace('@', ''))
        }
      } else {
        return show(callStr.replace('@', ''))
      }
      off()
      // show(callStr.replace('@', ''))
    }
  }
}

function onBlur() {
  // eventBus.emit(CMD.SHOW_CALL, {show: false})
  // eventBus.off(CMD.SET_CALL)
  isFocus.value = false
}

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
  // loading.value = false
  // return console.log(item)
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

  let url = `${window.url}/t/${post.value.id}`
  $.post(url, {content: content.value, once: post.value.once}).then(
      res => {
        // console.log('回复', res)
        loading.value = false
        content.value = replyInfo
        eventBus.emit('refreshOnce', res)
        eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
        eventBus.emit('addReply', item)
      },
      err => {
        loading.value = false
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
  txtRef.value && txtRef.value.focus()
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
    resize: none;
  }

  .toolbar {
    box-sizing: border-box;
    padding: .5rem 1rem;
    width: 100%;
    position: relative;
    background: rgb(246, 247, 248);
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      color: gray;
      font-size: 1.2rem;
    }
  }

  .get-cursor {
    .post-editor();
    position: absolute;
    top: 0;
    z-index: -100;
  }
}

</style>