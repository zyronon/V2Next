<script>
import {PageType} from "./types"
import {computed, nextTick} from "vue";
import Setting from "./components/Modal/SettingModal.vue";
import eventBus from "@/utils/eventBus.js";
import {CMD} from "@/utils/type.js";
import PostDetail from "./components/PostDetail.vue";
import Base64Tooltip from "./components/Base64Tooltip.vue";
import Msg from "../../src/components/Msg.vue";
import Tooltip from "@/components/Tooltip.vue";
import TagModal from "@/components/Modal/TagModal.vue";
import MsgModal from "@/components/Modal/MsgModal.vue";

export default {
  components: {MsgModal, TagModal, Tooltip, Setting, PostDetail, Base64Tooltip, Msg},
  provide() {
    return {
      isLogin: computed(() => this.isLogin),
      isNight: computed(() => this.isNight),
      pageType: computed(() => this.pageType),
      tags: computed(() => this.tags),
      show: computed(() => this.show),
      post: computed(() => this.current),
      config: computed(() => this.config),
      allReplyUsers: computed(() => {
        if (this.current?.replyList) {
          return Array.from(new Set(this.current?.replyList?.map(v => v.username) ?? []))
        }
        return []
      }),
      showConfig: this.showConfig
    }
  },
  data() {
    return {
      loading: window.pageType === PageType.Post,
      loadMore: false,
      isLogin: !!window.user.username,
      pageType: window.pageType,
      isNight: window.isNight,
      stopMe: false,//停止使用脚本
      show: false,
      current: window.clone(window.initPost),
      list: [],
      config: window.clone(window.config),
      tags: window.user.tags,
      readList: window.user.readList,
      configModal: {
        show: false
      },
      tagModal: {
        show: false,
        currentUsername: '',
        tag: '',
      }
    }
  },
  computed: {
    isList() {
      return this.pageType !== PageType.Post
    },
    isPost() {
      return this.pageType === PageType.Post
    },
  },
  watch: {
    'current.replyList': {
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
        let config = {[window.user.username ?? 'default']: newVal}
        localStorage.setItem('v2ex-config', JSON.stringify(config))
        window.config = newVal
      },
      deep: true
    },
    tags(newVal) {
      window.user.tags = newVal
    },
    'config.viewType'(newVal) {
      if (!newVal) return
      if (newVal === 'card') {
        $('.post-item').each(function () {
          $(this).addClass('preview')
        })
      } else {
        $('.post-item').each(function () {
          $(this).removeClass('preview')
        })
      }
    },
  },
  created() {
    // console.log('create', this.current)
    window.cb = this.winCb
    if (window.win().canParseV2exPage) {
      if (this.isList) {
        // let lastItem = window.win().appNode.nextElementSibling
        // let maxPage = 1000
        // if (this.pageType !== 'home') {
        //   let navs = lastItem.querySelectorAll('a')
        //   maxPage = Number(navs[navs.length - 1].innerText)
        // }

        // let ob = window.win().IntersectionObserver
        // const observer = new ob(async (e) => {
        //   if (e[0].isIntersecting) {
        //     if (this.loadMore) return
        //     console.log('加载更多')
        //     this.loadMore = true
        //     let url
        //
        //     if (this.pageType === 'home') {
        //       url = window.baseUrl + `/recent?p=1`
        //       this.pageType = 'recent'
        //     } else {
        //       let {href, search, origin, pathname} = window.win().location
        //       url = href + `?p=2`
        //       let r = search.match(/p=([\d]+)/)
        //       if (r) {
        //         if (Number(r[1]) >= maxPage) {
        //           eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '已经是最后一页了'})
        //           return this.loadMore = false
        //         }
        //         url = origin + pathname + search.replace(r[1], Number(r[1]) + 1)
        //       }
        //     }
        //     // console.log('url', url)
        //     window.win().history.pushState({}, 0, url);
        //     let apiRes = await window.win().fetch(url)
        //     let htmlText = await apiRes.text()
        //     let res = window.parse.parseOtherPage(htmlText, this.pageType)
        //     console.log('res', res)
        //     lastItem.innerHTML = res.page
        //     this.list.push({type: 'page', innerHTML: lastItem.innerHTML})
        //     //不同页数之单，会有重复的数据
        //     res.postList.map(v => {
        //       let rIndex = this.list.findIndex(i => i.id == v.id)
        //       if (rIndex === -1) this.list.push(v)
        //     })
        //     this.loadMore = false
        //     // console.log(htmlText)
        //     Promise.allSettled(res.apiList.map(v => $.get(v))).then(async (results) => {
        //       let res = results.filter((result) => result.status === "fulfilled").map(v => v.value[0])
        //       this.winCb({type: 'list', value: res})
        //     });
        //   }
        // })
        // observer.observe(lastItem)
      }
    }
    //A标签的
    $(document).on('click', 'a', (e) => {
      if (this.stopMe) return true
      let {href, id, title} = window.parse.parseA(e.currentTarget)
      if (this.clickPost(e, id, href, title)) {
        return false
      }
    })
    let that = this
    //帖子的
    $(document).on('click', '.post-item', function (e) {
      //只有预览时，才响应点击
      if (this.classList.contains('preview')) {
        //A标签，要么上面的on事件已经处理了，要么就是不需要处理
        //IMG是头像
        //toggle是切换按钮
        if (e.target.tagName !== 'A'
            &&
            e.target.tagName !== 'IMG'
            &&
            !e.target.classList.contains('toggle')
        ) {
          console.log('点空白处')
          let id = this.dataset['id']
          let href = this.dataset['href']
          if (that.clickPost(e, id, href)) {
            return false
          } else {
            location.href = href
          }
        }
      }
    })
    //展开或收起的点击事件
    $(document).on('click', '.toggle', (e) => {
      let id = e.currentTarget.dataset['id']
      let itemDom = window.win().query(`.id_${id}`)
      if (itemDom.classList.contains('preview')) {
        itemDom.classList.remove('preview')
      } else {
        itemDom.classList.add('preview')
      }
    })

    window.onpopstate = (event) => {
      if (event.state) {
        if (!this.show) this.show = true
      } else {
        if (this.show) this.show = false
      }
    };

    window.onbeforeunload = () => {
      window.parse.saveReadFloor(this.readList)
    }
    this.initEvent()
  },
  beforeUnmount() {
    // console.log('unmounted')
    eventBus.clear()
  },
  methods: {
    clickPost(e, id, href, title = '') {
      if (id) {
        if (this.config.clickPostItemOpenDetail) {
          let index = this.list.findIndex(v => v.id == id)
          let postItem = this.clone(window.initPost)
          if (index > -1) {
            postItem = this.list[index]
          } else {
            postItem.title = title ?? '加载中'
          }
          postItem.id = id
          postItem.href = href
          if (!postItem.headerTemplate) {
            let template = `
            <div class="header">
              <div class="fr">
                <a href="/member/${postItem?.member?.username ?? ''}">
                  <img src="${postItem?.member?.avatar_large ?? ''}" class="avatar"
                       border="0"
                       align="default" width="73" style="width: 73px; max-height: 73px;" alt="${postItem?.member?.username ?? ''}">
                </a>
              </div>
              <a href="/">V2EX</a> <span class="chevron">&nbsp;›&nbsp;</span> <a href="${postItem?.node?.url ?? ''}">${postItem?.node?.title ?? ''}</a>
              <div class="sep10"></div>
              <h1>${postItem?.title || '加载中...'}</h1>
              <div id="topic_930514_votes" class="votes">
                <a href="javascript:" onclick="null" class="vote">
                  <li class="fa fa-chevron-up"></li>
                  &nbsp;
                </a> &nbsp;
                <a href="javascript:" onclick="null" class="vote">
                  <li class="fa fa-chevron-down"></li>
                </a>
              </div> &nbsp;
              <small class="gray">
                <a href="/member/zyronon">${postItem?.member?.username ?? ''}</a> ·
                <span title="2023-04-07 11:32:28 +08:00">1 天前</span> · 0 次点击
              </small>
            </div>
            <div class="cell">
              <div class="topic_content">
                <div class="markdown_body">
                 ${postItem?.content_rendered ?? ''}
                </div>
              </div>
            </div>
            `
            postItem.headerTemplate = template
          }
          this.getPostDetail(postItem)
          e.preventDefault()
          return true
        }
        if (this.config.newTabOpen) {
          let tempId = 'a_blank_' + Date.now()
          let a = win().doc.createElement("a");
          a.setAttribute("href", href);
          a.setAttribute("target", "_blank");
          a.setAttribute("id", tempId);
          // 防止反复添加
          if (!win().doc.getElementById(tempId)) {
            win().doc.body.appendChild(a);
          }
          a.click();
          return true
        }
      }
    },
    showPost() {
      this.show = true
      $(`#Wrapper #Main .box:lt(3)`).each(function () {
        $(this).hide()
      })
    },
    showConfig() {
      this.configModal.show = true
    },
    async winCb({type, value}) {
      // console.log('回调的类型', type, value)
      if (type === 'openSetting') {
        this.configModal.show = true
      }
      if (type === 'restorePost') {
        if (this.stopMe) return
        this.stopMe = true
        this.show = false
        this.loading = false
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '脚本无法查看此页面！'})
        $(`#Wrapper #Main .box:lt(3)`).each(function () {
          $(this).show()
        })
      }
      if (type === 'postContent') {
        if (this.stopMe) return
        this.current = Object.assign(this.clone(this.current), this.clone(value))
        //这时有正文了，再打开，体验比较好
        if (this.config.autoOpenDetail) {
          this.showPost()
        }
      }
      if (type === 'postReplies') {
        if (this.stopMe) return
        this.current = Object.assign(this.clone(this.current), this.clone(value))
        console.log('当前帖子', this.current)
        this.loading = false
      }
      if (type === 'syncData') {
        this.list = window.postList
        this.config = window.config
        this.tags = window.user.tags
        this.readList = window.user.readList
        this.current.lastReadFloor = this.readList[this.current.id] ?? 0
        if (this.show && this.isPost && this.current.lastReadFloor) {
          nextTick(() => {
            this.$refs.postDetail.lastReadFloor = this.current.lastReadFloor
            this.$refs.postDetail.jumpLastRead(this.current.lastReadFloor)
          })
        }
        console.log('this.readList', this.readList)
        // console.log(this.tags)
      }
    },
    clone(val) {
      return window.clone(val)
    },
    initEvent() {
      eventBus.on(CMD.CHANGE_COMMENT_THANK, (val) => {
        console.log('CHANGE_COMMENT_THANK',val)
        const {id, type} = val
        let currentI = this.current.replyList.findIndex(i => i.id === id)
        if (currentI > -1) {
          this.current.replyList[currentI].isThanked = type === 'add'
          if (type === 'add') {
            this.current.replyList[currentI].thankCount++
          } else {
            this.current.replyList[currentI].thankCount--
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
        let removeIndex = this.current.replyList.findIndex(i => i.floor === val)
        // console.log('removeIndex',removeIndex)
        if (removeIndex > -1) {
          this.current.replyList.splice(removeIndex, 1)
        }
        // console.log('removeIndex',this.current.replyList)
        let rIndex = this.list.findIndex(i => i.id === this.current.id)
        if (rIndex > -1) {
          this.list[rIndex] = Object.assign(this.list[rIndex], val)
        }
        // this.msgList.push({...val, id: Date.now()})
      })
      eventBus.on(CMD.IGNORE, () => {
        this.show = false
        let rIndex = this.list.findIndex(i => i.id === this.current.id)
        if (rIndex > -1) {
          this.list.splice(rIndex, 1)
        }
        this.current = this.clone(window.initPost)
      })
      eventBus.on(CMD.MERGE, (val) => {
        this.current = Object.assign(this.current, val)
        let rIndex = this.list.findIndex(i => i.id === this.current.id)
        if (rIndex > -1) {
          this.list[rIndex] = Object.assign(this.list[rIndex], val)
        }
      })
      eventBus.on(CMD.ADD_READ, (val) => {
        this.readList[this.current.id] = val
      })
      eventBus.on(CMD.ADD_REPLY, (item) => {
        this.current.replyList.push(item)
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
        window.fetchOnce().then(r => {
          // console.log('通过fetchOnce接口拿once', r)
          this.current.once = r
        })
      })
      eventBus.on(CMD.REMOVE_TAG, async ({username, tag}) => {
        let oldTag = this.clone(this.tags)
        let tags = this.tags[username] ?? []
        let rIndex = tags.findIndex(v => v === tag)
        if (rIndex > -1) {
          tags.splice(rIndex, 1)
        }
        this.tags[username] = tags

        let res = await window.parse.saveTags(this.tags)
        if (!res) {
          eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '标签删除失败！'})
          this.tags = oldTag
        }
      })
    },
    async getPostDetail(post, event) {
      this.current = Object.assign({}, window.initPost, post)
      this.current.lastReadFloor = this.readList[this.current.id] ?? 0
      this.show = true
      let url = window.baseUrl + '/t/' + post.id
      document.body.style.overflow = 'hidden'
      window.history.pushState({}, 0, post.href ?? url);

      let alreadyHasReply = this.current.replyList.length
      //如果，有数据，不显示loading,默默更新即可
      if (alreadyHasReply) {
        this.$refs.postDetail.jumpLastRead(this.current.lastReadFloor)
      } else {
        this.loading = true
      }

      //ajax不能判断是否跳转
      // $.get(url + '?p=1').then((res, textStatus, xhr) => {
      let apiRes = await window.fetch(url + '?p=1')
      if (apiRes.status === 404) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '主题未找到'})
        return this.loading = false
      }
      if (apiRes.status === 403) {
        this.loading = false
        this.show = false
        window.open(`https://www.v2ex.com/t/${post.id}?p=1&script=0`, '_black')
        return
      }
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

      this.current = await window.parse.getPostDetail(this.current, body, htmlText)
      if (this.current.replyList.length) {
        let index = this.list.findIndex(v => v.id == post.id)
        if (index > -1) {
          this.list[index].replyList = this.current.replyList
          this.list[index].nestedReplies = this.current.nestedReplies
          this.list[index].once = this.current.once
          this.list[index].createDate = this.current.createDate
        } else {
          this.list.push(this.clone(this.current))
        }
      }
      this.loading = false
      if (!alreadyHasReply) {
        nextTick(() => {
          this.$refs.postDetail.jumpLastRead(this.current.lastReadFloor)
        })
      }
      console.log('当前帖子', this.current)
    },
  },
}
</script>

