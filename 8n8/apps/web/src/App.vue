<template>
  <div id="app" class="min-h-screen">
    <RouterView />
    <BaseToast />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseToast from '@/components/base/BaseToast.vue'
</script>

<style>
/* Global styles are handled in style.css */
</style>
