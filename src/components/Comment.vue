<template>
  <div class="comment" ref="comment">
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
            <BaseHtmlRender class="text" :html="modelValue.reply_content"/>
            <PostEditor v-if="edit"
                        @close="edit = false"
                        :replyInfo="replyInfo"
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
  inject: ['post', 'postDetailWidth'],
  watch: {},
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
      let url = `${window.win().url}/ignore/reply/${this.modelValue.id}?once=${this.post.once}`
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
      width: 2.6rem;
      min-width: 2.6rem;
      position: relative;

      &:after {
        position: absolute;
        left: calc(68% - 1px);
        content: " ";
        height: 100%;
        width: 0;
        border-right: 2px solid #ddd;

      }

      &:hover {
        &:after {
          border-right: 2px solid #0079D3;
        }
      }
    }

    .right {
      flex: 1;
      width: calc(100% - 2.6rem);

      .w {
        padding-left: 1.7rem;

        .text {
          color: black;
          word-break: break-word;
        }

        .post-editor-wrapper{
          margin-top: 1rem;
        }

      }
    }
  }
}

</style>
