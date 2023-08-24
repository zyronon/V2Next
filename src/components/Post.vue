<!--<template>-->
<!--  <div class="post"-->
<!--       :style="postStyle"-->
<!--       :class="[props.viewType,props.isNight?'isNight':'']"-->
<!--       @click="$emit('show',$event)">-->
<!--    <div class="base-info">-->
<!--      <div class="left">-->
<!--        <a @click.stop="null" :href="`/member/${props.post.username}`">-->
<!--          <div class="avatar">-->
<!--            <img :src="props.post.avatar" alt="">-->
<!--          </div>-->
<!--        </a>-->
<!--        <div class="right">-->
<!--          <div class="title">-->
<!--            <a :href="`t/${props.post.id}`">{{ props.post.title }}</a>-->
<!--          </div>-->
<!--          <div class="bottom">-->
<!--            <template v-if="props.post.node">-->
<!--              <a @click.stop="null" :href="props.post.nodeUrl" class="my-node">{{ props.post.node }}</a>-->
<!--              &nbsp;&nbsp;•&nbsp;&nbsp;-->
<!--            </template>-->
<!--            <strong>-->
<!--              <a @click.stop="null" class="username" :href="`/member/${props.post.username}`">{{-->
<!--                  props.post.username-->
<!--                }}</a>-->
<!--            </strong>-->
<!--            &nbsp;&nbsp;•&nbsp;&nbsp;-->
<!--            <span class="date">{{ props.post.date }}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="count" v-if="props.post.replyCount">{{ props.post.replyCount }}</div>-->
<!--    </div>-->
<!--    <div class="post-content-wrapper" :class="{mask}" v-if="props.post.content_rendered">-->
<!--      <div v-html="props.post.content_rendered" ref="contentRef"></div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import {computed, ref, watch} from "vue";-->

<!--const checkHeight = 200-->
<!--const props = defineProps(['post', 'viewType', 'isNight'])-->
<!--// const {post, viewType} = props-->
<!--const mask = ref(false)-->
<!--const contentRef = ref(null)-->
<!--const postStyle = computed(() => {-->
<!--  if (props.post.bg) {-->
<!--    return {-->
<!--      backgroundImage: props.post.bg,-->
<!--      backgroundRepeat: 'no-repeat',-->
<!--      backgroundSize: '20px 20px',-->
<!--      backgroundPosition: 'right top'-->
<!--    }-->
<!--  }-->
<!--  return {}-->
<!--})-->

<!--watch([() => props.post, () => contentRef.value, () => props.viewType], () => {-->
<!--  if (!contentRef.value) return-->
<!--  if (props.viewType === 'table') return;-->
<!--  let rect = contentRef.value.getBoundingClientRect()-->
<!--  //如果有图片，还没加载完，此刻content.value的高度不会包括图片的高度-->
<!--  contentRef.value.querySelectorAll('img').forEach(item => {-->
<!--    item.addEventListener('load', checkContentHeight)-->
<!--  })-->
<!--  mask.value = rect.height >= checkHeight-->
<!--}, {immediate: true, flush: 'post'})-->

<!--function checkContentHeight() {-->
<!--  if (mask.value) return-->
<!--  let rect = contentRef.value.getBoundingClientRect()-->
<!--  // console.log('rect', rect.height)-->
<!--  mask.value = rect.height >= checkHeight-->
<!--}-->
<!--</script>-->

<!--<style lang="less">-->
<!--p {-->
<!--  &:first-child {-->
<!--    margin-top: 0;-->
<!--  }-->

<!--  &:last-child {-->
<!--    margin-bottom: 0;-->
<!--  }-->
<!--}-->
<!--</style>-->
<!--<style scoped lang="less">-->
<!--@import "@/assets/less/variable";-->

