<template>
  <div class="post-editor-wrapper" :class="editorClass">
    <textarea class="post-editor"
              ref="txtRef"
              @focus="isFocus = true"
              @blur="onBlur"
              @focusin="onFocusin"
              placeholder="请尽量让自己的回复能够对别人有帮助"
              :class="editorId"
              @input="onInput"
              @keydown="onKeydown"
              @drop="drop"
              v-model="content"></textarea>
    <div class="get-cursor">
      <span v-html="cursorHtml"></span>
      <span class="cursor" ref="cursorRef">|</span>
    </div>
    <div class="toolbar">
      <div class="left">
        <svg @click="showEmoticons" width="20" height="20" viewBox="0 0 48 48" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path
              d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
              fill="none" stroke="#929596" stroke-width="2" stroke-linejoin="round"/>
          <path d="M24 35C29 35 31 31 31 31H17C17 31 19 35 24 35Z" stroke="#929596" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M31 18V22" stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 18V22" stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="upload">
          <input type="file" accept="image/*" @change="e=>upload(e.currentTarget.files[0])">
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5 10C5 8.89543 5.89543 8 7 8L41 8C42.1046 8 43 8.89543 43 10V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V10Z"
                  stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M14.5 18C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15C13.6716 15 13 15.6716 13 16.5C13 17.3284 13.6716 18 14.5 18Z"
                  stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 24L20 28L26 21L43 34V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V34L15 24Z"
                  fill="none" stroke="#929596" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        <span v-if="uploadLoading" style="color: black;font-size: 1.4rem">上传中.....</span>
      </div>
      <div class="right">
        <span v-if="useType === 'reply-comment'" style="margin-right: 1rem;cursor: pointer;"
              @click="emits('close')">关闭</span>
        <div class="button"
             :class="{disabled,loading}"
             @click="submit">回复
        </div>
      </div>
    </div>

    <div class="emoticon-pack" ref="emoticonsRef" v-show="isShowEmoticons">
      <i class="fa fa-times" aria-hidden="true" @click="isShowEmoticons = false"></i>
      <div class="title">经典表情</div>
      <div class="list">
        <img v-for="item in classicsEmoticons" :src="item.high" @click="insert(item.name);isShowEmoticons = false">
      </div>
      <div class="emoji">
        <template v-for="item in emojiEmoticons">
          <div class="title">{{ item.title }}</div>
          <div class="list">
            <span v-for="emoji in item.list" @click="insert(emoji);isShowEmoticons = false">{{ emoji }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, h, inject, onBeforeUnmount, onMounted, ref, toRef, watch} from "vue";
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
const isNight = inject('isNight')
const pageType = inject('pageType')
const allReplyUsers = inject('allReplyUsers')
let isFocus = ref(false)
const loading = ref(false)
const uploadLoading = ref(false)
const isShowEmoticons = ref(false)
const editorId = ref('editorId_' + Date.now())
const content = ref(replyInfo)
const txtRef = ref(null)
const cursorRef = ref(null)
const emoticonsRef = ref(null)
const none = ref('<span style="white-space:pre-wrap;"> </span>')
/** emoji表情数据 */
const emojiEmoticons = [
  {
    title: '小黄脸',
    list: [
      '😀',
      '😁',
      '😂',
      '🤣',
      '😅',
      '😊',
      '😋',
      '😘',
      '🥰',
      '😗',
      '🤩',
      '🤔',
      '🤨',
      '😐',
      '😑',
      '🙄',
      '😏',
      '😪',
      '😫',
      '🥱',
      '😜',
      '😒',
      '😔',
      '😨',
      '😰',
      '😱',
      '🥵',
      '😡',
      '🥳',
      '🥺',
      '🤭',
      '🧐',
      '😎',
      '🤓',
      '😭',
      '🤑',
      '🤮',
    ],
  },
  {
    title: '手势',
    list: [
      '🙋',
      '🙎',
      '🙅',
      '🙇',
      '🤷',
      '🤏',
      '👉',
      '✌️',
      '🤘',
      '🤙',
      '👌',
      '🤌',
      '👍',
      '👎',
      '👋',
      '🤝',
      '🙏',
      '👏',
    ],
  },
  {
    title: '庆祝',
    list: ['✨', '🎉', '🎊'],
  },
  {
    title: '其他',
    list: ['👻', '🤡', '🐔', '👀', '💩', '🐴', '🦄', '🐧', '🐶', '🐒', '🙈', '🙉', '🙊', '🐵'],
  },
]
/** 新版贴吧表情数据 */
const newClassicsEmoticons = [
  {
    name: '[狗头]',
    low: 'https://i.imgur.com/nQIIqnv.png',
    high: 'https://i.imgur.com/0icl60r.png'
  },
  {
    name: '[马]',
    low: 'https://i.imgur.com/5FyD9Un.png',
    high: 'https://i.imgur.com/ANFUX52.png'
  },
  {
    name: '[不高兴]',
    low: 'https://i.imgur.com/cbIUvcG.png',
    high: 'https://i.imgur.com/i7O4v0O.png'
  },
  {
    name: '[真棒]',
    low: 'https://i.imgur.com/IPG5yJO.png',
    high: 'https://i.imgur.com/mzefu0w.png'
  },
  {
    name: '[疑问]',
    low: 'https://i.imgur.com/IqpiI7h.png',
    high: 'https://i.imgur.com/ygs7SFM.png'
  },
  {
    name: '[笑眼]',
    low: 'https://i.imgur.com/PlO4jbB.png',
    high: 'https://i.imgur.com/zpGsuyY.png'
  },
  {
    name: '[喷]',
    low: 'https://i.imgur.com/iN8x1Sm.png',
    high: 'https://i.imgur.com/d4g2dbf.png'
  },
  {
    name: '[苦笑]',
    low: 'https://i.imgur.com/6gZe7Jg.png',
    high: 'https://i.imgur.com/NAfspZ1.png'
  },
  {
    name: '[喝酒]',
    low: 'https://i.imgur.com/v7BAkoy.png',
    high: 'https://i.imgur.com/rVbSVak.png'
  },
  {
    name: '[吃瓜]',
    low: 'https://i.imgur.com/SnluqXL.png',
    high: 'https://i.imgur.com/0L26og9.png'
  },
  {
    name: '[捂脸]',
    low: 'https://i.imgur.com/Q3bcJJ9.png',
    high: 'https://i.imgur.com/qqBqgVm.png'
  },
  {
    name: '[呕吐]',
    low: 'https://i.imgur.com/096Nc7O.png',
    high: 'https://i.imgur.com/AVFtmIl.png'
  },
  {
    name: '[怒]',
    low: 'https://i.imgur.com/uGk6mIa.png',
    high: 'https://i.imgur.com/3YUDhdh.png'
  },
  {
    name: '[衰]',
    low: 'https://i.imgur.com/WJXUrLF.png',
    high: 'https://i.imgur.com/XffE6gu.png'
  },
  {
    name: '[合十]',
    low: 'https://i.imgur.com/dibCTJG.png',
    high: 'https://i.imgur.com/T4rJVee.png'
  },
  {
    name: '[赞]',
    low: 'https://i.imgur.com/yVg4qEx.png',
    high: 'https://i.imgur.com/AoF5PLp.png'
  },
  {
    name: '[踩]',
    low: 'https://i.imgur.com/mWjzsH1.png',
    high: 'https://i.imgur.com/1XYGfXj.png'
  },
  {
    name: '[爱心]',
    low: 'https://i.imgur.com/edXjhvU.png',
    high: 'https://i.imgur.com/dND56oX.png'
  },

  {
    name: '[心碎]',
    low: 'https://i.imgur.com/1krm1wx.png',
    high: 'https://i.imgur.com/RiUsPci.png'
  },
]

