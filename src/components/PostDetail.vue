<template>
  <div class="post-detail"
       ref="detail"
       @keydown.esc="close()"
       v-show="modelValue"
       :class="[isNight?'isNight':'']"
       @click="close('space')">
    <div ref="main" class="main" tabindex="1" @click.stop="()=>void 0">
      <div class="left">
        <div class="left-wrapper">
          <div class="my-box post-wrapper">
            <div v-html="post.headerTemplate"></div>
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
          <div class="my-box comment-wrapper" v-if="replies.length || loading">
            <div class="my-cell flex flex-end">
              <div class="radio-group2">
                <div class="radio"
                     @click="changeOption(0)"
                     :class="displayType === 0?'active':''">楼中楼
                </div>
                <div class="radio"
                     @click="changeOption(1)"
                     :class="displayType === 1?'active':''">感谢
                </div>
                <div class="radio"
                     @click="changeOption(2)"
                     :class="displayType === 2?'active':''">V2原版
                </div>
              </div>
            </div>
            <div class="my-cell flex">
                <span class="gray">{{ post.replyCount }} 条回复
                 <span v-if="post.createDate"> &nbsp;<strong class="snow">•</strong> &nbsp;{{ post.createDate }}</span>
                </span>
              <div class="fr" v-html="post.fr"></div>
            </div>
            <div class="loading-wrapper" v-if="loading">
              <div :class="[isNight?'loading-b':'loading-c']"></div>
            </div>
            <div class="comments" ref="comments" v-else>
              <Comment v-for="(item,index) in replies"
                       :key="item.floor"
                       :style="`border-bottom: 1px solid ${isNight?'#22303f':'#e2e2e2'};  padding: 1rem;margin-top: 0;`"
                       v-model="replies[index]"/>
            </div>
          </div>
          <div v-else id="no-comments-yet">目前尚无回复</div>
          <div v-if="isLogin" class="my-box editor-wrapper" ref="replyBox" :class="{'sticky':isSticky}">
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
                  @click="isSticky = true"/>
            </div>
          </div>
        </div>
      </div>
      <div class="right" ref="right">
        <div id="Rightbar" v-html="post.RightbarHTML"></div>
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

      <div class="close-btn" @click="close('btn')">
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8L40 40" :stroke="isNight?'#ffffff':'#000000'" stroke-width="4" stroke-linecap="round"
                stroke-linejoin="round"/>
          <path d="M8 40L40 8" :stroke="isNight?'#ffffff':'#000000'" stroke-width="4" stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
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
import {computed} from "vue";

export default {
  name: "detail",
  components: {
    Comment,
    PostEditor,
    Point,
    Toolbar,
    BaseHtmlRender
  },
  inject: ['allReplyUsers', 'post', 'clone', 'isLogin'],
  provide() {
    return {
      postDetailWidth: computed(() => this.$refs.comments?.getBoundingClientRect().width || 0)
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      default() {
        return false
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    isNight: {
      type: Boolean,
      default() {
        return false
      }
    },
    closePostDetailBySpace: {
      type: Boolean,
      default() {
        return true
      }
    },
    displayType: 0,
  },
  data() {
    return {
      isSticky: false,
      selectCallIndex: 0,
      postDetailWidth: 0,
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
      if (this.displayType === 0) return this.post.nestedReplies
      if (this.displayType === 1) {
        return this.clone(this.post.nestedReplies).sort((a, b) => b.thankCount - a.thankCount)
      }
      if (this.displayType === 2) return this.post.replies
      return []
    },
  },
  watch: {
    modelValue: {
      handler(newVal) {
        if (!newVal) {
          window.win().doc.body.style.overflow = 'unset'
          this.isSticky = false
          if (window.win().pageType === 'home' || window.win().pageType === 'nodePage') {
            window.history.back();
          }
        } else {
          window.win().doc.body.style.overflow = 'hidden'
          this.$nextTick(() => {
            this.$refs.main.focus()
            this.$refs.detail.scrollTo({top: 0})
          })
        }
      },
    }
  },
  mounted() {
    if (this.isLogin) {
      const observer = new IntersectionObserver(
          ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
          {threshold: [1]}
      );
      observer.observe(this.$refs.replyBox);
      window.win().addEventListener('keydown', this.onKeyDown)
    }

    // let Rightbar = window.win().doc.querySelector('#Rightbar')
    // if (Rightbar) {
    //   this.$refs.right.append(Rightbar.cloneNode(true))
    // }
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
    close(from) {
      if (from === 'space') {
        if (this.closePostDetailBySpace) {
          this.$emit('update:modelValue', false)
        }
      } else {
        this.$emit('update:modelValue', false)
      }
    },
    setCall(e) {
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
      this.$emit('update:displayType', item)
    },
    addThank() {
      eventBus.emit(CMD.CHANGE_POST_THANK, {id: this.post.id, type: 'add'})
    },
    recallThank() {
      eventBus.emit(CMD.CHANGE_POST_THANK, {id: this.post.id, type: 'recall'})
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

  &.isNight {
    background: rgba(46, 47, 48, .8);

    .main {
      background: #22303f;

      @bg: #18222d;
      @bg1: #22303f;
      @line: #22303f;
      @text: #d1d5d9;

      .my-box {
        color: white;
        background: @bg;

        .title, .content {
          color: @text !important;
        }

        .base-info, .content {
          border: 1px solid @line !important;
        }
      }

      :deep(.subtle) {
        .fade {
          color: #b2c3d4 !important;
        }

        .topic_content {
          color: @text !important;
        }
      }

      .my-cell {
        border-bottom: 1px solid @line !important;
      }

      :deep(.comment) {
        background: @bg;

        .expand-line {
          &:after {
            border-right: 1px solid #202c39 !important;
          }

          &:hover {
            &:after {
              border-right: 2px solid #0079D3 !important;
            }
          }
        }

        .comment-content {
          background: @bg !important;

          .w > .text {
            color: #d1d5d9 !important;
          }
        }
      }

      :deep(.Author-right) {

        .toolbar {
          &:hover {
            background: @bg !important;
          }
        }

        .tool {
          background: @bg1 !important;
        }
      }

      :deep(.point) {
        margin-left: .5rem;

        svg {
          &:hover {
            background: @bg1;
          }
        }

        .num {
          color: #d1d5d9 !important;
        }
      }

      :deep(.floor) {
        background: #393f4e !important;
        color: #d1d5d9 !important;
      }

      .editor-wrapper {
        background: #393f4e !important;
      }

      :deep(.post-editor-wrapper) {
        //border: 1px solid #507092;
        .post-editor {
          background: @bg;
          border: transparent;
          color: white;
        }

        .toolbar {
          background: #393f4e !important;
        }
      }

      .call-list {
        background: @bg1;

        .call-item {
          border-top: 1px solid @bg;

          .select {
            background-color: #393f4e;
            text-decoration: none;
          }

          &:hover {
            .select();
          }

          &.select {
            .select();
          }

        }
      }
    }
  }

  .main {
    display: flex;
    justify-content: flex-end;
    padding: 6rem 12rem 15rem 12rem;
    //margin: auto;
    //box-sizing: border-box;
    //min-height: 100%;
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
        .toolbar-wrapper {
          border-top: 1px solid #e2e2e2;
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
        .comments {
          width: 100%;
          box-sizing: border-box;
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

  .close-btn {
    cursor: pointer;
    position: fixed;
    top: 6rem;
    transform: translateX(4rem);

    //margin-left: 50rem;
  }
}
</style>
