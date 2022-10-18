<template>
  <div class="post">
    <!--    <Point :post="post"/>-->
    <div class="right">
      <div class="post-author">
        <div class="username">
          <a :href="`/member/${post.username}`">{{ post.username }}</a>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div class="date">{{ post.date }}</div>
      </div>
      <div class="title">
        <div class="my-node">{{ post.node }}</div>
        <a :href="`t/${post.id}`">{{ post.title }}</a>
      </div>
      <div class="content" :class="{mask}" v-if="post.content_rendered" ref="content">
        <div v-html="post.content_rendered"></div>
      </div>
      <Toolbar :post="post" :reply-count="post.replyCount"/>
    </div>
  </div>
</template>

<script>
import Toolbar from "./Toolbar";
import Point from "./Point";

export default {
  name: 'post',
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    Toolbar,
    Point,
  },
  data() {
    return {
      mask: false
    }
  },
  watch: {
    'post.content_rendered'(newVal) {
      this.$nextTick(() => {
        if (!this.$refs.content) return
        let rect = this.$refs.content.getBoundingClientRect()
        this.mask = rect.height > 250
      })
    }
  },
  created() {
  },
  mounted() {
    // console.log(this.post)
  },
  methods: {}
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
  display: flex;
  cursor: pointer;
  background: white;
  margin-top: 1.1rem;
  border: 1px solid @border;
  border-radius: @border-radius;
  text-align: start;

  &.visited {
    .title a {
      opacity: .6;
    }
  }

  &:hover {
    border: 1px solid @border-hover;
  }

  .right {
    padding: .4rem 1rem;
    width: calc(100% - 4rem);
    box-sizing: border-box;

    .title {
      display: inline;
      align-items: center;

      a {
        color: black !important;
        font-size: 2rem;
        margin-left: .5rem;
        text-decoration: none;
      }
    }

    .content {
      color: black;
      max-height: 25rem;
      overflow: hidden;
      position: relative;
      padding: 1rem 0;

      &.mask {
        -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);
      }
    }
  }
}
</style>