/** 老版贴吧表情数据 */
const classicsEmoticons = [
  {
    name: '[狗头]',
    low: 'https://i.imgur.com/io2SM1h.png',
    high: 'https://i.imgur.com/0icl60r.png'
  },
  {
    name: '[马]',
    low: 'https://i.imgur.com/8EKZv7I.png',
    high: 'https://i.imgur.com/ANFUX52.png'
  },
  {
    name: '[不高兴]',
    low: 'https://i.imgur.com/huX6coX.png',
    high: 'https://i.imgur.com/N7JEuvc.png'
  },
  {
    name: '[呵呵]',
    low: 'https://i.imgur.com/RvoLAbX.png',
    high: 'https://i.imgur.com/xSzIqrK.png'
  },
  {
    name: '[真棒]',
    low: 'https://i.imgur.com/xr1UOz1.png',
    high: 'https://i.imgur.com/w8YEw9Q.png'
  },
  {
    name: '[鄙视]',
    low: 'https://i.imgur.com/u6jlqVq.png',
    high: 'https://i.imgur.com/8JFNANq.png'
  },
  {
    name: '[疑问]',
    low: 'https://i.imgur.com/F29pmQ6.png',
    high: 'https://i.imgur.com/EbbTQAR.png'
  },
  {
    name: '[吐舌]',
    low: 'https://i.imgur.com/InmIzl9.png',
    high: 'https://i.imgur.com/Ovj56Cd.png'
  },
  // {
  //   name: '[嘲笑]',
  //   low: 'https://i.imgur.com/BaWcsMR.png',
  //   high: 'https://i.imgur.com/0OGfJw4.png'
  // },
  // {
  //   name: '[滑稽]',
  //   low: 'https://i.imgur.com/lmbN0yI.png',
  //   high: 'https://i.imgur.com/Pc0wH85.png'
  // },
  {
    name: '[笑眼]',
    low: 'https://i.imgur.com/ZveiiGy.png',
    high: 'https://i.imgur.com/PI1CfEr.png'
  },
  {
    name: '[狂汗]',
    low: 'https://i.imgur.com/veWihk6.png',
    high: 'https://i.imgur.com/3LtHdQv.png'
  },
  {
    name: '[大哭]',
    low: 'https://i.imgur.com/hu4oR6C.png',
    high: 'https://i.imgur.com/b4X9XLE.png'
  },
  {
    name: '[喷]',
    low: 'https://i.imgur.com/bkw3VRr.png',
    high: 'https://i.imgur.com/wnZL13L.png'
  },
  {
    name: '[苦笑]',
    low: 'https://i.imgur.com/VUWFktU.png',
    high: 'https://i.imgur.com/NAfspZ1.png'
  },
  {
    name: '[喝酒]',
    low: 'https://i.imgur.com/2ZZSapE.png',
    high: 'https://i.imgur.com/rVbSVak.png'
  },
  {
    name: '[吃瓜]',
    low: 'https://i.imgur.com/ee8Lq7H.png',
    high: 'https://i.imgur.com/0L26og9.png'
  },
  {
    name: '[捂脸]',
    low: 'https://i.imgur.com/krir4IG.png',
    high: 'https://i.imgur.com/qqBqgVm.png'
  },
  {
    name: '[呕]',
    low: 'https://i.imgur.com/6CUiUxv.png',
    high: 'https://i.imgur.com/kgdxRsG.png'
  },
  {
    name: '[阴险]',
    low: 'https://i.imgur.com/MA8YqTP.png',
    high: 'https://i.imgur.com/e94jbaT.png'
  },
  {
    name: '[怒]',
    low: 'https://i.imgur.com/n4kWfGB.png',
    high: 'https://i.imgur.com/iMXxNxh.png'
  },

  {
    name: '[衰]',
    low: 'https://i.imgur.com/voHFDyQ.png',
    high: 'https://i.imgur.com/XffE6gu.png'
  },
  {
    name: '[合十]',
    low: 'https://i.imgur.com/I8x3ang.png',
    high: 'https://i.imgur.com/T4rJVee.png'
  },
  {
    name: '[赞]',
    low: 'https://i.imgur.com/lG44yUl.png',
    high: 'https://i.imgur.com/AoF5PLp.png'
  },
  {
    name: '[踩]',
    low: 'https://i.imgur.com/cJp0uKZ.png',
    high: 'https://i.imgur.com/1XYGfXj.png'
  },
  {
    name: '[爱心]',
    low: 'https://i.imgur.com/sLENaF5.png',
    high: 'https://i.imgur.com/dND56oX.png'
  },

  {
    name: '[心碎]',
    low: 'https://i.imgur.com/AZxJzve.png',
    high: 'https://i.imgur.com/RiUsPci.png'
  },
]

