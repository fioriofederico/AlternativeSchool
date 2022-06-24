<template>
  <vimeo-player
      ref="player"
      :video-id="videoID"
      @ready="onReady"
      :player-height="height">
  </vimeo-player>
</template>

<script>
export default {
  props:{
    linkUrl: String,
    inModal: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      videoID: 'some-id',
      height: 500,
      options: {
        muted: true,
        autoplay: true,
      },
      playerReady: false
    }
  },
  methods: {
    onReady() {
      this.playerReady = true
    },
    play () {
      this.$refs.player.play()
    },
    pause () {
      this.$refs.player.pause()
    }
  },
  name: "PlayerVimeo"
}
</script>

<style scoped>

</style>
