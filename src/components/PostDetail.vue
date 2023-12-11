<template>
  <div class="post-detail"
       ref="detail"
       @keydown.esc="close()"
       v-show="modelValue"
       :class="[isNight?'isNight':'',pageType]"
       @scroll="debounceScroll"
       @click="close('space')">
    <div ref="main" class="main" tabindex="1" @click.stop="stop">
      <div class="main-wrapper" ref="mainWrapper" :style="{width:config.postWidth}">
        <div class="my-box post-wrapper">
          <BaseHtmlRender :html="post.headerTemplate"/>
          <div class="toolbar-wrapper">
            <Point
                @addThank="addThank"
                @recallThank="recallThank"
                :full="false"
                :item="{
                isThanked:post.isThanked,
                thankCount:post.thankCount,
                username:post.username
              }"
                :api-url="'topic/'+post.id"/>
            <Toolbar @reply="isSticky = !isSticky"/>
          </div>
        </div>

        <div class="my-box" v-if="topReply.length && config.showTopReply">
          <div class="my-cell flex">
            <span class="gray">高赞回复</span>
            <div class="top-reply">
              <Tooltip :title="`统计点赞数大于等于${config.topReplyLoveMinCount}个的回复，可在设置中调整`">
                <i class="fa fa-info" @click="showConfig()"/>
              </Tooltip>
              <PopConfirm title="关闭后不再默认显示，可在设置里重新打开，确认关闭？"
                          @confirm="config.showTopReply = false">
                <i class="fa fa-times"/>
              </PopConfirm>
              <Tooltip title="收起高赞回复">
                <i class="fa fa-compress" @click="collapseTopReplyList"/>
              </Tooltip>
            </div>
          </div>
          <div ref="topReply">
            <Comment v-for="(item,index) in topReply"
                     :key="item.floor"
                     type="top"
                     v-model="topReply[index]"/>
          </div>
        </div>

        <div class="my-box comment-wrapper">
          <template v-if="post.replyList.length ||loading">
            <div class="my-cell flex" v-if="config.showToolbar">
              <div class="radio-group2" :class="{isNight}">
                <Tooltip title="不隐藏@用户">
                  <div class="radio"
                       @click="changeOption(CommentDisplayType.FloorInFloor)"
                       :class="displayType === CommentDisplayType.FloorInFloor?'active':''">楼中楼(@)
                  </div>
                </Tooltip>
                <Tooltip title="隐藏第一个@用户，双击内容可显示原文">
                  <div class="radio"
                       @click="changeOption(CommentDisplayType.FloorInFloorNoCallUser)"
                       :class="displayType === CommentDisplayType.FloorInFloorNoCallUser?'active':''">楼中楼
                  </div>
                </Tooltip>
                <Tooltip title="重复显示楼中楼的回复">
                  <div class="radio"
                       @click="changeOption(CommentDisplayType.FloorInFloorNested)"
                       :class="displayType === CommentDisplayType.FloorInFloorNested?'active':''">冗余楼中楼
                  </div>
                </Tooltip>
                <div class="radio"
                     @click="changeOption(CommentDisplayType.Like)"
                     :class="displayType ===CommentDisplayType.Like?'active':''">感谢
                </div>
                <div class="radio"
                     @click="changeOption(CommentDisplayType.OnlyOp)"
                     :class="displayType === CommentDisplayType.OnlyOp?'active':''">只看楼主
                </div>
                <div class="radio"
                     @click="changeOption(CommentDisplayType.V2exOrigin)"
                     :class="displayType === CommentDisplayType.V2exOrigin?'active':''">V2原版
                </div>
              </div>
              <div class="read-notice" v-if="read.floor || read.total">
                <span>上次打开：</span>
                <template v-if="read.floor">
                  <span>阅读到<b>{{ read.floor }}</b>楼</span>
                  <div class="jump jump1" @click="jump(read.floor)">
                    <i class="fa fa-long-arrow-down"/>
                  </div>
                </template>
                <span>总楼层<b>{{ read.total }}</b></span>
                <div class="jump" @click="jump(read.total)">
                  <i class="fa fa-long-arrow-down"/>
                </div>
              </div>
            </div>
            <div class="my-cell flex">
                <span class="gray">{{ post.replyCount }} 条回复
                 <span v-if="post.createDate"> &nbsp;<strong class="snow">•</strong> &nbsp;{{ post.createDate }}</span>
                </span>
              <div class="fr" v-html="post.fr"></div>
            </div>
          </template>

          <template v-if="replyList.length || loading">
            <div class="loading-wrapper" v-if="loading">
              <div :class="[isNight?'loading-b':'loading-c']"></div>
            </div>
            <div class="comments" v-else>
              <template v-if="modelValue">
                <Comment v-for="(item,index) in replyList"
                         :key="item.floor"
                         v-model="replyList[index]"/>
              </template>
            </div>
          </template>
        </div>

        <div v-if="!(replyList.length || loading)" id="no-comments-yet">目前尚无回复</div>

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
                @close="goBottom"
                ref="post-editor"
                useType="reply-post"
                @click="isSticky = true"/>
          </div>
        </div>
      </div>
      <div class="relationReply" v-if="showRelationReply" @click="close('space')">
        <div class="my-cell flex" @click.stop="stop">
          <span class="gray">上下文</span>
          <div class="top-reply">
            <i class="fa fa-times" @click="showRelationReply = false"/>
          </div>
        </div>
        <div class="comments" @click.stop="stop">
          <SingleComment v-for="(item,index) in relationReply"
                         :is-right="item.username === targetUser.right"
                         :key="item.floor"
                         :comment="item"/>
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
      <div class="close-btn" v-if="config.closePostDetailBySpace" @click="close('btn')">
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
      <div class="scroll-top button" @click.stop="scrollTop">
        <i class="fa fa-long-arrow-up" aria-hidden="true"></i>
      </div>
      <div class="scroll-to button" @click.stop="jump(currentFloor)">
        <i class="fa fa-long-arrow-down"/>
        <input type="text" v-model="currentFloor" @click.stop="stop">
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
import eventBus from "@/utils/eventBus.js";
import {CMD} from "@/utils/type";
import {computed, nextTick} from "vue";
import {CommentDisplayType, PageType} from "@/types";
import Tooltip from "@/components/Tooltip.vue";
import PopConfirm from "@/components/PopConfirm.vue";
import SingleComment from "@/components/SingleComment.vue";
import {debounce} from "@/utils/index.js";

