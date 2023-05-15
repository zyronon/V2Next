<template>
  <div class="comment" :class="modelValue.isOp?'op':''" ref="comment">
    <Author v-model="expand"
            :comment="modelValue"
            @reply="edit = !edit"
            @hide="hide"
    />
    <!--    {{ modelValue.level }}-->
    <div v-if="cssStyle && !expand" class="more ago" @click="expand = !expand">
      由于嵌套回复层级太深，自动将后续回复隐藏
    </div>
    <div class="comment-content-w" v-show="expand" :style="cssStyle">
      <div v-if="cssStyle" class="more ago" @click="expand = !expand">
        由于嵌套回复层级太深，自动将以下回复移至可见范围
      </div>
      <div class="comment-content">
        <div class="left expand-line" @click="toggle"></div>
        <div class="right">
          <div class="w">
            <div class="wrong-wrapper" v-if="modelValue.isWrong">
              <span>
                <a :href="'/member/'+modelValue.replyUsers[0]">@{{ modelValue.replyUsers[0] }}&nbsp;&nbsp;</a>
              <span>#{{ modelValue.replyFloor }} </span>
              </span>
              <i class="fa fa-question-circle-o wrong-icon" aria-hidden="true"></i>
              <div class="warning">
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

            <BaseHtmlRender class="reply_content" :html="modelValue.reply_content"/>
            <PostEditor v-if="edit"
                        @close="edit = false"
                        :replyInfo="replyInfo"
                        :replyUser="modelValue.username"
                        :replyFloor="modelValue.floor"/>
          </div>
          <Comment v-for="(item,index) in modelValue.children"
                   v-model="modelValue.children[index]"
                   :key="index"/>
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
import eventBus from "../eventBus";
import BaseHtmlRender from "@/components/BaseHtmlRender";
import {CMD} from "@/utils/type";

export default {
  name: "Comment",
  components: {BaseHtmlRender, Author, PostEditor, Point},
  props: {
    modelValue: {
      reply_content: ''
    },
  },
  data() {
    return {
      edit: false,
      expand: true,
      replyInfo: `@${this.modelValue.username} #${this.modelValue.floor} `,
      cssStyle: null
    }
  },
  inject: ['post', 'postDetailWidth', 'show'],
  watch: {
    show(e) {
      if (e) {
        this.edit = false
      }
    }
  },
  created() {
    // console.log(this.modelValue)
  },
  mounted() {
    let rect = this.$refs.comment.getBoundingClientRect()
    let ban = this.postDetailWidth / 2
    if (ban < rect.width && rect.width < ban + 25 && this.modelValue.children.length) {
      this.expand = false
      // console.log(rect.width - this.postDetailWidth)
      let padding = 2
      this.cssStyle = {
        padding: '1rem 0',
        width: `calc(${this.postDetailWidth}px - ${padding}rem)`,
        transform: `translateX(calc(${rect.width - this.postDetailWidth}px + ${padding}rem))`
      }
      // console.log(this.cssStyle)
    }
  },
  methods: {
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
  }
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.comment {
  width: 100%;
  box-sizing: border-box;
  margin-top: 1rem;
  background: white;

  //&.op {
  //  background: rgb(yellow, .3);
  //
  //  & > .comment-content-w > .comment-content > .right > .w {
  //    background: rgb(yellow, .3);
  //  }
  //}

  .comment-content-w {
    background: white;

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
      //border-right: 2px solid #ddd;
      width: 3rem;
      min-width: 3rem;
      position: relative;

      &:after {
        position: absolute;
        left: calc(60% - 1px);
        content: " ";
        height: 100%;
        width: 0;
        border-right: 1px solid #f1f1f1;
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
        padding-left: 1.7rem;

        .post-editor-wrapper {
          margin-top: 1rem;
        }
      }
    }
  }
}

.wrong-wrapper {
  font-size: 1.4rem;
  cursor: pointer;
  margin-bottom: 1rem;

  span {
    text-decoration: line-through;
  }

  .wrong-icon {
    margin-left: .5rem;
  }

  &:hover {
    .warning {
      display: block;
    }
  }

  .warning {
    @border: #e1e1e1;
    border-top: 1px solid @border;
    border-bottom: 1px solid @border;
    padding: 1rem 0;
    margin-top: 1rem;
    font-size: 1.2rem;
    color: red;
    display: none;
  }
}


</style>
