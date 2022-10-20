<template>
  <div class="posts">
    <Post :class="{visited:readList.has(item.id)}" @click="showDetail(item,$event)" v-for="item in list" :post="item"/>
  </div>
  <PostDetail v-model="show" :post="current" :loading="loading"/>
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

let repliesMap = []
export default {
  name: 'home',
  provide() {
    return {
      isDev: computed(() => import.meta.env.DEV),
      isLogin: computed(() => !!window.user.username),
      post: computed(() => this.current),
      allReplyUsers: computed(() => this.current.replies.map(v => v.username)),
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
      loading: false,
      msgList: [
        // {type: 'success', text: '123', id: Date.now()}
      ],
      show: false,
      current: {
        replies: [],
        nestedReplies: [],
        username: '',
        title: '',
        id: '',
        once: '',
        replyCount: 0,
        collectCount: 0,
        isFavorite: false,
        isIgnore: false,
        isReport: false,
      },
      list: [],
      readList: new Set(),
    }
  },
  computed: {
    isDev() {
      return import.meta.env.DEV
    }
  },
  watch: {
    show(newVal) {
      if (!newVal) {
        window.history.back();
      }
    }
  },
  created() {
    let local = localStorage.getItem('readList')
    if (local) {
      let list = JSON.parse(local)
      this.readList = new Set(list);
    }
    let that = this
    window.w.cb = (posts) => {
      posts.map(post => {
        let rIndex = that.list.findIndex(v => v.id == post.id)
        if (rIndex > -1) {
          that.list[rIndex] = Object.assign(that.list[rIndex], {
            content_rendered: post.content_rendered,
            replyCount: post.replies || 0,
            nodeUrl: post.node.url,
            avatar: post.member.avatar_large,
          })
        }
      })
    }
    if (window.w.postList) {
      this.list = window.w.postList
      let read = localStorage.getItem('read')
      if (read) {
        read = JSON.parse(read)
        read.map()
        // this.list =
      }
    }
    if (window.isDev) {
      this.list = data
      // setTimeout(() => {
      //   this.list.map(v => {
      //     v.content_rendered = `<p><a href="https://imgur.com/taLDwNr" rel="nofollow"><img class="embedded_image" loading="lazy" referrerpolicy="no-referrer" rel="noreferrer" src="https://i.imgur.com/taLDwNr.png" title="source: imgur.com"></a></p>`
      //   })
      // }, 500)
    }
    eventBus.on(CMD.SHOW_MSG, (val) => {
      this.msgList.push({...val, id: Date.now()})
    })
    eventBus.on('ignore', () => {
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
    eventBus.on('merge', (val) => {
      this.current = Object.assign(this.current, val)
      let rIndex = this.list.findIndex(i => i.id === this.current.id)
      if (rIndex > -1) {
        this.list[rIndex] = Object.assign(this.list[rIndex], val)
      }
    })
    eventBus.on('addReply', (item) => {
      this.getAllReply(this.current.replies.concat(item))
      // this.current.replies.push(item)
      // this.current.replyCount = this.current.replies.length
      // let rIndex = this.list.findIndex(i => i.id === this.current.id)
      // if (rIndex > -1) {
      //   this.list[rIndex].replyCount = this.current.replies.length
      // }
    })
    eventBus.on('refreshOnce', async (once) => {
      if (once) {
        if (typeof once === 'string') {
          let res = once.match(/var once = "([\d]+)";/)
          if (res && res[1]) {
            this.current.once = Number(res[1])
            console.log('接口返回了once-str', this.current.once)
            return
          }
        }
        if (typeof once === 'number') {
          this.current.once = once
          console.log('接口返回了once-number', this.current.once)
          return
        }
      }
      let that = this
      let url = window.url + '/t/' + this.current.id
      $.get(url + '?p=1').then(res => {
        let hasPermission = res.search('你要查看的页面需要先登录')
        if (hasPermission > -1) {
          eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '没有权限'})
        } else {
          let once = res.match(/var once = "([\d]+)";/)
          // console.log(once)
          if (once && once[1]) {
            that.current.once = once[1]
          }
        }
      })
    })
    // this.getReplyInfo()

    let href = window.doc.location.href
    let r = href.match(/t\/([\d]+)/)
    if (r) {
      // this.showDetail({id: r[1]}, null, $(window.doc.body), window.doc.documentElement.outerHTML)
      this.showDetail({id: r[1]}, null)
    }
  },
  mounted() {
    window.win().onbeforeunload = () => {
      localStorage.setItem('readList', JSON.stringify(Array.from(this.readList)))
    };
  },
  methods: {
    removeMsg(id) {
      let rIndex = this.msgList.findIndex(item => item.id === id)
      if (rIndex > -1) {
        this.msgList.splice(rIndex, 1)
      }
    },
    getReplyInfo(str) {
      if (!str) return
      let getUsername = (userStr) => {
        let endIndex = userStr.indexOf('">')
        if (endIndex > -1) {
          let user = userStr.substring(0, endIndex)
          if (!users.find(i => i === user)) {
            users.push(user)
          }
        }
      }
      // str = `@<a hr a> #4 @<a1 href="/member/Eiden1">Eiden1</a1>   @<a href="/member/Eiden111">Eiden21</a> #11   这也是执行阶段，所谓的安装也是程序业务的 setup 。<br>windows 、Android 并没有系统级的 CD-KEY 。`
      let floorReg = /@<a href="\/member\/[\s\S]+?<\/a>[\s]+#([\d]+)/g
      let userReg = /@<a href="\/member\/([\s\S]+?)<\/a>/g
      let hasFloor = str.matchAll(floorReg)
      let res = [...hasFloor]
      // console.log('总匹配', res)
      let users = []
      let floor = -1
      if (res.length) {
        floor = Number(res[0][1])
      } else {
        let has = str.matchAll(userReg)
        let res2 = [...has]
        // console.log('总匹配', res2)
        if (res2.length > 1) {
          res2.map(item => {
            getUsername(item[1])
          })
        }
        if (res2.length === 1) {
          getUsername(res2[0][1])
        }
      }
      // console.log('用户', users)
      // console.log('楼层', floor)
      return {users, floor}
    },
    findChildren(item, arr, all) {
      const fn = (list, r, item2) => {
        let rIndex = all.findIndex(v => v.floor === r.floor)
        if (rIndex > -1) {
          all[rIndex].isUse = true
        }
        item2.children.push(this.findChildren(r, list, all))
      }
      // console.log('arr', arr)
      item.children = []
      // if (item.floor ==8)debugger
      for (let i = 0; i < arr.length; i++) {
        let r = arr[i]

        //如果已被使用，直接跳过
        if (r.isUse) continue

        let list = arr.slice(i + 1)
        //不知哪个V友的插件，回复的#号是错误的....，所有还要加上一个用户名是不是相同的判断
        // if (r.replyFloor === item.floor && r.replyUsers[0] === item.username) {
        //错的就错的吧，反正我自己的不出错就行

        if (r.replyFloor !== -1) {
          if (r.replyFloor === item.floor) {
            fn(list, r, item)
          }
        } else {
          if (r.replyUsers.length === 1) {
            //找出自己最近一条正常回复，以那条为搜索终点
            let rIndex = arr.findIndex(v => v.username === item.username && (r.replyUsers.length === 0 && r.replyFloor === -1))
            if (rIndex > -1) {
              list = arr.slice(i + 1, rIndex)
            }
            //如果是下一条是同一人的回复，那么跳转循环。children从下一条开始找
            if (r.username === item.username) {
              //自己回复自己的特殊情况
              if (r.replyUsers[0] === item.username) {
                fn(list, r, item)
                continue
              }
              list.map((v, vi) => {
                if (v.replyFloor === item.floor) {
                  fn(arr.slice(vi + 1), v, item)
                }
              })
              break
            } else {
              if (r.replyUsers[0] === item.username) {
                fn(list, r, item)
              }
            }
          } else {
            //如果是下一条是同一人的回复，那么跳转循环。children从下一条开始找
            if (r.username === item.username) {
              //有种特殊情况，就是自己连着评论了两条。然后后面的人以#号的方式 回复了自己第一条。
              //如果检测到下条是自己的回复，直接略过的话就会丢失第一条的所有楼中楼回复
              //具体如下
              // 自己：1楼，在for的时候，如果碰到 2楼不能直接跳过，直接略过的话就会丢失第一条的所有楼中楼回复，即3楼。所以应该以3楼为起点
              //进行楼中楼查找，查找完了再跳过
              // 自己：2楼
              // 别人：指定回复1楼
              list.map((v, vi) => {
                if (v.replyFloor === item.floor) {
                  fn(arr.slice(vi + 1), v, item)
                }
              })
              break
            }
          }
        }
      }
      return item
    },
    getNestedList(list, res) {
      list.map((item, index) => {
        let forList = list.slice(index + 1)
        if (index === 0) {
          res.push(this.findChildren(item, forList, list))
        } else {
          //这里判断@人数不等于1。那么会把@多个人作为一级楼层，而不会作为楼中楼
          //如果要把@多个人作为楼中楼，那么这里只需判断人数等于0
          //然后把子方法里面for里面的第一个else里面的if判断r.replyUsers.length === 1 改为=== 0。然后把逻辑和else对调就可以
          if ((item.replyUsers.length !== 1) && item.replyFloor === -1) {
            res.push(this.findChildren(item, forList, list))
          }
        }
      })
    },
    getOtherPage(url, i) {
      let that = this
      return new Promise(resolve => {
        $.get(url).then(res => {
          let s = res.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
          let box = $(s[0]).find('#Main .box')[1]
          let cells = box.querySelectorAll('.cell')
          cells = Array.from(cells)
          that.parseReply(cells.slice(2), i)
          resolve(true)
        })
      })
    },
    getAllReply(allList) {
      // this.current.repliesMap.keys()
      if (!allList) {
        allList = repliesMap.sort((a, b) => a.i - b.i).reduce((pre, i) => {
          pre = pre.concat(i.replyList)
          return pre
        }, [])
      }
      this.current.replies = allList
      this.current.replyCount = allList.length
      let rIndex = this.list.findIndex(i => i.id === this.current.id)
      if (rIndex > -1) {
        this.list[rIndex].replyCount = allList.length
      }
      //可能打开的不是列表里面的帖子
      let replyNestedList = []
      let copy = JSON.parse(JSON.stringify(allList))
      this.getNestedList(copy, replyNestedList)
      // console.log(copy)
      console.log('replyNestedList', replyNestedList)
      this.current.nestedReplies = replyNestedList
    },
    parseReply(nodes, i) {
      let replyList = []
      nodes.forEach((node, index) => {
        if (!node.id) return
        let item = {
          thankCount: 0,
          isThanked: false,
          isOp: false,
          id: node.id.replace('r_', '')
        }
        let reply_content = node.querySelector('.reply_content')
        // console.log(reply_content)
        item.reply_content = reply_content.innerHTML
        item.reply_text = reply_content.innerText

        let {users, floor} = this.getReplyInfo(item.reply_content)
        item.replyUsers = users
        item.replyFloor = floor
        if (index === 5) {
          // console.log(item)
          // console.log(reply_content.innerText)
          // console.log(reply_content.innerHTML)
        }
        let ago = node.querySelector('.ago')
        item.date = ago.innerText

        let userNode = node.querySelector('strong a')
        item.username = userNode.innerText
        let avatar = node.querySelector('td img')
        item.avatar = avatar.src
        let no = node.querySelector('.no')
        item.floor = Number(no.innerText)

        let thank_area = node.querySelector('.thank_area')
        if (thank_area) {
          item.isThanked = thank_area.classList.contains('thanked')
        }
        let small = node.querySelector('.small')
        if (small) {
          item.thankCount = Number(small.innerText)
        }
        let op = node.querySelector('.op')
        if (op) {
          item.isOp = true
        }
        // console.log('item', item)

        replyList.push(item)
      })
      repliesMap.push({i, replyList})
    },
    async showDetail(post, event, body, htmlText) {
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
      repliesMap = []
      // this.current = post
      this.current = JSON.parse(JSON.stringify(post))
      this.current.isFavorite = false
      this.current.isThanked = false
      this.current.isIgnore = false
      this.current.once = ''
      this.current.replies = []
      this.current.nestedReplies = []
      this.current.clickCount = 0
      this.current.collectCount = 0
      this.current.thankCount = 0
      this.show = true
      this.loading = true

      window.doc.body.style.overflow = 'hidden'

      let that = this
      let url = window.url + '/t/' + post.id
      window.w.history.pushState({}, 0, '/t/' + post.id);
      let promiseList = []
      if (!body) {
        //ajax不能判断是否跳转
        // $.get(url + '?p=1').then((res, textStatus, xhr) => {
        let apiRes = await window.w.fetch2(url + '?p=1')
        //如果是重定向了，那么就是没权限
        if (apiRes.redirected) {
          eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '没有权限'})
          return that.loading = false
        }
        htmlText = await apiRes.text()
        let hasPermission = htmlText.search('你要查看的页面需要先登录')
        if (hasPermission > -1) {
          eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '你要查看的页面需要先登录'})
          return that.loading = false
        }
        let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
        body = $(bodyText[0])
        // console.log(body)
      }

      //如果没有正文（点的本站的a标签），才会解析正文
      if (!that.current.title) {
        let main = body.find('#Main')
        let topic_content = main.find('.topic_content')
        if (topic_content.length) {
          that.current.content_rendered = topic_content.html()
        }
        let title = main.find('.header h1')
        if (title.length) {
          that.current.title = title.html()
        }
        let a2 = main.find('.header a:eq(2)')
        if (a2.length) {
          that.current.nodeUrl = a2[0].href
          that.current.node = a2.text()
        }
        let a5 = main.find('.header a:eq(5)')
        if (a5.length) {
          that.current.username = a5.text()
          that.current.date = a5.next().text()
        }

        let avatarNode = main.find('.header .fr img')
        if (avatarNode.length) {
          that.current.avatar = avatarNode[0].src
        }
      }

      let subtles = body.find('.subtle')
      if (subtles.length) {
        that.current.subtlesHtml = `
        <div class="subtlesHtml">${Array.from(subtles).reduce((p, i) => {
          p += `<div class="subtle">${i.innerHTML}</div>`
          return p
        }, '')}</div>
        `
      }

      let once = htmlText.match(/var once = "([\d]+)";/)
      // console.log(once)
      if (once && once[1]) {
        that.current.once = once[1]
      }

      that.current.isReport = htmlText.includes('你已对本主题进行了报告')

      let topic_buttons = body.find('.topic_buttons')
      if (topic_buttons.length) {
        let favoriteNode = topic_buttons.find('.tb:first')
        if (favoriteNode.length) {
          that.current.isFavorite = favoriteNode[0].innerText === '取消收藏'
        }
        let ignoreNode = topic_buttons.find('.tb:eq(2)')
        if (ignoreNode.length) {
          that.current.isIgnore = ignoreNode[0].innerText === '取消忽略'
        }
        //
        let thankNode = topic_buttons.find('#topic_thank .tb')
        if (!thankNode.length) {
          that.current.isThanked = true
        }

        let topic_stats = topic_buttons.find('.topic_stats')
        //topic_stats = $(`<div class="fr topic_stats" style="padding-top: 4px;">9569 次点击 &nbsp;∙&nbsp; 28 人收藏 &nbsp; ∙&nbsp; 1 人感谢 &nbsp; </div>`)
        //收藏数、感谢数
        if (topic_stats.length) {
          let text = topic_stats[0].innerText
          let reg1 = text.matchAll(/([\d]+)[\s]*人收藏/g)
          let collectCountReg = [...reg1]
          if (collectCountReg.length) {
            that.current.collectCount = Number(collectCountReg[0][1])
          }
          // console.log([...collectCountReg])
          let reg2 = text.matchAll(/([\d]+)[\s]*人感谢/g)
          let thankCountReg = [...reg2]
          if (thankCountReg.length) {
            that.current.thankCount = Number(thankCountReg[0][1])
          }
          // console.log([...thankCountReg])
        }
      }

      //点击数
      let baseInfo = body.find('.header small.gray')
      if (baseInfo.length) {
        let text = baseInfo.text()
        let reg = text.matchAll(/([\d]+)[\s]*次点击/g)
        let clickCountReg = [...reg]
        if (clickCountReg.length) {
          that.current.clickCount = Number(clickCountReg[0][1])
        }
      }

      console.log('current', that.current)

      if (body.find('#no-comments-yet').length) {
        this.loading = false
        return
      }

      let box = body.find('#Main .box')[1]
      // console.log(box)
      let cells = box.querySelectorAll('.cell')
      cells = Array.from(cells)
      if (!cells[1].id) {
        that.parseReply(cells.slice(2), 0)
        let pages = cells[1].querySelectorAll('a')
        console.log(pages)
        pages.forEach((v, i) => {
          if (i === 0) return
          promiseList.push(that.getOtherPage(url + '?p=' + (i + 1), i))
        })
        Promise.allSettled(promiseList).then(
            (results) => {
              results.filter((result) => result.status === "fulfilled").map(v => v.value[0])
              // console.log(this.current.repliesMap)
              that.getAllReply()
              this.loading = false
            }
        );
      } else {
        that.parseReply(cells.slice(1), 0)
        that.getAllReply()
        this.loading = false
        // console.log(this.current.repliesMap)
      }
    }
  },
}
</script>