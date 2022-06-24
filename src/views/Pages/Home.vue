<template>
  <div class="home">
    <div class="main-content">
      <b-container>
        <b-row>
          <b-col>
            <div class="home--link">
              <router-link :to="{name: 'courses'}" replace>Corsi</router-link>
            </div>
            <img src="@/assets/logo.png" alt="" class="d-block mx-auto">
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    components: {
    }
  }
</script>

<style scoped>
  .home {
    text-align: center;
  }
  .home--link {
    margin-bottom: 4rem;
  }
  .main-content {
    height: 100vh;
    display: flex;
    flex-flow: column;
    justify-content: center;
   align-items: center;
  }
</style>
