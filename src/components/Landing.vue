<template>
  <div>
    <h1><span>Fancy Popups <small>for</small> <img class="curved-arrow" src="@/assets/curved-arrow.png" alt=""></span> </h1>
    <h1 class="lower-title">Fanciest Websites</h1>
    <button type="button" @click="ctaButton">Create Yours Now</button>
    <h2>Fully Customizable</h2>
    <h2>Simple Usage</h2>
    <h2>*Fancy*</h2>
    <Footer class="footer"/>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Footer from '@/components/Footer.vue'

import { useRouter } from 'vue-router';
const router = useRouter()

const ctaButton = () => {
  router.push('/create')
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button{
  background: linear-gradient(268.12deg, #807BE5 -4.8%, #5A57C3 103.41%);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1.3em;
  font-weight: 700;
  cursor: pointer;
  opacity: .9;
  width: 350px;
  height: 50px;
  transition: .1s all ease-in-out;
}
button:hover{
  opacity: 1;
}
span {
  color: #807BE5;
}
h1 {
  font-size: 3.5em;
  font-weight: 800;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
small{
  font-size: .7em;
  margin-right: -20px;
  color: black;
  opacity: .7;
}
.curved-arrow{
  width: 1em;
  height: 1em;
  object-fit: contain;
  margin: 0 5px;
  margin-bottom: -35px;
  opacity: .7;
  margin-left: 10px;
  margin-right: -20px;
  transform: rotate(90deg);
}
.lower-title{
  font-weight: 600;
  font-size: 4em;
  margin-top: -50px;
  margin-bottom: 20px;
}
.footer{
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>
