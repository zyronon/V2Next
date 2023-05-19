<template>
  <div class="comment" ref="comment">
    <a class="avatar" :href="`/member/${comment.username}`">
      <img :src="comment.avatar" alt="">
    </a>
    <div class="comment-body">
      <div class="Author">
        <div class="Author-left">
        <span class="texts">
          <strong>
            <a :href="`/member/${comment.username}`" class="username">{{ comment.username }}</a>
          </strong>
          <div v-if="comment.isOp" class="op">OP</div>
          <div v-if="comment.isMod" class="mod">MOD</div>
          <span class="ago">{{ comment.date }}</span>
           <template v-if="isLogin && config.openTag">
            <span class="my-tag" v-for="i in myTags">
              <i class="fa fa-tag"></i>
              <span>{{ i }}</span>
            </span>
            </template>
        </span>
        </div>
        <div class="Author-right">
          <div class="tool" @click="emit('jump',comment.floor)">
            <span>跳转</span>
          </div>
          <div class="floor">{{ comment.floor }}</div>
        </div>
      </div>
      <BaseHtmlRender class="reply_content" :html="comment.reply_content"/>
    </div>
  </div>
</template>
<script setup>
import eventBus from "@/utils/eventBus.js";
import BaseHtmlRender from "@/components/BaseHtmlRender";
import {CMD} from "@/utils/type";
import {computed, inject} from "vue";

const config = inject('config')
const isLogin = inject('isLogin')
const tags = inject('tags')
const props = defineProps({
  comment: {
    reply_content: ''
  },
  isRight: {
    type: Boolean,
    default() {
      return false
    }
  }
})
const emit = defineEmits(['jump'])
const myTags = computed(() => {
  return tags[props.comment.username] ?? []
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.comment {
  width: 100%;
  box-sizing: border-box;
  margin-top: 1rem;
  background: white;
  display: flex;
  gap: 1rem;

  .avatar {
    flex: 1;
    display: flex;

    img {
      @w: 5rem;
      width: @w;
      height: @w;
      border-radius: .3rem;
    }
  }

  .comment-body {
    .Author {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.2rem;
      position: relative;
      margin-bottom: .4rem;

      .Author-left {
        display: flex;
        align-items: center;
        max-width: 90%;

        .username {
          font-size: 1.4rem;
          margin-right: 1rem;
        }


        @color: #1484cd;

        .texts {
          flex: 1;
        }

        .op {
          display: inline-block;
          background-color: transparent;
          color: @color;
          border-radius: .3rem;
          padding: 0 .3rem;
          cursor: default;
          border: 2px solid @color;
          font-size: 1.2rem;
          font-weight: bold;
          margin-right: 1rem;
          transform: scale(.8);
        }

        .mod {
          .op;
          background: @color;
          color: white;
          margin-right: 1rem;
        }

        .my-tag {
          font-size: 1.4rem;
          color: red;
          margin-left: 1rem;

          &:hover {
            .remove {
              display: inline;
            }
          }

          .remove {
            cursor: pointer;
            margin-left: .5rem;
            display: none;
          }
        }
      }

      .Author-right {
        position: absolute;
        right: 0;
        display: flex;
        align-items: center;

        .floor {
          margin-left: 1rem;
          font-size: 1.2rem;
          line-height: 1rem;
          border-radius: 1rem;
          display: inline-block;
          background-color: #f0f0f0;
          color: #ccc;
          padding: .2rem .5rem;
          cursor: default;
        }
      }
    }
  }
}


</style>
