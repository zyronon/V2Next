<template>
  <div class="comment" ref="comment">
    <a class="avatar" v-if="!isRight" :href="`/member/${comment.username}`">
      <img :src="comment.avatar" alt="">
    </a>
    <div class="comment-body" :class="{isRight}">
      <div class="texts">
        <div class="point" v-if="comment.thankCount && isRight">
          <svg width="19" height="19" viewBox="0 0 48 48" fill="none">
            <path
                d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                fill="#E02A2A" stroke="#E02A2A" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
          </svg>
          <div class="num">{{ comment.thankCount }}</div>
        </div>
        <template v-if="isLogin && config.openTag  && isRight">
            <span class="my-tag" v-for="i in myTags">
              <i class="fa fa-tag"></i>
              <span>{{ i }}</span>
            </span>
        </template>
        <span class="ago" v-if="isRight">{{ comment.date }}</span>
        <div v-if="comment.isMod && isRight" class="mod">MOD</div>
        <div v-if="comment.isOp && isRight" class="op">OP</div>
        <a :href="`/member/${comment.username}`" class="username">{{ comment.username }}</a>
        <div v-if="comment.isOp && !isRight" class="op">OP</div>
        <div v-if="comment.isMod && !isRight" class="mod">MOD</div>
        <span class="ago" v-if="!isRight">{{ comment.date }}</span>
        <template v-if="isLogin && config.openTag && !isRight">
            <span class="my-tag" v-for="i in myTags">
              <i class="fa fa-tag"></i>
              <span>{{ i }}</span>
            </span>
        </template>
        <div class="point" v-if="comment.thankCount && !isRight">
          <svg width="19" height="19" viewBox="0 0 48 48" fill="none">
            <path
                d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                fill="#E02A2A" stroke="#E02A2A" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
          </svg>
          <div class="num">{{ comment.thankCount }}</div>
        </div>
      </div>
      <BaseHtmlRender class="reply_content" :html="comment.reply_content"/>
    </div>
    <a class="avatar" v-if="isRight" :href="`/member/${comment.username}`">
      <img :src="comment.avatar" alt="">
    </a>
    <div class="Author-right">
      <div class="floor">{{ comment.floor }}</div>

      <div class="tool jump" @click="jump">
        <span>跳转</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import BaseHtmlRender from "@/components/BaseHtmlRender";
import {computed, inject} from "vue";
import eventBus from "@/utils/eventBus.js";
import {CMD} from "@/utils/type.js";

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
const myTags = computed(() => {
  return tags[props.comment.username] ?? []
})

function jump() {
  eventBus.emit(CMD.JUMP, props.comment.floor)
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.comment {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e2e2;

  .avatar {
    display: flex;

    img {
      @w: 3.8rem;
      width: @w;
      height: @w;
      border-radius: .3rem;
    }
  }

  .comment-body {
    flex: 1;
    display: flex;
    flex-direction: column;

    .texts {
      display: flex;
      align-items: center;
    }

    .reply_content {
      margin-top: 1rem;
      max-width: calc(100% - 5rem);
    }
  }

  .isRight {
    align-items: flex-end;

    .op, .mod, .username {
      margin: 0 0 0 1rem;
    }
  }

  .Author-right {
    display: flex;
    flex-direction: column;
    align-items: center;

    .floor {
      margin-left: 0;
    }

    .jump {
      color: #929596;
      margin-left: 0;
    }
  }

  .point {
    margin: 0 .5rem;
    font-size: 1.4rem;
    display: flex;
    gap: .5rem;
    align-items: center;
    font-weight: 700;
    color: black;
  }
}


</style>
