<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/vue-logo.png">
    <Landing />
  </div>
</template>

<script setup>
import Landing from '@/components/Landing.vue'

import { useRouter } from 'vue-router';
const router = useRouter()


</script>
