<template>
  <Transition>
    <div class="tag-modal modal" v-if="tagModal.show" :class="{isNight}">
      <div class="mask" @click.stop="tagModal.show = false"></div>
      <div class="wrapper">
        <div class="title">
          添加标签
        </div>
        <div class="option">
          <span>用户：</span>
          <div>
            {{ tagModal.currentUsername }}
          </div>
        </div>
        <input type="text"
               ref="input"
               style="width: 100%;"
               autofocus
               v-model="tagModal.tag" @keydown.enter="addTag">
        <div class="btns">
          <div class="white" @click="tagModal.show = false">取消</div>
          <div class="main" @click="addTag">确定</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {inject, nextTick, onMounted, reactive, ref} from "vue"
import {CMD} from "../../../../src/utils/type"
import eventBus from "@/utils/eventBus.js";

const tagModal = reactive({
  show: false,
  currentUsername: '',
  tag: '',
})
const isNight = inject('isNight')
const {tags} = defineProps(['tags'])
const emit = defineEmits(['update:tags'])
const input = ref<HTMLInputElement>(null as any)

onMounted(() => {
  eventBus.on(CMD.ADD_TAG, (username: string) => {
    tagModal.currentUsername = username
    tagModal.show = true
    nextTick(() => {
      input.value.focus()
    })
  })
})

async function addTag() {
  let oldTag = window.clone(tags)
  let tempTag = window.clone(tags)
  let userTags = tempTag[tagModal.currentUsername] ?? []
  let rIndex = userTags.findIndex((v: string) => v === tagModal.tag)
  if (rIndex > -1) {
    eventBus.emit(CMD.SHOW_MSG, {type: 'warning', text: '标签已存在！'})
    return
  } else {
    userTags.push(tagModal.tag)
  }
  tempTag[tagModal.currentUsername] = userTags
  emit('update:tags', tempTag)
  tagModal.tag = ''
  tagModal.show = false
  let res = await window.parse.saveTags(tempTag)
  if (!res) {
    eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '标签添加失败！'})
    emit('update:tags', oldTag)
  }
  console.log('res', res)
  return console.log(tags)
}
</script>

<style scoped lang="less">
@import "src/assets/less/variable";

.isNight {
  .wrapper {
    background: #22303f!important;

    .title{
      color: gray;
    }

    .option {
      color: white!important;

      span {
        color: gray !important;
      }
    }
    .white{
      color: white!important;
    }
  }
}

.tag-modal {
  .wrapper {
    z-index: 9;
    background: #f1f1f1;
    border-radius: .8rem;
    font-size: 1.4rem;
    //box-shadow: 0 0 6px 4px gainsboro;
    padding: 2rem 6rem 4rem 6rem;
    width: 25rem;

    .btns {
      margin-top: 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1.5rem;
      font-size: 1rem;

      div {
        cursor: pointer;
      }

      .main {
        color: gray;
        background: @bg-color;
        padding: .5rem 1.2rem;
        border-radius: .4rem;
      }
    }
  }
}

</style>