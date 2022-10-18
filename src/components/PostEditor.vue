<template>
  <div class="editor-wrapper" :class="{isFocus}">
    <textarea class="post-editor"
              ref="txt"
              @focus="isFocus = true"
              @blur="isFocus = false"
              :class="editorId"
              v-model="content"></textarea>
    <textarea class="hide" :class="editorId"></textarea>
    <div class="toolbar">
      <div class="button"
           :class="{disabled,loading}"
           @click="submit">回复
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import {CMD} from "@/utils/type";

export default {
  name: "PostEditor",
  props: {
    replyInfo: {
      type: String,
      default() {
        return ''
      }
    },
  },
  inject: [
    'postUsername',
    'replyCount',
    'postId',
    'once'
  ],
  computed: {
    disabled() {
      if (this.content) {
        return this.content === this.replyInfo
      } else {
        return true
      }
    }
  },
  data() {
    return {
      isFocus: false,
      editorId: 'editorId_' + Date.now(),
      content: this.replyInfo,
      loading: false,
    }
  },
  methods: {
    async submit() {
      if (!this.content || this.loading) return
      this.loading = true
      let item = {
        thankCount: 0,
        isThanked: false,
        isOp: this.postUsername === window.user.username,
        id: Date.now(),
        username: window.user.username,
        avatar: window.user.avatar,
        date: '几秒前',
        index: this.replyCount + 1,
        reply_content: this.content || Date.now(),
        children: []
      }
      // this.loading = false
      // eventBus.emit('refreshOnce',)
      // eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
      // eventBus.emit('addReply', item)
      // this.$emit('addReplyChild', item)
      // this.content = this.replyInfo
      // return
      let url = `${window.url}/t/${this.postId}`
      $.post(url, {content: this.content, once: this.once}).then(
          res => {
            this.loading = false
            // console.log('回复', res)
            eventBus.emit('refreshOnce', res)
            eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '回复成功'})
            eventBus.emit('addReply', item)
            this.$emit('addReplyChild', item)
            this.content = this.replyInfo
          },
          err => {
            this.loading = false
            eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '回复失败'})
          }
      )
    },
  },
  mounted() {
    $(`.${this.editorId}`).each(function () {
      this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    }).on("input", function () {
      this.style.height = 0;
      this.style.height = (this.scrollHeight) + "px";
    });
    this.$refs.txt.focus()
  },
  beforeUnmount() {
    $(`.${this.editorId}`).off()
  },
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.editor-wrapper {
  border-radius: .4rem;
  border: 1px solid @border;
  margin-top: 1rem;
  margin-right: 3rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: all .3s;

  &.isFocus {
    border: 1px solid @border-hover;
  }

  .hide {
    position: absolute;
    left: -9999px;
  }

  .post-editor {
    width: 100%;
    max-width: 100%;
    padding: .6rem 1.4rem;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.4rem;
    min-height: 13rem;
  }

  .toolbar {
    box-sizing: border-box;
    text-align: end;
    padding: .5rem 1rem;
    width: 100%;
    position: relative;
    background: rgb(246, 247, 248);
  }
}

</style>