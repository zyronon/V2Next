<template>
  <div class="comment" :class="myClass" ref="comment" :data-floor="floor">
    <Author v-model="expand"
            :comment="modelValue"
            @reply="edit = !edit"
            :type="type"
            @hide="hide"
    />
    <div v-if="cssStyle && !expand" class="more ago" @click="expand = !expand">
      由于嵌套回复层级太深，自动将后续回复隐藏
    </div>
    <div class="comment-content-w" v-if="expand" :style="cssStyle">
      <div v-if="cssStyle" class="more ago" @click="expand = !expand">
        由于嵌套回复层级太深，自动将以下回复移至可见范围
      </div>
      <div class="comment-content">
        <div class="left expand-line" @click="toggle"></div>
        <div class="right">
          <div class="w">
            <div class="wrong-wrapper" v-if="modelValue.isWrong">
              <span
                  @click="expandWrong = !expandWrong"
                  title="点击楼层号查看提示"
              >
                <a :href="'/member/'+modelValue.replyUsers[0]">@{{ modelValue.replyUsers[0] }}&nbsp;&nbsp;</a>
              <span class="del-line">#{{ modelValue.replyFloor }} </span>
              <i class="fa fa-question-circle-o wrong-icon" aria-hidden="true"></i>
              </span>
              <div class="warning" v-if="expandWrong">
                这条回复似乎有点问题，指定的楼层号与@的人对应不上
                <br>
                原因可能有下面几种：
                <br>
                一、屏蔽用户导致楼层塌陷：你屏蔽了A，自A以后的回复的楼层号都会减1
                <br>
                二、忽略回复导致楼层塌陷：原理同上
                <br>
                三、层主回复时指定错了楼层号（同一，层主屏蔽了别人，导致楼层塌陷）
                <br>
                四、脚本解析错误，请在<a href="https://github.com/zyronon/v2ex-script/discussions/7"
                                       target="_blank">这里</a>反馈
              </div>
            </div>
            <template v-if="config.commentDisplayType === 4 && this.type !== 'top'">
              <div v-if="showOrigin" @dblclick="toggleContent">
                <p>---原文---</p>
                <BaseHtmlRender class="reply_content" :html="modelValue.reply_content"/>
                <p>-----------</p>
              </div>
              <BaseHtmlRender class="reply_content" @dblclick="toggleContent"
                              :html="modelValue.hideCallUserReplyContent"/>
            </template>
            <BaseHtmlRender v-else class="reply_content" :html="modelValue.reply_content"/>
            <PostEditor v-if="edit"
                        @close="edit = false"
                        :replyInfo="replyInfo"
                        :replyUser="modelValue.username"
                        :replyFloor="modelValue.floor"/>
          </div>
          <div class="simple-wrapper">
            <Comment v-for="(item,index) in modelValue.children"
                     v-model="modelValue.children[index]"
                     :key="index"/>
          </div>
        </div>
      </div>
      <div v-if="cssStyle" class="more ago" @click="expand = !expand">
        由于嵌套回复层级太深，自动将以上回复移至可见范围
      </div>
    </div>
  </div>
</template>
<script>
import Author from "./Author";
import PostEditor from "./PostEditor";
import Point from "./Point";
import eventBus from "@/utils/eventBus.js";
import BaseHtmlRender from "@/components/BaseHtmlRender";
import {CMD} from "@/utils/type";

