<template>
  <div class="app-home" :class="[viewType,pageType]">
    <template v-if="showList">
      <div class="nav flex flex-end" :class="viewType">
        <div class="nav-item" :class="{active:viewType === 'table'}" @click="saveConfig(viewType = 'table')">
          <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42 5H6V13H42V5Z" fill="none" :stroke="svgColor('table')" stroke-width="4"
                  stroke-linejoin="round"/>
            <path d="M42 20H6V28H42V20Z" fill="none" :stroke="svgColor('table')" stroke-width="4"
                  stroke-linejoin="round"/>
            <path d="M42 35H6V43H42V35Z" fill="none" :stroke="svgColor('table')" stroke-width="4"
                  stroke-linejoin="round"/>
          </svg>
          <span>表格</span>
        </div>
        <div class="nav-item" :class="{active:viewType === 'card'}" @click="saveConfig(viewType = 'card')">
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
        <template v-for="item in list">
          <div v-if="item.id === 'page'" class="nav p0 page" :class="viewType">
            <div class="cell" v-html="item.innerHTML"></div>
          </div>
          <Post
              v-else
              :viewType="viewType"
              :post="item"
              :class="{visited:readList.has(item.id)}"
              @show="getPostDetail(item,$event)"/>
        </template>

      </div>
    </template>
    <template v-if="pageType === 'post'">
      <div class="my-box flex f14" style="margin: 1rem 0 0 0;padding: 1rem;">
        <div class="flex">
          自动加载详情页 ：
          <div class="switch" :class="{active:autoOpenDetail}" @click="saveConfig(autoOpenDetail = !autoOpenDetail)"/>
        </div>
        <div class="button" @click="openPostDetail" :class="{loading}">
          点击显示详情页
        </div>
      </div>
    </template>
    <PostDetail v-model="show" :loading="loading"/>
    <div class="msgs">
      <Msg v-for="v in msgList" :key="v.id" :type="v.type" :text="v.text" @close="removeMsg(v.id)"/>
    </div>
    <Base64Tooltip/>
  </div>
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