/** 以下 Client ID 来自「V2EX_Polish」*/
const imgurClientIdPool = [
  '3107b9ef8b316f3',
  '442b04f26eefc8a',
  '59cfebe717c09e4',
  '60605aad4a62882',
  '6c65ab1d3f5452a',
  '83e123737849aa9',
  '9311f6be1c10160',
  'c4a4a563f698595',
  '81be04b9e4a08ce',
]

defineExpose({content})

const editorClass = computed(() => {
  return [useType, isFocus.value ? 'isFocus' : '', isNight.value ? 'isNight' : '']
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

function drop(e) {
  e.preventDefault()
  upload(e.dataTransfer.files[0])
}

async function upload(file) {
  if (!file) return
  if (uploadLoading.value) return
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('image', file)
  // 随机获取一个 Imgur Client ID。
  const randomIndex = Math.floor(Math.random() * imgurClientIdPool.length)
  const clidenId = imgurClientIdPool[randomIndex]

  // 使用详情参考 Imgur API 文档：https://apidocs.imgur.com/
  const res = await fetch('https://api.imgur.com/3/upload', {
    method: 'POST',
    headers: {Authorization: `Client-ID ${clidenId}`},
    body: formData,
  })

  uploadLoading.value = false
  if (res.ok) {
    const resData = await res.json()
    if (resData.success) {
      return insert(' ' + resData.data.link + ' ')
    }
  }
  eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '上传失败'})
}

