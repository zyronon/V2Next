<template>
  <div class="post-detail"
       ref="detail"
       @keydown.esc="close()"
       v-show="modelValue"
       :class="[isNight?'isNight':'',pageType]"
       @click="close('space')">
    <div ref="main" class="main" tabindex="1" @click.stop="()=>void 0">
      <div class="main-wrapper" :style="{width:config.postWidth}">
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

        <div class="my-box" v-if="topReplyList.length && config.showTopReply">
          <div class="my-cell flex">
            <span class="gray">高赞回复</span>
            <div class="top-reply">
              <PopConfirm title="关闭后不再默认显示，可在设置里重新打开，确认关闭？"
                          @confirm="config.showTopReply = false"
              >
                <i class="fa fa-times"
                   aria-hidden="true"></i>
              </PopConfirm>
              <Tooltip title="收起高赞回复">
                <i class="fa fa-compress" aria-hidden="true" @click="collapseTopReplyList"></i>
              </Tooltip>
            </div>
          </div>
          <div class="comments" ref="topReply">
            <Comment v-for="(item,index) in topReplyList"
                     :key="item.floor"
                     :style="`border-bottom: 1px solid ${isNight?'#22303f':'#f2f2f2'};  padding: 1rem;margin-top: 0;`"
                     v-model="topReplyList[index]"/>
          </div>
        </div>

        <div class="my-box comment-wrapper">
          <template v-if="post.replyList.length ||loading">
            <div class="my-cell flex" :class="pageType !== 'post'&&'flex-end'" v-if="config.showToolbar">
              <div class="flex" v-if="pageType === 'post'">
                默认显示楼中楼：
                <div class="switch" :class="{active:config.autoOpenDetail}"
                     @click="config.autoOpenDetail = !config.autoOpenDetail"/>
              </div>
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
                     @click="changeOption(3)"
                     :class="displayType === 3?'active':''">只看楼主
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
          </template>

          <template v-if="replyList.length || loading">
            <div class="loading-wrapper" v-if="loading">
              <div :class="[isNight?'loading-b':'loading-c']"></div>
            </div>
            <div class="comments" ref="comments" v-else>
              <template v-if="modelValue">
                <Comment v-for="(item,index) in replyList"
                         :key="item.floor"
                         :style="`border-bottom: 1px solid ${isNight?'#22303f':'#f2f2f2'};  padding: 1rem;margin-top: 0;`"
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
      <div class="scroll-top button gray" @click.stop="scrollTop">
        <i class="fa fa-long-arrow-up" aria-hidden="true"></i>
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
import {PageType} from "@/types";
import Tooltip from "@/components/Tooltip.vue";
import PopConfirm from "@/components/PopConfirm.vue";

export default {
  name: "detail",
  components: {
    PopConfirm,
    Comment,
    PostEditor,
    Point,
    Toolbar,
    BaseHtmlRender,
    Tooltip
  },
  inject: ['allReplyUsers', 'post', 'isLogin', 'config', 'pageType'],
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
      },
    }
  },
  computed: {
    filterCallList() {
      if (this.showCallList) {
        if (this.replyText) {
          return ['管理员', '所有人'].concat(this.allReplyUsers).filter(i => i.search(this.replyText) > -1)
        }
        return ['管理员', '所有人'].concat(this.allReplyUsers)
      }
      return []
    },
    topReplyList() {
      return this.post.replyList
          .filter(v => v.thankCount > 0)
          .slice(0, 3)
          .sort((a, b) => b.thankCount - a.thankCount)
    },
    replyList() {
      if (this.displayType === 0) return this.post.nestedReplies
      if (this.displayType === 1) {
        return window.clone(this.post.nestedReplies).sort((a, b) => b.thankCount - a.thankCount)
      }
      if (this.displayType === 2) return this.post.replyList
      if (this.displayType === 3) return this.post.replyList.filter(v => v.username === this.post.member?.username)
      return []
    },
  },
  watch: {
    'post.id'(n, o) {
      if (this.$refs["post-editor"]) {
        this.$refs["post-editor"].content = ''
      }
    },
    modelValue: {
      handler(newVal) {
        console.log('modelValue', newVal)
        if (this.pageType === PageType.Post) return
        if (newVal) {
          document.body.style.overflow = 'hidden'
          this.$nextTick(() => {
            this.$refs?.main?.focus()
            this.$refs?.detail?.scrollTo({top: 0})
          })
        } else {
          document.body.style.overflow = 'unset'
          this.isSticky = false
          if ((this.pageType === PageType.Home || this.pageType === PageType.Node) &&
              window.location.pathname !== '/'
          ) {
            window.history.back();
          }
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
    eventBus.on(CMD.SHOW_CALL, (val) => {
      if (val.show) {
        // console.log('va', val)
        this.showCallList = true
        this.replyText = val.text
        //top值要加上滚动的距离，因为val传的top是相对于视口，而不是父div
        //left要减去父级的left，原理同上
        if (this.pageType === PageType.Post) {
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
  },
  beforeUnmount() {
    window.win().removeEventListener('keydown', this.onKeyDown)
    eventBus.off(CMD.SHOW_CALL)
  },
  methods: {
    collapseTopReplyList() {
      $(this.$refs.topReply).slideToggle('fast')
    },
    goBottom() {
      this.isSticky = false
      setTimeout(() => {
        if (this.pageType === PageType.Post) {
          let body = $('body , html')
          let scrollHeight = body.prop("scrollHeight");
          body.animate({scrollTop: scrollHeight - 850}, 300);
        } else {
          this.$refs.detail.scrollTo({top: this.$refs.detail.scrollHeight, behavior: 'smooth'})
        }
      })
    },
    close(from) {
      if (this.pageType === PageType.Post) return
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
      if (this.pageType === PageType.Post) {
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

    .main-wrapper {
      width: @width;
      padding-bottom: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;

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
    padding: 0.8rem 1.4rem;
    transform: translateX(6rem);
    font-size: 2rem;
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
    color: @main-color;
    cursor: pointer;
    font-size: 2rem;
    display: flex;
    gap: 2rem;
  }
}
</style>
