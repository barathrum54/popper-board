<template>
  <Menu/>
  <router-view/>
</template>

<script setup>
import Menu from '@/components/Menu/Menu.vue'
</script>
<style>
body{
  margin: 0;
}
#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
  height: 100vh;
  padding: 0px;
  margin: 0px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #807BE5;
}
</style>
