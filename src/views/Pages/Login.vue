<template>
  <div class="auth-wrap pt-5">
    <b-img
    src="./../../assets/logo.png"
    fluid
    class="d-block mx-auto login--logo mb-4"
    alt="Logo Alternative School"></b-img>
    <div class="auth p-5">
        <slide-x-left-transition :duration="300" mode="out-in">
          <component :is="this.$store.state.auth.toShow" :key="this.$store.state.auth.toShow"></component>
        </slide-x-left-transition>
    </div>
  </div>
</template>

<script>
  import {SlideXLeftTransition} from 'vue2-transitions'
  import LoginForm from '@/views/Auth/LoginForm.vue'
  import Register from '@/views/Auth/Register.vue'
  export default {
    name: 'Home',
    props: ['appToken'],
    components: {
      LoginForm,
      Register,
      SlideXLeftTransition
    },
    data() {
      return {

      }
    },
    methods: {

    },
    mounted() {
    }
  }
</script>

<style scoped>
.auth-wrap {
  display: flex;
  flex-flow: column;
}
.auth {
  background: #fff;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 10px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  margin: 0 auto;
  min-height: 300px;
  width: 500px;
}
</style>
