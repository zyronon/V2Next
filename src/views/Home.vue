<template>
  <template v-if="pageType === 'home'">
    <div class="nav" :class="viewType">
      <div class="nav-item" :class="{active:viewType === 'table'}" @click="viewType = 'table'">
        <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 5H6V13H42V5Z" fill="none" :stroke="svgColor('table')" stroke-width="4" stroke-linejoin="round"/>
          <path d="M42 20H6V28H42V20Z" fill="none" :stroke="svgColor('table')" stroke-width="4"
                stroke-linejoin="round"/>
          <path d="M42 35H6V43H42V35Z" fill="none" :stroke="svgColor('table')" stroke-width="4"
                stroke-linejoin="round"/>
        </svg>
        <span>表格</span>
      </div>
      <div class="nav-item" :class="{active:viewType === 'card'}" @click="viewType = 'card'">
        <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 18V40C42 41.1046 41.1046 42 40 42H8C6.89543 42 6 41.1046 6 40V18" :stroke="svgColor('card')"
                stroke-width="4"
                stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 8C6 6.89543 6.89543 6 8 6H40C41.1046 6 42 6.89543 42 8V18H6V8Z" fill="none"
                :stroke="svgColor('card')"
                stroke-width="4" stroke-linejoin="round"/>
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                :fill="svgColor('card')"/>
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z"
                :fill="svgColor('card')"/>
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M24 14C25.1046 14 26 13.1046 26 12C26 10.8954 25.1046 10 24 10C22.8954 10 22 10.8954 22 12C22 13.1046 22.8954 14 24 14Z"
                :fill="svgColor('card')"/>
        </svg>
        <span>卡片</span>
      </div>
    </div>
    <div class="posts">
      <Post
          v-for="item in list"
          :viewType="viewType"
          :post="item"
          :class="{visited:readList.has(item.id)}"
          @show="showPostDetail(item,$event)"/>
    </div>
  </template>
  <template v-if="pageType === 'post'">
    <div class="nav">
      <div @click="show = !show" class="nav-item">展示</div>
    </div>
  </template>
  <PostDetail v-model="show" :loading="loading"/>
  <div class="msgs">
    <Msg v-for="v in msgList" :key="v.id" :type="v.type" :text="v.text" @close="removeMsg(v.id)"/>
  </div>
  <Base64Tooltip/>
</template>

<script>
import PostDetail from "../components/PostDetail.vue";
import Post from "../components/Post";
import Msg from "@/components/Msg";
import eventBus from "@/eventBus";
import data from "@/data";
import Base64Tooltip from "@/components/Base64Tooltip";
import {CMD} from "@/utils/type";
import {computed} from "vue";

