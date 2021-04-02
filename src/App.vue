<template>
  <div id="app">
    <div class="pgContainer">
      <cover-bar-container></cover-bar-container>
      <div class="rightContainer">
        <h1>MP3 player</h1>
        <song-list></song-list>
      </div>
    </div>
    <footer>
      <playerComponent></playerComponent>
    </footer>
  </div>
</template>

<script>
// import songList from './components/songList.vue'
import coverBarContainer from "./components/coverBar.vue";
import SongList from "./components/songList.vue";
import playerComponent from "./components/playAudioComponent.vue";
export default {
  name: "App",
  components: {
    coverBarContainer,
    SongList,
    playerComponent,
  },
  mounted() {
    this.$store.dispatch("getCovers");
  },
  data() {
    return {};
  },
};
</script>

<style>
@import url("./components/style/mainStyle.css");
</style>
