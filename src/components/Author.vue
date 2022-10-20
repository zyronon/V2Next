<template>
  <div class="Author">
    <svg class="expand"
         v-if="!modelValue"
         @click="$emit('update:modelValue',true)"
         width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 42H6V26" stroke="#177EC9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 6H42V22" stroke="#177EC9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <a :href="`/member/${comment.username}`">
      <img class="icon" :src="comment.avatar" alt="">
    </a>
    <div class="username">
      <a :href="`/member/${comment.username}`">{{ comment.username }}</a>
    </div>
    &nbsp;&nbsp;&nbsp;
    <div v-if="comment.isOp" class="op">OP</div>
    <div class="date">{{ comment.date }}</div>
    <div class="floor" :class="{isDev}">{{ comment.floor }}</div>
  </div>
</template>
<script>
export default {
  name: "Author",
  components: {},
  inject: ['isDev'],
  props: {
    modelValue: false,
    comment: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  watch: {},
  created() {
  },
  methods: {}
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable";

.Author {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  position: relative;

  //&:hover{
  //  .index{
  //    display: inline-block;
  //  }
  //}

  .floor {
    position: absolute;
    right: 0;
    font-size: 1.2rem;
    line-height: 1rem;
    border-radius: 1rem;
    display: inline-block;
    background-color: #f0f0f0;
    color: #ccc;
    padding: .2rem .5rem;
    cursor: default;
  }

  .isDev{
    color: black;
  }

  .username {
    color: @font-color;
    font-size: 1.3rem;
    font-weight: bold;
  }

  .expand {
    cursor: pointer;
    margin-right: .8rem;
    width: 2rem;
    height: 2rem;
    transform: rotate(90deg);
  }

  .icon {
    margin-right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: .3rem;
    //border-radius: 50%;
  }

  .op {
    @color: #1484cd;
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

}
</style>
