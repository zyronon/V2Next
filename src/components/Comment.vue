<template>
  <div class="comment">
    <Author v-model="expand" :comment="modelValue"/>
    <div class="comment-content" v-show="expand">
      <div class="left line" @click="toggle"></div>
      <div class="right">
        <div class="w">
          <BaseHtmlRender class="text" :html="modelValue.reply_content"/>
          <div v-if="true" class="toolbar">
            <Point
                :item="{
                    isThanked:modelValue.isThanked,
                    thankCount:modelValue.thankCount,
                    username:modelValue.username
                }"
                @addThank="addThank"
                @recallThank="recallThank"
                :api-url="'reply/'+modelValue.id"
            />
            <div class="tool" @click="edit = !edit">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
                <path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
                <path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>回复</span>
            </div>
            <div class="tool" @click="hide">
              <span>隐藏</span>
            </div>
            <!--            <div class="tool">-->
            <!--              <span>报告</span>-->
            <!--            </div>-->
          </div>
          <div class="my-wrapper">
            <PostEditor v-if="edit"
                        :replyInfo="replyInfo"
                        :replyFloor="modelValue.floor"/>
          </div>
        </div>
        <Comment v-for="(item,index) in modelValue.children"
                 v-model="modelValue.children[index]"
                 style="margin-top: .4rem;"
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
  inject: ['post'],
  watch: {},
  created() {
    // console.log(this.modelValue)
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
        eventBus.emit('refreshOnce')
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
  margin-top: 1.8rem;


  .comment-content {
    display: flex;
    position: relative;

    .line {
      cursor: pointer;
      //border-right: 2px solid #ddd;
      width: 2.2rem;
      min-width: 2.2rem;
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
      width: calc(100% - 2.2rem);

      .w {
        padding-left: 1.7rem;

        .text {
          color: black;
          word-break: break-word;
        }

        .toolbar {
          margin-top: .5rem;
          display: flex;
          align-items: center;
          color: #929596;

          .tool {
            margin: 0 .4rem;
            cursor: pointer;
            height: 3.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: .2rem;

            > svg {
              width: 2rem;
              padding: .4rem .6rem;
              border-radius: .2rem;
            }

            span {
              margin: 0 .4rem;
            }

            &:nth-child(2) {
              span {
                margin: 0;
                margin-right: .6rem;
              }
            }

            &:hover {
              background: rgb(232, 232, 232);
            }
          }

        }
      }
    }
  }
}

</style>
