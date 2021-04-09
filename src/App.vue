<template>
  <div id="app">
    <div class="pgContainer">
      <cover-bar-container></cover-bar-container>
      <div class="rightContainer">
        <div>
          <h1>MP3 player</h1>
          <img
            v-if="playList.length != 0"
            :src="config.serverAdress + `/img/playList.svg`"
            @click="changeStatus()"
          />
        </div>
        <song-list></song-list>
      </div>
    </div>
    <footer>
      <playerComponent></playerComponent>
    </footer>
  </div>
</template>

<script>
import coverBarContainer from "./components/coverBar.vue";
import SongList from "./components/songList.vue";
import playerComponent from "./components/playAudioComponent.vue";
import config from "../config.json";
export default {
  name: "App",
  components: {
    coverBarContainer,
    SongList,
    playerComponent,
  },
  computed: {
    playList() {
      if (
        this.$store.getters.getPlayList == 0 &&
        this.$store.getters.getPlayListStatus
      ) {
        this.$store.dispatch("getPlayList");
        this.$store.commit("setPlayListStatus");
      }
      return this.$store.getters.getPlayList;
    },
  },
  mounted() {
    this.$store.dispatch("getCovers");
    this.$store.dispatch("getPlayList");
    document.title = "Odtwarzacz MP3";
  },
  methods: {
    changeStatus() {
      this.$store.commit("setPlayListStatus");
    },
  },
  data() {
    return { config };
  },
};
</script>

<style>
@import url("./components/style/mainStyle.css");
</style>