async function submit() {
  if (disabled.value || loading.value) return
  loading.value = true

  let submit_content = content.value.replace(/\[((?!\[).)+\]/g, function (match) {
    let item = classicsEmoticons.find(v => v.name === match)
    if (item) {
      return item.low + ' '
    }
    return match
  })


  //转换上传的图片
  let show_content = content.value.replace(/https?:\/\/(i\.)?imgur\.com\/((?!http).)+\.(gif|png|jpg|jpeg|GIF|PNG|JPG|JPEG)/g, function (match) {
    return `<img src="${match}" data-originUrl="${match}" data-notice="这个img标签由v2ex-超级增强脚本解析" style="max-width: 100%">`
  })

  //转换表情
  show_content = show_content.replace(/\[((?!\[).)+\]/g, function (match) {
    let item = classicsEmoticons.find(v => v.name === match)
    if (item) {
      return `<a target="_blank" href="${item.low}" rel="nofollow noopener"><img src="${item.low}" class="embedded_image" rel="noreferrer"></a> `
    }
    return match
  })

  let matchUsers = show_content.match(/@([\w]+?[\s])/g)
  if (matchUsers) {
    matchUsers.map(i => {
      let username = i.replace('@', '').replace(' ', '')
      show_content = show_content.replace(username, `<a href="/member/${username}">${username}</a>`)
    })
  }

  show_content = show_content.replaceAll('\n', '<br/>')

  // loading.value = false
  // return console.log('show_content', show_content)

  let item = {
    thankCount: 0,
    isThanked: false,
    isOp: post.value.username === window.user.username,
    id: Date.now(),
    username: window.user.username,
    avatar: window.user.avatar,
    date: '几秒前',
    floor: post.value.replyCount + 1,
    reply_content: show_content ?? '',
    children: [],
    replyUsers: replyUser ? [replyUser] : [],
    replyFloor: replyFloor || -1,
    level: useType === 'reply-comment' ? 1 : 0
  }
  // loading.value = false
  // return console.log(item)

  // loading.value = false
  // content.value = replyInfo
  // eventBus.emit(CMD.REFRESH_ONCE,)
  // eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
  // eventBus.emit(CMD.ADD_REPLY, item)
  // emits('close')
  // return console.log('item', item)

  let url = `${window.baseUrl}/t/${post.value.id}`
  $.post(url, {content: submit_content, once: post.value.once}).then(
      res => {
        // console.log('回复', res)
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

function showEmoticons(e) {
  if (isShowEmoticons.value) {
    return isShowEmoticons.value = false
  }
  let rect = e.currentTarget.getBoundingClientRect()
  emoticonsRef.value.style.left = rect.left + 30 + 'px'
  emoticonsRef.value.style.bottom = window.innerHeight - rect.top - 20 + 'px'
  isShowEmoticons.value = true
}

function off() {
  eventBus.emit(CMD.SHOW_CALL, {show: false})
  eventBus.off(CMD.SET_CALL)
}

function checkHeight() {
  txtRef.value.style.height = 0;
  txtRef.value.style.height = (txtRef.value.scrollHeight) + "px";
}

function insert(str) {
  let cursorPos = txtRef.value.selectionStart
  let start = content.value.slice(0, cursorPos)
  let end = content.value.slice(cursorPos, content.value.length)
  content.value = start + str + end
  let moveCursorPos = start.length + str.length
  setTimeout(() => {
    txtRef.value.focus()
    txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
    checkHeight()
  })
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
    }
    if (e === '所有人') {
      e = allReplyUsers.value.map((v, i) => {
        if (i) return '@' + v
        else return v
      }).join(' ')
    }
    content.value = start + e + ' ' + end
    let moveCursorPos = start.length + e.length + 1
    // console.log(moveCursorPos)
    setTimeout(() => {
      txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
      checkHeight()
    })
    eventBus.off(CMD.SET_CALL)
  })
}

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
    case 13:
      //Ctrl + Enter发送
      if (e.ctrlKey) submit()
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

// 监听paste事件
function onPaste(e) {
  // console.log('onPaste', e)
  const dataTransferItemList = e.clipboardData.items;
  // 过滤非图片类型
  const items = [].slice.call(dataTransferItemList).filter(function (item) {
    return item.type.indexOf('image') !== -1;
  });
  if (items.length === 0) {
    return;
  }
  const dataTransferItem = items[0];
  const blob = dataTransferItem.getAsFile();
  upload(blob);
}

function onBlur() {
  // console.log('onBlur',)
  // eventBus.emit(CMD.SHOW_CALL, {show: false})
  // eventBus.off(CMD.SET_CALL)
  document.removeEventListener('paste', onPaste);
  isFocus.value = false
}

function onFocusin() {
  console.log('onFocusin',)
  document.addEventListener('paste', onPaste);
}

//如果帖子详情关闭了，那么把表情框也关了
watch(() => show, (n) => {
  if (n.value) isShowEmoticons.value = false
}, {deep: true})

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
@import "@/assets/less/variable.less";

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

    .left {
      display: flex;
      gap: 1rem;

      svg {
        cursor: pointer;
      }

      .upload {
        input {
          cursor: pointer;
          position: absolute;
          width: 20px;
          height: 20px;
          opacity: 0;
        }
      }
    }

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

  .emoticon-pack {
    z-index: 999999999;
    border-radius: 1rem;
    padding: 1rem;
    width: 31rem;
    max-width: 31rem;
    height: 30rem;
    max-height: 30rem;
    overflow: auto;
    background: white;
    border: 1px solid #e2e8f0;
    box-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);
    position: fixed;
    bottom: 11rem;
    left: 14rem;

    i {
      cursor: pointer;
      position: absolute;
      right: 2rem;
      font-size: 2rem;
      color: @bg-color;
    }

    .title {

    }

    .list {
      margin: 1rem 0;
    }

    img {
      cursor: pointer;
      @w: 3rem;
      width: @w;
      height: @w;
      padding: .5rem;
    }

    span {
      display: inline-block;
      cursor: pointer;
      font-size: 2.3rem;
      padding: .5rem;
    }
  }
}

.isNight {
  .emoticon-pack {
    background: @night-bg;
    border: 1px solid #737373;
  }
}

</style>