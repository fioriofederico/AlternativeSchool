<template>
  <b-col md="12">
        <b-card>
          <div v-if="arrayChat.length == 0">
            <b-card-text>
              <b-media>
                <h2 >La conversazione ancora non è iniziata scrivi un messaggio per primo</h2>
              </b-media>
            </b-card-text>
          </div>
          <div v-else v-for="item in arrayChat" :key="item">
          <b-card-text v-if="item.sender.id != $store.getters['auth/user'].id">
            <b-media>
              <template #aside>
                <img src="https://ih0.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u2.jpg" width="60px"  alt="Media Aside">
              </template>
              <h2 >{{ item.message }}</h2>
              <p>{{ formatDate(item.dataInsert) }}</p>
            </b-media>
          </b-card-text>
          <b-card-text v-else>
            <b-media right-align>
              <template #aside>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" width="60px"  alt="Media Aside">
              </template>
              <h2 class="text-right" >{{ item.message }}</h2>
              <p class="text-right">{{ formatDate(item.dateInsert) }}</p>
            </b-media>
          </b-card-text>
          </div>
        </b-card>
  </b-col>
</template>

<script>
import moment from "moment";

export default {
  name: "ChatMessages",
  data() {
    return{
    }
  },
  props:{
    idChat: Number,
    arrayChat: []
  },
  methods:{
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  async mounted() {
  }
}
</script>

<style scoped>

</style>