const initPost = {
  replies: [],
  nestedReplies: [],
  username: '',
  title: '',
  id: '',
  once: '',
  replyCount: 0,
  clickCount: 0,
  thankCount: 0,
  collectCount: 0,
  isFavorite: false,
  isIgnore: false,
  isThanked: false,
  isReport: false,
  RightbarHTML: '',
}
export default {
  name: 'home',
  provide() {
    return {
      isDev: computed(() => import.meta.env.DEV),
      isLogin: computed(() => !!window.win().user.username),
      pageType: computed(() => this.pageType),
      clone: this.clone,
      post: computed(() => this.current),
      allReplyUsers: computed(() => Array.from(new Set(this.current.replies.map(v => v.username)))),
    }
  },
  components: {
    PostDetail,
    Post,
    Msg,
    Base64Tooltip
  },
  data() {
    return {
      viewType: 'card',
      loading: window.pageType === 'post',
      pageType: window.pageType,
      msgList: [
        // {type: 'success', text: '123', id: Date.now()}
      ],
      show: window.pageType === 'post',
      // show: true,
      current: initPost,
      list: [],
      list2: [],
      readList: new Set(),
    }
  },
  computed: {
    isDev() {
      return import.meta.env.DEV
    }
  },
  watch: {
    'current.replies': {
      handler(newVal) {
        if (!newVal.length) return
        this.current.replyCount = newVal.length
        let res = window.parse.getNestedList(newVal)
        if (res) {
          this.current.nestedReplies = res
        }
        if (this.list) {
          let rIndex = this.list.findIndex(i => i.id === this.current.id)
          if (rIndex > -1) {
            this.list[rIndex].replyCount = newVal.length
          }
        }
      },
      deep: true
    }
  },
  created() {
    console.log('create')
    let that = this
    window.win().cb = ({type, value}) => {
      console.log('回调的类型', type, new Date())
      if (type === 'list') {
        value.map(post => {
          let rIndex = that.list.findIndex(v => v.id == post.id)
          if (rIndex > -1) {
            that.list[rIndex] = Object.assign(that.list[rIndex], {
              content_rendered: post.content_rendered,
              nodeUrl: post.node.url,
              avatar: post.member.avatar_large,
            })
          }
        })
      }
      if (type === 'postContent') {
        window.doc.body.style.overflow = 'hidden'
        this.readList.add(value.id)
        this.current = Object.assign(this.clone(initPost), this.clone(value))
      }
      if (type === 'postReplies') {
        this.current = Object.assign(this.current, this.clone(value))
        this.loading = false
      }
    }

    if (window.win().vue) {
      console.log('vue', window.win().postList)
      //开发时使用，因为数据是从cb传过来的。hmr之后index.html不会再调cb了
      if (window.pageData.post) {
        window.doc.body.style.overflow = 'hidden'
        this.current = Object.assign(this.clone(initPost), this.clone(window.pageData.post))
        this.loading = false
      }
      if (window.isFrame) {
        this.list = window.win().postList
      } else {
        this.list = data
      }
    }

    let configStr = window.win().localStorage.getItem('v2ex-config')
    if (configStr) {
      let config = JSON.parse(configStr)
      if (config.username === window.win().user.username) {
        this.readList = new Set(config.readList);
        this.viewType = config.viewType
      }
    }
    window.win().onbeforeunload = () => {
      console.log('onbeforeunload')
      // window.win().cb = null
      let config = {
        username: window.win().user.username ?? '',
        viewType: this.viewType,
        readList: Array.from(this.readList)
      }
      window.win().localStorage.setItem('v2ex-config', JSON.stringify(config))
    };
    if (window.isFrame) {
      this.list = window.win().postList
      // setTimeout(() => {
      //   this.list.map(v => {
      //     v.content_rendered = `<p><a href="https://imgur.com/taLDwNr" rel="nofollow"><img class="embedded_image" loading="lazy" referrerpolicy="no-referrer" rel="noreferrer" src="https://i.imgur.com/taLDwNr.png" title="source: imgur.com"></a></p>`
      //   })
      // }, 500)
    } else {
      this.list = data
    }

    // this.getReplyInfo()
    if (window.pageType === 'post') {
      if (window.isFrame) {
      } else {
        this.showPostDetail({id: window.pageData.id}, null)
      }
    }
    this.initEvent()
  },
  beforeUnmount() {
    console.log('unmounted')
    eventBus.clear()
  },
  methods: {
    initEvent() {
      eventBus.on(CMD.SHOW_MSG, (val) => {
        this.msgList.push({...val, id: Date.now()})
      })
      eventBus.on(CMD.IGNORE, () => {
        this.show = false
        let rIndex = this.list.findIndex(i => i.id === this.current.id)
        if (rIndex > -1) {
          this.list.splice(rIndex, 1)
        }
        this.current = {
          replies: [],
          nestedReplies: [],
        }
      })
      eventBus.on(CMD.MERGE, (val) => {
        this.current = Object.assign(this.current, val)
        let rIndex = this.list.findIndex(i => i.id === this.current.id)
        if (rIndex > -1) {
          this.list[rIndex] = Object.assign(this.list[rIndex], val)
        }
      })
      eventBus.on(CMD.ADD_REPLY, (item) => {
        this.current.replies.push(item)
      })
      eventBus.on(CMD.REFRESH_ONCE, async (once) => {
        if (once) {
          if (typeof once === 'string') {
            let res = once.match(/var once = "([\d]+)";/)
            if (res && res[1]) {
              this.current.once = Number(res[1])
              // console.log('接口返回了once-str', this.current.once)
              return
            }
          }
          if (typeof once === 'number') {
            this.current.once = once
            // console.log('接口返回了once-number', this.current.once)
            return
          }
        }
        window.win().fetchOnce().then(r => {
          // console.log('通过fetchOnce接口拿once', r)
          this.current.once = r
        })
        // let that = this
        // let url = window.url + '/t/' + this.current.id
        // $.get(url + '?p=1').then(res => {
        //   let hasPermission = res.search('你要查看的页面需要先登录')
        //   if (hasPermission > -1) {
        //     eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '没有权限'})
        //   } else {
        //     let once = res.match(/var once = "([\d]+)";/)
        //     // console.log(once)
        //     if (once && once[1]) {
        //       that.current.once = once[1]
        //     }
        //   }
        // })
      })
    },
    svgColor(type) {
      return type === this.viewType ? 'white' : '#929596'
    },
    removeMsg(id) {
      let rIndex = this.msgList.findIndex(item => item.id === id)
      if (rIndex > -1) {
        this.msgList.splice(rIndex, 1)
      }
    },
    async showPostDetail(post, event) {
      if (event) {
        let target = event.target || event.srcElement;
        //如果是站内帖子，那么直接打开
        if (target.nodeName.toLocaleLowerCase() === 'a') {
          event.preventDefault();
          let text = target.innerText
          let r = text.match(/t\/([\d]+)/)
          if (r) {
            post = {id: r[1]}
          }
        }
      }
      this.readList.add(post.id)
      this.current = Object.assign(
          this.clone(initPost),
          // {RightbarHTML: this.current.RightbarHTML},
          this.clone(post))
      this.show = true
      this.loading = true
      // window.win().history.pushState({}, 0, '/t/' + post.id);
      window.doc.body.style.overflow = 'hidden'

      let url = window.url + '/t/' + post.id
      //ajax不能判断是否跳转
      // $.get(url + '?p=1').then((res, textStatus, xhr) => {
      let apiRes = await window.win().fetch(url + '?p=1')
      //如果是重定向了，那么就是没权限
      if (apiRes.redirected) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '没有权限'})
        return this.loading = false
      }
      let htmlText = await apiRes.text()
      let hasPermission = htmlText.search('你要查看的页面需要先登录')
      if (hasPermission > -1) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '你要查看的页面需要先登录'})
        return this.loading = false
      }
      let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
      let body = $(bodyText[0])
      // console.log(body)

      this.current = await window.parse.parsePost(this.current, body, htmlText)
      this.loading = false
      console.log('当前帖子', this.current)
    },
    clone(val) {
      return JSON.parse(JSON.stringify(val))
    },
  },
}
</script>
<style lang="less">
@import "@/assets/less/variable";

.nav {
  font-size: 1.4rem;
  background: white;
  text-align: start;
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &.card {
    margin-top: 1rem;
    border: 1px solid @border;
    border-radius: @border-radius;
  }

  &.table {
    border-bottom: 1px solid @border;
  }

  .nav-item {
    cursor: pointer;
    display: flex;
    margin-left: 2rem;
    padding: .6rem;
    border-radius: .4rem;

    &.active {
      background: #40a9ff;
      color: white;

      &:hover {
        background: #40a9ff;
        opacity: .8;
      }
    }

    &:hover {
      background: #e2e2e2;
    }

    span {
      margin-left: .4rem;
    }
  }
}
</style>