<template>
  <Setting v-model="config" v-model:show="configModal.show"/>
  <TagModal v-model:tags="tags"/>
  <PostDetail v-model="show" ref="postDetail" v-model:displayType="config.commentDisplayType" :loading="loading"/>
  <Base64Tooltip/>
  <MsgModal/>

  <div class="toolbar" v-if="!stopMe && config.showToolbar" :class="[isNight?'isNight':'',config['viewType']]">
    <div class="nav flex flex-end" v-if="isList">
      <div class="radio-group2" :class="{isNight}">
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
    <div v-if="!isList && !show" class="my-box flex f14 open-post" style="margin: 2rem 0 0 0;padding: 1rem;">
      <div class="flex">
        默认显示楼中楼 ：
        <div class="switch light" :class="{active:config.autoOpenDetail}"
             @click="config.autoOpenDetail = !config.autoOpenDetail"/>
      </div>
      <div class="button light" @click="showPost" :class="{loading,isNight}">
        点击显示楼中楼
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "./assets/less/variable";

.isNight {
  //background: #22303f;
  @border: rgb(69, 72, 71);

  .open-post, .nav {
    color: white;
    background: #18222d;
    border-bottom: 1px solid #22303f;
  }
}

.card {
  border-radius: 0 0 0.4rem 0.4rem;
  overflow: hidden;
}

.nav {
  font-size: 1.4rem;
  background: white;
  padding: 1rem;
  border-bottom: 1px solid @border;
}
</style>

