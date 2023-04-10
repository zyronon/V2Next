<template>
  <div class="app-home" :class="[pageType,isNight?'isNight':'']">
    <template v-if="showList">
      <div class="nav flex flex-end">
        <div class="nav-item" @click="showConfig = true">
          <span>配置</span>
        </div>
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
    </template>
    <template v-if="pageType === 'post'">
      <div class="my-box flex f14 open-post" style="margin: 1rem 0 0 0;padding: 1rem;">
        <div class="flex">
          自动打开详情弹框 ：
          <div class="switch" :class="{active:config.autoOpenDetail}"
               @click="config.autoOpenDetail = !config.autoOpenDetail"/>
        </div>
        <div class="button" @click="show = true" :class="{loading}">
          点击显示详情弹框
        </div>
      </div>
    </template>
    <PostDetail v-model="show"
                :isNight="isNight"
                v-model:displayType="config.commentDisplayType"
                :closePostDetailBySpace="config.closePostDetailBySpace"
                :loading="loading"/>
    <div class="msgs">
      <Msg v-for="v in msgList" :key="v.id" :type="v.type" :text="v.text" @close="removeMsg(v.id)"/>
    </div>
    <Base64Tooltip/>
    <div class="setting-modal modal" v-if="showConfig">
      <div class="mask" @click="showConfig = !showConfig"></div>
      <div class="wrapper">
        <div class="title">
          脚本配置
        </div>
        <div class="sub-title">
          配置自动保存到本地，下次打开依然生效
        </div>
        <div class="option">
          <span>列表帖子展示方式：</span>
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
          <span>回复展示方式：</span>
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
          <span>开启打标签功能：</span>
          <div class="switch" :class="{active:config.openTag}"
               @click="config.openTag = !config.openTag"/>
        </div>
        <div class="option">
          <span>帖子界面自动打开详情弹框 ：</span>
          <div class="switch" :class="{active:config.autoOpenDetail}"
               @click="config.autoOpenDetail = !config.autoOpenDetail"/>
        </div>
        <div class="notice">
          单独打开这种地址 https://v2ex.com/t/xxxx 时， 是否自动打开详情弹框
        </div>
        <div class="option">
          <span>点击列表的帖子，打开详情弹框 ：</span>
          <div class="switch" :class="{active:config.clickPostItemOpenDetail}"
               @click="config.clickPostItemOpenDetail = !config.clickPostItemOpenDetail"/>
        </div>
        <div class="notice">
          若关闭此项，点击列表的帖子时，不会打开弹框，会跳转网页
        </div>
        <!--        <div class="option">-->
        <!--          <span>新标签页打开帖子 ：</span>-->
        <!--          <div class="switch" :class="{active:config.newTabOpen}"-->
        <!--               @click="config.newTabOpen = !config.newTabOpen"/>-->
        <!--        </div>-->
        <!--        <div class="notice">-->
        <!--          仅关闭”点击列表的帖子，打开详情弹框“时生效，-->
        <!--        </div>-->
        <div class="option">
          <span>点击两侧空白处关闭帖子详情：</span>
          <div class="switch" :class="{active:config.closePostDetailBySpace}"
               @click="config.closePostDetailBySpace = !config.closePostDetailBySpace"/>
        </div>


        <div class="jieshao">
          如只想要列表预览功能，可关闭 ”点击列表的帖子，打开详情弹框“，”帖子界面自动打开详情弹框“
        </div>
      </div>
    </div>
    <div class="tag-modal modal" v-if="tagModal.show">
      <div class="mask" @click.stop="tagModal.show = false"></div>
      <div class="wrapper">
        <div class="title">
          添加标签
        </div>
        <div class="option">
          <span>用户：</span>
          <div>
            {{ tagModal.currentUsername }}
          </div>
        </div>
        <input type="text" autofocus v-model="tagModal.tag" @keydown.enter="addTag">
        <div class="btns">
          <div class="button info" @click="tagModal.show = false">取消</div>
          <div class="button" @click="addTag">确定</div>
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
      tags: computed(() => this.tags),
      clone: window.win().clone,
      post: computed(() => this.current),
      config: computed(() => this.config),
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
      isNight: window.win().isNight,
      msgList: [
        // {type: 'success', text: '123', id: Date.now()}
      ],
      show: false,
      showConfig: false,
      current: window.win().initPost,
      list: [],
      config: window.win().config,
      tags: window.win().user.tags,
      tagModal: {
        show: false,
        currentUsername: '',
        tag: '',
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
        let config = {[window.win().user.username ?? 'default']: newVal}
        window.win().localStorage.setItem('v2ex-config', JSON.stringify(config))
        window.win().config = newVal
      },
      deep: true
    },
    tags(newVal) {
      window.win().user.tags = newVal
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
    window.win().cb = this.winCb
    if (this.config.autoOpenDetail && this.pageType === 'post') {
      this.loading = true
      //这里手动设置一下，postdetail不能使用立即执行监听器，会导致，从帖子页进入列表页是，自动返回
      window.win().doc.body.style.overflow = 'hidden'
      this.show = true
    }
    if (window.win().canParseV2exPage) {
      if (this.showList) {
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
        //       url = window.win().url + `/recent?p=1`
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
    $(window.win().doc).on('click', 'a', (e) => {
      let {href, id} = window.parse.parseA(e.currentTarget)
      if (id) {
        if (this.config.clickPostItemOpenDetail) {
          let index = this.list.findIndex(v => v.id == id)
          if (index > -1) {
            let postItem = this.list[index]
            let template = `
            <div class="header">
              <div class="fr">
                <a href="/member/${postItem.member.username}">
                  <img src="${postItem.member.avatar_large}" class="avatar"
                       border="0"
                       align="default" width="73" style="width: 73px; max-height: 73px;" alt="${postItem.member.username}">
                </a>
              </div>
              <a href="/">V2EX</a> <span class="chevron">&nbsp;›&nbsp;</span> <a href="${postItem.node.url}">${postItem.node.title}</a>
              <div class="sep10"></div>
              <h1>${postItem.title}</h1>
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
                <a href="/member/zyronon">${postItem.member.username}</a> ·
                <span title="2023-04-07 11:32:28 +08:00">1 天前</span> · 3334 次点击
              </small>
            </div>
            <div class="cell">
              <div class="topic_content">
                <div class="markdown_body">
                 ${postItem.content_rendered}
                </div>
              </div>
            </div>
        `
            postItem.headerTemplate = template
            this.getPostDetail(postItem)
            e.preventDefault()
            return false
          }
        }
      }
    })
    //展开或收起的点击事件
    $(window.win().doc).on('click', '.toggle', (e) => {
      let id = e.currentTarget.dataset['id']
      let itemDom = window.win().query(`.id_${id}`)
      if (itemDom.classList.contains('preview')) {
        itemDom.classList.remove('preview')
      } else {
        itemDom.classList.add('preview')
      }
    })
    this.initEvent()
  },
  beforeUnmount() {
    // console.log('unmounted')
    eventBus.clear()
  },
  methods: {
    async addTag() {
      let oldTag = this.clone(this.tags)
      let tags = this.tags[this.tagModal.currentUsername] ?? []
      let rIndex = tags.findIndex(v => v === this.tagModal.tag)
      if (rIndex > -1) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '标签已存在！'})
        return
      } else {
        tags.push(this.tagModal.tag)
      }
      this.tags[this.tagModal.currentUsername] = tags
      this.tagModal.tag = ''
      this.tagModal.show = false
      let res = await window.parse.saveTags(this.tags)
      if (!res) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '标签添加失败！'})
        this.tags = oldTag
      }
      console.log('res', res)
      return console.log(this.tags)
    },
    async winCb({type, value}) {
      // console.log('回调的类型', type, value)
      if (type === 'postContent') {
        this.current = Object.assign(this.clone(window.win().initPost), this.clone(value))
      }
      if (type === 'postReplies') {
        this.current = Object.assign(this.current, this.clone(value))
        this.loading = false
      }
      if (type === 'syncData') {
        this.list = window.win().postList
        this.config = window.win().config
        this.tags = window.win().user.tags
        console.log(this.tags)
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
      eventBus.on(CMD.ADD_TAG, (username) => {
        console.log('use', username)
        this.tagModal.currentUsername = username
        this.tagModal.show = true
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
    removeMsg(id) {
      let rIndex = this.msgList.findIndex(item => item.id === id)
      if (rIndex > -1) {
        this.msgList.splice(rIndex, 1)
      }
    },
    async getPostDetail(post, event) {
      this.show = true
      // if (event) {
      //   let target = event.target || event.srcElement;
      //   //如果是站内帖子，那么直接打开
      //   if (target.nodeName.toLocaleLowerCase() === 'a') {
      //     event.preventDefault();
      //     let text = target.innerText
      //     let r = text.match(/t\/([\d]+)/)
      //     if (r) {
      //       post = {id: r[1]}
      //     }
      //   }
      // }
      let url = window.win().url + '/t/' + post.id
      window.win().doc.body.style.overflow = 'hidden'
      window.win().history.pushState({}, 0, post.href ?? url);

      this.current = Object.assign(
          this.clone(window.win().initPost),
          {RightbarHTML: this.current.RightbarHTML},
          this.clone(post))
      //如果，有数据，不显示loading,默默更新即可
      if (!this.current.replies.length) this.loading = true

      //ajax不能判断是否跳转
      // $.get(url + '?p=1').then((res, textStatus, xhr) => {
      let apiRes = await window.win().fetch(url + '?p=1')
      if (apiRes.status === 404) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '主题未找到'})
        return this.loading = false
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
      if (this.current.replies.length) {
        let index = this.list.findIndex(v => v.id == post.id)
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

  &.isNight {
    background: #22303f;
    @border: rgb(69, 72, 71);

    .open-post, .nav {
      color: white;
      background: #18222d;
      border: none;
    }

    .setting-modal {
      .wrapper {
        background: #22303f;

        .option {
          color: black;

          span {
            color: gray !important;
          }
        }
      }
    }


    .radio-group2 {
      @border: rgb(69, 72, 71);
      border: 1px solid @border;

      .radio {
        border-left: 1px solid @border;
        color: white;

      }

      .active {
        background: #165c94;
      }
    }
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

  .nav-item {
    cursor: pointer;
    display: flex;
    margin-right: 2rem;
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

.setting-modal {
  .wrapper {
    z-index: 9;
    background: #f1f1f1;
    border-radius: .8rem;
    font-size: 1.4rem;
    //box-shadow: 0 0 6px 4px gainsboro;
    padding: 2rem 6rem 4rem 6rem;
    width: 45rem;


    .sub-title {
      color: gray;
      font-size: 1.4rem;
      margin-bottom: 4rem;
    }


    .notice {
      font-size: 12px;
      display: flex;
      justify-content: flex-start;
      padding-left: 3rem;
      line-break: anywhere;
      text-align: left;
    }

    .jieshao {
      margin-top: 2rem;
      font-size: 15px;
      font-weight: bold;
      color: red;
      display: flex;
      justify-content: flex-start;
      line-break: anywhere;
      text-align: left;
    }
  }
}

.tag-modal {
  .wrapper {
    z-index: 9;
    background: #f1f1f1;
    border-radius: .8rem;
    font-size: 1.4rem;
    //box-shadow: 0 0 6px 4px gainsboro;
    padding: 2rem 6rem 4rem 6rem;
    width: 25rem;

    input {
      margin-bottom: 3rem;
      width: 100%;
      height: 3rem;
      outline: unset;
      border: 1px solid #e1e1e1;
      padding: 0 .5rem;
      border-radius: 5px;
      box-sizing: border-box;
    }

    .btns {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  }
}

.radio-group2 {
  display: inline-flex;
  border-radius: .5rem;
  overflow: hidden;
  @border: #40a9ff;
  //@border: rgb(69, 72, 71);
  border: 1px solid @border;

  .radio {
    cursor: pointer;
    //background: white;
    background: transparent;
    padding: 0.5rem 1.5rem;
    border-left: 1px solid @border;
    color: black;
    //color: white;

    &:first-child {
      border-left: none;
    }
  }

  .active {
    background: #40a9ff;
    //background: #165c94;
    color: white;
  }
}
</style>