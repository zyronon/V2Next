<template>
  <div class="post-detail"
       ref="detail"
       @scroll="scroll"
       v-show="modelValue"
       @click="$emit('update:modelValue',false)">
    <div class="main" @click.stop="stop">
      <div class="left">
        <div class="left-wrapper">
          <div class="my-box post-wrapper">
            <div class="base-info">
              <a :href="`/member/${post.username}`">
                <img class="avatar" :src="post.avatar" alt="">
              </a>
              <div class="post-nodes">
                <a href="/">V2EX</a>
                <span class="chevron">&nbsp;&nbsp;›&nbsp;&nbsp;</span>
                <a :href="post.nodeUrl">{{ post.node }}</a>
              </div>
              <div class="title" v-html="post.title"></div>
              <div class="post-author">
                <div class="username">
                  <a :href="`/member/${post.username}`">{{ post.username }}</a>
                </div>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                <div class="date">{{ post.date }}</div>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                <div class="date">{{ post.clickCount }}次点击</div>
              </div>
            </div>
            <div class="content" v-if="post.content_rendered||post.subtlesHtml">
              <BaseHtmlRender :html="post.content_rendered" class="baseContent"/>
              <BaseHtmlRender :html="post.subtlesHtml"/>
            </div>
            <div class="toolbar-wrapper">
              <Point
                  @addThank="addThank"
                  @recallThank="recallThank"
                  :item="{
                isThanked:post.isThanked,
                thankCount:post.thankCount,
                username:post.username
              }"
                  :api-url="'topic/'+post.id"/>
              <Toolbar @reply="isSticky = !isSticky"/>
            </div>
          </div>
          <div class="my-box" v-if="loading">
            <div class="my-cell flex">
                <span class="gray">{{ post.replyCount }} 条回复
                 <span v-if="post.createDate"> &nbsp;<strong class="snow">•</strong> &nbsp;{{ post.createDate }}</span>
                </span>
              <div class="sort-select">
                <div class="target" @click.stop="showSortOption = true">
                  <span>排序：{{ sortOptions.find(v => v.value === target).label }}</span>
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 19L24 31L12 19H36Z" fill="#0079d3" stroke="#0079d3" stroke-width="2"
                          stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="options" v-if="showSortOption">
                  <div class="option"
                       :class="{active:target === item.value}"
                       @click="changeOption(item)"
                       v-for="item in sortOptions">
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </div>
            <div class="loading-wrapper">
              <div class="loading-c"></div>
            </div>
          </div>
          <template v-else>
            <div class="my-box comment-wrapper" v-if="replies.length">
              <div class="my-cell flex">
                <span class="gray">{{ post.replyCount }} 条回复
                 <span v-if="post.createDate"> &nbsp;<strong class="snow">•</strong> &nbsp;{{ post.createDate }}</span>
                </span>
                <div class="sort-select">
                  <div class="target" @click.stop="showSortOption = true">
                    <span>排序：{{ sortOptions.find(v => v.value === target).label }}</span>
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M36 19L24 31L12 19H36Z" fill="#0079d3" stroke="#0079d3" stroke-width="2"
                            stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="options" v-if="showSortOption">
                    <div class="option"
                         :class="{active:target === item.value}"
                         @click="changeOption(item)"
                         v-for="item in sortOptions">
                      {{ item.label }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="comments">
                <Comment v-for="(item,index) in replies"
                         @remove="remove(index)"
                         v-model="replies[index]" :key="index"/>
              </div>
            </div>
            <div v-else id="no-comments-yet">目前尚无回复</div>
          </template>
          <div class="my-box editor-wrapper" ref="replyBox" :class="{'sticky':isSticky}">
            <div class="my-cell flex">
              <span>添加一条新回复</span>
              <div class="notice-right">
                <a class="float" v-if="isSticky" @click="isSticky = false">取消回复框停靠</a>
                <a @click="scrollTop">回到顶部</a>
              </div>
            </div>
            <div class="w">
              <PostEditor
                  useType="reply-post"
                  @click="isSticky = true"
                  @addReplyChild="addReplyChild"/>
            </div>
          </div>
        </div>
      </div>
      <div class="right" ref="right">
        <div class="scroll-top button" @click.stop="scrollTop">
          回到顶部
        </div>
      </div>
      <div class="call-list"
           :style="callStyle"
           v-if="showCallList && filterCallList.length">
        <div class="call-item"
             @click="setCall(item)"
             :class="{select:index === selectCallIndex}"
             v-for="(item,index) in filterCallList.slice(0,10)">
          <a>{{ item }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Comment from './Comment'
import PostEditor from './PostEditor'
import Point from "./Point";
import Toolbar from "./Toolbar";
import BaseHtmlRender from "@/components/BaseHtmlRender";
import eventBus from "@/eventBus";
import {CMD} from "@/utils/type";

export default {
  name: "detail",
  components: {
    Comment,
    PostEditor,
    Point,
    Toolbar,
    BaseHtmlRender
  },
  inject: ['allReplyUsers', 'post','clone'],
  props: {
    modelValue: false,
    loading: false,
  },
  data() {
    return {
      showSortOption: false,
      isSticky: false,
      target: 0,
      sortOptions: [
        {value: 0, label: '楼中楼'},
        {value: 1, label: '感谢'},
        {value: 2, label: 'V2原版'},
      ],
      selectCallIndex: 0,
      showCallList: false,
      replyText: '',
      callStyle: {
        top: 0,
        left: 0
      }
    }
  },
  computed: {
    filterCallList() {
      if (this.showCallList) {
        if (this.replyText) {
          return this.allReplyUsers.filter(i => i.search(this.replyText) > -1)
        }
        return this.allReplyUsers
      }
      return []
    },
    replies() {
      if (this.target === 0) return this.post.nestedReplies
      if (this.target === 1) {
        return this.clone(this.post.nestedReplies).sort((a, b) => b.thankCount - a.thankCount)
      }
      if (this.target === 2) return this.post.replies
    },
  },
  watch: {
    modelValue(newVal) {
      if (!newVal) {
        this.$refs.detail.scrollTo({top: 0})
        window.doc.body.style.overflow = 'unset'
      }
    }
  },
  mounted() {
    const observer = new IntersectionObserver(
        ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
        {threshold: [1]}
    );

    observer.observe(this.$refs.replyBox);

    window.win().addEventListener('keydown', this.onKeyDown)
    let Rightbar = window.doc.querySelector('#Rightbar')
    if (Rightbar) {
      this.$refs.right.append(Rightbar.cloneNode(true))
    }
    eventBus.on(CMD.SHOW_CALL, (val) => {
      if (val.show) {
        // console.log('va', val)
        this.showCallList = true
        this.replyText = val.text
        //top值要加上滚动的距离，因为val传的top是相对于视口，而不是父div
        //left要减去父级的left，原理同上
        this.callStyle.top = val.top + $('.post-detail').scrollTop() + 15 + 'px'
        this.callStyle.left = val.left - $('.main')[0].getBoundingClientRect().left + 10 + 'px'
        if (this.selectCallIndex >= this.filterCallList.length) {
          this.selectCallIndex = 0
        }
      } else {
        this.replyText = ''
        this.showCallList = false
        this.selectCallIndex = 0
      }
    })
  },
  beforeUnmount() {
    this.$refs.right.innerHTML = ''
    window.win().removeEventListener('keydown', this.onKeyDown)
    eventBus.off(CMD.SHOW_CALL)
  },
  methods: {
    setCall(e) {
      if (e) {

      }
      eventBus.emit(CMD.SET_CALL, e)
      this.showCallList = false
    },
    onKeyDown(e) {
      if (!this.modelValue) return
      if (!this.showCallList) return
      let length = this.filterCallList.slice(0, 10).length
      //enter
      if (e.keyCode === 13) {
        this.setCall(this.filterCallList[this.selectCallIndex])
        e.preventDefault()
      }
      //上
      if (e.keyCode === 38) {
        this.selectCallIndex--
        if (this.selectCallIndex < 0) {
          this.selectCallIndex = length - 1
        }
        e.preventDefault()
      }
      //下
      if (e.keyCode === 40) {
        this.selectCallIndex++
        if (this.selectCallIndex > (length - 1)) {
          this.selectCallIndex = 0
        }
        e.preventDefault()
      }
    },
    changeOption(item) {
      this.showSortOption = false;
      this.target = item.value
    },
    stop() {
      this.showSortOption = false
    },
    scroll() {
      this.showSortOption = false
    },
    addThank() {
      this.post.isThanked = true
      this.post.thankCount++
    },
    recallThank() {
      this.post.isThanked = false
      this.post.thankCount--
    },
    remove(index) {
      if (this.target === 0) {
        this.post.nestedReplies.splice(index, 1)
      } else {
        this.post.replies.splice(index, 1)
      }
    },
    addReplyChild(item) {
      if (this.target === 0) {
        this.post.nestedReplies.push(item)
      } else {
        this.post.replies.push(item)
      }
    },
    scrollTop() {
      this.$refs.detail.scrollTo({top: 0, behavior: 'smooth'})
    },
  }
}
</script>

<style lang="less">
.htmlContent {
  width: 100%;

  img {
    max-width: 100%;
  }
}

.sticky {
  position: sticky;
  bottom: -2px;
}

.sticky[stuck] {
  box-shadow: 0 2px 20px rgb(0 0 0 / 35%) !important;
}

</style>
<style scoped lang="less">
@import "src/assets/less/variable.less";

.line {
  border-bottom: 1px solid @border;
}

.my-box {
  box-shadow: 0 2px 3px rgb(0 0 0 / 10%);
  border-radius: @border-radius;
  background: white;
  margin-bottom: 2rem;
  width: 100%;
}

.my-cell {
  padding: 1rem;
  font-size: 1.4rem;
  line-height: 150%;
  text-align: left;
  border-bottom: 1px solid @border;
}

.post-detail {
  text-align: start;
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(46, 47, 48, .8);
  overflow: auto;
  font-size: 1.4rem;

  @width: 77rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .main {
    display: flex;
    padding: 6rem 12rem 15rem 12rem;
    //margin: auto;
    //box-sizing: border-box;
    min-height: 100%;
    background: #e2e2e2;
    position: relative;

    > .left {
      width: @width;

      .left-wrapper {
        width: 100%;
        padding-bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .post-wrapper {

        .base-info {
          padding: 1rem;
          box-sizing: border-box;
          border-bottom: 1px solid @border;

          .avatar {
            float: right;
            border-radius: .4rem;
            height: 7.3rem;
          }

          .post-nodes {
            font-size: 1.5rem;
            margin-bottom: .8rem;
            display: flex;
          }

          .title {
            margin-bottom: 1rem;
            line-height: 150%;
            font-size: 2.4rem;
            color: black;
          }

          .post-author {
          }
        }

        .content {
          color: black;
          word-break: break-word;
          line-height: 1.6;
          border-bottom: 1px solid @border;

          .baseContent {
            padding: 1rem;
          }
        }

        .toolbar-wrapper {
          height: 4rem;
          padding-left: .6rem;
          display: flex;
          align-items: center;
          //background: linear-gradient(to bottom, #eee 0, #ccc 100%);
        }
      }


      .editor-wrapper {

        .float {
          margin-right: 2rem;
        }

        .w {
          padding: @space;
        }
      }

      .comment-wrapper {
        padding-bottom: 1.8rem;

        .comments {
          width: 100%;
          box-sizing: border-box;
          padding: 0 1rem;
        }

      }

      .sort-select {
        position: relative;

        .target {
          color: #0079d3;
          font-size: 1.2rem;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          cursor: pointer;

          svg {
            @width: 1.4rem;
            width: @width;
            height: @width;
            margin-left: .5rem;
          }
        }

        .options {
          box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
          background: white;
          z-index: 9998;
          border-radius: .5rem;
          cursor: pointer;
          font-size: 1.4rem;
          position: absolute;
          top: 2.6rem;
          left: 2.7rem;
          width: 8rem;
          color: @link-color;

          .option {
            padding: .8rem 1.4rem;

            &.active {
              color: #0079d3;
            }

            &:hover {
              background: #e9f5fd;
            }
          }
        }
      }

      .loading-wrapper {
        height: 20rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #no-comments-yet {
        color: #a9a9a9;
        font-weight: bold;
        text-align: center;
        width: 100%;
        margin-bottom: 2rem;
        box-sizing: border-box;
      }
    }

    > .right {
      //width: 27rem;
      //height: 20rem;
      //background: red;
      margin-left: 2rem;
      margin-top: -2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .call-list {
      z-index: 9;
      position: absolute;
      top: 12rem;
      border: 1px solid #ccc;
      background-color: #fff;
      box-shadow: 0 5px 15px rgb(0 0 0 / 10%);
      overflow: hidden;
      max-height: 30rem;
      min-width: 8rem;
      box-sizing: content-box;

      .call-item {
        border-top: 1px solid #ccc;
        height: 3rem;
        display: flex;
        padding: 0 1rem;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        box-sizing: border-box;

        .select {
          background-color: #f0f0f0;
          text-decoration: none;
        }

        &:hover {
          .select();
        }

        &.select {
          .select();
        }

        &:nth-child(1) {
          border-top: 1px solid transparent;
        }
      }
    }
  }

  @media screen and (max-width: 1500px) {
    @width: 65vw;
    .main {
      padding: 8rem;
      padding-bottom: 15rem;

      > .left {
        width: @width;
      }

      > .right {
        display: none;
      }
    }
  }
  @media screen and (max-width: 1280px) {
    @width: 75vw;
    .main {
      padding: 5rem;
      padding-bottom: 15rem;

      > .left {
        width: @width;
      }

      > .right {
        display: none;
      }
    }
  }

  .scroll-top {
    position: fixed;
    bottom: 3rem;
    z-index: 99;
  }
}
</style>