export default {
  name: "Comment",
  components: {BaseHtmlRender, Author, PostEditor, Point},
  inject: ['post', 'postDetailWidth', 'show', 'isNight', 'config'],
  props: {
    modelValue: {
      reply_content: ''
    },
    type: {
      type: String,
      default() {
        return 'list'
      }
    },
  },
  data() {
    return {
      showOrigin: false,
      edit: false,
      ding: false,
      expand: true,
      expandWrong: false,
      replyInfo: `@${this.modelValue.username} #${this.modelValue.floor} `,
      cssStyle: null,
      floor: this.modelValue.floor
    }
  },
  watch: {
    show(e) {
      if (e) {
        this.edit = false
      }
    },
    postDetailWidth(n, o) {
      this.checkIsTooLong(n)
    }
  },
  computed: {
    myClass() {
      return {
        isOp: this.modelValue.isOp,
        isSimple: this.config.simple,
        ding: this.ding,
        isLevelOne: this.modelValue.level === 0,
        ['c_' + this.floor]: this.type !== 'top'
      }
    }
  },
  mounted() {
    this.checkIsTooLong(this.postDetailWidth)
  },
  methods: {
    checkIsTooLong(postDetailWidth) {
      if (postDetailWidth !== 0) {
        let rect = this.$refs.comment.getBoundingClientRect()
        let ban = postDetailWidth / 2
        console.log('ban', ban)
        if (ban < rect.width && rect.width < ban + 25 && this.modelValue.children.length) {
          this.expand = false
          // console.log(rect.width - this.postDetailWidth)
          let padding = 2
          this.cssStyle = {
            padding: '1rem 0',
            width: `calc(${postDetailWidth}px - ${padding}rem)`,
            transform: `translateX(calc(${rect.width - postDetailWidth}px + ${padding}rem))`,
            background: this.isNight ? '#18222d' : 'white'
          }
          // console.log(this.cssStyle)
        }
      }
    },
    //高亮一下
    showDing() {
      this.ding = true
      setTimeout(() => {
        this.ding = false
      }, 2000)
    },
    hide() {
      let url = `${window.baseUrl}/ignore/reply/${this.modelValue.id}?once=${this.post.once}`
      eventBus.emit(CMD.REMOVE, this.modelValue.floor)
      $.post(url).then(res => {
        eventBus.emit(CMD.REFRESH_ONCE)
        eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '隐藏成功'})
      }, err => {
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '隐藏成功,仅本次有效（接口调用失败！）'})
      })
    },
    toggle() {
      this.expand = !this.expand
    },
    toggleContent() {
      if (this.modelValue.level === 0 && this.modelValue.replyUsers.length === 0) return
      this.showOrigin = !this.showOrigin
    },
  }
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.comment {
  width: 100%;
  box-sizing: border-box;
  margin-top: .6rem;

  @line-color: #ececec;

  &.isLevelOne {
    border-bottom: 1px solid @line-color;
    padding: .8rem 1rem;
    //padding: 1rem 1rem;
    margin-top: 0;
  }


  &.ding {
    @bg: rgb(yellow, .3);
    background: @bg !important;
  }

  &.isSimple {
    .avatar, .expand-line {
      display: none;
    }

    .simple-wrapper {
      padding-left: 2.8rem;
    }

    .w {
      padding-left: 0 !important;
      padding-top: .5rem;
    }
  }

  .comment-content-w {
    .more {
      text-align: center;
      margin: 2rem 0;
    }
  }

  .comment-content {
    display: flex;
    position: relative;

    .expand-line {
      cursor: pointer;
      margin-top: .6rem;
      @w: 2.8rem;
      width: @w;
      min-width: @w;
      position: relative;

      &:after {
        position: absolute;
        left: 50%;
        content: " ";
        height: 100%;
        width: 0;
        border-right: 1px solid @line-color;
      }

      &:hover {
        &:after {
          border-right: 2px solid #0079D3;
        }
      }
    }

    .right {
      flex: 1;
      width: calc(100% - 3rem);

      .w {
        padding-left: 1rem;

        .post-editor-wrapper {
          margin-top: 1rem;
        }
      }
    }
  }
}

.wrong-wrapper {
  font-size: 1.4rem;
  margin-bottom: 1rem;

  span {
    cursor: pointer;
  }

  .del-line {
    text-decoration: line-through;
  }

  .wrong-icon {
    margin-left: .5rem;
  }

  .warning {
    @border: #e1e1e1;
    border-top: 1px solid @border;
    border-bottom: 1px solid @border;
    padding: 1rem 0;
    margin-top: 1rem;
    font-size: 1.2rem;
    color: red;
  }
}


</style>
