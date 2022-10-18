<template>
  <div class="post-detail"
       ref="detail"
       @scroll="scroll"
       v-show="modelValue"
       @click="$emit('update:modelValue',false)">
    <div class="main" @click.stop="stop">
      <div class="left">
        <div class="post">
          <div class="base-info">
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
          </div>
          <div class="line"></div>
          <div class="content">
            <BaseHtmlRender :html="post.content_rendered" class="baseContent"/>
            <BaseHtmlRender :html="post.subtlesHtml"/>
          </div>
          <div class="toolbar-wrapper">
            <Point
                @addThank="addThank"
                @recallThank="recallThank"
                :item="{
                isThanked:post.isThanked,
                thankCount:post.thankCount,
                username:post.username
              }"
                :api-url="'topic/'+post.id"/>
            <Toolbar :post="post" :replyCount="post.replyCount"/>
          </div>
        </div>
        <div class="post-wrapper2">
          <PostEditor v-if="modelValue" @addReplyChild="addReplyChild"/>
          <div class="sort-select">
            <div class="target" @click.stop="showSortOption = true">
              <span>排序：{{ sortOptions.find(v => v.value === target).label }}</span>
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 19L24 31L12 19H36Z" fill="#0079d3" stroke="#0079d3" stroke-width="2"
                      stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="options" v-if="showSortOption">
              <div class="option"
                   :class="{active:target === item.value}"
                   @click="changeOption(item)"
                   v-for="item in sortOptions">
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="line"></div>
        </div>
        <div v-if="loading" class="loading-w">
          <div class="loading-c"></div>
        </div>
        <template v-else>
          <div class="comments" v-if="replies.length">
            <Comment v-for="(item,index) in replies"
                     @remove="remove(index)"
                     v-model="replies[index]" :key="index"/>
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
      target: computed(() => this.target),
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
    return {
      showSortOption: false,
      target: 0,
      sortOptions: [
        {value: 0, label: '楼中楼'},
        {value: 1, label: '感谢'},
        {value: 2, label: 'V2原版'},
      ]
    }
  },
  computed: {
    replies() {
      if (this.target === 0) return this.post.nestedReplies
      if (this.target === 1) {
        let copy = JSON.parse(JSON.stringify(this.post.replies))
        return copy.sort((a, b) => b.thankCount - a.thankCount)
      }
      if (this.target === 2) return this.post.replies
    }
  },
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
    clone(val) {
      return JSON.parse(JSON.stringify(val))
    },
    changeOption(item) {
      this.showSortOption = false;
      this.target = item.value
    },
    stop() {
      this.showSortOption = false
    },
    scroll() {
      this.showSortOption = false
    },
    addThank() {
      this.post.isThanked = true
      this.post.thankCount++
    },
    recallThank() {
      this.post.isThanked = false
      this.post.thankCount--
    },
    remove(index) {
      if (this.target === 0) {
        this.post.nestedReplies.splice(index, 1)
      } else {
        this.post.replies.splice(index, 1)
      }
    },
    addReplyChild(item) {
      if (this.target === 0) {
        this.post.nestedReplies.push(item)
      } else {
        this.post.replies.push(item)
      }
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
        //display: flex;
        margin-bottom: 2rem;

        .base-info {
          padding: 1rem;
          box-sizing: border-box;
          border-bottom: 1px solid @border;

          .avatar {
            float: right;

            img {
              border-radius: .4rem;
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

          .post-author {
          }
        }

        .content {
          color: black;
          word-break: break-word;
          line-height: 1.6;

          .baseContent {
            padding: 1rem;
          }
        }

        .toolbar-wrapper {
          width: 90%;
          margin-left: 5%;
          display: flex;

          .point {
            margin-right: 1rem;
          }
        }
      }

      .post-wrapper2 {
        width: 90%;

        .line {
          border-bottom: 1px solid @border;
          width: 100%;
        }

        .sort-select {
          margin-top: 3rem;
          margin-bottom: 1rem;
          position: relative;

          .target {
            color: #0079d3;
            font-size: 1.2rem;
            font-weight: bold;
            display: inline-flex;
            align-items: center;
            cursor: pointer;

            svg {
              @width: 1.4rem;
              width: @width;
              height: @width;
              margin-left: .5rem;
            }
          }

          .options {
            box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
            background: white;
            z-index: 9998;
            border-radius: .5rem;
            cursor: pointer;
            font-size: 1.4rem;
            position: absolute;
            top: 2.6rem;
            left: 2.7rem;
            color: @link-color;

            .option {
              padding: .8rem 1.4rem;

              &.active {
                color: #0079d3;
              }

              &:hover {
                background: #e9f5fd;
              }
            }
          }
        }
      }

      .loading-w {
        height: 30rem;
        display: flex;
        justify-content: center;
        align-items: center;
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
