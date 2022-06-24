<template>
  <div class="not-found">
    <div class="main-content">
      <b-container>
        <b-row>
          <b-col>

            <div class="main--item">
                <img src="@/assets/logo.png" alt="" class="d-block mx-auto logo">

                <h3>404 Not found</h3>
                <div class="menu" v-if="!isAuth">
                  <router-link :to="{name: 'login'}" replace>Login</router-link> |
                  <router-link :to="{name: 'about'}" replace>About</router-link>
                </div>
                <div class="menu" v-else>
                  <router-link :to="{name: 'courses'}" replace>Courses</router-link>
                </div>
            </div>

          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'Error404',
    data() {
        return {
            ...mapGetters({
                isAuth: 'auth/isAuthenticated',
            })
        }
    },
  }
</script>

<style scoped>
  .not-found {
    text-align: center;
  }
  .logo {
      margin-bottom: 4rem;
  }
  .home--link {
    margin-bottom: 4rem;
  }
  .main--item {
    height: 100vh;
    display: flex;
    flex-flow: column;
    justify-content: center;
   align-items: center;
  }
</style>
