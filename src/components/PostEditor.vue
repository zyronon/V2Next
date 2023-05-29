<template>
  <div class="post-editor-wrapper" :class="editorClass">
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
import {computed, h, inject, onBeforeUnmount, onMounted, ref, watch} from "vue";
import eventBus from "@/utils/eventBus.js";
import {CMD} from "../utils/type";

const props = defineProps({
  replyUser: null,
  replyFloor: null,
  useType: {
    type: String,
    default() {
      return 'reply-comment'
    }
  },
})
const {replyUser, replyFloor, useType} = props
const replyInfo = replyUser ? `@${replyUser} #${replyFloor} ` : ''
const emits = defineEmits(['close'])

const post = inject('post')
const show = inject('show')
const pageType = inject('pageType')
const allReplyUsers = inject('allReplyUsers')
let isFocus = ref(false)
const loading = ref(false)
const editorId = ref('editorId_' + Date.now())
const content = ref(replyInfo)
const txtRef = ref(null)
const cursorRef = ref(null)
const none = ref('<span style="white-space:pre-wrap;"> </span>')

defineExpose({content})

const editorClass = computed(() => {
  return [useType, isFocus.value ? 'isFocus' : '']
})
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
    replyUsers: replyUser ? [replyUser] : [],
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

  // loading.value = false
  // content.value = replyInfo
  // eventBus.emit(CMD.REFRESH_ONCE,)
  // eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
  // eventBus.emit(CMD.ADD_REPLY, item)
  // emits('close')
  // return console.log('item', item)

  let url = `${window.baseUrl}/t/${post.value.id}`
  $.post(url, {content: content.value, once: post.value.once}).then(
      res => {
        console.log('回复', res)
        loading.value = false
        let r = res.search('你上一条回复的内容和这条相同')
        if (r > -1) return eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '你上一条回复的内容和这条相同'})

        r = res.search('请不要在每一个回复中都包括外链，这看起来像是在 spamming')
        if (r > -1) return eventBus.emit(CMD.SHOW_MSG, {
          type: 'error',
          text: '请不要在每一个回复中都包括外链，这看起来像是在 spamming'
        })

        let r2 = res.search('创建新回复')
        if (r2 > -1) {
          eventBus.emit(CMD.REFRESH_ONCE, res)
          eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '回复失败'})
          let clientWidth = window.win().document.body.clientWidth
          let windowWidth = 1200
          let left = clientWidth / 2 - windowWidth / 2
          let newWin = window.win().open("about:blank", "hello", `width=${windowWidth},height=600,left=${left},top=100`);
          newWin.document.write(res);
          return
        }
        content.value = replyInfo
        emits('close')
        eventBus.emit(CMD.REFRESH_ONCE, res)
        eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
        eventBus.emit(CMD.ADD_REPLY, item)
      },
      err => {
        console.log('err', err)
        loading.value = false
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '回复失败'})
      }
  ).catch(r => {
    console.log('cathc', r)
  })
}

function off() {
  eventBus.emit(CMD.SHOW_CALL, {show: false})
  eventBus.off(CMD.SET_CALL)
}

function checkHeight() {
  txtRef.value.style.height = 0;
  txtRef.value.style.height = (txtRef.value.scrollHeight) + "px";
}

function showCallPopover(text) {
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
    if (e === '管理员') {
      e = 'Livid @Kai @Olivia @GordianZ @sparanoid'
      setTimeout(checkHeight)
    }
    if (e === '所有人') {
      e = allReplyUsers.value.map((v, i) => {
        if (i) return '@' + v
        else return v
      }).join(' ')
      setTimeout(checkHeight)
    }
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
      //esc
    case 27:
      e.preventDefault();
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
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
        return showCallPopover('')
      }
    } else {
      return showCallPopover('')
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
        return showCallPopover(callStr.replace('@', ''))
      }
      if (content.value.length !== 1) {
        if (content.value[lastCallPos - 1] === ' ' || content.value[lastCallPos - 1] === '\n') {
          return showCallPopover(callStr.replace('@', ''))
        }
      } else {
        return showCallPopover(callStr.replace('@', ''))
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

onMounted(() => {
  $(`.${editorId.value}`).each(function () {
    this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
  }).on("input", function () {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + "px";
  });
  if (useType === 'reply-comment') {
    txtRef.value && txtRef.value.focus()
  }
})
onBeforeUnmount(() => {
  $(`.${editorId.value}`).off()
})

</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.post-editor-wrapper {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: all .3s;

  &.reply-post {
    .post-editor {
      border: 1px solid @border;
      border-radius: .4rem;
    }

    &.isFocus {
      .post-editor {
        border: 1px solid @border-hover;
      }
    }
  }

  &.reply-comment {
    border: 1px solid @border;
    border-radius: .4rem;
    overflow: hidden;

    &.isFocus {
      border: 1px solid @border-hover;
    }

    .toolbar {
      background: rgb(246, 247, 248);
    }
  }


  .post-editor {
    transition: border .3s;
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
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      color: gray;
      font-size: 1.3rem;
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