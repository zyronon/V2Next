<template>
  <div class="post-detail" ref="detail" v-show="modelValue" @click="$emit('update:modelValue',false)">
    <div class="main" @click.stop="stop">
      <div class="left">
        <div class="post">
          <Point
              @addThank="addThank"
              @recallThank="recallThank"
              :item="{
                isThanked:post.isThanked,
                thankCount:post.thankCount,
                username:post.username
              }"
              type="vertical"
              :api-url="'topic/'+post.id"/>
          <div class="right">
            <a :href="`/member/${post.username}`">
              <div class="avatar">
                <img :src="post.avatar" alt="">
              </div>
            </a>
            <div class="post-nodes">
              <a href="/">V2EX</a>
              <span class="chevron">&nbsp;&nbsp;›&nbsp;&nbsp;</span>
              <a :href="post.nodeUrl">{{ post.node }}</a>
            </div>
            <div class="title" v-html="post.title"></div>
            <div class="post-author">
              <div class="username">
                <a :href="`/member/${post.username}`">{{ post.username }}</a>
              </div>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <div class="date">{{ post.date }}</div>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <div class="date">{{ post.clickCount }}次点击</div>
            </div>
            <div class="content">
              <BaseHtmlRender :html="post.content_rendered" class="htmlContent"/>
              <BaseHtmlRender :html="post.subtlesHtml"/>
            </div>
            <Toolbar :post="post" :replyCount="post.replyCount"/>
            <PostEditor v-if="modelValue" @addReplyChild="addReplyChild"/>
          </div>
        </div>
        <div class="line"></div>
        <div v-if="loading" class="loading-w">
          <div class="loading-c"></div>
        </div>
        <template v-else>
          <div class="comments" v-if="post.nestedReplies.length">
            <Comment v-for="(item,index) in post.nestedReplies"
                     @remove="remove(index)"
                     v-model="post.nestedReplies[index]" :key="index"/>
          </div>
          <div v-else class="empty">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="#4a90e2" stroke="#4a90e2" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21H25.0025" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
              <path d="M33.001 21H34.9999" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
              <path d="M13.001 21H14.9999" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="t1">
              暂无评论
            </div>
            <div>
              第一个分享你的想法！
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="scroll-top button" @click.stop="scrollTop">
      回到顶部
    </div>
  </div>
</template>
<script>
import Comment from './Comment'
import PostEditor from './PostEditor'
import {computed,} from "vue";
import Point from "./Point";
import Toolbar from "./Toolbar";
import BaseHtmlRender from "@/components/BaseHtmlRender";

export default {
  name: "detail",
  components: {
    Comment,
    PostEditor,
    Point,
    Toolbar,
    BaseHtmlRender
  },
  provide() {
    return {
      postUsername: computed(() => this.post.username),
      postTitle: computed(() => this.post.title),
      isFavorite: computed(() => this.post.isFavorite),
      isIgnore: computed(() => this.post.isIgnore),
      postId: computed(() => this.post.id),
      once: computed(() => this.post.once),
      replyCount: computed(() => this.post.replyCount),
      collectCount: computed(() => this.post.collectCount),
    }
  },
  props: {
    modelValue: false,
    loading: false,
    post: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {
    modelValue(newVal) {
      if (!newVal) {
        this.$refs.detail.scrollTo({top: 0})
        window.doc.body.style.overflow = 'unset'
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    addThank() {
      this.post.isThanked = true
      this.post.thankCount++
    },
    recallThank() {
      this.post.isThanked = false
      this.post.thankCount--
    },
    remove(index) {
      this.post.nestedReplies.splice(index, 1)
    },
    addReplyChild(item) {
      this.post.nestedReplies.push(item)
    },
    scrollTop() {
      this.$refs.detail.scrollTo({top: 0, behavior: 'smooth'})
    },
  }
}
</script>

<style lang="less">
.htmlContent {
  width: 100%;

  img {
    max-width: 100%;
  }
}
</style>
<style scoped lang="less">
@import "src/assets/less/variable.less";

.post-detail {
  text-align: start;
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(46, 47, 48, .8);
  overflow: auto;
  font-size: 1.4rem;

  @width: 55vw;

  .main {
    padding: 6rem 15rem;
    display: flex;
    margin: auto;
    width: @width;
    box-sizing: border-box;
    min-height: 100%;
    background: #e2e2e2;

    > .left {
      flex: 1;
      max-width: 100%;
      background: white;
      border-radius: @border-radius;
      padding-bottom: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;


      .post {
        width: 100%;
        display: flex;

        .right {
          box-sizing: border-box;
          width: calc(100% - 4rem);
          flex: 1;
          padding: 1rem;
          padding-left: 0;

          .avatar {
            float: right;

            img {
              width: 6.4rem;
            }
          }

          .post-nodes {
            font-size: 1.5rem;
            margin-bottom: .8rem;
            display: flex;
          }

          .title {
            margin-bottom: 1rem;
            line-height: 150%;
            font-size: 2.4rem;
            color: black;
          }

          .post-author{
            padding-bottom: 1rem;
            border-bottom: 1px solid #e2e2e2;
          }

          .content {
            color: black;
            word-break: break-word;
            line-height: 1.6;
            margin: 1rem 0;

          }
        }
      }

      .loading-w {
        height: 30rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }


      .line {
        border-bottom: 1px solid @border;
        width: 91%;
        margin: 2rem;
      }

      .comments {
        width: 100%;
        box-sizing: border-box;
        padding: 0 1rem;
      }

      .empty {
        color: #ccc;
        font-weight: normal;
        height: 30rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div {
          margin-top: 2rem;
        }

        .t1 {
          font-size: 1.6rem;
          font-weight: bold;
        }
      }
    }
  }

  @media screen and (max-width: 1500px) {
    @width: 70vw;
    .main {
      padding: 8rem;
      width: @width;
    }
  }
  @media screen and (max-width: 1280px) {
    @width: 75vw;
    .main {
      padding: 5rem;
      width: @width;
    }
  }

  .scroll-top {
    position: fixed;
    right: 5%;
    bottom: 10%;
  }
}
</style>
