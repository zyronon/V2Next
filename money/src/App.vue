<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import viteLogoUrl from './assets/vite.svg';
import vueLogoUrl from './assets/vue.svg';</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img :src="viteLogoUrl" class="logo" alt="Vite logo"/>
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img :src="vueLogoUrl" class="logo vue" alt="Vue logo"/>
    </a>
  </div>
  <HelloWorld msg="Vite + Vue"/>
</template>

<style scoped>
</style>
