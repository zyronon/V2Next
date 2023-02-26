<template>
  <div class="app-home" :class="[config.viewType,pageType]">
    <template v-if="showList">
      <div class="nav flex flex-end" :class="config.viewType">
        <div class="nav-item" @click="showConfig = true">
          <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.0003 41L44 24L34.0003 7H14.0002L4 24L14.0002 41H34.0003Z" fill="none" stroke="#000000"
                  stroke-width="4" stroke-linejoin="round"/>
            <path
                d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
                fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round"/>
          </svg>
          <span>配置</span>
        </div>
        <div class="nav-item" :class="{active:config.viewType === 'table'}" @click="config.viewType = 'table'">
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
        <div class="nav-item" :class="{active:config.viewType === 'card'}" @click="config.viewType = 'card'">
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
          <div v-if="item.type === 'ad' && item.innerHTML" class="nav p0 page" :class="config.viewType">
            <div v-html="item.innerHTML"></div>
          </div>
          <div v-if="item.type === 'page' && item.innerHTML" class="nav page" :class="config.viewType">
            <div v-html="item.innerHTML"></div>
          </div>
          <Post
              v-else
              :viewType="config.viewType"
              :post="item"
              :class="{visited:config.readList.has(item.id)}"
              @show="getPostDetail(item,$event)"/>
        </template>
        <div class="flex flex-center p1" v-if="loadMore">
          <div class="loading-c"></div>
        </div>
      </div>
    </template>
    <template v-if="pageType === 'post'">
      <div class="my-box flex f14" style="margin: 1rem 0 0 0;padding: 1rem;">
        <div class="flex">
          自动加载详情页 ：
          <div class="switch" :class="{active:config.autoOpenDetail}"
               @click="config.autoOpenDetail = !config.autoOpenDetail"/>
        </div>
        <div class="button" @click="openPostDetail" :class="{loading}">
          点击显示详情页
        </div>
      </div>
    </template>
    <PostDetail v-model="show"
                v-model:commentDisplayType="config.commentDisplayType"
                :closePostDetailBySpace="config.closePostDetailBySpace"
                :loading="loading"/>
    <div class="msgs">
      <Msg v-for="v in msgList" :key="v.id" :type="v.type" :text="v.text" @close="removeMsg(v.id)"/>
    </div>
    <Base64Tooltip/>
    <div class="setting" v-if="showConfig">
      <div class="mask" @click="showConfig = !showConfig"></div>
      <div class="wrapper">
        <div class="title">
          脚本配置
        </div>
        <div class="sub-title">
          配置自动保存到本地，下次打开依然生效
        </div>
        <div class="option">
          列表帖子展示方式：
          <div class="radio-group2">
            <div class="radio"
                 @click="config.viewType = 'table'"
                 :class="config.viewType === 'table'?'active':''">表格
            </div>
            <div class="radio"
                 @click="config.viewType = 'card'"
                 :class="config.viewType === 'card'?'active':''">卡片
            </div>
          </div>
        </div>
        <div class="option">
          回复展示方式：
          <div class="radio-group2">
            <div class="radio"
                 @click="config.commentDisplayType = 0"
                 :class="config.commentDisplayType === 0?'active':''">楼中楼
            </div>
            <div class="radio"
                 @click="config.commentDisplayType = 1"
                 :class="config.commentDisplayType === 1?'active':''">感谢最多
            </div>
            <div class="radio"
                 @click="config.commentDisplayType = 2"
                 :class="config.commentDisplayType === 2?'active':''">V2原版
            </div>
          </div>
        </div>
        <div class="option">
          自动加载详情页 ：
          <div class="switch" :class="{active:config.autoOpenDetail}"
               @click="config.autoOpenDetail = !config.autoOpenDetail"/>
        </div>
        <div class="option">
          点击两侧空白处关闭帖子详情：
          <div class="switch" :class="{active:config.closePostDetailBySpace}"
               @click="config.closePostDetailBySpace = !config.closePostDetailBySpace"/>
        </div>
      </div>
    </div>
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
      loading: window.win().pageType === 'post',
      loadMore: false,
      pageType: window.win().pageType,
      msgList: [
        // {type: 'success', text: '123', id: Date.now()}
      ],
      show: false,
      showConfig: false,
      current: window.win().initPost,
      list: [],
      config: {
        autoOpenDetail: false,
        closePostDetailBySpace: true,//点击空白处关闭详情
        readList: new Set(),
        viewType: 'card',
        commentDisplayType: 0
      }
    }
  },
  computed: {
    isDev() {
      return import.meta.env.DEV
    },
    showList() {
      return this.pageType === 'home' ||
          this.pageType === 'recent' ||
          this.pageType === 'nodePage'
    }
  },
  watch: {
    'current.replies': {
      handler(newVal, oldVal) {
        // console.log('watch', newVal.length, oldVal.length)
        if (newVal.length) {
          this.current.replyCount = newVal.length
          let res = window.parse.createNestedList(newVal, this.current.allReplyUsers)
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
    },
    config: {
      handler(newVal) {
        let readList = Array.from(newVal.readList);
        let config = {[window.win().user.username ?? 'default']: {...newVal, readList}}
        window.win().localStorage.setItem('v2ex-config', JSON.stringify(config))
      },
      deep: true
    }
  },
  created() {
    console.log('create')

    window.win().cb = this.winCb

    // if (window.win().vue) {
    //   console.log('vue', window.win().postList)
    //   //开发时使用，因为数据是从cb传过来的。hmr之后index.html不会再调cb了
    //   if (window.win().pageData?.post) {
    //     window.win().doc.body.style.overflow = 'hidden'
    //     this.current = Object.assign(this.clone(window.win().initPost), this.clone(window.win().pageData.post))
    //     this.loading = false
    //   }
    //   if (window.win().canParseV2exPage) {
    //     this.list = window.win().postList
    //   } else {
    //     this.list = data
    //   }
    // }

    let configStr = window.win().localStorage.getItem('v2ex-config')
    if (configStr) {
      let configObj = JSON.parse(configStr)
      configObj = configObj[window.win().user.username ?? 'default']
      if (configObj) {
        configObj.readList = new Set(configObj.readList);
        this.config = Object.assign(this.config, configObj)
        if (this.config.autoOpenDetail && this.pageType === 'post') {
          this.loading = true
          this.openPostDetail()
        }
      }
    }

    if (window.win().canParseV2exPage) {
      this.list = window.win().postList
      window.win().waitDelElList.map(v => v.remove())
      window.win().waitDelElList = []
      if (this.showList) {
        let lastItem = window.win().appNode.nextElementSibling
        let maxPage = 1000
        if (this.pageType !== 'home') {
          let navs = lastItem.querySelectorAll('a')
          maxPage = Number(navs[navs.length - 1].innerText)
        }

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
                if (Number(r[1]) >= maxPage) {
                  eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '已经是最后一页了'})
                  return this.loadMore = false
                }
                url = origin + pathname + search.replace(r[1], Number(r[1]) + 1)
              }
            }
            // console.log('url', url)
            window.win().history.pushState({}, 0, url);
            let apiRes = await window.win().fetch(url)
            let htmlText = await apiRes.text()
            let res = window.parse.parseOtherPage(htmlText, this.pageType)
            console.log('res', res)
            lastItem.innerHTML = res.page
            this.list.push({type: 'page', innerHTML: lastItem.innerHTML})
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
      // console.log('回调的类型', type, value)
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
        this.config.readList.add(value.id)
        this.current = Object.assign(this.clone(window.win().initPost), this.clone(value))
      }
      if (type === 'postReplies') {
        this.current = Object.assign(this.current, this.clone(value))
        this.loading = false
      }
      if (type === 'ad') {
        window.win().adList.map(v => {
          let adEl = window.win().query('#' + v.id)
          let rIndex = this.list.findIndex(w => w.id == v.id)
          if (rIndex > -1) {
            this.list[rIndex] = Object.assign(this.list[rIndex], {
              innerHTML: adEl.innerHTML
            })
          }
        })
        window.win().$adListEl.innerHTML = ''
        window.win().adList = []
      }
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
      return type === this.config.viewType ? 'white' : '#929596'
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
      this.openPostDetail()
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
      let url = window.win().url + '/t/' + post.id
      window.win().history.pushState({}, 0, url);
      this.config.readList.add(post.id)
      this.current = Object.assign(
          window.win().clone(window.win().initPost),
          {RightbarHTML: this.current.RightbarHTML},
          window.win().clone(post))

      //如果，有数据，不显示loading,默默更新即可
      if (!this.current.replies.length) this.loading = true

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

      this.current = await window.parse.getPostDetail(this.current, body, htmlText)
      if (this.current.replies.length) {
        let index = this.list.findIndex(v => v.id === post.id)
        if (index > -1) {
          this.list[index].replies = this.current.replies
          this.list[index].nestedReplies = this.current.nestedReplies
          this.list[index].once = this.current.once
          this.list[index].createDate = this.current.createDate
        }
      }
      this.loading = false
      console.log('当前帖子', this.current)
    },
  },
}
</script>

<style lang="less">
@import "../assets/less/variable";

.app-home {
  position: relative;

  &.home, &.recent, &.nodePage {
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

.setting {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  //left: 50%;
  //top: 50%;
  //transform: translate(-50%, -50%);

  .mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background: rgba(black, .3);
  }

  .wrapper {
    z-index: 9;
    background: #f1f1f1;
    border-radius: .8rem;
    font-size: 1.4rem;
    //box-shadow: 0 0 6px 4px gainsboro;
    padding: 2rem 6rem 4rem 6rem;

    .title {
      font-size: 2.4rem;
      margin-bottom: 1rem;
    }

    .sub-title {
      color: gray;
      font-size: 1.4rem;
      margin-bottom: 4rem;
    }

    .option {
      width: 40rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;

      .radio-group2 {
        display: flex;
        border-radius: .5rem;
        overflow: hidden;

        .radio {
          cursor: pointer;
          background: white;
          padding: .7rem 1.5rem;
          border: none;
        }

        .active {
          background: #40a9ff;
          color: white;

        }
      }
    }
  }


}
</style>