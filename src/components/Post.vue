<template>
  <div class="post">
    <div class="base-info">
      <div class="left">
        <a :href="`/member/${post.username}`">
          <div class="avatar">
            <img :src="post.avatar" alt="">
          </div>
        </a>
        <div class="right">
          <div class="top">
            <a :href="post.nodeUrl" class="my-node">{{ post.node }}</a>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <a class="username" :href="`/member/${post.username}`">{{ post.username }}</a>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <span class="date">{{ post.date }}</span>
          </div>
          <div class="title">
            <a :href="`t/${post.id}`">{{ post.title }}</a>
          </div>
        </div>
      </div>
      <div class="count" v-if="post.replyCount">{{ post.replyCount }}</div>
    </div>
    <div class="post-content-wrapper" :class="{mask}" v-if="post.content_rendered">
      <div v-html="post.content_rendered" ref="content"></div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";

const {post} = defineProps(['post'])
const mask = ref(false)
const content = ref(null)

watch([() => post, () => content.value], () => {
  if (!content.value) return
  let rect = content.value.getBoundingClientRect()
  //如果有图片，还没加载完，此刻content.value的高度不会包括图片的高度
  content.value.querySelectorAll('img').forEach(item => {
    item.addEventListener('load', checkContentHeight)
  })
  mask.value = rect.height >= 250
}, {immediate: true, flush: 'post'})

function checkContentHeight() {
  if (mask.value) return
  let rect = content.value.getBoundingClientRect()
  console.log('rect', rect.height)
  mask.value = rect.height >= 250
}
</script>

<style lang="less">
p {
  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
<style scoped lang="less">
@import "@/assets/less/variable";

.post {
  font-size: 1.4rem;
  cursor: pointer;
  background: white;
  margin-top: 1.1rem;
  border: 1px solid @border;
  border-radius: @border-radius;
  text-align: start;
  padding: 1rem;
  overflow: hidden;

  &.visited {
    .title a {
      opacity: .6;
    }
  }

  &:hover {
    border: 1px solid @border-hover;
  }

  .base-info {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .left {
      display: flex;
      width: 95%;

      .avatar {
        margin-right: 1rem;

        img {
          border-radius: .4rem;
          width: 4.8rem;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {
          font-size: 1.2rem;
          line-height: 1.2rem;
          display: flex;
          align-items: center;
        }

        .title {
          display: inline;
          align-items: center;

          a {
            color: black !important;
            font-size: 2rem;
            text-decoration: none;
          }
        }
      }
    }

    .count {
      margin-top: 2rem;
      line-height: 12px;
      font-weight: 700;
      color: #fff;
      background-color: #aab0c6;
      display: inline-block;
      padding: 2px 10px;
      -moz-border-radius: 12px;
      -webkit-border-radius: 12px;
      border-radius: 12px;
      text-decoration: none;

      &:hover {
        background-color: #969cb1;
      }
    }
  }

  .post-content-wrapper {
    max-height: 25rem;
    overflow: hidden;
    margin-top: .6rem;
    color: black;
    position: relative;
    line-break: anywhere;

    &.mask {
      -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);
    }
  }
}
</style>