export default {
  name: 'home',
  provide() {
    return {
      isDev: computed(() => import.meta.env.DEV),
      isLogin: computed(() => !!window.win().user.username),
      pageType: computed(() => this.pageType),
      clone: window.win().clone,
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
      loading: window.win().pageType === 'post',
      loadMore: false,
      pageType: window.win().pageType,
      msgList: [
        // {type: 'success', text: '123', id: Date.now()}
      ],
      show: false,
      autoOpenDetail: false,
      current: window.win().initPost,
      list: [],
      readList: new Set(),
    }
  },
  computed: {
    isDev() {
      return import.meta.env.DEV
    },
    showList() {
      return this.pageType === 'home' ||
          this.pageType === 'recent' ||
          this.pageType === 'node'
    }
  },
  watch: {
    'current.replies': {
      handler(newVal) {
        console.log('watch')
        if (newVal.length) {
          this.current.replyCount = newVal.length
          let res = window.parse.getNestedList(newVal)
          if (res) {
            this.current.nestedReplies = res
          }
          // console.log('this.current.nestedReplies',this.current.nestedReplies)
        } else {
          this.current.replyCount = 0
          this.current.nestedReplies = []
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

    window.win().cb = this.winCb

    if (window.win().vue) {
      // console.log('vue', window.win().postList)
      //开发时使用，因为数据是从cb传过来的。hmr之后index.html不会再调cb了
      if (window.win().pageData?.post) {
        window.win().doc.body.style.overflow = 'hidden'
        this.current = Object.assign(this.clone(window.win().initPost), this.clone(window.win().pageData.post))
        this.loading = false
      }
      if (window.win().isFrame) {
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
        this.autoOpenDetail = config.autoOpenDetail || false
        if (this.autoOpenDetail && this.pageType === 'post') {
          this.show = true
          window.win().doc.body.style.overflow = 'hidden'
        }
      }
    }
    window.win().onbeforeunload = this.saveConfig

    if (window.win().isFrame) {
      this.list = window.win().postList

      if (this.showList) {
        let lastItem = window.win().appNode.nextElementSibling
        let ob = window.win().IntersectionObserver
        const observer = new ob(async (e) => {
          if (e[0].isIntersecting) {
            if (this.loadMore) return
            console.log('加载更多')
            this.loadMore = true
            let url

            if (this.pageType === 'home') {
              url = window.win().url + `/recent?p=1`
              this.pageType = 'recent'
            } else {
              let {href, search, origin, pathname} = window.win().location
              url = href + `?p=2`
              let r = search.match(/p=([\d]+)/)
              if (r) {
                url = origin + pathname + search.replace(r[1], Number(r[1]) + 1)
              }
            }
            console.log('url', url)
            this.loadMore = false
            window.win().history.pushState({}, 0, url);
            return
            let apiRes = await window.win().fetch(url)
            let htmlText = await apiRes.text()
            let res = window.parse.parsePage(htmlText, this.pageType)
            lastItem.innerHTML = res.page
            this.list.push({id: 'page', innerHTML: lastItem.innerHTML})
            //不同页数之单，会有重复的数据
            res.postList.map(v => {
              let rIndex = this.list.findIndex(i => i.id == v.id)
              if (rIndex === -1) this.list.push(v)
            })
            this.loadMore = false
            // console.log(htmlText)
            Promise.allSettled(res.apiList.map(v => $.get(v))).then(async (results) => {
              let res = results.filter((result) => result.status === "fulfilled").map(v => v.value[0])
              this.winCb({type: 'list', value: res})
            });
          }
        })
        observer.observe(lastItem)
      }
      // setTimeout(() => {
      //   this.list.map(v => {
      //     v.content_rendered = `<p><a href="https://imgur.com/taLDwNr" rel="nofollow"><img class="embedded_image" loading="lazy" referrerpolicy="no-referrer" rel="noreferrer" src="https://i.imgur.com/taLDwNr.png" title="source: imgur.com"></a></p>`
      //   })
      // }, 500)
    } else {
      this.list = data
    }

    this.initEvent()

  },
  beforeUnmount() {
    console.log('unmounted')
    eventBus.clear()
  },
  methods: {
    winCb({type, value}) {
      console.log('回调的类型', type, value)
      if (type === 'list') {
        value.map(post => {
          let rIndex = this.list.findIndex(v => v.id == post.id)
          if (rIndex > -1) {
            this.list[rIndex] = Object.assign(this.list[rIndex], {
              content_rendered: post.content_rendered,
              nodeUrl: post.node.url,
              avatar: post.member.avatar_large,
            })
          }
        })
        window.win().vueCb && window.win().vueCb()
      }
      if (type === 'postContent') {
        this.saveConfig(this.readList.add(value.id))
        this.current = Object.assign(this.clone(window.win().initPost), this.clone(value))
      }
      if (type === 'postReplies') {
        this.current = Object.assign(this.current, this.clone(value))
        this.loading = false
      }
    },
    saveConfig() {
      let config = {
        username: window.win().user.username ?? '',
        viewType: this.viewType,
        readList: Array.from(this.readList),
        autoOpenDetail: this.autoOpenDetail
      }
      window.win().localStorage.setItem('v2ex-config', JSON.stringify(config))
    },
    clone(val) {
      return window.win().clone(val)
    },
    initEvent() {
      eventBus.on(CMD.CHANGE_COMMENT_THANK, (val) => {
        const {id, type} = val
        let currentI = this.current.replies.findIndex(i => i.id === id)
        if (currentI > -1) {
          this.current.replies[currentI].isThanked = type === 'add'
          if (type === 'add') {
            this.current.replies[currentI].thankCount++
          } else {
            this.current.replies[currentI].thankCount--
          }
        }
      })
      eventBus.on(CMD.CHANGE_POST_THANK, (val) => {
        const {id, type} = val
        this.current.isThanked = type === 'add'
        if (type === 'add') {
          this.current.thankCount++
        } else {
          this.current.thankCount--
        }
        let currentI = this.list.findIndex(i => i.id === id)
        if (currentI > -1) {
          this.list[currentI].isThanked = type === 'add'
          if (type === 'add') {
            this.list[currentI].thankCount++
          } else {
            this.list[currentI].thankCount++
          }
        }
      })
      eventBus.on(CMD.REMOVE, (val) => {
        // console.log('remove', val)
        let removeIndex = this.current.replies.findIndex(i => i.floor === val)
        // console.log('removeIndex',removeIndex)
        if (removeIndex > -1) {
          this.current.replies.splice(removeIndex, 1)
        }
        // console.log('removeIndex',this.current.replies)
        let rIndex = this.list.findIndex(i => i.id === this.current.id)
        if (rIndex > -1) {
          this.list[rIndex] = Object.assign(this.list[rIndex], val)
        }
        // this.msgList.push({...val, id: Date.now()})
      })
      eventBus.on(CMD.SHOW_MSG, (val) => {
        this.msgList.push({...val, id: Date.now()})
      })
      eventBus.on(CMD.IGNORE, () => {
        this.show = false
        let rIndex = this.list.findIndex(i => i.id === this.current.id)
        if (rIndex > -1) {
          this.list.splice(rIndex, 1)
        }
        this.current = this.clone(window.win().initPost)
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
        // let url = window.win().url + '/t/' + this.current.id
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
    openPostDetail() {
      this.show = true
      window.win().doc.body.style.overflow = 'hidden'
    },
    async getPostDetail(post, event) {
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
      this.saveConfig(this.readList.add(post.id))
      this.current = Object.assign(
          window.win().clone(window.win().initPost),
          // {RightbarHTML: this.current.RightbarHTML},
          window.win().clone(post))
      this.show = true
      this.loading = true
      // window.win().history.pushState({}, 0, '/t/' + post.id);
      window.win().doc.body.style.overflow = 'hidden'

      let url = window.win().url + '/t/' + post.id
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

      this.current = await window.parse.parsePostDetail(this.current, body, htmlText)
      this.loading = false
      console.log('当前帖子', this.current)
    },
  },
}
</script>

<style lang="less">
@import "../assets/less/variable";

.app-home {
  &.home, &.recent {
    background: rgb(226, 226, 226);
  }

  &.card {
    padding: 1rem 0;
  }
}

.page {
  &.card {
    margin-top: 1rem;
  }
}

.nav {
  font-size: 1.4rem;
  background: white;
  text-align: start;
  padding: 1rem;

  &.card {
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