export default {
  name: "detail",
  components: {
    SingleComment,
    PopConfirm,
    Comment,
    PostEditor,
    Point,
    Toolbar,
    BaseHtmlRender,
    Tooltip
  },
  inject: ['allReplyUsers', 'post', 'isLogin', 'config', 'pageType', 'isNight', 'showConfig'],
  provide() {
    return {
      postDetailWidth: computed(() => this.postDetailWidth)
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
    displayType: CommentDisplayType.FloorInFloorNoCallUser,
  },
  data() {
    return {
      isSticky: false,
      selectCallIndex: 0,
      postDetailWidth: 0,
      showCallList: false,
      showRelationReply: false,
      replyText: '',
      callStyle: {
        top: 0,
        left: 0
      },
      targetUser: {
        left: [],
        right: '',
        rightFloor: -1
      },
      debounceScroll: () => {
      },
      read: {
        floor: 0,
        total: 0
      },
      currentFloor: 1
    }
  },
  computed: {
    CommentDisplayType() {
      return CommentDisplayType
    },
    isPost() {
      return this.pageType === PageType.Post
    },
    filterCallList() {
      if (this.showCallList) {
        let list = ['管理员', '所有人'].concat(this.allReplyUsers)
        if (this.replyText) return list.filter(i => i.search(this.replyText) > -1)
        return list
      }
      return []
    },
    topReply() {
      return this.post.replyList
          .filter(v => v.thankCount >= this.config.topReplyLoveMinCount)
          .sort((a, b) => b.thankCount - a.thankCount)
          .slice(0, this.config.topReplyCount)
    },
    replyList() {
      if ([CommentDisplayType.FloorInFloor, CommentDisplayType.FloorInFloorNoCallUser].includes(this.displayType)) return this.post.nestedReplies
      if (this.displayType === CommentDisplayType.Like) {
        return window.clone(this.post.nestedReplies).sort((a, b) => b.thankCount - a.thankCount)
      }
      if (this.displayType === CommentDisplayType.V2exOrigin) return this.post.replyList
      if (this.displayType === CommentDisplayType.FloorInFloorNested) return this.post.nestedRedundReplies
      if (this.displayType === CommentDisplayType.OnlyOp) return this.post.replyList.filter(v => v.username === this.post.member?.username)
      return []
    },
    //关联回复
    relationReply() {
      if (this.targetUser.left.length && this.targetUser.right) {
        return this.post.replyList
            .filter(v => {
              if (this.targetUser.left.includes(v.username)) {
                //如果超过目标楼层，只找回复目标的
                if (v.floor > this.targetUser.rightFloor) {
                  if (v.replyUsers.includes(this.targetUser.right)) {
                    return true
                  }
                } else {
                  return true
                }
              }
              if (v.username === this.targetUser.right) {
                for (let i = 0; i < this.targetUser.left.length; i++) {
                  if (v.replyUsers.includes(this.targetUser.left[i])) {
                    return true
                  }
                }
              }
            })
      }
      return []
    }
  },
  watch: {
    'post.id'(n, o) {
      if (this.$refs["post-editor"]) {
        this.$refs["post-editor"].content = ''
        nextTick(() => {
          this.$refs?.detail?.scrollTo({top: 0})
        })
      }
    },
    modelValue: {
      handler(newVal) {
        if (this.isPost) return
        if (newVal) {
          document.body.style.overflow = 'hidden'
          this.read = this.post.read
          this.currentFloor = 1
          nextTick(() => {
            this.$refs?.main?.focus()
          })
        } else {
          this.$emit('saveReadList')
          document.body.style.overflow = 'unset'
          this.isSticky = false
          this.showRelationReply = false
          if ((this.pageType === PageType.Home
                  || this.pageType === PageType.Node
                  || this.pageType === PageType.Member
              ) &&
              window.location.pathname !== '/'
          ) {
            window.history.back();
          }
        }
      },
    }
  },
  mounted() {
    setTimeout(() => {
      this.postDetailWidth = this.$refs.mainWrapper?.getBoundingClientRect().width || 0
    })
    this.debounceScroll = debounce(this.scroll, 300, false)
    if (this.isLogin) {
      const observer = new IntersectionObserver(
          ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
          {threshold: [1]}
      );
      observer.observe(this.$refs.replyBox);
      window.addEventListener('keydown', this.onKeyDown)
    }
    eventBus.on(CMD.SHOW_CALL, (val) => {
      if (val.show) {
        // console.log('va', val)
        this.showCallList = true
        this.replyText = val.text
        //top值要加上滚动的距离，因为val传的top是相对于视口，而不是父div
        //left要减去父级的left，原理同上
        if (this.isPost) {
          this.callStyle.top = val.top + $(window.win()).scrollTop() + -40 + 'px'
        } else {
          this.callStyle.top = val.top + $('.post-detail').scrollTop() + 15 + 'px'
        }
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
    eventBus.on(CMD.RELATION_REPLY, (val) => {
      this.targetUser = val
      this.showRelationReply = true
    })
    eventBus.on(CMD.JUMP, this.jump)
    if (this.isPost) {
      window.addEventListener('scroll', this.debounceScroll)
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    eventBus.off(CMD.SHOW_CALL)
  },
  methods: {
    scroll() {
      if (!this.config.rememberLastReadFloor) return
      let height = window.innerHeight * 0.3
      let comments = $('.comments  .comment')
      let forCount = 0
      for (let i = 0; i < comments.length; i++) {
        forCount++
        let ins = comments[i]
        let rect = ins.getBoundingClientRect()
        if (rect.top > height) {
          let lastReadFloor = Number(ins.dataset['floor']);
          console.log('当前阅读楼层', lastReadFloor)
          eventBus.emit(CMD.ADD_READ, {
            floor: lastReadFloor > 3 ? lastReadFloor : 0,
            total: this.post.replyList.length
          })
          if (lastReadFloor > 3) {
            this.read.floor = 0
          }
          break
        }
      }
      if (forCount === comments.length) {
        console.log('看到最后了')
        eventBus.emit(CMD.ADD_READ, {
          floor: forCount,
          total: this.post.replyList.length
        })
      }
    },
    stop(e) {
    },
    jump(floor) {
      try {
        floor = Number(floor)
      } catch (e) {
      }
      if (!floor) return;
      if (!this.post.replyList.length) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '没有回复可跳转！'})
        this.read.floor = 0
        return
      }
      if (floor > this.post.replyList.length) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '没有找到对应回复！'})
        this.read.floor = 0
        return;
      }
      let comment = $(`.c_${floor}`)
      if (!comment.length) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '没有找到对应回复！'})
        this.read.floor = 0
        return
      }
      comment[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
      comment.addClass('ding')
      this.read.floor = 0
      this.currentFloor = floor + 1
      setTimeout(() => {
        comment.removeClass('ding')
      }, 2000)
    },
    jumpLastRead(floor) {
      if (this.config.autoJumpLastReadFloor) {
        if (!floor) return
        setTimeout(() => {
          console.log('上次跳转', floor)
          this.jump(floor)
          eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '已跳转到上次阅读位置'})
        }, 300)
      }
    },
    collapseTopReplyList() {
      $(this.$refs.topReply).slideToggle('fast')
    },
    goBottom() {
      this.isSticky = false
      setTimeout(() => {
        if (this.isPost) {
          let body = $('body , html')
          let scrollHeight = body.prop("scrollHeight");
          body.animate({scrollTop: scrollHeight - 850}, 300);
        } else {
          this.$refs.detail.scrollTo({top: this.$refs.detail.scrollHeight, behavior: 'smooth'})
        }
      })
    },
    close(from) {
      if (this.isPost) return
      if (from === 'space') {
        if (this.config.closePostDetailBySpace) {
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
      if (this.isPost) {
        $("body , html").animate({scrollTop: 0}, 300);
      } else {
        this.$refs.detail.scrollTo({top: 0, behavior: 'smooth'})
      }
    },
  }
}
</script>