<!--.post {-->
<!--  font-size: 1.4rem;-->
<!--  background: white;-->
<!--  text-align: start;-->
<!--  padding: 1rem;-->
<!--  overflow: hidden;-->

<!--  &.isNight {-->
<!--    background: #18222d;-->
<!--    border: none !important;-->

<!--    .title a {-->
<!--      color: #a9bcd6 !important;-->
<!--    }-->

<!--    .bottom .date {-->
<!--      color: #738292;-->
<!--    }-->

<!--    .post-content-wrapper {-->
<!--      color: #d1d5d9 !important;-->
<!--    }-->

<!--    .my-node {-->
<!--      background: #393f4e;-->
<!--      color: #9caec7;-->

<!--      &:hover {-->
<!--        background: #9caec7;-->
<!--        color: #001d25;-->
<!--      }-->
<!--    }-->

<!--    .count {-->
<!--      background: #393f4e !important;-->
<!--      color: #d1d5d9 !important;-->
<!--    }-->

<!--    &.visited {-->
<!--      .count {-->
<!--        background: #001d25 !important;-->
<!--        color: #393f4e !important;-->
<!--      }-->

<!--      .title a {-->
<!--        color: #393f4e !important;-->
<!--      }-->
<!--      .post-content-wrapper {-->
<!--        color: #576077 !important;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  &.table {-->
<!--    border-bottom: 1px solid @border;-->

<!--    .post-content-wrapper {-->
<!--      display: none;-->
<!--    }-->

<!--    .title {-->
<!--      a {-->
<!--        color: #778087;-->
<!--        font-size: 1.6rem;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  &.card {-->
<!--    margin-top: 1.1rem;-->
<!--    border: 1px solid @border;-->
<!--    border-radius: @border-radius;-->
<!--    cursor: pointer;-->

<!--    &:hover {-->
<!--      border: 1px solid @border-hover;-->
<!--    }-->

<!--    .title {-->
<!--      a {-->
<!--        color: black;-->
<!--        font-size: 1.8rem;-->

<!--      }-->
<!--    }-->
<!--  }-->

<!--  &.visited {-->
<!--    .title a {-->
<!--      color: #afb9c1 !important;-->
<!--    }-->

<!--    .post-content-wrapper {-->
<!--      opacity: .6;-->
<!--    }-->
<!--  }-->

<!--  .base-info {-->
<!--    box-sizing: border-box;-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    align-items: flex-start;-->

<!--    .left {-->
<!--      display: flex;-->
<!--      width: 95%;-->

<!--      .avatar {-->
<!--        margin-right: 1rem;-->

<!--        img {-->
<!--          border-radius: .4rem;-->
<!--          width: 4.8rem;-->
<!--          min-width: 4.8rem;-->
<!--          min-height: 4.8rem;-->
<!--        }-->
<!--      }-->

<!--      .right {-->
<!--        display: flex;-->
<!--        flex-direction: column;-->
<!--        justify-content: space-between;-->

<!--        .title {-->
<!--          display: inline;-->
<!--          align-items: center;-->
<!--        }-->

<!--        .bottom {-->
<!--          font-size: 1.2rem;-->
<!--          line-height: 1.2rem;-->
<!--          display: flex;-->
<!--          align-items: center;-->
<!--          color: #ccc;-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    .count {-->
<!--      margin-top: 1.8rem;-->
<!--      line-height: 12px;-->
<!--      font-weight: 700;-->
<!--      color: #fff;-->
<!--      background-color: #aab0c6;-->
<!--      display: inline-block;-->
<!--      padding: 2px 10px;-->
<!--      -moz-border-radius: 12px;-->
<!--      -webkit-border-radius: 12px;-->
<!--      border-radius: 12px;-->
<!--      text-decoration: none;-->
<!--      cursor: pointer;-->

<!--      &:hover {-->
<!--        background-color: #969cb1;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .post-content-wrapper {-->
<!--    max-height: 20rem;-->
<!--    overflow: hidden;-->
<!--    margin-top: .6rem;-->
<!--    color: black;-->
<!--    position: relative;-->
<!--    line-break: anywhere;-->
<!--    font-size: 1.4rem;-->

<!--    &.mask {-->
<!--      -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
