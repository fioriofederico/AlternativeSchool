<template>
  <b-col md="2">
    <b-list-group>
      <b-list-group-item v-for="item in users" :key = item.id @click="foundChat(item.id)">
        {{ item.name }}
      </b-list-group-item>
    </b-list-group>
  </b-col>
</template>

<script>
export default {
  name: "ListContact",
  props: {
    users: []
  },
  methods:{
    foundChat(item){
      this.$emit('name', item)
    }
  }
}
</script>

<style scoped>

</style>
