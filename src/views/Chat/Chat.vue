<template>
  <div>
    <b-card no-body class="overflow-hidden">
      <b-row no-gutters>
        <b-col md="2">
          <b-list-group>
            <b-list-group-item v-for="item in users" :key = item.id @click="foundChat(item.id)">
              {{ item.name }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-card-body title="Chat Alternative School">
          <ChatMessages :array-chat="chat"></ChatMessages>
          <b-form-group>
            <b-row lg="12" class="mt-3 ml-4">
              <b-col lg="11">
                <b-form-input v-model="message" placeholder="Scrivi il messaggio qui"></b-form-input>
              </b-col>
              <b-col lg="1">
                  <b-button
                      squared
                      type="submit"
                      variant="success"
                      @click="onSubmit">
                    <font-awesome-icon class="action--item action-delete text-white" icon="paper-plane" />
                  </b-button>
              </b-col>
            </b-row>
          </b-form-group>
        </b-card-body>
      </b-row>
    </b-card>
  </div>
</template>

<script>

import ChatMessages from "@/views/Chat/ChatMessages";
export default {
  name: "Chat",
  components: {ChatMessages},
  data() {
    return {
      renderComponent: true,
      currentUserName : '',
      currentUserId: this.$store.getters['auth/user'].id,
      path: '',
      users: [],
      chat: [],
      message: '',
      apiRequest: 'post'
    }
  },
  methods:{
    async foundChat(item) {
      let path = 'chat/' + item
      var res = await this.$store.dispatch('getDataChat', {
        resource: path
      })
      this.chat = res.data
      this.path = path
    },
    async refrsh(path) {
      var res = await this.$store.dispatch('getDataChat', {
        resource: path
      })
      this.chat = res.data
      this.path = path
    },
    forceUpdate() {
      this.$forceUpdate();
    },
    async onSubmit() {
      // Data da passare alle API
      const formData = {
        message: this.message,
      }
      // Invia i dati all'api
      await this.$store.dispatch(this.apiRequest, {
        resource: this.path,
        params: formData
      })

      this.message = null
      // Aggiorna la tabella che contiene i dati del modulo
      this.refrsh(this.path)
    },
  },
  async mounted() {
    var res =await this.$store.dispatch('getDataChat', {
      resource: 'users'
    })
    var nameSend;
    var surnameSend;
    for(let i = 0; i < res.data.length; i++){
      if(this.$store.getters['auth/user'].id == res.data[i].id) {
        nameSend = res.data[i].name;
        surnameSend = res.data[i].surname;
      }
    }
    this.currentUserId = nameSend + ' ' + surnameSend
    let user = {}
    const appo = []
    for(let i = 0; i < res.data.length; i++) {
      if (!(this.$store.getters['auth/user'].id == res.data[i].id)) {
        user.id = res.data[i].id
        user.name = res.data[i].name + ' ' + res.data[i].surname
        appo.push(user)
        user = {}
      }
    }
    this.users = appo
  }
}


</script>

<style scoped>

</style>
