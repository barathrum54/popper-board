<template>
  <div class="home">
    <img class="popper-logo" alt="Popper logo" src="../assets/logo.png">
    <Landing />
  </div>
</template>

<script setup>
import Landing from '@/components/Landing.vue'

import { useRouter } from 'vue-router';
const router = useRouter()


</script>

<style>
.popper-logo{
  object-fit: contain;
  width: 30vw;
  margin-bottom: -40px;
  border-bottom: 10px solid #807BE5;
  border-radius: 0 0 60% 0px;
}

</style>
