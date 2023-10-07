<template>
  <div class="Author" :class="{expand:!modelValue}">
    <div class="Author-left">
      <svg class="expand-icon"
           v-if="!modelValue"
           @click="$emit('update:modelValue',true)"
           width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 42H6V26" stroke="#177EC9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M26 6H42V22" stroke="#177EC9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <a class="avatar" v-if="!config.simple" :href="`/member/${comment.username}`">
        <img :src="comment.avatar" alt="">
      </a>
      <span class="texts">
        <strong>
          <a :href="`/member/${comment.username}`" class="username">{{ comment.username }}</a>
        </strong>
        <div v-if="comment.isOp" class="op">OP</div>
        <div v-if="comment.isDup" class="dup">DUP</div>
        <div v-if="comment.isMod" class="mod">MOD</div>
        <span class="ago">{{ comment.date }}</span>
        <template v-if="isLogin && config.openTag">
            <span class="my-tag" v-for="i in myTags">
              <i class="fa fa-tag"></i>
              <span>{{ i }}</span>
              <i class="fa fa-trash-o remove" @click="removeTag(i)"></i>
            </span>
            <span class="add-tag ago" @click="addTag" title="添加标签">+</span>
        </template>
      </span>
    </div>
    <div class="Author-right">
      <div class="toolbar" v-if="isLogin">
        <PopConfirm title="确认隐藏这条回复?" @confirm="$emit('hide')">
          <div class="tool">
            <span>隐藏</span>
          </div>
        </PopConfirm>
        <div class="tool" v-if="context"
             @click="showRelationReply">
          <span>上下文</span>
        </div>
        <div class="tool" v-if="type === 'top'" @click="jump">
          <span>跳转</span>
        </div>
        <div class="tool" @click="checkIsLogin('reply')">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
            <path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
            <path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>回复</span>
        </div>
        <Point
            v-show="!comment.thankCount"
            :item="pointInfo"
            @addThank="addThank"
            @recallThank="recallThank"
            :api-url="'reply/'+comment.id"
        />
      </div>
      <Point
          v-show="comment.thankCount"
          :item="pointInfo"
          @addThank="addThank"
          @recallThank="recallThank"
          :api-url="'reply/'+comment.id"
      />
      <div class="floor" :class="{isDev}">{{ (isDev ? `a${comment.floor}-` : comment.floor) }}</div>
    </div>
  </div>
</template>
<script>
import Point from "./Point";
import eventBus from "@/utils/eventBus.js";
import {CMD} from "../utils/type";
import PopConfirm from "@/components/PopConfirm.vue";

export default {
  name: "Author",
  components: {PopConfirm, Point},
  inject: ['isLogin', 'tags', 'config'],
  props: {
    modelValue: false,
    comment: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default() {
        return 'list'
      }
    },
  },
  computed: {
    isDev() {
      return import.meta.env.DEV
    },
    pointInfo() {
      return {
        isThanked: this.comment.isThanked,
        thankCount: this.comment.thankCount,
        username: this.comment.username
      }
    },
    myTags() {
      return this.tags[this.comment.username] ?? []
    },
    context() {
      return this.comment.replyUsers.length
    }
  },
  methods: {
    jump() {
      eventBus.emit(CMD.JUMP, this.comment.floor)
    },
    showRelationReply() {
      if (!this.comment.replyUsers.length) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '该回复无上下文'})
        return
      }
      eventBus.emit(CMD.RELATION_REPLY, {
        left: this.comment.replyUsers,
        right: this.comment.username,
        rightFloor: this.comment.floor
      })
    },
    addTag() {
      eventBus.emit(CMD.ADD_TAG, this.comment.username)
    },
    removeTag(tag) {
      eventBus.emit(CMD.REMOVE_TAG, {username: this.comment.username, tag})
    },
    checkIsLogin(emitName = '') {
      if (!this.isLogin) {
        eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '请先登录！'})
        return false
      }
      this.$emit(emitName)
      return true
    },
    addThank() {
      eventBus.emit(CMD.CHANGE_COMMENT_THANK, {id: this.comment.id, type: 'add'})
    },
    recallThank() {
      eventBus.emit(CMD.CHANGE_COMMENT_THANK, {id: this.comment.id, type: 'recall'})
    },
  }
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.Author {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
  position: relative;

  &.expand {
    margin-bottom: 0;
  }

  .Author-left {
    display: flex;
    align-items: center;
    max-width: 65%;
    word-break: break-all;

    .username {
      font-size: 1.4rem;
      margin-right: 1rem;
    }

    .expand-icon {
      cursor: pointer;
      margin-right: .8rem;
      width: 2rem;
      height: 2rem;
      transform: rotate(90deg);
    }

    .avatar {
      margin-right: 1rem;
      display: flex;

      img {
        @w:2.8rem;
        width: @w;
        height: @w;
        border-radius: 0.4rem;
      }

      //border-radius: 50%;
    }

    @color: #1484cd;
    @dup-color: red;

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

    .dup {
      display: inline-block;
      background-color: transparent;
      color: @dup-color;
      border-radius: .3rem;
      padding: 0 .3rem;
      cursor: default;
      border: 2px solid @dup-color;
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

    .add-tag {
      font-size: 2.5rem;
      transform: translateY(.2rem);
      line-height: 1rem;
      display: inline-block;
      margin-left: 1rem;
      cursor: pointer;
      display: none;
    }

  }

  &:hover {
    .add-tag {
      display: inline-block;
    }
  }

  .Author-right {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;

    .toolbar {
      display: flex;
      align-items: center;
      color: #929596;
      opacity: 0;

      &:hover {
        background: white;
        opacity: 1;
      }
    }

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

    .isDev {
      color: black !important;
    }
  }
}
</style>
