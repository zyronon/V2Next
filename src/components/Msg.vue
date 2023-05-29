<template>
  <div class="msg" :class="type">
    <div class="left" @click="$emit('close')">
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 14L34 34" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 34L34 14" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="right">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "Msg",
  props: {
    type: '',
    text: '',
  },
  created() {
    setTimeout(() => {
      this.$emit('close')
    }, 3000)
  }
}
</script>

<style scoped>

</style>