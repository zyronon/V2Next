<template>
  <div class="comment" ref="comment">
    <Author v-model="expand" :comment="modelValue"/>
    {{modelValue.level}}
    <div class="comment-content" v-show="expand">
      <div class="left line" @click="toggle"></div>
      <div class="right">
        <div class="w">
          <BaseHtmlRender class="text" :html="modelValue.reply_content"/>
          <div class="my-wrapper">
            <PostEditor v-if="edit"
                        @close="edit = false"
                        :replyInfo="replyInfo"
                        :replyFloor="modelValue.floor"/>
          </div>
        </div>
        <Comment v-for="(item,index) in modelValue.children"
                 v-model="modelValue.children[index]"
                 @remove="remove(index)"
                 :key="index"/>
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
    }
  },
  inject: ['post', 'postDetailWidth'],
  watch: {},
  created() {
    // console.log(this.modelValue)
  },
  mounted() {
    let rect = this.$refs.comment.getBoundingClientRect()
    if (rect.width < (this.postDetailWidth / 2)) {
      this.expand = false
    }
  },
  methods: {
    addThank() {
      this.modelValue.isThanked = true
      this.modelValue.thankCount++
    },
    recallThank() {
      this.modelValue.isThanked = false
      this.modelValue.thankCount--
    },
    hide() {
      let url = `${window.url}/ignore/reply/${this.modelValue.id}?once=${this.post.once}`
      this.$emit('remove')
      $.post(url).then(res => {
        console.log('hide：', res)
        eventBus.emit(CMD.REFRESH_ONCE)
        eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '隐藏成功'})
      }, err => {
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '隐藏成功,仅本次有效（接口调用失败！）'})
      })
    },
    remove(index) {
      this.modelValue.children.splice(index, 1)
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

  .comment-content {
    display: flex;
    position: relative;

    .line {
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


      }
    }
  }
}

</style>