<style lang="less">

.sticky {
  position: sticky;
  bottom: -2px;
  z-index: 2;
}

.sticky[stuck] {
  box-shadow: 0 2px 20px rgb(0 0 0 / 35%) !important;
}
</style>

<style scoped lang="less">
@import "src/assets/less/index.less";
@import "src/assets/less/variable.less";

.Post {
  position: unset !important;
  background: transparent !important;
  overflow: unset !important;

  .main {
    background: transparent !important;
    padding: unset !important;
    width: 100% !important;
  }

  .close-btn {
    display: none;
  }
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

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  :deep(.subtle){
    background-color: rgb(236 253 245 / 90%);
    border-left: 4px solid #a7f3d0;
  }

  &.isNight {
    background: rgba(46, 47, 48, .8);

    .main {
      background: #22303f;

      @bg: #18222d;
      @bg1: #22303f;
      @line: #22303f;
      @text: #d1d5d9;

      .toolbar-wrapper {
        border-top: unset !important;
      }

      .button.gray {
        background: @bg !important;
        border: 1px solid @bg !important;
      }

      .relationReply {
        .comments, .my-cell {
          background: @bg;
        }

        .comment {
          border-bottom: 1px solid @line-color;
        }

        color: white;
      }

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
        background-color: rgb(26,51,50);
        border-left: 4px solid #047857;

      }

      .my-cell {
        border-bottom: 1px solid @line !important;
      }

      @line-color: #22303f;

      :deep(.isLevelOne) {
        border-bottom: 1px solid @line-color;
      }

      :deep(.comment) {

        .expand-line {
          &:after {
            border-right: 1px solid @line-color !important;
          }

          &:hover {
            &:after {
              border-right: 2px solid #0079D3 !important;
            }
          }
        }

        .comment-content {

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

      .scroll-to, .close-btn, .scroll-top, .top-reply {
        //color: rgb(72, 98, 126);
        color: #9caec7;
      }

      :deep(.tool) {
        &:hover {
          background-color: #22303f !important;
        }
      }

    }
  }

  @width: 77rem;

  .main {
    display: flex;
    justify-content: flex-end;
    padding: 3rem 8rem 15rem 8rem;
    //margin: auto;
    //box-sizing: border-box;
    //min-height: 100%;
    background: #e2e2e2;
    position: relative;
    outline: none;

    .main-wrapper {
      width: @width;
      padding-bottom: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .post-wrapper {
        .toolbar-wrapper {
          border-top: 1px solid #e2e2e2;
          height: 3.4rem;
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

    .relationReply {
      position: fixed;
      width: 25vw;
      top: 6.5rem;
      bottom: 15rem;
      z-index: 99;
      transform: translateX(calc(100% + 2rem));
      font-size: 2rem;
      @r: 0.5rem;
      overflow: hidden;

      .my-cell {
        background: white;
        border-radius: @r @r 0 0;
      }

      .comments {
        max-height: calc(100% - 4.2rem);
        overflow: auto;
        background: white;
        border-radius: 0 0 @r @r;
        //box-shadow: 0 0 10px 0 #c7c7c7;
      }
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
    .main-wrapper {
      width: @width !important;
    }
  }
  @media screen and (max-width: 1280px) {
    @width: 75vw;
    .main-wrapper {
      width: @width !important;
    }
  }

  .scroll-top {
    position: fixed;
    bottom: 10rem;
    z-index: 99;
    padding: .6rem .2rem;
    width: 3.5rem;
    transform: translateX(6rem);
    font-size: 2rem;
    background: #f1f1f1;
    border: none;
    color: darkgrey;
  }

  .scroll-to {
    .scroll-top;
    bottom: 15rem;
    display: flex;
    flex-direction: column;

    input {
      margin-top: .5rem;
      height: 2rem;
      width: 3.3rem;
      font-size: 1.4rem;
      text-align: center;
      color: gray;
    }
  }

  .read-notice {
    display: flex;
    align-items: center;
    color: gray;

    .jump {
      background: #f1f1f1;
      color: gray;
      padding: 0.3rem 1rem;
      border-radius: .4rem;
      margin: 0 1rem;
      cursor: pointer;
    }
  }

  .close-btn {
    color: @main-color;
    cursor: pointer;
    position: fixed;
    top: 3rem;
    transform: translateX(4rem);
    font-size: 2rem;
  }

  .top-reply {
    color: @bg-color;
    cursor: pointer;
    font-size: 2rem;
    display: flex;

    i {
      padding: 0 1rem;
    }
  }
}
</style>
